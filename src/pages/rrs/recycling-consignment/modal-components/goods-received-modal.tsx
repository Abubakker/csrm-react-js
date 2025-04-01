import { useCallback, useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Form, Modal, message, Input, Popconfirm, Button } from 'antd';
import { OmsRecycleOrderDetail } from 'types/oms';
import { fetchGoodsReceived } from 'apis/oms';
import UploadImageTips from '../input-components/upload-image-tips';
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

interface formData {
  content: string;
  receiptPics: string;
}

const GoodsReceived = ({ open, onClose, data, reload }: Props) => {
  const [form] = Form.useForm<formData>();
  const [loading, setLoading] = useState(false);
  const { setProductInfo, showData } = useProductFormData();

  useEffect(() => {
    setProductInfo(data.omsRecycleOrderProduct || {});
  }, [data]);

  const onFinish = useCallback(() => {
    form.validateFields().then((values: formData) => {
      setLoading(true);
      const payload = {
        ...values,
        id: data.omsRecycleOrder?.id,
      };
      fetchGoodsReceived(payload)
        .then(() => {
          message.success('上传成功！');
          onClose();
          reload();
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [data]);

  return (
    <>
      <Modal
        open={open}
        title={i18n.t(LOCALS.confirm_receipt)}
        onCancel={() => onClose()}
        onOk={onFinish}
        className={styles.GoodsReceived}
        destroyOnClose
        confirmLoading={loading}
        footer={[
          <Button onClick={() => onClose()} key={'cancel'}>
            {i18n.t(LOCALS.cancel)}
          </Button>,
          <Popconfirm
            title={i18n.t(LOCALS.caution)}
            description={<div className={styles.Popconfirm}>{i18n.t(LOCALS.confirm_submission)}</div>}
            onConfirm={() => onFinish()}
            okText={i18n.t(LOCALS.confirm)}
            cancelText={i18n.t(LOCALS.cancel)}
            key={'confirm-pop'}
          >
            <Button
              type="primary"
              loading={loading}
              onClick={() => form.validateFields()}
              key={'confirm'}
            >
              {i18n.t(LOCALS.confirm)}
            </Button>
          </Popconfirm>,
        ]}
      >
        <div className={styles.form}>
          {/* showData={showData} */}
          <BriefProductInfo data={data} />
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            initialValues={{ isPirce: 1 }}
          >
            <Form.Item
              label= {i18n.t(LOCALS.received_items)}
              name="receiptPics"
              rules={[{ required: true }]}
            >
              <UploadImageTips />
            </Form.Item>
            <Form.Item label={i18n.t(LOCALS.id_passport_number)} name="memberCredentialNo">
              <Input maxLength={100} />
            </Form.Item>
            <Form.Item label={i18n.t(LOCALS.remark)} name="content">
              <Input.TextArea maxLength={100} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default GoodsReceived;
