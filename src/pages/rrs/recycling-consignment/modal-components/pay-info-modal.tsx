import { useCallback, useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Form, Row, Col, Select, Radio, Input, message, Modal } from 'antd';
import {
  OmsRecycleOrderFillInMemberPaymentInfoDTO,
  OmsRecycleOrderDetail,
} from 'types/oms';
import { fetchFillInMemberPaymentInfo } from 'apis/oms';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import {
  MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP,
  MEMBER_PAYMENT_ACCOUNT_TYPE_MAP,
} from 'constants/RecyclingConsignment';
import i18n from '../../../../i18n';
import LOCALS from '../../../../commons/locals';

interface Props {
  open: boolean;
  onClose: () => void;
  data: OmsRecycleOrderDetail;
  reload: () => void;
}

const PayInfoModal = ({ open, onClose, data, reload }: Props) => {
  const [form] = Form.useForm<any>();
  const [loading, setLoading] = useState(false);
  const [payAccount, setPayAccount] = useState<number>(
    MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP
  ); // 打款账户
  const [transferType, setTransferType] = useState<number>(
    MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK
  ); // 转账类型

  const [country, setCounty] = useState<string>('JPN');
  const { countryOptions } = useAppSelector(selectGlobalInfo);

  useEffect(() => {
    setPayAccount(MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP);
    setTransferType(MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK);
    form.setFieldsValue({
      payAccount: MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP,
      memberPaymentAccountSubType: MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK,
    });
  }, [form]);

  useEffect(() => {
    setTransferType(MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK);
    form.setFieldsValue({
      memberPaymentAccountSubType: MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK,
    });
  }, [payAccount, form]);

  const onFinish = useCallback(() => {
    form.validateFields().then((values) => {
      const { payAccount, ...rest } = values;
      setLoading(true);
      const id = data.omsRecycleOrder?.id;
      const payload: OmsRecycleOrderFillInMemberPaymentInfoDTO = {
        ...rest,
        memberPaymentAccountType: payAccount,
        id,
      };
      fetchFillInMemberPaymentInfo(payload)
        .then(() => {
          message.success('提交成功');
          onClose();
          reload();
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [data, form, onClose, reload]);

  return (
    <>
      <Modal
        open={open}
        title={'收款信息'}
        onCancel={() => onClose()}
        onOk={onFinish}
        className={styles.PayInfoModal}
        destroyOnClose
        confirmLoading={loading}
        width={700}
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Row gutter={[48, 0]}>
            <Col span={24}>
              <Form.Item
                label={'打款账户'}
                name="payAccount"
                rules={[{ required: true }]}
              >
                <Radio.Group
                  onChange={(e) => {
                    setPayAccount(e.target.value);
                  }}
                >
                  <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.HONG_KONG}>
                    香港账户
                  </Radio>
                  <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.OVERSEA}>
                    {i18n.t(LOCALS.overseas_account)}
                  </Radio>
                  <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.JP}>
                    日本账户
                  </Radio>
                  <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.SG}>
                    新加坡账户
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
                    label={'转账类型'}
                    name="memberPaymentAccountSubType"
                    rules={[{ required: true }]}
                  >
                    <Radio.Group
                      onChange={(e) => setTransferType(e.target.value)}
                    >
                      <Radio value={MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK}>
                        银行转账
                      </Radio>
                      <Radio value={MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.FPS}>
                        FPS转账
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
                        label={'银行名称'}
                        name="memberPaymentBankName"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={'银行编号'}
                        name="memberPaymentBankNo"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={'账户号码'}
                        name="memberPaymentAccountNo"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={'账户人姓名'}
                        name="memberPaymentAccountName"
                        rules={[{ required: true }]}
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
                        label={'FPS账号'}
                        name="memberPaymentFpsNo"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={'账户人姓名'}
                        name="memberPaymentFpsAccountName"
                        rules={[{ required: true }]}
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
                    label={'国家/地区'}
                    name="memberPaymentBankCountry"
                    rules={[{ required: true }]}
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
                    label={'银行名称'}
                    name="memberPaymentBankName"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={'银行地址'}
                    name="memberPaymentBankAddress"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={'SWIFT Code'}
                    name="memberPaymentSwiftCode"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={'账户号码/IBAN'}
                    name="memberPaymentAccountNo"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              {country === 'USA' && (
                <Row gutter={[48, 0]}>
                  <Col span={24}>
                    <Form.Item
                      label={'Routing No.'}
                      name="memberPaymentRoutingNo"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={'账户人姓名'}
                    name="memberPaymentAccountName"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={'账户人地址'}
                    name="memberPaymentAccountAddress"
                    rules={[{ required: true }]}
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
                    label={'银行名称'}
                    name="memberPaymentBankName"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={'银行地址'}
                    name="memberPaymentBankAddress"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={'账户号码'}
                    name="memberPaymentAccountNo"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={'账户人名字'}
                    name="memberPaymentAccountName"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={'記号'}
                    name="memberPaymentKiGo"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[48, 0]}>
                <Col span={24}>
                  <Form.Item
                    label={'番号'}
                    name="memberPaymentBangGo"
                    rules={[{ required: true }]}
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
                    label={'转账类型'}
                    name="memberPaymentAccountSubType"
                    rules={[{ required: true }]}
                  >
                    <Radio.Group
                      onChange={(e) => setTransferType(e.target.value)}
                    >
                      <Radio value={MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK}>
                        银行转账
                      </Radio>
                      <Radio
                        value={MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.PAY_NOW}
                      >
                        PayNow转账
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
                        label={'银行名称'}
                        name="memberPaymentBankName"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={'银行编号'}
                        name="memberPaymentBankNo"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={'SWIFT Code'}
                        name="memberPaymentSwiftCode"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={'账户号码'}
                        name="memberPaymentAccountNo"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={'账户人姓名'}
                        name="memberPaymentAccountName"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={'账户人地址'}
                        name="memberPaymentAccountAddress"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={'银行预留电话'}
                        name="memberPaymentBankPhone"
                        rules={[{ required: true }]}
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
                        label={'PayNow账号'}
                        name="memberPaymentPayNowNo"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 0]}>
                    <Col span={24}>
                      <Form.Item
                        label={'账户人姓名'}
                        name="memberPaymentPayNowAccountName"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default PayInfoModal;
