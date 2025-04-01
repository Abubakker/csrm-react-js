import { useTranslation } from 'react-i18next';
import {
  InstagramIcon,
  LineIcon,
  MessengerIcon,
  WeChatIcon,
  WhatsAppIcon,
} from 'assets/images';
import ChannelCard from 'components/integration/ChannelCard';
import UserGuideBtn from 'components/integration/UserGuideBtn';

const Messenger = () => {
  const { t } = useTranslation();

  return (
    <div className="-mx-8 -my-10 overflow-hidden min-h-[calc(100vh-64px)] font-NotoSans bg-white p-6">
      {/* Header Section */}
      <header className="flex items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="font-bold text-2xl">{t('channel_list')}</h2>
          <p className="text-[#676B80]">{t('channel_list_desc')}</p>
        </div>
        <UserGuideBtn />
      </header>

      {/* Channel Cards Section */}
      <section className="space-y-6">
        <ChannelCard
          url="/im-chat/integration-instagram"
          icon={InstagramIcon}
          name={t('instagram')}
          description={t('instagram_desc')}
        />
        <ChannelCard
          url="/im-chat/integration-line"
          icon={LineIcon}
          name={t('line')}
          description={t('line_desc')}
        />
        <ChannelCard
          url="/im-chat/integration-whatsapp"
          icon={WhatsAppIcon}
          name={t('whatsapp')}
          description={t('whatsapp_desc')}
        />
        <ChannelCard
          url="/im-chat/integration-we-chat"
          icon={WeChatIcon}
          name={t('we_chat')}
          description={t('we_chat_desc')}
        />
        <ChannelCard
          url="/im-chat/integration-facebook"
          icon={MessengerIcon}
          name={t('facebook')}
          description={t('facebook_desc')}
        />
      </section>
    </div>
  );
};

export default Messenger;
