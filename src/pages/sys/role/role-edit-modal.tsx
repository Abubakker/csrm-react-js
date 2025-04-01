import { Form, Input, Modal, Switch, message } from 'antd';
import i18n from 'i18n';
import { useEffect } from 'react';
import { SysRole } from 'types/sys';
import { roleEdit } from 'apis/sys';

type Props = {
  open: boolean;
  data?: SysRole;
  onCancel: () => void;
  onLoad: () => void;
};

const RoleEdit = ({ open, data, onCancel, onLoad }: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form, open]);

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      await roleEdit(values);
      message.success(i18n.t('successful_operation'));
      onLoad();
      onCancel();
    });
  };

  return (
    <Modal
      open={open}
      title={i18n.t('edit')}
      onCancel={onCancel}
      onOk={onFinish}
    >
      <Form form={form} labelCol={{ span: 6 }} labelWrap>
        <Form.Item name={'id'} hidden>
          <Input></Input>
        </Form.Item>
        <Form.Item
          label={i18n.t('role_name')}
          name={'name'}
          rules={[
            { required: true, message: i18n.t('please_enter') as string },
          ]}
          required
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label={i18n.t('description')}
          name={'description'}
          rules={[
            { required: true, message: i18n.t('please_enter') as string },
          ]}
          required
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label={`${i18n.t('enable')}/${i18n.t('disable')}`}
          name={'status'}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleEdit;
