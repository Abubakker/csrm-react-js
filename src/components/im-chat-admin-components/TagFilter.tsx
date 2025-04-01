import { Button, Checkbox, Menu } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setFilterTagIds } from 'store/im-chat-stores/imManagerSettingsSlice';
import { useGetTagsQuery } from 'store/tags-store/tagsApi';

interface TagFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

interface Tag {
  id: string | number;
  name: string;
}

interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string | React.ReactNode;
  children?: MenuItem[];
}

const TagFilter = ({ setVisible }: TagFilterProps) => {
  const { t } = useTranslation();
  const [chatTagsList, setChatTagsList] = useState<MenuItem[]>([]);
  const [userTagsList, setUserTagsList] = useState<MenuItem[]>([]);
  const [chatCheckedList, setChatCheckedList] = useState<(string | number)[]>(
    []
  );
  const [userCheckedList, setUserCheckedList] = useState<(string | number)[]>(
    []
  );
  const [checkAllChat, setCheckAllChat] = useState<boolean>(false);
  const [checkAllUser, setCheckAllUser] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { data: userTags, isSuccess: userTagsSuccess } = useGetTagsQuery({
    type: 'user',
  });
  const { data: chatTags, isSuccess: chatTagsSuccess } = useGetTagsQuery({
    type: 'chat',
  });

  useEffect(() => {
    if (chatTagsSuccess) {
      const chatTagsData = chatTags?.map((item: Tag) => ({
        key: item?.id,
        label: (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleChatTagChange(item?.id)}
          >
            <Checkbox checked={chatCheckedList.includes(item?.id)} />
            {item?.name}
          </div>
        ),
      }));
      setChatTagsList(chatTagsData);
    }
  }, [chatTagsSuccess, chatTags, chatCheckedList]);

  useEffect(() => {
    if (userTagsSuccess) {
      const userTagsData = userTags?.map((item: Tag) => ({
        key: item?.id,
        label: (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleUserTagChange(item?.id)}
          >
            <Checkbox checked={userCheckedList.includes(item?.id)} />
            {item?.name}
          </div>
        ),
      }));
      setUserTagsList(userTagsData);
    }
  }, [userTagsSuccess, userTags, userCheckedList]);

  const handleChatTagChange = (id: string | number) => {
    setChatCheckedList((prev) =>
      prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]
    );
  };

  const handleUserTagChange = (id: string | number) => {
    setUserCheckedList((prev) =>
      prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]
    );
  };

  const handleCheckAllChat = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setChatCheckedList(chatTags.map((tag: Tag) => tag?.id));
      setCheckAllChat(true);
    } else {
      setChatCheckedList([]);
      setCheckAllChat(false);
    }
  };

  const handleCheckAllUser = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setUserCheckedList(userTags.map((tag: Tag) => tag?.id));
      setCheckAllUser(true);
    } else {
      setUserCheckedList([]);
      setCheckAllUser(false);
    }
  };

  const handleFilter = () => {
    dispatch(setFilterTagIds([...chatCheckedList, ...userCheckedList]));
    setVisible(false);
  };

  const handleResetFilter = () => {
    setChatCheckedList([]);
    setUserCheckedList([]);
    dispatch(setFilterTagIds([]));
    setVisible(false);
  };

  const items = [
    {
      key: '1',
      icon: <Checkbox checked={checkAllChat} onChange={handleCheckAllChat} />,
      label: t('chat_tags'),
      children: chatTagsList,
    },
    {
      key: '2',
      icon: <Checkbox checked={checkAllUser} onChange={handleCheckAllUser} />,
      label: t('user_tags'),
      children: userTagsList,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="max-h-[348px] overflow-y-auto tag-scroll">
        <Menu
          mode="inline"
          style={{ width: 256 }}
          items={items}
          className="no-active-menu"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={handleFilter}
          type="primary"
          className="w-full rounded-[10px]"
        >
          {t('filter')}
        </Button>
        <Button onClick={handleResetFilter} className="w-full rounded-[10px]">
          {t('reset')}
        </Button>
      </div>
    </div>
  );
};

export default TagFilter;
