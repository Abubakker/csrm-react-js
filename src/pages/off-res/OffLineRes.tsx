import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import notification from '../../assets/images/cloud-minus.svg';

import Loading from 'components/shared/Loading';
import CreateOffLineResponse from 'components/offline-response/create-response/CreateOffLineResponse';
import ResponseTable from 'components/offline-response/ResponseTable';
import CreateResponseButton from 'components/shared/CreateResponseButton';
import { useGetOfflineResponseMessagesQuery } from 'store/im-chat-stores/imManagerChatApi';
import { useDispatch } from 'react-redux';
import {
  resetAuthToken,
  resetBaseUrl,
  resetPluginKey,
  storeAuthToken,
  storeBaseUrl,
  storePluginKey,
} from 'store/im-chat-stores/imManagerSettingsSlice';

type OfflineResProps = {
  authToken: string;
  pluginKey: string;
  baseUrl: string;
};

const OffLineRes = ({ authToken, pluginKey, baseUrl }: OfflineResProps) => {
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const { t } = useTranslation();
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

  // get response
  const { data: offlineMessagesData, isLoading } =
    useGetOfflineResponseMessagesQuery({
      pluginKey,
    });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-[1920px] mx-auto">
      {offlineMessagesData?.length > 0 ? (
        // data table
        <ResponseTable />
      ) : (
        <div>
          {!isCreated ? (
            <div className="min-h-[75vh] flex items-center justify-center">
              <div className="flex flex-col justify-center items-center">
                <img
                  src={notification}
                  alt="notification"
                  className="w-[100px]"
                />
                <p className="text-[15px] font-normal mt-1">{t('off_cre')}</p>

                {/* create new offline message */}
                <CreateResponseButton
                  setIsCreated={setIsCreated}
                  buttonText={t('of_cnr')}
                />
              </div>
            </div>
          ) : (
            // created form
            <CreateOffLineResponse setIsCreated={setIsCreated} />
          )}
        </div>
      )}
    </div>
  );
};

export default OffLineRes;
