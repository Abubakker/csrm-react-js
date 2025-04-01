import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCreatepushNotificationMutation } from 'store/push-notification-stores/pushNotificationApi';
import { audiencefiltersItem, languages } from 'constants/general-constants';

import LanguageSection from './LanguageSection';
import ContentSection from './ContentSection';
import ActionButtons from './ActionButtons';
import DiscardModal from './DiscardModal';
import ContentType from '../ContentTypeNotification';
import '../style.css';

type ContentItem = {
  title: string;
  description: string;
  image: File | null;
  preImg: string | null;
  pushAlert: boolean;
  lang?: string;
};

// content Item
let contentItem: ContentItem = {
  title: '',
  description: '',
  image: null,
  preImg: null,
  pushAlert: true,
};

const NotificationContent = ({
  notificationType,
  setIsSelectedType,
}: {
  notificationType: string | null;
  setIsSelectedType: (value: string | null) => void;
}) => {
  const { t } = useTranslation();
  const [discard, setDiscard] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState<any>(t('en'));
  const [openContentTab, setOpenContentTab] = useState<number | null>(1);
  const [loadingButton, setLoadingButton] = useState<string | null>(null);
  const [pushNotification, setPushNotification] = useState<any>({
    contents: [],
    filters: [],
    events: {},
    operations: {},
  });

  const [contents, setContents] = useState([
    {
      lang: t('en'),
      ...contentItem,
    },
  ]);

  // create notification mutation
  const [createNotification, { isLoading }] =
    useCreatepushNotificationMutation();

  useEffect(() => {
    setPushNotification((prev: any) => ({ ...prev, contents }));
  }, [contents]);

  // modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // create new response
  const pushSubmit = async (status: string) => {
    setLoadingButton(status);
    const startDate = pushNotification?.operations?.start_date;
    const endDate = pushNotification?.operations?.end_date;

    if (!startDate) {
      notification.error({
        message: '',
        description: t('start_date_req_msg'),
        duration: 2,
        placement: 'bottomRight',
      });
      setLoadingButton(null);
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      notification.error({
        message: '',
        description: t('start_date_must_be_before_end_date'),
        duration: 2,
        placement: 'bottomRight',
      });
      setLoadingButton(null);
      return;
    }

    // notification language content
    const languageContent = pushNotification?.contents?.map((content: any) => {
      return {
        title: content?.title,
        description: content?.description,
        imageUrl: content?.preImg,
        pushAlert: content?.pushAlert,
        language: languages?.find((lang) => t(lang?.value) === content?.lang)
          ?.shortform,
        language_short: languages?.find(
          (lang) => t(lang?.value) === content?.lang
        )?.value,
      };
    });

    // Check if any required field is empty
    const isInvalidContent = languageContent?.some(
      (content: any) =>
        !content.title ||
        !content.description ||
        !content.language ||
        !content.language_short
    );

    if (isInvalidContent) {
      notification.error({
        message: 'Validation Error',
        description:
          'Title, description, language fields are required in all language content.',
        placement: 'bottomRight',
      });
      setLoadingButton(null);
      return;
    }

    // query filter
    const queryFilter = pushNotification?.filters?.map((item: any) => {
      const matchedFilter = audiencefiltersItem?.find(
        (audifil: any) => t(`${audifil.trname}`) === item.fieldName
      );

      return {
        field: matchedFilter?.original,
        operator: item?.condition,
        value: item?.value,
      };
    });

    const notificationData = {
      notificationType: notificationType,
      // tags: ['new_users', 'premium_users'],
      languageContent: languageContent,
      isRepeat: pushNotification?.operations?.is_repetable || false,
      intervalPeriod: Number(pushNotification?.operations?.duration) || 0,
      startDate: pushNotification?.operations?.start_date,
      endDate: pushNotification?.operations?.end_date,
      query: {
        filters: queryFilter,
      },
      tigger_event: pushNotification?.events,
      status: status,
      offlineEmail:
        pushNotification?.operations?.offline_notification?.includes('email')
          ? true
          : false,
    };

    const response: any = await createNotification({ data: notificationData });

    const placement = 'bottomRight';
    if (response?.data) {
      notification.info({
        message: '',
        description: 'new notification created',
        placement,
      });
      setIsSelectedType(null);
    } else {
      notification.info({
        message: '',
        description: response?.error?.data?.message,
        placement,
      });
    }
    setLoadingButton(null);
  };

  // handle discard
  const handleDiscard = () => {
    setContents([
      {
        lang: t('en'),
        ...contentItem,
      },
    ]);

    setPushNotification({
      contents: [
        {
          lang: t('en'),
          ...contentItem,
        },
      ],
      filters: [],
      events: {},
      operations: {},
    });

    setDiscard(true);
    setSelectedButton(t('en'));
    handleCancel();
    // window.location.reload();
    setIsSelectedType(null);
  };

  return (
    <div className="min-h-screen p-8">
      <section className="max-w-[1020px] mx-auto">
        {/* Extracted LanguageSection*/}
        <LanguageSection
          setContents={setContents}
          contents={contents}
          setSelectedButton={setSelectedButton}
          selectedButton={selectedButton}
          contentsItem={contentItem}
        />

        <div className="h-[1px] bg-slate-200 my-8"></div>

        {/* Extracted ContentSection*/}
        <ContentSection
          openContentTab={openContentTab}
          setOpenContentTab={setOpenContentTab}
          contents={contents}
          setContents={setContents}
          selectedButton={selectedButton}
          discard={discard}
          setDiscard={setDiscard}
        />

        {/* Others content type section */}
        <ContentType
          openContentTab={openContentTab}
          setOpenContentTab={setOpenContentTab}
          setPushNotification={setPushNotification}
          discard={discard}
          setDiscard={setDiscard}
        />

        {/* Extracted ActionButtons */}
        <ActionButtons
          showModal={showModal}
          pushSubmit={pushSubmit}
          loadingButton={loadingButton}
          isLoading={isLoading}
        />

        {/* Extracted DiscardModal*/}
        <DiscardModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          handleDiscard={handleDiscard}
        />
      </section>
    </div>
  );
};

export default NotificationContent;
