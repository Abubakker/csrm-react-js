import { Form, Input, Modal, Select, message } from 'antd';
import i18n from 'i18n';
import { SysRoleResources, SysRoleResourcesCategory } from 'types/sys';
import { resourceEdit } from 'apis/sys';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  data?: SysRoleResources;
  onCancel: () => void;
  categoryList: SysRoleResourcesCategory[];
};

const MenuEdit = ({ open, data, onCancel, categoryList }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !data) {
      form.resetFields();
    }
    if (data && open) {
      form.setFieldsValue({ ...data });
    }
  }, [data, form, open]);

  const onFinish = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        await resourceEdit({ ...values });
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
      <Form
        form={form}
        labelCol={{ span: 6 }}
        labelWrap
        initialValues={{ parentId: 0, level: 0 }}
      >
        <Form.Item name={'id'} hidden>
          <Input></Input>
        </Form.Item>
        <Form.Item
          label={i18n.t('resource_name')}
          name={'name'}
          rules={[
            { required: true, message: i18n.t('please_enter') as string },
          ]}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={i18n.t('resource_path')}
          name={'url'}
          rules={[
            { required: true, message: i18n.t('please_enter') as string },
          ]}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={i18n.t('resource_classification')}
          name={'categoryId'}
          rules={[
            { required: true, message: i18n.t('please_enter') as string },
          ]}
          required
        >
          <Select>
            {categoryList.map((d) => (
              <Select.Option key={d.id} value={d.id}>
                {d.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={i18n.t('description')} name={'description'}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuEdit;
