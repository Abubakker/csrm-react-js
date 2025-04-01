import { useEffect } from 'react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ja from 'javascript-time-ago/locale/ja';
import zh from 'javascript-time-ago/locale/zh';
import { Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars-2';

// Components
import CustomerInbox from '../../components/im-chat-admin-components/CustomerInbox';
import { Sessions } from '../../components/im-chat-admin-components/Sessions';
import { CustomerDetails } from '../../components/im-chat-admin-components/customer-details/CustomerDetails';
import { Messages } from '../../components/im-chat-admin-components/Messages';
import { NoSessionSelected } from '../../components/im-chat-admin-components/NoSessionSelected';
import ChatInfo from 'components/im-chat-admin-components/ChatInfo';

// Store actions
import {
  resetAuthToken,
  resetBaseUrl,
  resetLocale,
  resetPluginKey,
  storeAuthToken,
  storeBaseUrl,
  storeLocale,
  storePluginKey,
} from '../../store/im-chat-stores/imManagerSettingsSlice';

// Styles
import '../../components/im-chat-admin-components/assets/im_chat_styles.css';

// Add supported locales for time formatting
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ja);
TimeAgo.addLocale(zh);

interface IMChatInboxProps {
  authToken: string;
  pluginKey: string;
  baseUrl: string;
  locale: string;
}

const IMChatInbox = ({
  authToken,
  pluginKey,
  baseUrl,
  locale,
}: IMChatInboxProps) => {
  const { selectedCustomer, selectedSession } = useSelector(
    (state: any) => state.imManagerSettings
  );

  const dispatch = useDispatch();

  // Effect to manage auth, base URL, plugin key, and locale updates
  useEffect(() => {
    // Reset settings if no authToken
    const resetSettings = () => {
      dispatch(resetAuthToken());
      dispatch(resetBaseUrl());
      dispatch(resetLocale());
      dispatch(resetPluginKey());
    };

    // Store settings when authToken exists
    const storeSettings = () => {
      dispatch(storeBaseUrl(baseUrl));
      dispatch(storeAuthToken(authToken));
      dispatch(storePluginKey(pluginKey));
      dispatch(storeLocale(locale));
    };

    authToken ? storeSettings() : resetSettings();

    // i18n.changeLanguage(locale);
  }, [authToken, baseUrl, pluginKey, locale, dispatch]);

  // Rendering the layout of the inbox
  return (
    <div className="-mr-8 -ml-4 xl:!-ml-8 -my-10 overflow-x-auto">
      <Row className="h-[calc(100vh-64px)] font-NotoSans min-w-[1100px]">
        <Col span={5} className="bg-[#EBEDF7] h-[100%] pr-[1px]">
          <CustomerInbox />
        </Col>

        {selectedCustomer && selectedCustomer.media_type === 'im chat' && (
          <Col
            span={5}
            className="bg-[#EBEDF7] border-x-4 border-[#DADDEB] h-[100%]"
          >
            <Sessions />
          </Col>
        )}

        {selectedSession ? (
          <>
            <Col
              span={selectedCustomer?.media_type === 'im chat' ? 9 : 14}
              className="h-[100%] bg-white"
            >
              <Messages />
            </Col>
            <Col span={5} className="h-[100%] bg-white">
              <Scrollbars autoHide>
                <div className="p-3">
                  <ChatInfo />
                  <CustomerDetails />
                </div>
              </Scrollbars>
            </Col>
          </>
        ) : (
          <Col
            span={selectedCustomer ? 14 : 19}
            className="bg-[#EBEDF7] h-[100%]"
          >
            <NoSessionSelected />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default IMChatInbox;
