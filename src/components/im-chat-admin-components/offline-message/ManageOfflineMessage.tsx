import { Button, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  useCreateOfflineMessageMutation,
  useDeleteOfflineMessageMutation,
  useGetOfflineMessagesQuery,
  useUpdateOfflineMessageMutation,
} from '../../../store/im-chat-stores/imManagerChatApi.js';
import { useState, useEffect } from 'react';
import OfflineMessageModal from '../modals/OfflineMessageModal.jsx';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { OfflineMessageCard } from './OfflineMessageCard.js';

const ManageOfflineMessage = () => {
  const pluginKey = useSelector(
    (state: any) => state.imManagerSettings.pluginKey
  );
  const {
    data: offlineMessagesData,
    refetch: refetchOfflineMessage,
    isLoading,
  } = useGetOfflineMessagesQuery({ pluginKey: pluginKey });
  const [createOfflineMessage] = useCreateOfflineMessageMutation();
  const [updateOfflineMessage] = useUpdateOfflineMessageMutation();
  const [deleteOfflineMessage] = useDeleteOfflineMessageMutation();
  const [offlineMessageModal, setOfflineMessageModal] = useState(false);

  const [messages, setMessages] = useState<any>({});
  const [editingStates, setEditingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const { t } = useTranslation();

  useEffect(() => {
    if (offlineMessagesData) {
      const initialMessages = offlineMessagesData.reduce(
        (acc: any, message: any) => {
          acc[message.id] = {
            buttonContent: message.buttonContent,
            replyMessage: message.replyMessage,
          };
          return acc;
        },
        {}
      );
      setMessages((prevMessages: any) => ({
        ...prevMessages,
        ...initialMessages,
      }));
      setEditingStates({});
    }
  }, [offlineMessagesData]);

  const handleInputChange = (id: string, field: string, value: string) => {
    setMessages((prevMessages: any) => ({
      ...prevMessages,
      [id]: {
        ...prevMessages[id],
        [field]: value,
      },
    }));
    setEditingStates((prevStates) => ({
      ...prevStates,
      [id]: true,
    }));
  };

  const handleOfflineMessageSave = async (data: any) => {
    try {
      const result = await createOfflineMessage({
        pluginKey: pluginKey,
        data: data,
      }).unwrap();

      setMessages((prevMessages: any) => ({
        ...prevMessages,
        [result.id]: {
          buttonContent: data.buttonContent,
          replyMessage: data.replyMessage,
        },
      }));

      setOfflineMessageModal(false);
      refetchOfflineMessage();
    } catch (error) {
      console.error('Failed to create offline message: ', error);
    }
  };

  const handleUpdateOfflineMessage = async (id: string) => {
    try {
      await updateOfflineMessage({
        offlineResponseId: id,
        data: messages[id],
      });
      setEditingStates((prevStates) => ({
        ...prevStates,
        [id]: false,
      }));
      refetchOfflineMessage();
    } catch (error) {
      console.error('Failed to update offline message: ', error);
    }
  };

  const handleCancelEdit = (id: any) => {
    setMessages((prevMessages: any) => ({
      ...prevMessages,
      [id]: {
        buttonContent: offlineMessagesData.find((m: any) => m.id === id)
          .buttonContent,
        replyMessage: offlineMessagesData.find((m: any) => m.id === id)
          .replyMessage,
      },
    }));
    setEditingStates((prevStates) => ({
      ...prevStates,
      [id]: false,
    }));
  };

  const handleDeleteOfflineMessage = async (responseId: string) => {
    try {
      await deleteOfflineMessage({ offlineResponseId: responseId });
      refetchOfflineMessage();
    } catch (error) {
      console.error('Failed to delete offline message: ', error);
    }
  };

  return (
    <>
      <div className="w-full p-3">
        {isLoading
          ? [...Array(2)].map((_, index) => (
              <div key={index} className="bg-[#F5F6FC] p-3 rounded-lg mb-3">
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            ))
          : offlineMessagesData?.map((message: any) => (
              <OfflineMessageCard
                key={message.id}
                id={message.id}
                buttonContent={messages[message.id]?.buttonContent}
                replyMessage={messages[message.id]?.replyMessage}
                isEditing={editingStates[message.id]}
                onInputChange={handleInputChange}
                onSave={handleUpdateOfflineMessage}
                onCancel={handleCancelEdit}
                onDelete={handleDeleteOfflineMessage}
              />
            ))}
        <div className="mt-3">
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => setOfflineMessageModal(true)}
          >
            {t('add_response')}
          </Button>
        </div>
      </div>
      <OfflineMessageModal
        visible={offlineMessageModal}
        onCancel={() => setOfflineMessageModal(false)}
        onConfirm={(data) =>
          handleOfflineMessageSave({
            data: {
              buttonContent: data.buttonContent,
              replyMessage: data.replyMessage,
            },
          })
        }
      />
    </>
  );
};

export default ManageOfflineMessage;
