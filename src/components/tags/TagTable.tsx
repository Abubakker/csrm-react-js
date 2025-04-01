import React, { useMemo, useState } from 'react';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { Edit2Icon } from 'assets/images';
import ReactTimeAgo from 'react-time-ago';
import { useSearchTagsQuery } from 'store/tags-store/tagsApi';
import SearchBar from './SearchBar';
import ActionsDropdown from './ActionsDropdown';
import TagLabel from './TagLabel';

export interface Tag {
  id: string;
  name: string;
  color: string;
  description: string;
  matched: number;
  createdAt: Date;
}
interface TagTableProps {
  btnText: string;
  onClick: () => void;
  type: string;
  handleUpdate: (item: any) => void;
}

const TagTable = ({ btnText, onClick, type, handleUpdate }: TagTableProps) => {
  const [keyword, setKeyword] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState({
    keyword: '',
    type: 'user',
  });
  const [chatSearchQuery, setChatSearchQuery] = useState({
    keyword: '',
    type: 'chat',
  });

  const { data: userTags } = useSearchTagsQuery(userSearchQuery);

  const { data: chatTags } = useSearchTagsQuery(chatSearchQuery);

  const { t } = useTranslation();

  const handleSearch = () => {
    if (type === 'user') {
      setUserSearchQuery((prev: any) => ({ ...prev, keyword }));
    } else {
      setChatSearchQuery((prev: any) => ({ ...prev, keyword }));
    }
  };

  const handleResetSearch = () => {
    if (type === 'user') {
      setUserSearchQuery((prev: any) => ({ ...prev, keyword: '' }));
    } else {
      setChatSearchQuery((prev: any) => ({ ...prev, keyword: '' }));
    }
  };

  const columns = useMemo(
    () => [
      {
        title: t('title_label'),
        key: 'name',
        width: 220,
        render: (tag: Tag) => (
          <TagLabel
            name={tag.name}
            color={tag.color}
            description={tag.description}
          />
        ),
      },
      {
        title: t('matched'),
        dataIndex: 'matched',
        key: 'matched',
        width: 161,
      },
      {
        title: t('creation_time'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 222,
        render: (createdAt: Date) => (
          <ReactTimeAgo date={createdAt} locale="en-US" />
        ),
      },
      {
        title: t('action'),
        key: 'action',
        render: (item: any) => (
          <ActionsDropdown item={item} onEdit={handleUpdate} />
        ),
        width: 82,
      },
    ],
    [t, handleUpdate]
  );

  return (
    <div>
      <div>
        <h3 className="text-[24px] leading-[36px] font-bold text-[#1A1A1A]">
          {t(type === 'user' ? 'user_tags' : 'chat_tags')}
        </h3>
      </div>

      <SearchBar
        keyword={keyword}
        onSearch={handleSearch}
        onReset={handleResetSearch}
        onKeywordChange={setKeyword}
        placeholder={t('search_by_tag_title')}
      />

      <div className="custom-table mt-6">
        <Table
          columns={columns}
          dataSource={
            type === 'user'
              ? userTags?.slice().reverse()
              : chatTags?.slice().reverse()
          }
          footer={() => (
            <Button
              type="link"
              icon={<PlusOutlined />}
              className="font-bold text-[12px] p-0 text-[#1A1A1A]"
              onClick={onClick}
            >
              {btnText}
            </Button>
          )}
          components={{
            header: {
              cell: (props: any) => (
                <th
                  {...props}
                  style={{
                    backgroundColor: '#EBEDF7',
                    color: '#575A6E',
                    fontSize: '10px',
                    fontWeight: '500',
                    lineHeight: '16px',
                    letterSpacing: '0.5px',
                    padding: '12px 8px',
                    textTransform: 'uppercase',
                  }}
                />
              ),
            },
          }}
        />
      </div>
    </div>
  );
};

export default TagTable;
