import { Form, Input, Switch, message, Modal } from 'antd';
import LOCALS from 'commons/locals';
import { useEffect, useState } from 'react';
import i18n from 'i18n';
import FormImageUpload from 'components/form-image-upload';
import { CmsApi, CmsHelpCategory } from 'apis/cms';

interface Props {
  open: boolean;
  onClose: () => void;
  data?: CmsHelpCategory;
  onLoad?: () => void;
}

const CmsArticleCategoryEditModal = ({
  open,
  onClose,
  data,
  onLoad,
}: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    setLoading(true);
    form.validateFields().then(async (values) => {
      CmsApi.getHelpCategoryEdit({
        ...values,
        showStatus: values.showStatus ? 1 : 0,
      })
        .then(() => {
          message.success(i18n.t(LOCALS.successful_operation));
          onLoad?.();
          onClose();
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ ...data, showStatus: Boolean(data.showStatus) });
    }
  }, [data, form]);

  return (
    <Modal
      open={open}
      title={i18n.t('article_category')}
      onCancel={() => onClose()}
      onOk={onFinish}
      destroyOnClose
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          showStatus: true,
        }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label={i18n.t('title')}
          name="name"
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input maxLength={50} />
        </Form.Item>
        <Form.Item
          label={i18n.t('category_icon')}
          name="icon"
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <FormImageUpload />
        </Form.Item>
        <Form.Item
          label={i18n.t('article_publish_status')}
          name="showStatus"
          required
        >
          <Switch
            checkedChildren={i18n.t('enable')}
            unCheckedChildren={i18n.t('disable')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CmsArticleCategoryEditModal;
