import { Form, Input, InputNumber, Modal, Select, Switch, message } from 'antd';
import i18n from 'i18n';
import { SysMenu } from 'types/sys';
import { menuEdit } from 'apis/sys';
import LOCALS from 'commons/locals';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

type Props = {
  open: number;
  data?: SysMenu;
  onCancel: () => void;
  onLoad: () => void;
  dataSource: SysMenu[];
};

const MenuEdit = ({ open, data, onCancel, onLoad, dataSource }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open === 0) {
      form.resetFields();
    }
    if (data && open === 1) {
      form.setFieldsValue({
        ...data,
        parentId: Number(data.parentId),
        hidden: Boolean(!data.hidden),
      });
    }
    if (data && open === 2) {
      form.setFieldsValue({ parentId: data.id, level: 1 });
    }
  }, [data, form, open]);

  const onFinish = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        await menuEdit({ ...values, hidden: values.hidden ? 0 : 1 });
        message.success(i18n.t('successful_operation'));
        onLoad();
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
        <Form.Item name={'level'} hidden>
          <Input></Input>
        </Form.Item>
        <Form.Item
          label={i18n.t('menu_name')}
          name={'title'}
          rules={[
            { required: true, message: i18n.t('please_enter') as string },
          ]}
          required
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label={i18n.t('parent_menu')}
          name={'parentId'}
          rules={[
            { required: true, message: i18n.t('please_enter') as string },
          ]}
          required
        >
          <Select
            onChange={(e) => {
              if (e) {
                form.setFieldValue('level', 1);
              } else {
                form.setFieldValue('level', 0);
              }
            }}
          >
            <Select.Option value={0}>
              {i18n.t('no_superior_menu')}
            </Select.Option>
            {dataSource.map((d) => (
              <Select.Option key={d.id} value={d.id}>
                {d.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={i18n.t('front_end_name')}
          name={'name'}
          rules={[
            { required: true, message: i18n.t('please_enter') as string },
          ]}
          required
        >
          <Input></Input>
        </Form.Item>
        <Form.Item label={i18n.t('status')} name={'hidden'}>
          <Switch
            checkedChildren={<Trans i18nKey={LOCALS.enable} />}
            unCheckedChildren={<Trans i18nKey={LOCALS.disable} />}
          />
        </Form.Item>
        <Form.Item label={i18n.t('sort')} name={'sort'}>
          <InputNumber className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuEdit;
