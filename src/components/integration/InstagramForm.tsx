import React from 'react';
import { Button, Form, Input, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { useUpdateIntegrationSettingsMutation } from 'store/im-chat-stores/integrationSettingsApi';

interface InstagramFormProps {
  integrationSettings: {
    id: number;
    adminId: string;
    token: string;
    verificationToken: string;
    name: string;
  };
  onClose: () => void;
}

const InstagramForm: React.FC<InstagramFormProps> = ({
  integrationSettings,
  onClose,
}) => {
  const [updateIntegrationSettings, { isLoading }] =
    useUpdateIntegrationSettingsMutation();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = async ({
    adminId,
    token,
    verificationToken,
  }: {
    adminId: string;
    token: string;
    verificationToken: string;
  }) => {
    try {
      const response: any = await updateIntegrationSettings({
        adminId,
        token,
        verificationToken,
        name: 'INSTAGRAM_INTRIGATION',
      });

      if (response?.data) {
        notification.success({
          message: '',
          description: t('integration_update_success'),
          duration: 2,
          placement: 'bottomRight',
        });
        onClose();
      } else {
        throw new Error(t('integration_update_failed')!);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : t('unknown_error');

      notification.error({
        message: '',
        description: errorMessage,
        duration: 2,
        placement: 'bottomRight',
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Form
      form={form}
      initialValues={integrationSettings}
      layout="vertical"
      onFinish={handleSubmit}
      onFinishFailed={() => {}}
    >
      <Form.Item
        label={t('token')}
        name="token"
        className="mb-4 font-medium"
        rules={[{ required: true, message: `${t('token_req_msg')}` }]}
      >
        <Input
          className="rounded-[10px] p-3"
          placeholder={`${t('token_placeholder')}`}
        />
      </Form.Item>

      <Form.Item
        label={t('admin_id')}
        name="adminId"
        className="mb-4 font-medium"
        rules={[
          {
            required: true,
            message: `${t('admin_id_req_msg')}`,
          },
        ]}
      >
        <Input
          className="rounded-[10px] p-3"
          placeholder={`${t('admin_id_placeholder')}`}
        />
      </Form.Item>

      <Form.Item
        label={t('verify_token')}
        name="verificationToken"
        className="mb-4 font-medium"
      >
        <Input
          className="rounded-[10px] p-3"
          placeholder={`${t('verify_token_placeholder')}`}
        />
      </Form.Item>

      <Form.Item className="mb-0">
        <div className="flex items-center justify-start gap-4">
          <Button
            type="primary"
            htmlType="submit"
            className="rounded-[10px] py-3 px-6 h-[42px] leading-[0px]"
            disabled={isLoading}
          >
            {t('save')}
          </Button>
          <Button
            className="rounded-[10px] py-3 px-6 h-[42px] leading-[0px]"
            onClick={handleCancel}
          >
            {t('integration_modal_cancel_btn')}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default InstagramForm;
