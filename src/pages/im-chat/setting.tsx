import { Collapse } from 'antd';
import { useEffect } from 'react';
import ProfileHeader from '../../components/im-chat-admin-components/ProfileHeader.jsx';
import GreetingsHeader from '../../components/im-chat-admin-components/GreetingsHeader.jsx';
import OfflineResponseHeader from '../../components/im-chat-admin-components/OfflineResponseHeader.jsx';
import BusinessHourHeader from '../../components/im-chat-admin-components/BusinessHourHeader.jsx';

import { ManageGreeting } from '../../components/im-chat-admin-components/ManageGreeting.jsx';
import ManageOfflineMessage from '../../components/im-chat-admin-components/offline-message/ManageOfflineMessage.js';
import BusinessHour from '../../components/im-chat-admin-components/business-hour/BusinessHour';
import {
  resetAuthToken,
  resetBaseUrl,
  resetLocale,
  resetPluginKey,
  storeAuthToken,
  storeBaseUrl,
  storeLocale,
  storePluginKey,
} from '../../store/im-chat-stores/imManagerSettingsSlice.js';
import { useDispatch } from 'react-redux';
import ManagerProfile from 'components/im-chat-admin-components/manage-profile/ManagerProfile';

interface IMChatSettingsProps {
  authToken: string;
  pluginKey: string;
  baseUrl: string;
  locale: string;
}

const IMChatSettings = ({
  authToken,
  pluginKey,
  baseUrl,
  locale,
}: IMChatSettingsProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetAuthToken());
    dispatch(resetBaseUrl());
    dispatch(resetLocale());
    dispatch(resetPluginKey());

    if (authToken) {
      dispatch(storeBaseUrl(baseUrl));
      dispatch(storeAuthToken(authToken));
      dispatch(storePluginKey(pluginKey));
      dispatch(storeLocale(locale));
    }

    // i18n.changeLanguage(locale)
  }, [baseUrl, locale, pluginKey, authToken]);

  return (
    <>
      <div
        className="-m-4 w-1/2 overflow-auto"
        style={{ height: 'calc(100vh - 74px)' }}
      >
        <Collapse
          ghost
          accordion
          className="flex flex-col"
          destroyInactivePanel={true}
        >
          <Collapse.Panel
            className="bg-[#EBEDF7] m-4 rounded-xl"
            header={<ProfileHeader />}
            showArrow={false}
            key="1"
          >
            <ManagerProfile />
          </Collapse.Panel>
          <Collapse.Panel
            className="bg-[#EBEDF7] m-4 rounded-xl"
            header={<GreetingsHeader />}
            showArrow={false}
            key="2"
          >
            <ManageGreeting />
          </Collapse.Panel>

          <Collapse.Panel
            className="bg-[#EBEDF7] m-4 rounded-xl"
            header={<OfflineResponseHeader />}
            showArrow={false}
            key="3"
          >
            <ManageOfflineMessage />
          </Collapse.Panel>

          <Collapse.Panel
            className="bg-[#EBEDF7] m-4"
            style={{ borderRadius: '12px' }}
            header={<BusinessHourHeader />}
            showArrow={false}
            key="4"
          >
            <BusinessHour />
          </Collapse.Panel>
        </Collapse>
      </div>
    </>
  );
};

export default IMChatSettings;
