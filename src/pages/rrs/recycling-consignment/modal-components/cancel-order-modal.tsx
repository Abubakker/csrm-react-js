import { useCallback, useState } from 'react';
import styles from './index.module.scss';
import { Form, Modal, message, Input } from 'antd';
import { OmsRecycleOrderDetail } from 'types/oms';
import { fetchCancelRecycleOrder } from 'apis/oms';
import i18n from '../../../../i18n';
import LOCALS from '../../../../commons/locals';

interface Props {
  open: boolean;
  onClose: () => void;
  data: OmsRecycleOrderDetail;
  reload: () => void;
}

interface formData {
  remark: string;
}

const CancelOrderModal = ({ open, onClose, data, reload }: Props) => {
  const [form] = Form.useForm<formData>();
  const [loading, setLoading] = useState(false);

  const onFinish = useCallback(() => {
    form.validateFields().then((values: formData) => {
      setLoading(true);
      const payload = {
        ...values,
        id: data.omsRecycleOrder?.id,
      };
      fetchCancelRecycleOrder(payload)
        .then(() => {
          message.success(i18n.t(LOCALS.successful_operation));
          onClose();
          reload();
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [data.omsRecycleOrder?.id, form, onClose, reload]);

  return (
    <>
      <Modal
        open={open}
        title={i18n.t(LOCALS.cancel_order)}
        onCancel={() => onClose()}
        onOk={onFinish}
        className={styles.CancelOrderModal}
        destroyOnClose
        confirmLoading={loading}
      >
        <div className={styles.form}>
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
          >
            <Form.Item label={i18n.t(LOCALS.cancellation_reason)} name="remark">
              <Input.TextArea maxLength={100} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default CancelOrderModal;
