import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { audiencefiltersItem } from 'constants/general-constants';
const useNotificationState = (response: any) => {
  const { t } = useTranslation();
  const [pushContents, setPushContents] = useState([]);
  const [pushNotification, setPushNotification] = useState<any>({
    contents: [],
    filters: [],
    event: {},
    operations: {},
  });
  const [contentType, setContentType] = useState('');

  useEffect(() => {
    if (!response) return;
    const notifiData = {
      contents: response?.contents?.map((content: any) => ({
        language: content?.language_short,
        title: content?.title,
        description: content?.description,
        image: content?.imageUrl,
        pushAlert: content?.pushAlert,
      })),
      filters: response?.query?.map((item: any) => {
        const fieldName = audiencefiltersItem?.find(
          (tr: any) => tr?.original === item?.field
        )?.trname;
        return {
          fieldName: t(`${fieldName}`),
          condition: item?.operator,
          value: item?.value,
        };
      }),
      event: response?.tigger_event,
      operations: {
        end_date: response?.endDate,
        start_date: response?.startDate,
        duration: response?.intervalPeriod,
        is_repetable: response?.isRepeat,
        offline_notification: response?.offlineEmail ? ['email'] : [],
      },
    };
    setPushContents(notifiData?.contents);
    setPushNotification(notifiData);
    setContentType(response?.messageType);
  }, [response]);

  return {
    pushContents,
    pushNotification,
    contentType,
    setPushContents,
    setPushNotification,
  };
};

export default useNotificationState;
