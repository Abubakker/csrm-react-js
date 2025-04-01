import { useEffect, useState } from 'react';
import { Modal, notification } from 'antd';
import { useTranslation } from 'react-i18next';

import {
  useGetPushNotificationDetailsQuery,
  useUpdatePushnotificationMutation,
} from 'store/push-notification-stores/pushNotificationApi';
import { audiencefiltersItem, languages } from 'constants/general-constants';

import NotificationItem from './NotificationItem';
import ModelFooter from './ModalFooter';
import EditContent from './EditContent';
import AudienceComponent from 'components/shared/Audience';
import TriggerEventComponent from 'components/shared/TriggerEvent';
import OperationComponent from 'components/shared/Operation';

import editIcon from '../../../../assets/icons/editIcon.svg';

// Enums
export enum Status {
  Draft = 'Draft',
  Scheduled = 'Scheduled',
}

// EditNotification component
const EditNotification = ({ response }: any) => {
  const { t } = useTranslation();
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openContentTab, setOpenContentTab] = useState<number | null>(1);
  const [audience, setAudience] = useState([]);
  const [event, setEvent] = useState({});
  const [operations, setOperations] = useState<any>({});
  const [loading, setLoading] = useState<null | string>(null);
  const [pushContents, setPushContents] = useState<any>([]);
  const [contentType, setContentType] = useState('');
  const { data: pushNotificationDetails } = useGetPushNotificationDetailsQuery(
    response?.id
  );

  // Modal handlers
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);
  // update push notification mutation
  const [updatePushNotificationData] = useUpdatePushnotificationMutation();

  useEffect(() => {
    const contents = pushNotificationDetails?.contents?.map((content: any) => ({
      language: content?.language_short,
      title: content?.title,
      description: content?.description,
      image: content?.imageUrl,
      pushAlert: content?.pushAlert,
    }));
    setPushContents(contents);

    const query = pushNotificationDetails?.query?.map((item: any) => {
      const fieldName = audiencefiltersItem?.find(
        (tr: any) => tr?.original === item?.field
      )?.trname;
      return {
        fieldName: t(`${fieldName}`),
        condition: item?.operator,
        value: item?.value,
      };
    });

    setAudience(query);

    setEvent(pushNotificationDetails?.tigger_event);

    const operations = {
      end_date: pushNotificationDetails?.endDate,
      start_date: pushNotificationDetails?.startDate,
      duration: pushNotificationDetails?.intervalPeriod,
      is_repetable: pushNotificationDetails?.isRepeat,
      offline_notification: pushNotificationDetails?.offlineEmail
        ? ['email']
        : [],
    };

    setOperations(operations);

    setContentType(pushNotificationDetails?.notificationType);
  }, [pushNotificationDetails]);

  // Notification data structure
  const notificationItems = [
    {
      id: 2,
      name: t('push_Audience'),
      subTitle: t('push_DWP'),
      content: (
        <AudienceComponent
          audience={audience}
          setAudience={setAudience}
          audienceType={t('notification')}
          // currentAudience={pushNotification?.audience}
        />
      ),
    },
    {
      id: 3,
      name: t('push_even'),
      subTitle: t('Push_CNt'),
      content: (
        <TriggerEventComponent
          event={event}
          setEvent={setEvent}
          eventType={t('notification')}
        />
      ),
    },
    {
      id: 4,
      name: t('push_Operation'),
      subTitle: t('Push_WSN'),
      content: (
        <OperationComponent
          setOperations={setOperations}
          operationType={t('notification')}
          operations={operations}
        />
      ),
    },
  ];

  const handleToggleItem = (itemId: number) => {
    // setDropDownToggle(!dropDownToggle);
    setOpenContentTab((prev: number | null) =>
      prev === itemId ? null : itemId
    );
  };

  // update push notifation data
  const handleUpdate = async ({ status }: { status: string }) => {
    setLoading(status);
    const placement = 'bottomRight';
    // notification language content
    const languageContent = pushContents?.map((content: any) => {
      return {
        title: content?.title,
        description: content?.description,
        imageUrl: content?.preImgUrl,
        pushAlert: content?.pushAlert,
        language: languages?.find(
          (lang) => t(lang?.value) === content?.language
        )?.shortform,
        language_short: languages?.find(
          (lang) => t(lang?.value) === content?.language
        )?.value,
      };
    });

    // Check if any required field is empty
    const isInvalidContent = languageContent?.some(
      (content: any) =>
        !content.title || !content.description || !content.language
    );

    if (isInvalidContent) {
      notification.error({
        message: 'Validation Error',
        description:
          'Title, description, language and start Date fields are required in all language content.',
        placement: 'bottomRight',
      });
      setLoading(null);
      return;
    }
    // query filter
    const queryFilter = audience?.map((item: any) => {
      const fieldName = audiencefiltersItem?.find(
        (tr: any) => t(tr?.trname) === item?.fieldName
      )?.original;
      return {
        field: fieldName,
        operator: item?.condition,
        value: item?.value,
      };
    });

    const notificationData = {
      notificationType: response?.messageType,
      languageContent: languageContent,
      isRepeat: operations?.is_repetable,
      intervalPeriod: Number(operations?.duration) || 0,
      startDate: operations?.start_date,
      endDate: operations?.end_date,
      query: {
        filters: queryFilter,
      },
      tigger_event: event,
      status: status,
      offlineEmail: operations?.offline_notification?.includes('email')
        ? true
        : false,
    };

    const res: any = await updatePushNotificationData({
      id: response?.id,
      data: notificationData,
    });

    if (res?.data) {
      notification.info({
        message: '',
        description: 'push notification updated',
        placement,
      });

      handleCancel();
    } else {
      notification.info({
        message: '',
        description: res?.error?.data?.message,
        placement,
      });
    }
    setLoading(null);
  };

  return (
    <div>
      {/* Trigger for modal */}
      <div className="flex items-center gap-[6px]" onClick={showModal}>
        <img src={editIcon} alt="" className="size-4" />
        <span className="text-[12px] font-sans font-medium tracking-[1px] mt-1">
          {t('view&EditEmail')}
        </span>
      </div>

      {/* Modal for editing response */}
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        className="customModal min-w-[1050px]"
      >
        {/* content notification area*/}
        <EditContent
          setPushContents={setPushContents}
          pushContents={pushContents}
          setOpenContentTab={setOpenContentTab}
          openContentTab={openContentTab}
          contentType={contentType}
        />

        {/* other notification contains */}
        {
          <section className="space-y-6 ">
            {notificationItems?.map((item) => (
              <NotificationItem
                key={item.id}
                openContentTab={openContentTab}
                item={item}
                onToggle={handleToggleItem}
              />
            ))}
          </section>
        }

        {/* footer buttons */}
        <ModelFooter
          onCancel={() => setIsModalOpen(false)}
          onSave={handleUpdate}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default EditNotification;
