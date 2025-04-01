import { Form, Input, Modal, Select } from 'antd';
import { WantBookRecord, wantBookStatusList } from './common';
import { useEffect } from 'react';
import { wantBookUpdate } from 'apis/oms';

const WantBookEditDialog = ({
  open,
  data,
  onClose,
}: {
  open: boolean;
  data?: WantBookRecord;
  onClose: () => void;
}) => {
  const [form] = Form.useForm<WantBookRecord>();

  useEffect(() => {
    if (!data) return;
    form.setFieldsValue(data);
  }, [data, form]);

  return (
    <Modal
      title="编辑"
      open={open}
      onCancel={onClose}
      onOk={async () => {
        const data = form.getFieldsValue();
        await wantBookUpdate(data);

        setTimeout(() => {
          window.location.reload();
        }, 300);
      }}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="productName" label="商品名称">
          <Input />
        </Form.Item>
        <Form.Item name="productDesc" label="商品描述">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="socialName" label="社交媒体">
          <Input />
        </Form.Item>
        <Form.Item name="socialAccount" label="社交账号">
          <Input />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            options={wantBookStatusList.map((label, value) => ({
              value,
              label,
            }))}
          ></Select>
        </Form.Item>
        <Form.Item name="remarks" label="备注">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WantBookEditDialog;
