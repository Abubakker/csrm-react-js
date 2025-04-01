import { Col, Form, FormInstance, Input, Radio, Row, Select } from 'antd';
import { SHOP_MAP } from 'commons/options';
import { RenderLabel } from 'components/recycling-consignment/render-label';
import { useEffect } from 'react';
import { OmsRecycleOrderDetail } from 'types/oms';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import {
  MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP,
  MEMBER_PAYMENT_ACCOUNT_TYPE_MAP,
} from 'constants/RecyclingConsignment';
import i18n from 'i18next';
import LOCALS from '../../commons/locals';

type Props = {
  data: OmsRecycleOrderDetail;
  form: FormInstance<any>;
};

const MemberBankPaymentInfo = ({ data, form }: Props) => {
  const { omsRecycleOrder } = data;
  const { countryOptions } = useAppSelector(selectGlobalInfo);

  useEffect(() => {
    form.setFieldsValue({
      memberPaymentBankName: omsRecycleOrder?.memberPaymentBankName,
      memberPaymentBankAddress: omsRecycleOrder?.memberPaymentBankAddress,
      memberPaymentBankCountry: omsRecycleOrder?.memberPaymentBankCountry,
      memberPaymentBankNo: omsRecycleOrder?.memberPaymentBankNo,
      memberPaymentSwiftCode: omsRecycleOrder?.memberPaymentSwiftCode,
      memberPaymentAccountType: omsRecycleOrder?.memberPaymentAccountType,
      memberPaymentAccountSubType: omsRecycleOrder?.memberPaymentAccountSubType,
      memberPaymentRoutingNo: omsRecycleOrder?.memberPaymentRoutingNo,
      memberPaymentFpsNo: omsRecycleOrder?.memberPaymentFpsNo,
      memberPaymentFpsAccountName: omsRecycleOrder?.memberPaymentFpsAccountName,
      memberPaymentBankPhone: omsRecycleOrder?.memberPaymentBankPhone,
      memberPaymentPayNowNo: omsRecycleOrder?.memberPaymentPayNowNo,
      memberPaymentPayNowAccountName:
        omsRecycleOrder?.memberPaymentPayNowAccountName,
      memberPaymentAccountNo: omsRecycleOrder?.memberPaymentAccountNo,
      memberPaymentAccountName: omsRecycleOrder?.memberPaymentAccountName,
      memberPaymentAccountAddress: omsRecycleOrder?.memberPaymentAccountAddress,
      memberPaymentKiGo: omsRecycleOrder?.memberPaymentKiGo,
      memberPaymentBangGo: omsRecycleOrder?.memberPaymentBangGo,
    });
  }, [
    form,
    omsRecycleOrder?.memberPaymentAccountAddress,
    omsRecycleOrder?.memberPaymentAccountName,
    omsRecycleOrder?.memberPaymentAccountNo,
    omsRecycleOrder?.memberPaymentAccountSubType,
    omsRecycleOrder?.memberPaymentAccountType,
    omsRecycleOrder?.memberPaymentBangGo,
    omsRecycleOrder?.memberPaymentBankAddress,
    omsRecycleOrder?.memberPaymentBankCountry,
    omsRecycleOrder?.memberPaymentBankName,
    omsRecycleOrder?.memberPaymentBankNo,
    omsRecycleOrder?.memberPaymentBankPhone,
    omsRecycleOrder?.memberPaymentFpsAccountName,
    omsRecycleOrder?.memberPaymentFpsNo,
    omsRecycleOrder?.memberPaymentKiGo,
    omsRecycleOrder?.memberPaymentPayNowAccountName,
    omsRecycleOrder?.memberPaymentPayNowNo,
    omsRecycleOrder?.memberPaymentRoutingNo,
    omsRecycleOrder?.memberPaymentSwiftCode,
  ]);

  const memberPaymentAccountType = Form.useWatch('memberPaymentAccountType', {
    form,
    preserve: true,
  });

  const memberPaymentAccountSubType = Form.useWatch(
    'memberPaymentAccountSubType',
    { form, preserve: true }
  );

  const memberPaymentBankCountry = Form.useWatch('memberPaymentBankCountry', {
    form,
    preserve: true,
  });

  if (!omsRecycleOrder) return null;

  const { storeId } = omsRecycleOrder;

  if (storeId === SHOP_MAP.GINZA) {
    return (
      <div>
        <h3 style={{ textAlign: 'center' }}>{i18n.t(LOCALS.japanese_account)}</h3>

        <Form form={form} className="renderLabel">
          <Row gutter={[48, 0]}>
            <Col span={12}>
              <Form.Item
                name="memberPaymentBankName"
                label={<RenderLabel>{i18n.t(LOCALS.bank_name)}</RenderLabel>}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="memberPaymentBankAddress"
                label={<RenderLabel>{i18n.t(LOCALS.bank_address)}</RenderLabel>}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="memberPaymentAccountNo"
                label={<RenderLabel>{i18n.t(LOCALS.account_number)}</RenderLabel>}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="memberPaymentAccountName"
                label={<RenderLabel>{i18n.t(LOCALS.account_holder_name)}</RenderLabel>}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="memberPaymentKiGo"
                label={<RenderLabel>{i18n.t(LOCALS.identifier)}</RenderLabel>}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="memberPaymentBangGo"
                label={<RenderLabel>{i18n.t(LOCALS.number)}</RenderLabel>}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  if (storeId === SHOP_MAP.SINGAPORE) {
    return (
      <div>
        <h3 style={{ textAlign: 'center' }}>新加坡账户</h3>
        <Form form={form}>
          <div className="flex">
            <div
              style={{
                marginLeft: 40,
                marginBottom: 16,
                cursor: 'pointer',
              }}
              onClick={() => {
                form.setFieldValue(
                  'memberPaymentAccountSubType',
                  MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK
                );
              }}
            >
              <Radio
                type="radio"
                checked={
                  memberPaymentAccountSubType ===
                  MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK
                }
              ></Radio>
              银行转账
            </div>
            <div
              style={{
                marginLeft: 40,
                marginBottom: 16,
                cursor: 'pointer',
              }}
              onClick={() => {
                form.setFieldValue(
                  'memberPaymentAccountSubType',
                  MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.PAY_NOW
                );
              }}
            >
              <Radio
                type="radio"
                checked={
                  memberPaymentAccountSubType ===
                  MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.PAY_NOW
                }
              ></Radio>
              PayNow转账
            </div>
          </div>

          <Form.Item
            name="memberPaymentAccountSubType"
            style={{ display: 'none' }}
          >
            <Input></Input>
          </Form.Item>

          {/* BANK */}
          {memberPaymentAccountSubType ===
            MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK && (
            <Row gutter={[48, 0]}>
              <Col span={12}>
                <Form.Item
                  name="memberPaymentBankName"
                  label={<RenderLabel>银行名称</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="memberPaymentBankAddress"
                  label={<RenderLabel>银行地址</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="memberPaymentSwiftCode"
                  label={<RenderLabel>SWIFT Code</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="memberPaymentAccountNo"
                  label={<RenderLabel>账户号码</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="memberPaymentAccountName"
                  label={<RenderLabel>账户人姓名</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="memberPaymentAccountAddress"
                  label={<RenderLabel>账户人地址</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="memberPaymentBankPhone"
                  label={<RenderLabel>银行预留电话</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/*PAY_NOW */}
          {memberPaymentAccountSubType ===
            MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.PAY_NOW && (
            <Row gutter={[48, 0]}>
              <Col span={12}>
                <Form.Item
                  name="memberPaymentPayNowNo"
                  label={<RenderLabel>PayNow账号</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="memberPaymentPayNowAccountName"
                  label={<RenderLabel>账户人姓名</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </div>
    );
  }

  return (
    <div>
      <Form form={form}>
        <Form.Item
          name="memberPaymentAccountType"
          label={<RenderLabel>账户类型</RenderLabel>}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.OVERSEA}>
              {i18n.t(LOCALS.overseas_account)}
            </Radio>
            <Radio value={MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.HONG_KONG}>
              香港账户
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="memberPaymentAccountSubType"
          style={{ display: 'none' }}
        >
          <Input />
        </Form.Item>

        {memberPaymentAccountType ===
          MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.OVERSEA && (
          <>
            <Row gutter={[48, 0]}>
              <Col span={12}>
                <Form.Item
                  name="memberPaymentBankCountry"
                  label={<RenderLabel>银行所在国家</RenderLabel>}
                >
                  <Select options={countryOptions}></Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="memberPaymentBankName"
                  label={<RenderLabel>银行名称</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="memberPaymentBankAddress"
                  label={<RenderLabel>银行地址</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="memberPaymentSwiftCode"
                  label={<RenderLabel>SWIFT Code</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="memberPaymentAccountNo"
                  label={<RenderLabel>账户号码/IBAN</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>

              {memberPaymentBankCountry === 'USA' && (
                <Col span={12}>
                  <Form.Item
                    name="memberPaymentRoutingNo"
                    label={<RenderLabel>Routing No</RenderLabel>}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              )}

              <Col span={12}>
                <Form.Item
                  name="memberPaymentAccountName"
                  label={<RenderLabel>账户人姓名</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="memberPaymentAccountAddress"
                  label={<RenderLabel>账户人地址</RenderLabel>}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {memberPaymentAccountType ===
          MEMBER_PAYMENT_ACCOUNT_TYPE_MAP.HONG_KONG && (
          <>
            <div className="flex">
              <div
                style={{
                  marginLeft: 40,
                  marginBottom: 16,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  form.setFieldValue(
                    'memberPaymentAccountSubType',
                    MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK
                  );
                }}
              >
                <Radio
                  type="radio"
                  checked={
                    memberPaymentAccountSubType ===
                    MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK
                  }
                ></Radio>
                银行转账
              </div>
              <div
                style={{
                  marginLeft: 40,
                  marginBottom: 16,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  form.setFieldValue(
                    'memberPaymentAccountSubType',
                    MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.FPS
                  );
                }}
              >
                <Radio
                  type="radio"
                  checked={
                    memberPaymentAccountSubType ===
                    MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.FPS
                  }
                ></Radio>
                FPS转账
              </div>
            </div>

            {/* BANK */}
            {memberPaymentAccountSubType ===
              MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.BANK && (
              <Row gutter={[48, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="memberPaymentBankName"
                    label={<RenderLabel>银行名称</RenderLabel>}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="memberPaymentBankNo"
                    label={<RenderLabel>银行编号</RenderLabel>}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="memberPaymentAccountNo"
                    label={<RenderLabel>账户号码</RenderLabel>}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="memberPaymentAccountName"
                    label={<RenderLabel>账户人姓名</RenderLabel>}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            )}

            {/* FPS */}
            {memberPaymentAccountSubType ===
              MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP.FPS && (
              <Row gutter={[48, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="memberPaymentFpsNo"
                    label={<RenderLabel>FPS账号</RenderLabel>}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="memberPaymentFpsAccountName"
                    label={<RenderLabel>账户人姓名</RenderLabel>}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </>
        )}
      </Form>
    </div>
  );
};

export default MemberBankPaymentInfo;
