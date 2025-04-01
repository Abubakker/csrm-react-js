import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag } from 'antd';
import { useUpdateCustomerDetailsMutation } from '../../store/im-chat-stores/imManagerChatApi.js';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const TAGS_COLOR = [
  'blue',
  'purple',
  'cyan',
  'green',
  'magenta',
  'pink',
  'red',
  'orange',
  'yellow',
  'volcano',
  'geekblue',
  'lime',
  'gold',
];

export const CustomerTags = ({ customerDetails }: any) => {
  const { t } = useTranslation();
  const [tags, setTags] = useState(customerDetails?.tags || []);
  const session = useSelector(
    (state: any) => state.imManagerSettings.selectedSession
  );
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<any>(null);

  const [updateCustomerDetails] = useUpdateCustomerDetailsMutation();

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag: any) => {
    const newTags = tags.filter((tag: any) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  useEffect(() => {
    const updateDetails = async () => {
      try {
        await updateCustomerDetails({
          session,
          data: {
            ...customerDetails,
            tags: tags,
          },
        });
      } catch (error) {
        console.error('Failed to update customer details:', error);
      }
    };
    updateDetails();
  }, [tags]);

  return (
    <div className={`flex flex-col w-4/5 ${tags.length ? 'gap-1' : ''}`}>
      <div className="gap-2 flex flex-wrap">
        {tags?.map((tag: any, index: number) => {
          return (
            <Tag
              closable
              // tag={tag} // its giving type error TODO:
              key={index}
              color={TAGS_COLOR[index % TAGS_COLOR.length]}
              className="rounded-md p-1 font-medium mr-0"
              onClose={(e) => {
                e.preventDefault();
                handleClose(tag);
              }}
            >
              {tag}
            </Tag>
          );
        })}
      </div>
      <div>
        {inputVisible ? (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            className="w-[78px] rounded-md p-1 font-medium"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <Tag onClick={showInput} className="p-1 rounded-md font-medium">
            <PlusOutlined /> {t('new_tag')}
          </Tag>
        )}
      </div>
    </div>
  );
};
