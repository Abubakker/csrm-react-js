import { useCallback, useMemo, useState } from 'react';
import styles from './index.module.scss';
import { Form, Modal, message } from 'antd';
import { OmsRecycleOrderDetail } from 'types/oms';
import { fetchUploadShippingDocument } from 'apis/oms';
import UploadImageTips from '../input-components/upload-image-tips';
import i18n from '../../../../i18n';
import LOCALS from '../../../../commons/locals';

interface Props {
  open: boolean;
  onClose: () => void;
  data: OmsRecycleOrderDetail;
  reload: () => void;
}

const LogisticsDocumentModal = ({ open, onClose, data, reload }: Props) => {
  const [form] = Form.useForm<any>();
  const [loading, setLoading] = useState(false);

  const onFinish = useCallback(() => {
    form
      .validateFields()
      .then((values: { stateWrapperShippingDocument: string }) => {
        setLoading(true);
        const { stateWrapperShippingDocument } = values;
        const payload = {
          stateWrapperShippingDocument,
          id: `${data.omsRecycleOrder?.id}`,
        };
        fetchUploadShippingDocument(payload)
          .then(() => {
            message.success('上传成功！');
            onClose();
            reload();
          })
          .finally(() => {
            setLoading(false);
          });
      });
  }, [data, form, onClose, reload]);

  const stateWrapperShippingDocument = useMemo(() => {
    if (data?.omsRecycleOrderLogistics?.stateWrapperShippingDocument) {
      const t: string[] =
        JSON.parse(
          data?.omsRecycleOrderLogistics?.stateWrapperShippingDocument
        ) || [];
      if (t.length) return t[0];
    }
  }, [data?.omsRecycleOrderLogistics?.stateWrapperShippingDocument]);

  return (
    <>
      <Modal
        open={open}
        title={i18n.t(LOCALS.upload_packing_slip)}
        onCancel={() => onClose()}
        onOk={onFinish}
        className={styles.LogisticsDocumentModal}
        destroyOnClose
        confirmLoading={loading}
      >
        <div className={styles.form}>
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            initialValues={{ isPirce: 1 }}
          >
            {stateWrapperShippingDocument ? (
              <Form.Item label={i18n.t(LOCALS.historical_documents)}>
                <a href={stateWrapperShippingDocument || '#'}>{i18n.t(LOCALS.view)}</a>
              </Form.Item>
            ) : null}
            <Form.Item
              label={i18n.t(LOCALS.logistics_certificate)}
              rules={[{ required: true }]}
              name="stateWrapperShippingDocument"
            >
              <UploadImageTips />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default LogisticsDocumentModal;
