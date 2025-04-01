import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Form, Input } from 'antd';
import NoteCard from 'components/integration/NoteCard';
import UserGuideBtn from 'components/integration/UserGuideBtn';
import { CopyOutlined } from '@ant-design/icons';
import { EmailSenderHelp, InboxIntegrationHelp } from 'assets/images';

// Functional component for Email
const EmailIntegration = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSenderSettings, setIsSenderSettings] = useState<boolean>(true);
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Form Values:', values);
  };

  // Close modal handler
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Integration button click handler
  const handleBtnClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <header className="flex items-center justify-between gap-5 shadow mx-[-16px] p-6 mt-[-16px]">
        <div>
          <h2 className="font-bold text-2xl">{t('integration_email')}</h2>
          <p className="mb-0">{t('integration_email_desc')}</p>
        </div>
        <UserGuideBtn />
      </header>

      <section className="mx-[-16px] p-6 shadow mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => setIsSenderSettings(true)}
            type={isSenderSettings ? 'primary' : 'default'}
            className="rounded-[10px] px-6 py-3 h-[42px] flex items-center justify-center"
          >
            {t('sender_settings')}
          </Button>
          <Button
            onClick={() => setIsSenderSettings(false)}
            type={isSenderSettings ? 'default' : 'primary'}
            className="rounded-[10px] px-6 py-3 h-[42px] flex items-center justify-center"
          >
            {t('inbox_integration_settings')}
          </Button>
        </div>
        <h3 className="font-bold text-[#1A1A1A] text-[16px]">
          {t('default_email_address')}
        </h3>
        <p className="mb-0">tested@56854.mail.ginzaxiaoma</p>
      </section>

      {isSenderSettings ? (
        <section className="max-w-[493px] space-y-6">
          <div>
            <h3 className="font-bold text-[16px] text-[#1A1A1A]">
              {t('custom_domain_settings')}
            </h3>
            <p className="leading-[20px]">{t('custom_domain_desc')}</p>
          </div>

          <Button
            type="primary"
            className="rounded-[10px] px-6 py-3 h-[42px] flex items-center justify-center w-[231px]"
            onClick={handleBtnClick}
          >
            {t('domain_settings')}
          </Button>

          <img src={EmailSenderHelp} alt="Email Help" />

          {/* Important Notes Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-[16px] text-[#1A1A1A]">
              {t('integration_please_note')}
            </h3>
            <NoteCard isImportant={true} note={t('email_sender_note1')} />
            <NoteCard isImportant={false} note={t('email_sender_note2')} />
          </div>
        </section>
      ) : (
        <section className="max-w-[493px] space-y-6">
          <div>
            <h3 className="font-bold text-[16px] text-[#1A1A1A]">
              {t('inbox_integration_settings')}
            </h3>
            <p className="leading-[20px]">{t('integration_settings_desc')}</p>
          </div>

          <div className="flex justify-between items-center gap-3">
            <Input
              readOnly
              value={'35345sd3459i8904sd@forward-to.mail.Ginza xiaoma.'}
              className="rounded-[10px] p-3 bg-[#F2F4FB] text-[#6A7089]"
            />
            <Button
              shape="circle"
              className="w-[42px] h-[42px] bg-[#F2F4FB]"
              icon={<CopyOutlined />}
            />
          </div>

          <img src={InboxIntegrationHelp} alt="Inbox Help" />

          <UserGuideBtn />

          {/* Important Notes Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-[16px] text-[#1A1A1A]">
              {t('integration_please_note')}
            </h3>
            <NoteCard isImportant={false} note={t('inbox_integration_note1')} />
          </div>
        </section>
      )}

      {/* Modal for Line Integration Information */}
      <Modal
        title={
          <h3 className="font-bold">{t('integrations_email_modal_title')}</h3>
        }
        centered
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-8"
          onFinish={handleSubmit}
        >
          <Form.Item
            label={t('email_domain_name_label')}
            name="emailDomainName"
            className="mb-4 font-medium"
            rules={[
              {
                required: true,
                message: `${t('email_domain_name_req_msg')}`,
              },
            ]}
          >
            <Input
              className="rounded-[10px] p-3"
              placeholder={`e.g. example.com`}
            />
          </Form.Item>

          <Form.Item
            label={t('email_default_email_label')}
            name="emailDefaultEmail"
            className="mb-4 font-medium"
            rules={[
              {
                required: true,
                message: `${t('email_default_email_req_msg')}`,
              },
            ]}
          >
            <Input
              className="rounded-[10px] p-3"
              placeholder={`e.g. name@example.com`}
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex items-center justify-start gap-4">
              <Button
                type="primary"
                htmlType="submit"
                className="rounded-[10px] py-3 px-6 h-[42px] leading-[0px]"
                onClick={closeModal}
              >
                {t('integration_modal_next_btn')}
              </Button>
              <Button
                className="rounded-[10px] py-3 px-6 h-[42px] leading-[0px]"
                onClick={closeModal}
              >
                {t('integration_modal_cancel_btn')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmailIntegration;
