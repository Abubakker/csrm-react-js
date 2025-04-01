import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import { FacebookHelp } from 'assets/images';
import IntegrationBtn from 'components/integration/IntegrationBtn';
import NoteCard from 'components/integration/NoteCard';
import UserGuideBtn from 'components/integration/UserGuideBtn';
import { useGetIntegrationSettingsQuery } from 'store/im-chat-stores/integrationSettingsApi';
import FacebookForm from 'components/integration/FacebookForm';

// Functional component for Instagram Messenger
const FacebookIntegration = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const { data: integrationSettings } = useGetIntegrationSettingsQuery({
    name: 'MESSENGER_INTRIGATION',
  });

  // Close modal handler
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Integration button click handler
  const handleBtnClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="-mx-8 -my-10 overflow-hidden min-h-[calc(100vh-64px)] font-NotoSans bg-white p-6">
      <header className="mb-12">
        <h2 className="font-bold text-2xl">{t('facebook_title')}</h2>
      </header>

      <section className="max-w-[493px] space-y-6">
        {/* Integration Features */}
        <div>
          <h3 className="font-bold text-[16px] text-[#1A1A1A]">
            {t('integration_features')}
          </h3>
          <p className="leading-[20px]">{t('facebook_desc')}</p>
        </div>

        <img src={FacebookHelp} alt="Instagram Help" className="max-w-full" />
        <UserGuideBtn />

        {/* Important Notes Section */}
        <div className="space-y-3">
          <h3 className="font-bold text-[16px] text-[#1A1A1A]">
            {t('integration_please_note')}
          </h3>
          <NoteCard isImportant={true} note={t('facebook_note1')} />
          <NoteCard isImportant={false} note={t('facebook_note2')} />
        </div>

        {/* Integration Button */}
        <IntegrationBtn handleBtnClick={handleBtnClick} />
      </section>

      {/* Modal for Instagram Integration Information */}
      <Modal
        title={
          <h3 className="font-bold font-NotoSans">
            {t('integrations_facebook_modal_title')}
          </h3>
        }
        centered
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        className="integration-modal"
      >
        <p className="font-NotoSans">{t('integrations_line_modal_desc')}</p>

        <FacebookForm
          integrationSettings={integrationSettings}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default FacebookIntegration;
