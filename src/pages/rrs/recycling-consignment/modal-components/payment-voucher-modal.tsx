import { useCallback, useState, useEffect } from 'react';
import styles from './index.module.scss';
import {
  Form,
  Modal,
  Input,
  message,
  Popconfirm,
  Button,
  Collapse,
  Radio,
  Select,
} from 'antd';
import { OmsRecycleOrderDetail } from 'types/oms';
import { fetchPaymentVoucher } from 'apis/oms';
import BriefProductInfo from '../components/brief-product-info';
import UploadImageTips from '../input-components/upload-image-tips';
import useProductFormData from 'commons/hooks/useProductFormData';
import ClipboardJS from 'clipboard';
import { CaretRightOutlined } from '@ant-design/icons';
import { thousands } from 'utils/tools';
import GetPaymentInfo from 'utils/getPaymentInfo';
import i18n from 'i18next';
import LOCALS from '../../../../commons/locals';

interface Props {
  open: boolean;
  onClose: () => void;
  data: OmsRecycleOrderDetail;
  reload: () => void;
  modalOption: any;
}

/** 录入打款信息 */
const PaymentVoucherModal = ({
  open,
  onClose,
  data,
  reload,
  modalOption,
}: Props) => {
  const [form] = Form.useForm<any>();
  const [loading, setLoading] = useState(false);
  const [uploadList, setUploadList] = useState<string[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<
    { label: string; value?: string }[]
  >([]);

  const { type } = modalOption;
  const { showData, setProductInfo } = useProductFormData();
  const [copyText, setCopyText] = useState('');

  useEffect(() => {
    new ClipboardJS('.copy-btn');
  }, []);

  const selectedPaymentMethod = Form.useWatch('settlementType', form);

  const onFinish = useCallback(() => {
    form.validateFields().then((values: any) => {
      setLoading(true);
      const {
        settlementType,
        financialPaymentInfo,
        financialPaymentAmount,
        financialPaymentVoucher,
        isOrderCompleted,
      } = values;
      const id = data?.omsRecycleOrder?.id;
      // 移除千分位
      const cleanAmount = financialPaymentAmount.replace(/,/g, '');
      let payload: any = {
        id: `${id}`,
        type,
        settlementType,
        financialPaymentInfo,
        financialPaymentAmount: cleanAmount,
        financialPaymentVoucher,
        isOrderCompleted,
      };
      fetchPaymentVoucher(payload)
        .then(() => {
          message.success('提交成功！');
          onClose();
          reload();
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [data, type, form, onClose, reload]);

  useEffect(() => {
    if (Object.keys(data).length === 0) return;
    const { omsRecycleOrder, omsRecycleOrderItem, omsRecycleOrderProduct } =
      data;
    setProductInfo(omsRecycleOrderProduct || {});
    const { financialPaymentVoucher = '', type = 0 } = omsRecycleOrder || {};
    const { finalRecyclePrice, finalSalePrice } = omsRecycleOrderItem || {};
    // 0-未确认，1-寄卖，2-回收
    let PaymentAmount = 0;
    if (type === 1) {
      PaymentAmount = finalSalePrice || 0;
    } else if (type === 2) {
      PaymentAmount = finalRecyclePrice || 0;
    }
    const payment = GetPaymentInfo({
      ...omsRecycleOrder,
    });
    setPaymentInfo(payment);
    let copyData = '';
    // 这里需要保留换行
    payment.map((d) => (copyData += `${d.label}：${d.value}\n`));
    setCopyText(copyData);
    // 判断银行账号
    let financialPaymentInfo = copyData;
    //
    form.setFieldsValue({
      financialPaymentInfo,
      financialPaymentAmount: thousands(PaymentAmount),
    });
    setUploadList(JSON.parse(financialPaymentVoucher));
  }, [data, form, setProductInfo]);

  return (
    <Modal
      open={open}
      title={type === 'create' ? i18n.t(LOCALS.confirm_payment) : '更新打款'}
      onCancel={() => onClose()}
      onOk={onFinish}
      className={styles.PaymentVoucherModal}
      destroyOnClose
      confirmLoading={loading}
      width={600}
      footer={[
        <Button onClick={() => onClose()} key={'cancel'}>
          {i18n.t(LOCALS.cancel)}
        </Button>,
        <Popconfirm
          title={i18n.t(LOCALS.caution)}
          description={
            <div className={styles.Popconfirm}>
              {i18n.t(LOCALS.confirm_submission)}
            </div>
          }
          onConfirm={() => onFinish()}
          okText={i18n.t(LOCALS.confirm)}
          cancelText={i18n.t(LOCALS.cancel)}
          key={'ok'}
        >
          <Button
            type="primary"
            loading={loading}
            onClick={() => form.validateFields()}
          >
            {i18n.t(LOCALS.confirm)}
          </Button>
        </Popconfirm>,
      ]}
    >
      <BriefProductInfo data={data} showData={showData} />
      {/*TODO 选择现金还是会计打款 1-现金,2-会计打款*/}
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{
          settlementType: data.omsRecycleOrder?.settlementType ?? 2,
        }}
      >
        <Form.Item
          label={i18n.t(LOCALS.payment_method)}
          name="settlementType"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value={1}>{i18n.t(LOCALS.cash)}</Select.Option>
            <Select.Option value={2}>
              {i18n.t(LOCALS.accounting_settlement)}
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
      {selectedPaymentMethod === 2 ? (
        <>
          <Collapse
            bordered
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{ background: '#fff' }}
            size="small"
            items={[
              {
                key: '1',
                label: i18n.t(LOCALS.payment_information_collection),
                children: (
                  <div className={styles.desc}>
                    <div className="m-2">
                      {paymentInfo.map((d, i) => (
                        <div key={i} className="m-1 flex">
                          <div className="w-[40%] text-right pr-2 text-[#828282]">
                            {d.label}：
                          </div>
                          <div className="w-[60%] pl-2">{d.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.btn}>
                      <Button
                        type="primary"
                        onClick={() =>
                          message.success(i18n.t(LOCALS.successful_operation))
                        }
                        data-clipboard-text={copyText}
                        className="copy-btn"
                      >
                        复制收款
                      </Button>
                    </div>
                  </div>
                ),
              },
            ]}
          />
          <div className={styles.formWarp}>
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ isOrderCompleted: 1 }}
            >
              <Form.Item
                label={i18n.t(LOCALS.payment_information)}
                name="financialPaymentInfo"
              >
                <Input.TextArea disabled rows={5} />
              </Form.Item>
              <Form.Item
                label={i18n.t(LOCALS.receiving_amount)}
                name="financialPaymentAmount"
              >
                <Input addonBefore={data.omsRecycleOrder?.currency} disabled />
              </Form.Item>
              <Form.Item
                label={i18n.t(LOCALS.payment_voucher)}
                name="financialPaymentVoucher"
                rules={[{ required: true }]}
              >
                <UploadImageTips uploadList={uploadList} max={5} />
              </Form.Item>

              <Form.Item
                label={'注文を完了する'}
                name="isOrderCompleted"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio value={0}>{i18n.t(LOCALS.no)}</Radio>
                  <Radio value={1}>{i18n.t(LOCALS.yes)}</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </div>
        </>
      ) : (
        <>
          <div className={styles.formWarp}>
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ isOrderCompleted: 1 }}
            >
              <Form.Item
                label={i18n.t(LOCALS.receiving_amount)}
                name="financialPaymentAmount"
              >
                <Input addonBefore={data.omsRecycleOrder?.currency} disabled />
              </Form.Item>

              <Form.Item
                label={'注文を完了する'}
                name="isOrderCompleted"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio disabled={true} value={0}>
                    {i18n.t(LOCALS.no)}
                  </Radio>
                  <Radio defaultChecked={true} disabled={true} value={1}>
                    {i18n.t(LOCALS.yes)}
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </div>
        </>
      )}
    </Modal>
  );
};

export default PaymentVoucherModal;
