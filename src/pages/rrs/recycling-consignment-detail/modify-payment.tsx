import { Form, Select, Radio, Input, Modal, message } from 'antd';
import { modifyOmsRecycleOrderDetails } from 'apis/oms';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { useEffect, useState } from 'react';
import {
  PaymentMethod,
  MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP,
  MEMBER_PAYMENT_ACCOUNT_TYPE_MAP,
} from 'constants/RecyclingConsignment';
import { OmsRecycleOrderDetail } from 'types/oms';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';

type Props = {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  dataSource: OmsRecycleOrderDetail;
};

const ModifyPayment = ({ open, onCancel, onSuccess, dataSource }: Props) => {
  const [form] = Form.useForm();
  const { countryOptions } = useAppSelector(selectGlobalInfo);

  const [payMethod, setPayMethod] = useState<number>(2); // 打款方式
  const [payAccount, setPayAccount] = useState<number>(
    MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP
  ); // 打款账户
  const [transferType, setTransferType] = useState<number>(
    MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK
  ); // 转账类型
  const [country, setCounty] = useState<string>('JPN');

  useEffect(() => {
    form.setFieldsValue({ ...dataSource.omsRecycleOrder });
    setPayMethod(dataSource.omsRecycleOrder?.settlementType || 2);
    setPayAccount(
      dataSource.omsRecycleOrder?.memberPaymentAccountType ||
        MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP
    );
    setTransferType(
      dataSource.omsRecycleOrder?.memberPaymentAccountSubType ||
        MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK
    );
  }, [dataSource.omsRecycleOrder, form]);

  return (
    <Modal
      open={open}
      title={i18n.t(LOCALS.update_payment_information)}
      width={600}
      onCancel={onCancel}
      onOk={async () => {
        const { payAccount, ...rest } = form.getFieldsValue();
        const payload = {
          ...rest,
          memberPaymentAccountType: payAccount,
        };
        await modifyOmsRecycleOrderDetails(payload);
        message.success(i18n.t(LOCALS.successful_operation));
        onSuccess();
      }}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        initialValues={{
          id: dataSource.omsRecycleOrder?.id,
          settlementType: payMethod,
          payAccount,
          memberPaymentAccountSubType: transferType,
          country,
          address: { selectedType: 1 },
        }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label={i18n.t(LOCALS.payment_method)}
          name="settlementType"
          rules={[{ required: true }]}
        >
          <Select
            options={PaymentMethod}
            onChange={(e) => {
              setPayMethod(e);
            }}
          />
        </Form.Item>

        {payMethod === 2 && (
          <>
            <Form.Item
              label={i18n.t(LOCALS.receiving_account)}
              name="payAccount"
              rules={[{ required: true }]}
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
                  rules={[{ required: true }]}
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

                {transferType === MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK && (
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
                  </>
                )}
                {transferType === MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.FPS && (
                  <>
                    <Form.Item
                      label={i18n.t(LOCALS.number)}
                      name="memberPaymentFpsNo"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label={i18n.t(LOCALS.account_holder_name)}
                      name="memberPaymentFpsAccountName"
                      rules={[{ required: true }]}
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
                  rules={[{ required: true }]}
                >
                  <Select
                    options={countryOptions}
                    onChange={(e) => setCounty(e)}
                  />
                </Form.Item>

                <Form.Item
                  label={i18n.t(LOCALS.bank_name)}
                  name="memberPaymentBankName"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={i18n.t(LOCALS.bank_address)}
                  name="memberPaymentBankAddress"
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
                  label={i18n.t(LOCALS.account_number_iban)}
                  name="memberPaymentAccountNo"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>

                {country === 'USA' && (
                  <Form.Item
                    label={'Routing No.'}
                    name="memberPaymentRoutingNo"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                )}

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
              </>
            )}
            {/* 日本账户 */}
            {payAccount === MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP && (
              <>
                <Form.Item
                  label={i18n.t(LOCALS.bank_name)}
                  name="memberPaymentBankName"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={i18n.t(LOCALS.bank_address)}
                  name="memberPaymentBankAddress"
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
                  label={i18n.t(LOCALS.identifier)}
                  name="memberPaymentKiGo"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={i18n.t(LOCALS.number)}
                  name="memberPaymentBangGo"
                  rules={[{ required: true }]}
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
                    <Radio value={MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.PAY_NOW}>
                      {i18n.t(LOCALS.paynow)}
                    </Radio>
                  </Radio.Group>
                </Form.Item>

                {transferType === MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK && (
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
  );
};

export default ModifyPayment;
