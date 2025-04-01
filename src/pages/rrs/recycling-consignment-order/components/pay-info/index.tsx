import { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Row, Col, Select, Radio, Input, Divider } from 'antd';
import RenderLabel from 'components/recycling-consignment/render-label';
import {
  PaymentMethod,
  MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP,
  MEMBER_PAYMENT_ACCOUNT_TYPE_MAP,
} from 'constants/RecyclingConsignment';
import type { FormInstance } from 'antd/es/form';
import {
  OmsRecycleOrderSNSCreateDTO,
  OmsRecycleOrderCreateDTO,
} from 'types/oms';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { MallCity } from 'types/home';
import { getCityListByCountryCode } from 'apis/home';
import i18n from '../../../../../i18n';
import LOCALS from '../../../../../commons/locals';
import { UserType } from '../user-info/index';
import { SelectOption } from 'types/base';
import {
  setRecyclingConsignmentStore,
  getRecyclingConsignmentStore,
  ITEM_NAME_MAP,
} from '../utils';

export type PayInfoForm = OmsRecycleOrderSNSCreateDTO & {
  payAccount?: number;
  payMethod?: number;
  transferType?: number;
  memberPaymentAccountSubType: number;
  name?: string;
  areaCode: string;
  postPhone: string;
  postCode?: string;
  country?: string;
  city?: string;
  detailAddress?: string;
  settlementType: number;
};

interface Props {
  form: FormInstance<any>;
  onChange: (
    data: OmsRecycleOrderSNSCreateDTO | OmsRecycleOrderCreateDTO,
  ) => void;
  type: string;
  orderType?: number;
  userInfo?: UserType;
  createdFrom?: number;
}

const PayInfo = ({
  form,
  onChange,
  orderType,
  userInfo,
  type,
  createdFrom,
}: Props) => {
  // 判断是否是委托合同类型
  const isConsignmentContract = type === 'contract' && orderType === 1;

  // 根据合同类型返回是否必填的规则
  const getRequiredRule = (fieldName?: string) => {
    // 对于 detailAddress 或 city，当 createdFrom === 2 时，即使不是寄卖合同也不必填
    if (
      (fieldName === 'detailAddress' ||
        fieldName === 'city' ||
        fieldName === 'country') &&
      createdFrom === 2
    ) {
      return [];
    }
    // 其他字段保持原有逻辑：寄卖合同时非必填，其他情况必填
    if (isConsignmentContract) return [];
    return [{ required: true }];
  };
  const [payMethod, setPayMethod] = useState<number>(1); // 打款方式

  const [payAccount, setPayAccount] = useState<number>(
    MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP,
  ); // 打款账户
  const [transferType, setTransferType] = useState<number>(
    MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK,
  ); // 转账类型
  const [country, setCounty] = useState<string>('JPN');

  const { countryOptions, countryCodeOptions } =
    useAppSelector(selectGlobalInfo);
  const [cityList, setCityList] = useState<MallCity[]>([]);

  const SelectFilter = useCallback(
    (input: string, option: SelectOption | undefined) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
    [],
  );

  useEffect(() => {
    setPayAccount(MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP);
    setTransferType(MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK);
    form.setFieldsValue({
      payAccount: MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP,
      memberPaymentAccountSubType: MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK,
    });
  }, [payMethod, form]);

  useEffect(() => {
    setTransferType(MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK);
    form.setFieldsValue({
      memberPaymentAccountSubType: MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK,
    });
  }, [payAccount, form]);

  const getCityList = useCallback(
    (country: string, cb?: (countryList: MallCity[]) => void) => {
      form.setFieldValue('city', '');
      setCityList([]);
      getCityListByCountryCode(country).then((res) => {
        if (res.data) {
          setCityList(res.data.cityList || []);
          cb && cb(res.data.cityList || []);
        } else {
          setCityList([]);
        }
      });
    },
    [form],
  );

  const ItemName = useMemo(() => {
    if (type === 'contract') {
      return ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_CONTRACT;
    } else {
      return ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_INTENTION;
    }
  }, [type]);

  useEffect(() => {
    const payInfo = getRecyclingConsignmentStore(ItemName)
      .payInfo as PayInfoForm;
    if (payInfo) {
      if (payInfo?.country) getCityList(payInfo.country);
      if (payInfo?.payMethod) setPayMethod(payInfo.payMethod);
      if (payInfo?.payAccount) setPayAccount(payInfo.payAccount);
      if (payInfo?.transferType) setTransferType(payInfo.transferType);
      form.setFieldsValue({ ...payInfo, settlementType: payInfo?.payMethod });
    }

    if (userInfo) {
      const phone: string[] | undefined = userInfo?.phone?.split(' ');
      const [areaCode, postPhone] = phone || ['', ''];
      const payload: any = {};
      if (userInfo?.username) payload.name = userInfo?.username;
      if (areaCode) payload.areaCode = areaCode;
      if (postPhone) payload.postPhone = postPhone;
      if (userInfo?.postCode) payload.postCode = userInfo?.postCode;
      if (userInfo.country) payload.country = userInfo.country;
      if (userInfo?.detailAddress)
        payload.detailAddress = userInfo?.detailAddress;
      form.setFieldsValue(payload);

      if (userInfo?.country)
        getCityList(userInfo?.country, (cityList) => {
          const city = cityList.find((d) => d.id === Number(userInfo.city));
          if (city) form.setFieldValue('city', city?.code);
        });
    }
  }, [ItemName, form, getCityList, userInfo]);

  const formValue = Form.useWatch([], form);

  useEffect(() => {
    if (formValue) {
      const {
        settlementType,
        payAccount,
        city,
        detailAddress,
        name,
        postCode,
        areaCode,
        country,
        postPhone,
        ...rest
      } = formValue;
      setRecyclingConsignmentStore(ItemName, {
        payInfo: { ...formValue, payMethod: settlementType, transferType },
      });
      const memberPaymentAccountType = payAccount;
      let payload: OmsRecycleOrderCreateDTO = {
        settlementType,
        memberPaymentAccountType,
      };
      payload = {
        city,
        country,
        detailAddress,
        name,
        postPhone:
          areaCode && postPhone ? `${areaCode} ${postPhone}` : undefined,
        postCode,
        ...rest,
        ...payload,
      };
      if (settlementType === 2) {
        payload = {
          settlementType,
          memberPaymentAccountType,
          ...rest,
          ...payload,
        };
      }
      onChange(payload);
    }
  }, [ItemName, formValue, onChange, transferType]);

  return (
    <Form
      className="renderLabel"
      initialValues={{
        settlementType: payMethod,
        payAccount,
        memberPaymentAccountSubType: transferType,
      }}
      autoComplete="off"
      form={form}
    >
      <Form.Item>
        <Row gutter={[48, 0]}>
          <Col span={12}>
            <Form.Item
              label={
                <RenderLabel required={!isConsignmentContract}>
                  {i18n.t('name')}
                </RenderLabel>
              }
              rules={getRequiredRule()}
              name="name"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <RenderLabel required={!isConsignmentContract}>
                  {i18n.t('phone_number')}
                </RenderLabel>
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    rules={getRequiredRule()}
                    name="areaCode"
                    style={{ marginBottom: 0 }}
                  >
                    <Select options={countryCodeOptions} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    rules={getRequiredRule()}
                    name="postPhone"
                    style={{ marginBottom: 0 }}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[48, 0]}>
          <Col span={12}>
            <Form.Item
              label={<RenderLabel>{i18n.t('zip_code')}</RenderLabel>}
              name="postCode"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <RenderLabel
                  required={createdFrom !== 2 && !isConsignmentContract}
                >
                  {i18n.t('location')}
                </RenderLabel>
              }
              name={'country'}
              rules={getRequiredRule('country')}
            >
              <Select
                options={countryOptions}
                onChange={(e) => getCityList(e)}
                showSearch
                filterOption={SelectFilter}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[48, 0]}>
          <Col span={12}>
            <Form.Item
              label={
                <RenderLabel
                  required={createdFrom !== 2 && !isConsignmentContract}
                >
                  {i18n.t('state_province_city')}
                </RenderLabel>
              }
              name="city"
              rules={getRequiredRule('city')}
            >
              <Select
                options={cityList.map(({ name, code }) => {
                  return {
                    value: code,
                    label: name,
                  };
                })}
                showSearch
                filterOption={SelectFilter}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <RenderLabel
                  required={createdFrom !== 2 && !isConsignmentContract}
                >
                  {i18n.t('detail_address')}
                </RenderLabel>
              }
              name="detailAddress"
              rules={getRequiredRule('detailAddress')}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
      <Row gutter={[48, 0]}>
        <Col span={24}>
          <Divider />
        </Col>
      </Row>

      <Row gutter={[48, 0]}>
        <Col span={24}>
          <Form.Item
            label={<RenderLabel>{i18n.t(LOCALS.payment_method)}</RenderLabel>}
            name="settlementType"
          >
            <Select
              options={PaymentMethod}
              onChange={(e) => {
                setPayMethod(e);
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      {payMethod === 2 && (
        <>
          <Row gutter={[48, 0]}>
            <Col span={24}>
              <Form.Item
                label={<RenderLabel>{i18n.t('receiving_account')}</RenderLabel>}
                name="payAccount"
              >
                <Radio.Group
                  optionType="button"
                  buttonStyle="solid"
                  onChange={(e) => {
                    setPayAccount(e.target.value);
                  }}
                >
                  <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.HONG_KONG}>
                    {i18n.t('hong_kong_account')}
                  </Radio>
                  <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.OVERSEA}>
                    {i18n.t('overseas_account')}
                  </Radio>
                  <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP}>
                    {i18n.t('japanese_account')}
                  </Radio>
                  <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.SG}>
                    {i18n.t('singapore_account')}
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          {/* 香港 */}
          {payAccount === MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.HONG_KONG && (
            <>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={<RenderLabel>{i18n.t('payment_type')}</RenderLabel>}
                    name="memberPaymentAccountSubType"
                  >
                    <Radio.Group
                      optionType="button"
                      buttonStyle="solid"
                      onChange={(e) => setTransferType(e.target.value)}
                    >
                      <Radio value={MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK}>
                        {i18n.t('bank_transfer')}
                      </Radio>
                      <Radio value={MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.FPS}>
                        {i18n.t('fps')}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              {transferType === MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK && (
                <>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={<RenderLabel>{i18n.t('bank_name')}</RenderLabel>}
                        name="memberPaymentBankName"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={<RenderLabel>{i18n.t('bank_code')}</RenderLabel>}
                        name="memberPaymentBankNo"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={
                          <RenderLabel>{i18n.t('account_number')}</RenderLabel>
                        }
                        name="memberPaymentAccountNo"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={
                          <RenderLabel>
                            {i18n.t('account_holder_name')}
                          </RenderLabel>
                        }
                        name="memberPaymentAccountName"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
              {transferType === MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.FPS && (
                <>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={<RenderLabel>{i18n.t('number')}</RenderLabel>}
                        name="memberPaymentFpsNo"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={
                          <RenderLabel>
                            {i18n.t('account_holder_name')}
                          </RenderLabel>
                        }
                        name="memberPaymentFpsAccountName"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </>
          )}
          {/* 海外 */}
          {payAccount === MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.OVERSEA && (
            <>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={
                      <RenderLabel>{i18n.t('country_region')}</RenderLabel>
                    }
                    name="memberPaymentBankCountry"
                  >
                    <Select
                      options={countryOptions}
                      onChange={(e) => setCounty(e)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={<RenderLabel>{i18n.t('bank_name')}</RenderLabel>}
                    name="memberPaymentBankName"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={<RenderLabel>{i18n.t('bank_address')}</RenderLabel>}
                    name="memberPaymentBankAddress"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={<RenderLabel>SWIFT Code</RenderLabel>}
                    name="memberPaymentSwiftCode"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={
                      <RenderLabel>{i18n.t('account_number')}/IBAN</RenderLabel>
                    }
                    name="memberPaymentAccountNo"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              {country === 'USA' && (
                <Row gutter={[48, 0]}>
                  <Col span={24}>
                    <Form.Item
                      label={<RenderLabel>Routing No.</RenderLabel>}
                      name="memberPaymentRoutingNo"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={
                      <RenderLabel>{i18n.t('account_holder_name')}</RenderLabel>
                    }
                    name="memberPaymentAccountName"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={
                      <RenderLabel>
                        {i18n.t('account_holder_address')}
                      </RenderLabel>
                    }
                    name="memberPaymentAccountAddress"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          {/* 日本账户 */}
          {payAccount === MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP && (
            <>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={<RenderLabel>{i18n.t('bank_name')}</RenderLabel>}
                    name="memberPaymentBankName"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={<RenderLabel>{i18n.t('bank_address')}</RenderLabel>}
                    name="memberPaymentBankAddress"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={
                      <RenderLabel>{i18n.t('account_number')}</RenderLabel>
                    }
                    name="memberPaymentAccountNo"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={
                      <RenderLabel>{i18n.t('account_holder_name')}</RenderLabel>
                    }
                    name="memberPaymentAccountName"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={<RenderLabel>{i18n.t('identifier')}</RenderLabel>}
                    name="memberPaymentKiGo"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={<RenderLabel>{i18n.t('number')}</RenderLabel>}
                    name="memberPaymentBangGo"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          {/* 新加坡账户 */}
          {payAccount === MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.SG && (
            <>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={<RenderLabel>{i18n.t('payment_type')}</RenderLabel>}
                    name="memberPaymentAccountSubType"
                  >
                    <Radio.Group
                      optionType="button"
                      buttonStyle="solid"
                      onChange={(e) => setTransferType(e.target.value)}
                    >
                      <Radio value={MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK}>
                        {i18n.t('bank_transfer')}
                      </Radio>
                      <Radio
                        value={MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.PAY_NOW}
                      >
                        {i18n.t('paynow')}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              {transferType === MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK && (
                <>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={<RenderLabel>{i18n.t('bank_name')}</RenderLabel>}
                        name="memberPaymentBankName"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={<RenderLabel>{i18n.t('bank_code')}</RenderLabel>}
                        name="memberPaymentBankNo"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={<RenderLabel>SWIFT Code</RenderLabel>}
                        name="memberPaymentSwiftCode"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={
                          <RenderLabel>{i18n.t('account_number')}</RenderLabel>
                        }
                        name="memberPaymentAccountNo"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={
                          <RenderLabel>
                            {i18n.t('account_holder_name')}
                          </RenderLabel>
                        }
                        name="memberPaymentAccountName"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={
                          <RenderLabel>
                            {i18n.t('account_holder_address')}
                          </RenderLabel>
                        }
                        name="memberPaymentAccountAddress"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={
                          <RenderLabel>{i18n.t('contact_number')}</RenderLabel>
                        }
                        name="memberPaymentBankPhone"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
              {transferType === MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.PAY_NOW && (
                <>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={<RenderLabel>{i18n.t('paynow')}</RenderLabel>}
                        name="memberPaymentPayNowNo"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={
                          <RenderLabel>
                            {i18n.t('account_holder_name')}
                          </RenderLabel>
                        }
                        name="memberPaymentPayNowAccountName"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </>
          )}
        </>
      )}
    </Form>
  );
};

export default PayInfo;
