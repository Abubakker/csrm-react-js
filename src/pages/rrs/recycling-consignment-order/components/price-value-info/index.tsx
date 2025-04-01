import { useEffect } from 'react';
import { Form, Row, Col, Select, InputNumber } from 'antd';
import RenderLabel from 'components/recycling-consignment/render-label';
import { CurrencyOption } from 'constants/RecyclingConsignment';
import MinMaxValuation from 'components/recycling-consignment/min-max-valuation';
import type { FormInstance } from 'antd/es/form';
import {
  OmsRecycleOrderSNSCreateDTO,
  OmsRecycleOrderCreateDTO,
} from 'types/oms';
import classNames from 'classnames';
import i18n from 'i18n';
import { selectUserInfo } from 'store/slices/userInfoSlice';
import { useSelector } from 'react-redux';
import { CURRENCY_MAP } from 'commons/options';

interface formType {
  currency?: string;
  recyclePrice?: number[];
  salePrice?: number[];
  recycleValue?: number;
  saleValue?: number;
}

interface Props {
  form: FormInstance<formType>;
  onChange: (
    data: OmsRecycleOrderSNSCreateDTO | OmsRecycleOrderCreateDTO
  ) => void;
  type: 'intention' | 'contract';
  orderType?: number;
}

const PriceValueInfo = ({ form, onChange, type, orderType }: Props) => {
  const { shop } = useSelector(selectUserInfo);

  useEffect(() => {
    if (shop && form) {
      const t = CurrencyOption.find((d) => d.numberValue === shop)?.label!;
      if (t) form.setFieldValue('currency', t);
    }
  }, [form, shop]);

  const currency =
    Form.useWatch('currency', {
      form,
      preserve: true,
    }) || CURRENCY_MAP.JPY;

  useEffect(() => {
    form.setFieldsValue({
      saleValue: undefined,
      recycleValue: undefined,
    });
  }, [orderType, form]);

  return (
    <Form
      initialValues={{ currency }}
      autoComplete="off"
      form={form}
      className={classNames('renderLabel', { 'w-[50%]': type === 'contract' })}
      onValuesChange={(_, allValues) => {
        const { currency, recyclePrice, salePrice, recycleValue, saleValue } =
          allValues;
        if (type === 'intention') {
          let payload = {
            currency,
            minRecyclePrice: 0,
            maxRecyclePrice: 0,
            minSalePrice: 0,
            maxSalePrice: 0,
          };
          if (recyclePrice) {
            payload.minRecyclePrice = recyclePrice[0];
            payload.maxRecyclePrice = recyclePrice[1];
          }
          if (salePrice) {
            payload.minSalePrice = salePrice[0];
            payload.maxSalePrice = salePrice[1];
          }
          onChange({ ...payload });
        } else if (type === 'contract') {
          let payload = {
            currency,
            finalRecyclePrice: recycleValue,
            finalSalePrice: saleValue,
          };
          onChange({ ...payload });
        }
      }}
    >
      <Row gutter={[48, 0]}>
        <Col span={24}>
          <Form.Item
            label={
              <RenderLabel required width={130}>
                {i18n.t('currency')}
              </RenderLabel>
            }
            name="currency"
            rules={[{ required: true }]}
          >
            <Select options={CurrencyOption} disabled={!!shop} />
          </Form.Item>
        </Col>
      </Row>
      {type === 'intention' && (
        <>
          <Row gutter={[48, 0]}>
            <Col span={24}>
              <Form.Item
                label={
                  <RenderLabel width={130}>
                    {i18n.t('consignment_preliminary_valuation')}
                  </RenderLabel>
                }
                name="salePrice"
                rules={[
                  {
                    validator: (_, value) => {
                      if (value) {
                        if (value[0] > value[1]) {
                          return Promise.reject(i18n.t('invalid_range'));
                        }
                        if (!(value[0] && value[1])) {
                          return Promise.reject(i18n.t('fill_in_completely'));
                        }
                      }
                      const RecyclePrice = form.getFieldValue('recyclePrice');
                      if (
                        value &&
                        value[0] &&
                        value[1] &&
                        RecyclePrice &&
                        RecyclePrice[0] &&
                        RecyclePrice[1]
                      ) {
                        // 寄卖要比回收高
                        if (value[0] < RecyclePrice[0]) {
                          return Promise.reject(
                            i18n.t('consignment_valuation_minimum')
                          );
                        }
                        if (value[1] < RecyclePrice[1]) {
                          return Promise.reject(
                            i18n.t('consignment_valuation_maximum')
                          );
                        }
                      }
                      if (!value && !form.getFieldValue('recyclePrice')) {
                        return Promise.reject(i18n.t('select_at_least_one'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <MinMaxValuation currency={currency} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[48, 0]}>
            <Col span={24}>
              <Form.Item
                label={
                  <RenderLabel width={130}>
                    {i18n.t('instant_sale')}
                  </RenderLabel>
                }
                name="recyclePrice"
                rules={[
                  {
                    validator: (_, value) => {
                      if (value) {
                        if (value[0] > value[1]) {
                          return Promise.reject(i18n.t('invalid_range'));
                        }
                        if (!(value[0] && value[1])) {
                          return Promise.reject(i18n.t('fill_in_completely'));
                        }
                      }
                      if (!value && !form.getFieldValue('salePrice')) {
                        return Promise.reject(i18n.t('select_at_least_one'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <MinMaxValuation currency={currency} />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
      {type === 'contract' && (
        <>
          <Row gutter={[48, 0]}>
            <Col span={24}>
              <Form.Item
                label={
                  <RenderLabel required={orderType === 1} width={130}>
                    {i18n.t('consignment_confirmation_quote')}
                  </RenderLabel>
                }
                name="saleValue"
                rules={[
                  {
                    validator: (_, value) => {
                      const recycleValue = form.getFieldValue('recycleValue');
                      // 回收时可以不填
                      if (orderType === 2) {
                        return Promise.resolve();
                      }
                      // 寄卖时必填
                      if (orderType === 1 && !value) {
                        return Promise.reject('寄卖合同订单必须填写寄卖价格');
                      }
                      if (value && recycleValue && value < recycleValue) {
                        return Promise.reject(
                          i18n.t('consignment_valuation_w')
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  inputMode="numeric"
                  disabled={orderType === 2}
                  max={1000000000}
                  addonBefore={currency}
                  style={{ width: '100%' }}
                  min={1}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[48, 0]}>
            <Col span={24}>
              <Form.Item
                label={
                  <RenderLabel required={orderType === 2} width={130}>
                    {i18n.t('recycling_confirmation_quote')}
                  </RenderLabel>
                }
                name="recycleValue"
                rules={[
                  {
                    validator: (_, value) => {
                      if (orderType === 2 && !value) {
                        return Promise.reject('回收合同订单必须填写回收价格');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  inputMode="numeric"
                  max={1000000000}
                  addonBefore={currency}
                  style={{ width: '100%' }}
                  min={1}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );
};

export default PriceValueInfo;
