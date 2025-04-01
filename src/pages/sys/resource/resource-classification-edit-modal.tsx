import { Form, Input, InputNumber, Modal, message } from 'antd';
import i18n from 'i18n';
import { SysRoleResourcesCategory } from 'types/sys';
import { resourceCategoryEdit } from 'apis/sys';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  data?: SysRoleResourcesCategory;
  onCancel: () => void;
};

const ResourceClassificationEditModal = ({ open, data, onCancel }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !data) {
      form.resetFields();
    }
    form.setFieldsValue({ ...data });
  }, [data, form, open]);

  const onFinish = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        await resourceCategoryEdit({ ...values });
        message.success(i18n.t('successful_operation'));
        onCancel();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      open={Boolean(open)}
      title={i18n.t('edit')}
      onCancel={onCancel}
      onOk={onFinish}
      confirmLoading={loading}
    >
      <Form form={form} labelCol={{ span: 6 }} labelWrap>
        <Form.Item name={'id'} hidden>
          <Input />
        </Form.Item>
        <Form.Item label={i18n.t('resource_name')} name={'name'}>
          <Input />
        </Form.Item>
        <Form.Item label={i18n.t('sort')} name={'sort'}>
          <InputNumber className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResourceClassificationEditModal;
