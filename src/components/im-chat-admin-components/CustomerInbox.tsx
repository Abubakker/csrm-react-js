import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Popover, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import { SearchOutlined } from '@ant-design/icons';
import { CustomerSessionList } from './CustomerSessionList';
import { insertMessage } from '../../store/im-chat-stores/imManagerSettingsSlice';
import { useReadChatMutation } from '../../store/im-chat-stores/imManagerChatApi';
import { FilterIcon } from 'assets/images';
import TagFilter from './TagFilter';
import './TagFilter.css';
import {
  setSocketMediaUsers,
  setSocketMessage,
} from 'store/im-chat-stores/socketSlice';
import { getGinzaxiaomaSocketApiUrl } from '../../apis';

const { Title } = Typography;

// Redux State Type
interface IMManagerSettings {
  pluginKey: string;
  authToken: string;
  selectedSession: string | null;
  filterTagIds: string[];
  resetAllSessionList: number;
}

const CustomerInbox: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const { t } = useTranslation();
  const socketBaseUrl = getGinzaxiaomaSocketApiUrl();

  // Redux state selections
  const {
    pluginKey,
    authToken,
    selectedSession,
    filterTagIds,
    resetAllSessionList,
  } = useSelector(
    (state: { imManagerSettings: IMManagerSettings }) => state.imManagerSettings
  );

  const dispatch = useDispatch();
  const [readChat] = useReadChatMutation();

  // Session read handler to mark the session as read
  const handleSessionRead = useCallback(() => {
    if (selectedSession) {
      readChat({ session: selectedSession });
    }
  }, [readChat, selectedSession]);

  // Unified Socket Handler
  const handleSocket = useCallback(() => {
    if (!socketBaseUrl) return;

    const _socket = io(socketBaseUrl);

    _socket.on('connect', () => console.log('Connected to socket'));
    _socket.on('disconnect', () => console.log('Disconnected from socket'));

    _socket.on('updateUsers', (users: { content?: { data?: any[] } }) => {
      dispatch(setSocketMediaUsers(users?.content?.data || []));
    });

    _socket.on('message_created', (message: any) => {
      dispatch(setSocketMessage(message));
    });

    return () => {
      _socket.disconnect();
    };
  }, [dispatch]);

  // Effect to handle socket connection
  useEffect(() => {
    const cleanup = handleSocket();
    return () => {
      if (cleanup) cleanup();
    };
  }, [handleSocket]);

  // Initialize socket connection and manage message updates
  const initializeSocket = useCallback(() => {
    if (!socketBaseUrl || !authToken || !pluginKey) return;

    const _socket = io(`${socketBaseUrl}/im-chat`);

    const handleMessageCreated = (newMessage: any) => {
      handleSessionRead();
      dispatch(insertMessage([newMessage]));
    };

    _socket.on('message_created', handleMessageCreated);

    // Emit authentication event
    _socket.emit('authentication', {
      personType: 'manager',
      token: authToken,
      imChannelPluginKey: pluginKey,
    });

    // Clean-up socket connection on component unmount
    return () => {
      _socket.disconnect();
    };
  }, [authToken, pluginKey, dispatch, handleSessionRead]);

  // Set up socket on mount and handle cleanup on unmount
  useEffect(() => {
    initializeSocket();
  }, [initializeSocket]);

  return (
    <div className="flex justify-center flex-col h-[100%]">
      <Title className="mx-3 py-6 !mb-0 font-bold !text-[20px] font-NotoSans">
        {t('inbox')}
      </Title>

      {/* Search bar and filter icon */}
      <div className="px-3 mb-6 flex items-center gap-2">
        <Input
          className="rounded-lg p-2 h-[34px]"
          placeholder={`${t('inbox_search_placeholder')}`}
          prefix={<SearchOutlined className="text-[#C5C8D9]" />}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />

        {/* Tag filter popover */}
        <Popover
          content={<TagFilter setVisible={setVisible} />}
          trigger="click"
          placement="bottom"
          open={visible}
          onOpenChange={(visible) => setVisible(visible)}
        >
          <button className="border border-[#DADDEB] rounded-[8px] w-[34px] h-[34px] bg-white p-[5px] flex justify-center items-center">
            <img src={FilterIcon} alt="filter" className="w-6 h-6" />
          </button>
        </Popover>
      </div>

      {/* Customer session list */}
      <CustomerSessionList
        key={resetAllSessionList}
        searchKeyword={searchKeyword}
        tagIds={filterTagIds?.join(',')}
      />
    </div>
  );
};

export default CustomerInbox;
