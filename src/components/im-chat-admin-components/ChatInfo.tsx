import { useCallback, useEffect, useState } from 'react';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  useCreateTagMutation,
  useGetAllTagsQuery,
  useGetChatInfoDetailsQuery,
  useUpdateChatInfoMutation,
} from 'store/im-chat-stores/imManagerChatApi';
import { TAG_COLORS } from './constants/constants';
import { hexToRgb } from './helpers/utils';

interface Tag {
  id: number;
  name: string;
  color: string;
}

const ChatInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const customer = useSelector(
    (state: any) => state.imManagerSettings.selectedCustomer
  );
  const { t } = useTranslation();

  const {
    data: chatInfoDetails,
    isSuccess,
    refetch,
  } = useGetChatInfoDetailsQuery({
    sessionId: customer?.UniqueID,
  });

  const {
    data: fetchAllTags,
    isSuccess: allTagsSuccess,
    refetch: refetchTags,
  } = useGetAllTagsQuery({
    type: 'chat',
    isActive: true,
  });
  const [updateChatInfo, { isLoading: isUpdating }] =
    useUpdateChatInfoMutation();
  const [createTag, { isLoading: isCreating }] = useCreateTagMutation();

  useEffect(() => {
    if (isSuccess) {
      const tagList = chatInfoDetails?.tags?.map((tag: Tag) => tag.id);
      setSelectedTags(tagList);
      setDescription(chatInfoDetails.description);
    }
  }, [chatInfoDetails, isSuccess]);

  useEffect(() => {
    if (allTagsSuccess) {
      const tagList = fetchAllTags?.map((tag: Tag) => ({
        label: tag.name,
        value: tag.id,
      }));
      setAllTags(tagList);
    }
  }, [allTagsSuccess, fetchAllTags]);

  const handleEdit = () => {
    setIsEditing(true);
    const tagList = fetchAllTags?.map((tag: Tag) => ({
      label: tag.name,
      value: tag.id,
    }));
    setAllTags(tagList);
  };

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setSelectedTags(chatInfoDetails?.tags?.map((tag: Tag) => tag.id) || []);
    setDescription(chatInfoDetails?.description || '');
  }, [chatInfoDetails, setIsEditing]);

  const handleUpdateChatInfo = async () => {
    try {
      const [newTags, existingTags] = selectedTags.reduce(
        ([newTags, existingTags], tag) => {
          typeof tag === 'string' ? newTags.push(tag) : existingTags.push(tag);
          return [newTags, existingTags];
        },
        [[], []]
      );

      const newTagResults = await Promise.all(
        newTags.map((tag) =>
          createTag({
            data: {
              name: tag,
              type: 'user',
              isActive: true,
              color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
            },
          })
        )
      );

      const validNewTagIds = newTagResults
        .filter((result) => 'data' in result && result.data?.id)
        .map((result) => ('data' in result ? result.data.id : null))
        .filter((id) => id !== null);

      await updateChatInfo({
        data: {
          tagIds: [...existingTags, ...validNewTagIds],
          chatInfoId: chatInfoDetails?.UniqueID,
          description: description,
        },
      });

      refetch();
      refetchTags();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update chat info:', error);
    }
  };

  useEffect(() => {
    refetch();
    handleCancelEdit();
  }, [customer, refetch, handleCancelEdit]);

  return (
    <div className="bg-white rounded-[10px] p-3 shadow-[0_0_2px_rgba(0,0,0,0.2)] space-y-3 font-NotoSans mb-3">
      <h3 className="font-bold text-[14px] leading-5 text-[#3F4252] font-NotoSans">
        {t('chat_info')}
      </h3>
      <div>
        <h5 className="font-medium text-[12px] text-[#676B80] flex items-center justify-between gap-[10px]">
          <span>{t('chat_tags')}</span>
          {isEditing ? (
            <CloseOutlined
              onClick={handleCancelEdit}
              className="cursor-pointer"
            />
          ) : (
            <EditOutlined onClick={handleEdit} className="cursor-pointer" />
          )}
        </h5>
        <p className="font-medium text-[#C5C8D9] flex items-center gap-2 flex-wrap text-[12px]">
          {isEditing ? (
            <Select
              mode="tags"
              allowClear
              style={{ width: '100%' }}
              placeholder={t('please_select')}
              value={selectedTags}
              onChange={setSelectedTags}
              options={allTags}
            />
          ) : chatInfoDetails?.tags?.length > 0 ? (
            chatInfoDetails?.tags?.map((tag: Tag) => (
              <div
                key={tag.id}
                style={{
                  backgroundColor: `rgba(${hexToRgb(tag.color)}, 0.1)`,
                  color: tag.color,
                  borderColor: `rgba(${hexToRgb(tag.color)}, 0.5)`,
                }}
                className="py-1 text-[12px] leading-[18px] px-2 h-[26px] border rounded-[6px]"
              >
                {tag.name}
              </div>
            ))
          ) : (
            t('no_tags_yet')
          )}
        </p>
      </div>
      <div>
        <h5 className="font-medium text-[12px] text-[#676B80]">
          {t('chat_description')}
        </h5>
        <p className="font-medium text-[#C5C8D9] mb-0 text-[12px]">
          {isEditing ? (
            <Input
              type="text"
              placeholder={`${t('chat_desc')}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          ) : chatInfoDetails?.description?.trim()?.length > 0 ? (
            chatInfoDetails?.description
          ) : (
            t('chat_desc')
          )}
        </p>
      </div>
      {isEditing && (
        <Button
          onClick={handleUpdateChatInfo}
          type="primary"
          className="rounded w-full"
          disabled={isUpdating || isCreating}
        >
          {t('save')}
        </Button>
      )}
    </div>
  );
};

export default ChatInfo;
