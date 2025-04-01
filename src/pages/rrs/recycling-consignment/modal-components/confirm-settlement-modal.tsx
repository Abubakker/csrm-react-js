import { useState, useEffect, useCallback } from 'react';
import styles from './index.module.scss';
import { Select, Form, Modal, message, Input, Popconfirm, Button } from 'antd';
import {
  OmsRecycleOrderDetail,
  OmsRecycleOrderValuationPayload,
  OmsRecycleOrderItem,
  OmsRecycleOrder,
} from 'types/oms';
import { fetchConfirmSettlement } from 'apis/oms';
import { thousands } from 'utils/tools';
import BriefProductInfo from '../components/brief-product-info';
import useProductFormData from 'commons/hooks/useProductFormData';
import i18n from '../../../../i18n';
import LOCALS from '../../../../commons/locals';

interface Props {
  open: boolean;
  onClose: () => void;
  data: OmsRecycleOrderDetail;
  reload: () => void;
}

/** 确认结算 */
const ConfirmSettlementModal = ({ open, onClose, data, reload }: Props) => {
  const [form] = Form.useForm<OmsRecycleOrderValuationPayload>();
  const [info, setInfo] = useState<OmsRecycleOrderItem & OmsRecycleOrder>({});
  const [loading, setLoading] = useState(false);

  const { showData, setProductInfo } = useProductFormData();

  useEffect(() => {
    if (data?.omsRecycleOrderItem && data?.omsRecycleOrder) {
      setProductInfo(data.omsRecycleOrderProduct || {});

      const { finalSalePrice } = data.omsRecycleOrderItem;
      const { currency } = data?.omsRecycleOrder;
      const info = {
        currency,
        finalSalePrice,
      };
      setInfo(info);
    }
  }, [data]);

  const onFinish = useCallback(() => {
    form.validateFields().then((values: any) => {
      setLoading(true);
      const { settlementType, orderSn } = values;
      const id = data?.omsRecycleOrder?.id;
      let payload = {
        settlementType,
        orderSn,
        id: `${id}`,
      };
      fetchConfirmSettlement(payload)
        .then(() => {
          message.success('确认结算提交成功！');
          onClose();
          reload();
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [data]);

  return (
    <Modal
      open={open}
      title={i18n.t(LOCALS.confirm_settlement)}
      onCancel={() => onClose()}
      onOk={onFinish}
      className={styles.ConfirmSettlementModal}
      destroyOnClose
      confirmLoading={loading}
      footer={[
        <Button onClick={() => onClose()} key={'cancel'}>
          {i18n.t(LOCALS.cancel)}
        </Button>,
        <Popconfirm
          title={i18n.t(LOCALS.caution)} key={'ok'}
          description={<div className={styles.Popconfirm}>{i18n.t(LOCALS.confirm_submission)}</div>}
          onConfirm={() => onFinish()}
          okText={i18n.t(LOCALS.confirm)}
          cancelText={i18n.t(LOCALS.cancel)}
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
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ settlementType: 2 }}
      >
        <Form.Item label={i18n.t(LOCALS.consignment_item_amount)}>
          {info.currency}&nbsp;&nbsp;{thousands(info.finalSalePrice)}
        </Form.Item>
        <Form.Item
          label={i18n.t(LOCALS.payment_method)}
          name="settlementType"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value={1}>{i18n.t(LOCALS.cash)}</Select.Option>
            <Select.Option value={2}>{i18n.t(LOCALS.accounting_settlement)}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={i18n.t(LOCALS.sales_order_number)}
          name="orderSn"
          rules={[{ required: true }]}
        >
          <Input maxLength={100} />
        </Form.Item>
      </Form>
      <div className={styles.tips}>
        {i18n.t(LOCALS.please_confirm)}
      </div>
    </Modal>
  );
};

export default ConfirmSettlementModal;
