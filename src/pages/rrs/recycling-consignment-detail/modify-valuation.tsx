import { Button, Form, Input, Modal, Select, message } from 'antd';
import { modifyOmsInitialValuation } from 'apis/oms';
import { OmsRecycleOrderDetail } from 'types/oms';
import { CURRENCY_OPTION_LIST } from 'commons/options';
import { useState } from 'react';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';
import MinMaxValuation from 'components/recycling-consignment/min-max-valuation';
import { OMS_RECYCLE_ORDER_STATUS_MAP } from 'constants/RecyclingConsignment';
import useResource from 'commons/hooks/useResource';

const ModifyValuation = ({
  currency,
  onSuccess,
  data,
}: {
  currency?: string;
  onSuccess: () => void;
  data?: OmsRecycleOrderDetail;
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const currencyForm = Form.useWatch('currency', {
    form,
    preserve: true,
  });
  const ModifyInitialValuation = useResource(
    'recycling-consignment-modify-initial-valuation'
  );

  return (
    <div>
      <Modal
        open={open}
        title={i18n.t(LOCALS.update_valuation_information)}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={async () => {
          form.validateFields().then(async (values) => {
            const { RecyclePrice = [], SalePrice = [], ...rest } = values;
            await modifyOmsInitialValuation({
              ...rest,
              minRecyclePrice: RecyclePrice[0],
              maxRecyclePrice: RecyclePrice[1],
              minSalePrice: SalePrice[0],
              maxSalePrice: SalePrice[1],
            });
            message.success(i18n.t(LOCALS.successful_operation));
            setOpen(false);
            onSuccess();
          });
        }}
      >
        <Form
          form={form}
          initialValues={{
            currency,
            id: data?.omsRecycleOrder?.id,
            SalePrice: [
              data?.omsRecycleOrderItem?.minSalePrice,
              data?.omsRecycleOrderItem?.maxSalePrice,
            ],
            RecyclePrice: [
              data?.omsRecycleOrderItem?.minRecyclePrice,
              data?.omsRecycleOrderItem?.maxRecyclePrice,
            ],
          }}
        >
          <Form.Item label={i18n.t(LOCALS.quotation_currency)} name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label={i18n.t(LOCALS.quotation_currency)} name="currency">
            <Select
              options={CURRENCY_OPTION_LIST.map(({ value, label }) => ({
                value,
                label: value,
              }))}
            ></Select>
          </Form.Item>
          {/* 最终报价之前 */}
          {data?.omsRecycleOrder?.status &&
            data?.omsRecycleOrder?.status <=
              OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_FINAL_VALUATION && (
              <>
                <Form.Item
                  label={i18n.t(LOCALS.consignment_preliminary_valuation)}
                  name="SalePrice"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (value) {
                          if (value[0] > value[1]) {
                            return Promise.reject(i18n.t(LOCALS.invalid_range));
                          }
                          if (!(value[0] && value[1])) {
                            return Promise.reject(
                              i18n.t(LOCALS.fill_in_completely)
                            );
                          }
                        }
                        const RecyclePrice = form.getFieldValue('RecyclePrice');
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
                              i18n.t(LOCALS.consignment_valuation_minimum)
                            );
                          }
                          if (value[1] < RecyclePrice[1]) {
                            return Promise.reject(
                              i18n.t(LOCALS.consignment_valuation_maximum)
                            );
                          }
                        }
                        if (!value && !form.getFieldValue('RecyclePrice')) {
                          return Promise.reject(
                            i18n.t(LOCALS.select_at_least_one)
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <MinMaxValuation currency={currencyForm} />
                </Form.Item>
                <Form.Item
                  label={i18n.t(LOCALS.instant_sale)}
                  name="RecyclePrice"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (value) {
                          if (value[0] > value[1]) {
                            return Promise.reject(i18n.t(LOCALS.invalid_range));
                          }
                          if (!(value[0] && value[1])) {
                            return Promise.reject(
                              i18n.t(LOCALS.fill_in_completely)
                            );
                          }
                        }
                        if (!value && !form.getFieldValue('SalePrice')) {
                          return Promise.reject(
                            i18n.t(LOCALS.select_at_least_one)
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <MinMaxValuation currency={currencyForm} />
                </Form.Item>
              </>
            )}
        </Form>
      </Modal>

      {ModifyInitialValuation && data?.omsRecycleOrder?.status &&
        (data.omsRecycleOrder.status === 1 || data.omsRecycleOrder.status === 2) && (
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            {i18n.t(LOCALS.update_valuation_information)}
          </Button>
        )}
    </div>
  );
};

export default ModifyValuation;
