import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './index.module.scss';
import {
  Form,
  Row,
  Col,
  Select,
  Radio,
  Input,
  message,
  Modal,
  InputNumber,
} from 'antd';
import { OmsRecycleOrderDetail, OmsConsignmentToRecycling } from 'types/oms';
import { consignmentToRecycling } from 'apis/oms';
import i18n from 'i18next';
import { thousands } from 'utils/tools';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import {
  PaymentMethod,
  MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP,
  MEMBER_PAYMENT_ACCOUNT_TYPE_MAP,
} from 'constants/RecyclingConsignment';
import LOCALS from 'commons/locals';

interface Props {
  open: boolean;
  onClose: () => void;
  data: OmsRecycleOrderDetail;
  reload: () => void;
}

const ConsignmentToRecyclingModal = ({
  open,
  onClose,
  data,
  reload,
}: Props) => {
  const [form] = Form.useForm();
  const { countryOptions } = useAppSelector(selectGlobalInfo);

  const settlementType = Form.useWatch('settlementType', {
    form,
    preserve: true,
  });
  const currency = useMemo(() => {
    return data?.omsRecycleOrder?.currency;
  }, [data]);

  useEffect(() => {
    if (data) {
      const t = {
        id: data.omsRecycleOrder?.id,
        saleValue: data.omsRecycleOrderItem?.finalSalePrice,
        recycleValue: data.omsRecycleOrderItem?.finalRecyclePrice,
        omsRecycleOrderLogisticsId: data.omsRecycleOrderLogistics?.id,
      };
      form.setFieldsValue(t);
    }
    const rest = data?.omsRecycleOrder || {};
    form.setFieldsValue({
      ...rest,
      settlementType: 1,
      payAccount: MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP,
    });
    setPayAccount(MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP);
    setTransferType(MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK);
  }, [form, data]);

  const onFinish = useCallback(() => {
    form.validateFields().then((values: any) => {
      const { recycleValue, payAccount, ...rest } = values;
      const payload: OmsConsignmentToRecycling = {
        finalRecyclePrice: recycleValue,
        memberPaymentAccountType: payAccount,
        ...rest,
      };
      consignmentToRecycling(payload).then(() => {
        message.success(i18n.t('successful_operation'));
        onClose();
        reload();
      });
    });
  }, [form, onClose, reload]);

  const [payAccount, setPayAccount] = useState<number>(
    MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP
  ); // 打款账户
  const [transferType, setTransferType] = useState<number>(
    MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK
  ); // 转账类型
  const [country, setCounty] = useState<string>('JPN');

  return (
    <>
      <Modal
        open={open}
        title={i18n.t('consignment_to_recycling')}
        onCancel={() => onClose()}
        onOk={onFinish}
        className={styles.PayInfoModal}
        destroyOnClose
        width={700}
      >
        <div className="text-lg text-red-500 mb-4">
          {i18n.t('consignment_to_recycling_tips')}
        </div>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            settlementType: 1,
            payAccount: MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP,
            memberPaymentAccountSubType: transferType,
          }}
          labelWrap
        >
          <Row gutter={[48, 0]}>
            <Col span={24}>
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[48, 0]}>
            <Col span={24}>
              <Form.Item
                label={i18n.t('recycling_confirmation_quote')}
                name="recycleValue"
                rules={[{ required: true }]}
                className="mb-0"
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
              <Form.Item colon={false} label={<div></div>}>
                {i18n.t('consignment_confirmation_quote')}：
                {thousands(data?.omsRecycleOrderItem?.finalSalePrice)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={i18n.t(LOCALS.payment_method)}
            name="settlementType"
            rules={[{ required: true }]}
          >
            <Select options={PaymentMethod} />
          </Form.Item>
          {settlementType === 2 && (
            <>
              <Form.Item
                label={i18n.t(LOCALS.receiving_account)}
                name="payAccount"
              >
                <Radio.Group
                  onChange={(e) => {
                    setPayAccount(e.target.value);
                  }}
                >
                  <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.HONG_KONG}>
                    {i18n.t(LOCALS.hong_kong_account)}
                  </Radio>
                  <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.OVERSEA}>
                    {i18n.t(LOCALS.overseas_account)}
                  </Radio>
                  <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP}>
                    {i18n.t(LOCALS.japanese_account)}
                  </Radio>
                  <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.SG}>
                    {i18n.t(LOCALS.singapore_account)}
                  </Radio>
                </Radio.Group>
              </Form.Item>

              {/* 香港 */}
              {payAccount === MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.HONG_KONG && (
                <>
                  <Form.Item
                    label={i18n.t(LOCALS.payment_type)}
                    name="memberPaymentAccountSubType"
                  >
                    <Radio.Group
                      onChange={(e) => setTransferType(e.target.value)}
                    >
                      <Radio value={MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK}>
                        {i18n.t(LOCALS.bank_transfer)}
                      </Radio>
                      <Radio value={MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.FPS}>
                        {i18n.t(LOCALS.fps)}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>

                  {transferType ===
                    MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK && (
                    <>
                      <Form.Item
                        label={i18n.t(LOCALS.bank_name)}
                        name="memberPaymentBankName"
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={i18n.t(LOCALS.bank_code)}
                        name="memberPaymentBankNo"
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={i18n.t(LOCALS.account_number)}
                        name="memberPaymentAccountNo"
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={i18n.t(LOCALS.account_holder_name)}
                        name="memberPaymentAccountName"
                      >
                        <Input />
                      </Form.Item>
                    </>
                  )}
                  {transferType === MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.FPS && (
                    <>
                      <Form.Item
                        label={i18n.t(LOCALS.number)}
                        name="memberPaymentFpsNo"
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={i18n.t(LOCALS.account_holder_name)}
                        name="memberPaymentFpsAccountName"
                      >
                        <Input />
                      </Form.Item>
                    </>
                  )}
                </>
              )}
              {/* 海外 */}
              {payAccount === MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.OVERSEA && (
                <>
                  <Form.Item
                    label={i18n.t(LOCALS.location)}
                    name="memberPaymentBankCountry"
                  >
                    <Select
                      options={countryOptions}
                      onChange={(e) => setCounty(e)}
                    />
                  </Form.Item>

                  <Form.Item
                    label={i18n.t(LOCALS.bank_name)}
                    name="memberPaymentBankName"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label={i18n.t(LOCALS.bank_address)}
                    name="memberPaymentBankAddress"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item label={'SWIFT Code'} name="memberPaymentSwiftCode">
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label={i18n.t(LOCALS.account_number_iban)}
                    name="memberPaymentAccountNo"
                  >
                    <Input />
                  </Form.Item>

                  {country === 'USA' && (
                    <Form.Item
                      label={'Routing No.'}
                      name="memberPaymentRoutingNo"
                    >
                      <Input />
                    </Form.Item>
                  )}

                  <Form.Item
                    label={i18n.t(LOCALS.account_holder_name)}
                    name="memberPaymentAccountName"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label={i18n.t(LOCALS.account_holder_address)}
                    name="memberPaymentAccountAddress"
                  >
                    <Input />
                  </Form.Item>
                </>
              )}
              {/* 日本账户 */}
              {payAccount === MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP && (
                <>
                  <Form.Item
                    label={i18n.t(LOCALS.bank_name)}
                    name="memberPaymentBankName"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={i18n.t(LOCALS.bank_address)}
                    name="memberPaymentBankAddress"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label={i18n.t(LOCALS.account_number)}
                    name="memberPaymentAccountNo"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label={i18n.t(LOCALS.account_holder_name)}
                    name="memberPaymentAccountName"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={i18n.t(LOCALS.identifier)}
                    name="memberPaymentKiGo"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label={i18n.t(LOCALS.number)}
                    name="memberPaymentBangGo"
                  >
                    <Input />
                  </Form.Item>
                </>
              )}
              {/* 新加坡账户 */}
              {payAccount === MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.SG && (
                <>
                  <Form.Item
                    label={i18n.t(LOCALS.payment_type)}
                    name="memberPaymentAccountSubType"
                    rules={[{ required: true }]}
                  >
                    <Radio.Group
                      onChange={(e) => setTransferType(e.target.value)}
                    >
                      <Radio value={MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK}>
                        {i18n.t(LOCALS.bank_transfer)}
                      </Radio>
                      <Radio
                        value={MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.PAY_NOW}
                      >
                        {i18n.t(LOCALS.paynow)}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>

                  {transferType ===
                    MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK && (
                    <>
                      <Form.Item
                        label={i18n.t(LOCALS.bank_name)}
                        name="memberPaymentBankName"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={i18n.t(LOCALS.bank_code)}
                        name="memberPaymentBankNo"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={'SWIFT Code'}
                        name="memberPaymentSwiftCode"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={i18n.t(LOCALS.account_number)}
                        name="memberPaymentAccountNo"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={i18n.t(LOCALS.account_holder_name)}
                        name="memberPaymentAccountName"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={i18n.t(LOCALS.account_holder_address)}
                        name="memberPaymentAccountAddress"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={i18n.t(LOCALS.contact_number)}
                        name="memberPaymentBankPhone"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </>
                  )}
                  {transferType ===
                    MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.PAY_NOW && (
                    <>
                      <Form.Item
                        label={i18n.t(LOCALS.paynow)}
                        name="memberPaymentPayNowNo"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={i18n.t(LOCALS.account_holder_name)}
                        name="memberPaymentPayNowAccountName"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default ConsignmentToRecyclingModal;
