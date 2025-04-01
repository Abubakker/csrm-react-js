import CreatedNewNotification from 'components/push-notification/CreatedNewNotification';
import SelectNotification from 'components/push-notification/select-notification/SelectNotification';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import pushNotification from '../../assets/icons/notification.svg';

import { Spin } from 'antd';
import { useDispatch } from 'react-redux';
import {
  resetAuthToken,
  resetBaseUrl,
  resetPluginKey,
  storeAuthToken,
  storeBaseUrl,
  storePluginKey,
} from 'store/im-chat-stores/imManagerSettingsSlice';
import { useGetpushNotificationQuery } from 'store/push-notification-stores/pushNotificationApi';
import ManageNotification from 'components/push-notification/manage-notification/ManageNotification';

interface PushNotificationProps {
  authToken: string;
  pluginKey: string;
  baseUrl: string;
}

const PushNotification = ({
  authToken,
  pluginKey,
  baseUrl,
}: PushNotificationProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetAuthToken());
    dispatch(resetBaseUrl());
    dispatch(resetPluginKey());

    if (authToken) {
      dispatch(storeBaseUrl(baseUrl));
      dispatch(storeAuthToken(authToken));
      dispatch(storePluginKey(pluginKey));
    }
  }, [baseUrl, pluginKey, authToken]);

  const { t } = useTranslation();
  const [isSelectType, setIsSelectedType] = useState<string | null>(null);

  // fetch data
  const { data: pushnotificationData, isLoading } = useGetpushNotificationQuery(
    {}
  );

  // handle loading state
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="-mx-8 -my-10 overflow-x-auto">
      <div className="max-w-[1920px] bg-white min-h-[calc(100vh-64px)] min-w-[1100px] p-6">
        {pushnotificationData ? (
          <ManageNotification
            isSelectType={isSelectType}
            setIsSelectedType={setIsSelectedType}
          />
        ) : isSelectType === null ? (
          <div className="min-h-[75vh] flex items-center justify-center">
            <div className="flex flex-col justify-center items-center">
              <img src={pushNotification} alt="" className="size-[120px]" />

              <p className="text-[16px] font-normal mt-2 leading-5 font-sans">
                {t('push_noNoti')}
              </p>
              <div className="-mt-1">
                <SelectNotification setIsSelectedType={setIsSelectedType} />
              </div>
            </div>
          </div>
        ) : (
          <CreatedNewNotification
            selectedType={isSelectType}
            setIsSelectedType={setIsSelectedType}
          />
        )}
      </div>
    </div>
  );
};

export default PushNotification;
