import { useState, useCallback } from 'react';
import styles from './index.module.scss';
import { Button, Upload, Form, Modal, message, Row, Col } from 'antd';
import { OmsRecycleOrderDetail } from 'types/oms';
import { fetchUploadShiplable } from 'apis/oms';
import { s3UploadUrl } from 'apis/cms';
import { getLocalStorageToken } from 'commons';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import LOCALS from '../../../../commons/locals';
import i18n from 'i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  data: OmsRecycleOrderDetail;
  reload: () => void;
}

const ShiplableModal = ({ open, onClose, data, reload }: Props) => {
  const [form] = Form.useForm<any>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const onFinish = useCallback(() => {
    form.validateFields().then((value) => {
      const { file } = value;
      console.log('🚀  form.validateFields  value:', value);
      setLoading(true);
      if (file.file.status !== 'done') {
        setLoading(false);
        message.warning('请选择一个PDF');
        return;
      }
      const fileUrl = file.file.response.data.url;
      const payload = {
        shippingLabel: fileUrl,
        id: data.omsRecycleOrder?.id,
      };
      console.log('🚀  form.validateFields  payload:', payload);
      fetchUploadShiplable(payload)
        .then(() => {
          message.success(i18n.t(LOCALS.successful_operation));
          onClose();
          reload();
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [data, form, onClose, reload]);

  const shippingLabel = data?.omsRecycleOrderLogistics?.shippingLabel;

  return (
    <Modal
      open={open}
      title={i18n.t(LOCALS.confirm_receipt)}
      onCancel={() => onClose()}
      onOk={onFinish}
      className={styles.ShiplableModal}
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
          {shippingLabel ? (
            <Form.Item label={i18n.t(LOCALS.historical_documents)}>
              <a href={shippingLabel || '#'}>{i18n.t(LOCALS.view)}</a>
            </Form.Item>
          ) : null}

          <Form.Item
            label={'上传文件'}
            name="file"
            rules={[{ required: true }]}
          >
            <Upload
              data={{
                loginToken: getLocalStorageToken(),
              }}
              accept=".pdf"
              className={styles.uploader}
              action={s3UploadUrl}
              onChange={(e) => {
                setFileList(e.fileList);
              }}
              fileList={fileList}
            >
              <Button className={styles.btn} icon={<UploadOutlined />}>
                上传shiplable
              </Button>
            </Upload>
          </Form.Item>
          <Row>
            <Col offset={8} span={14}>
              <div className={styles.tips}>*上传文件的大小请不要超过10MB</div>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default ShiplableModal;
