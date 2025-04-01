import { useCallback, useState, useMemo } from 'react';
import styles from './index.module.scss';
import { Form, Modal, message, Radio } from 'antd';
import { OmsRecycleOrderDetail } from 'types/oms';
import { fetchAgreeFinalValuation } from 'apis/oms';
import { thousands } from 'utils/tools';

interface Props {
  open: boolean;
  onClose: () => void;
  data: OmsRecycleOrderDetail;
  reload: () => void;
}

const CustomerAgreeValuationModal = ({
  open,
  onClose,
  data,
  reload,
}: Props) => {
  const [form] = Form.useForm<any>();
  const [loading, setLoading] = useState(false);

  const onFinish = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);
        const id = data.omsRecycleOrder?.id;
        fetchAgreeFinalValuation({ ...values, id })
          .then(() => {
            message.success('成功');
            onClose();
            reload();
          })
          .catch((e) => {
            message.error(e.message);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(() => {});
  }, [data, form, reload, onClose]);

  const PriceObj = useMemo(() => {
    const currency = data?.omsRecycleOrder?.currency;
    const { finalSalePrice, finalRecyclePrice } =
      data.omsRecycleOrderItem || {};
    const temp = { Sale: '', Recycle: '' };
    if (finalSalePrice) {
      temp.Sale = `${currency} ${thousands(finalSalePrice)}`;
    }
    if (finalRecyclePrice) {
      temp.Recycle = `${currency} ${thousands(finalRecyclePrice)}`;
    }
    return temp;
  }, [data]);

  return (
    <>
      <Modal
        open={open}
        title={'同意最终报价'}
        onCancel={() => onClose()}
        onOk={onFinish}
        className={styles.CustomerAgreeValuationModal}
        destroyOnClose
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          initialValues={{}}
        >
          <Form.Item label={<div></div>} colon={false}>
            <div>寄卖确认报价：{PriceObj.Sale}</div>
            <div>回收确认报价：{PriceObj.Recycle}</div>
          </Form.Item>
          <Form.Item
            label={'类型选择'}
            name="type"
            rules={[{ required: true }]}
          >
            <Radio.Group optionType="button" buttonStyle="solid">
              {PriceObj.Sale && <Radio value={1}>同意寄卖</Radio>}
              {PriceObj.Recycle && <Radio value={2}>同意回收</Radio>}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CustomerAgreeValuationModal;
