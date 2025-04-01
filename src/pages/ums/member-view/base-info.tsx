import {
  Descriptions,
  Flex,
  Input,
  InputRef,
  Modal,
  Tag,
  theme,
  Tooltip,
} from 'antd';
import DescriptionsItem from 'antd/es/descriptions/Item';
import { useCityList } from 'apis/home';
import LOCALS from 'commons/locals';
import {
  GENDER_OPTION_LIST,
  SHOP_OPTION_LIST,
  findLabelByValue,
  LANGUAGE_MAP,
} from 'commons/options';
import CopyButton from 'components/copy-button';
import { Trans } from 'react-i18next';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import formatTime from 'utils/formatTime';
import { getLocalStorageLanguage } from 'commons';
import { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { editUmsMemberTags, getMemberByIdV2, umsMemberUpdate } from 'apis/ums';
import { UnwrapPromise } from 'types/base';
import { useToggle } from 'react-use';
import useSysDict from 'commons/hooks/use-sys-dict';
import EditableText from 'components/editable-input';

type MemberBaseInfoProps = {
  member: UnwrapPromise<ReturnType<typeof getMemberByIdV2>>;
};

const tagInputStyle: React.CSSProperties = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: 'top',
};

const MemberBaseInfo = ({ member }: MemberBaseInfoProps) => {
  const {
    email,
    countryCode,
    phone,
    firstName,
    lastName,
    firstNameKatakana,
    lastNameKatakana,
    gender,
    birthday,
    totalPayAmount,
    memberLevel,
    integration,
    pointExpireTime,
    createSource,
    createTime,
    country,
    city,
    detailAddress,
    socialAccount,
    socialName,
    remark,
    idCertificate,
    paymentDetails,
  } = member;

  const [tags, setTags] = useState<string[]>(member.tags || []);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const editInputRef = useRef<InputRef>(null);
  const { countryOptions } = useAppSelector(selectGlobalInfo);
  const cityList = useCityList(country);
  const [isModalOpen, toggleIsModalOpen] = useToggle(false);
  const tagConfig = useSysDict<[string[], { [key: string]: string }]>(
    'ums_member_tags_config'
  );

  const lastNameEle = (
    <Descriptions.Item label={<Trans i18nKey={LOCALS.last_name} />}>
      {lastName || '-'}
    </Descriptions.Item>
  );
  const firstNameEle = (
    <Descriptions.Item label={<Trans i18nKey={LOCALS.first_name} />}>
      {firstName || '-'}
    </Descriptions.Item>
  );

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    editUmsMemberTags({ id: member.id, tags: newTags });
    setTags(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = async (inputValue: string) => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      editUmsMemberTags({ id: member.id, tags: [...tags, inputValue] });
    }
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    editUmsMemberTags({ id: member.id, tags: newTags });
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  const { token } = theme.useToken();

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: 'dashed',
  };

  return (
    <Descriptions
      size="small"
      title={<Trans i18nKey={LOCALS.member_info} />}
      bordered
      column={{ xxl: 4, xl: 4, lg: 4, md: 2, sm: 2, xs: 2 }}
    >
      {getLocalStorageLanguage() === LANGUAGE_MAP.ZH_CN ||
      getLocalStorageLanguage() === LANGUAGE_MAP.JA ? (
        <>
          {lastNameEle}
          {firstNameEle}
        </>
      ) : (
        <>
          {firstNameEle}
          {lastNameEle}
        </>
      )}

      <Descriptions.Item label={<Trans i18nKey={LOCALS.first_name_katakana} />}>
        {firstNameKatakana || '-'}
      </Descriptions.Item>

      <Descriptions.Item label={<Trans i18nKey={LOCALS.last_name_katakana} />}>
        {lastNameKatakana || '-'}
      </Descriptions.Item>

      <Descriptions.Item label={<Trans i18nKey={LOCALS.email} />} span={2}>
        {email ? <CopyButton copyText={email}>{email}</CopyButton> : '-'}
      </Descriptions.Item>

      <Descriptions.Item
        label={<Trans i18nKey={LOCALS.phone_number} />}
        span={2}
      >
        <div>
          {countryCode && <span>+{countryCode} </span>}
          <span>{phone || '-'}</span>
        </div>
      </Descriptions.Item>

      <Descriptions.Item label={<Trans i18nKey={LOCALS.gender} />} span={2}>
        {findLabelByValue(gender, GENDER_OPTION_LIST)}
      </Descriptions.Item>

      <Descriptions.Item label={<Trans i18nKey={LOCALS.birthday} />} span={2}>
        {birthday || '-'}
      </Descriptions.Item>

      <DescriptionsItem
        label={<Trans i18nKey={LOCALS.total_pay_amount} />}
        span={2}
      >
        {totalPayAmount}
      </DescriptionsItem>

      <DescriptionsItem
        label={<Trans i18nKey={LOCALS.member_level} />}
        span={2}
      >
        {memberLevel}
      </DescriptionsItem>

      <DescriptionsItem label={<Trans i18nKey={LOCALS.points} />} span={2}>
        {integration || 0}
      </DescriptionsItem>

      <DescriptionsItem
        label={<Trans i18nKey={LOCALS.points_expiration_time} />}
        span={2}
      >
        {formatTime(pointExpireTime)}
      </DescriptionsItem>

      <DescriptionsItem
        label={<Trans i18nKey={LOCALS.created_from} />}
        span={2}
      >
        {findLabelByValue(createSource, SHOP_OPTION_LIST)}
      </DescriptionsItem>

      <DescriptionsItem
        label={<Trans i18nKey={LOCALS.registration_time} />}
        span={2}
      >
        {formatTime(createTime)}
      </DescriptionsItem>

      <DescriptionsItem
        label={<Trans i18nKey={LOCALS.social_media} />}
        span={2}
      >
        {socialName || '-'}
      </DescriptionsItem>

      <DescriptionsItem
        label={<Trans i18nKey={LOCALS.social_handle} />}
        span={2}
      >
        {socialAccount || '-'}
      </DescriptionsItem>

      <DescriptionsItem
        label={<Trans i18nKey={LOCALS.country_region} />}
        span={2}
      >
        {findLabelByValue(country, countryOptions)}
      </DescriptionsItem>

      <DescriptionsItem
        label={<Trans i18nKey={LOCALS.state_province_city} />}
        span={2}
      >
        {city ? cityList.find(({ id }) => id === +city)?.name : '-'}
      </DescriptionsItem>

      <DescriptionsItem
        label={<Trans i18nKey={LOCALS.detail_address} />}
        span={2}
      >
        {detailAddress || '-'}
      </DescriptionsItem>

      <DescriptionsItem label={<Trans i18nKey={LOCALS.note} />} span={2}>
        {remark || '-'}
      </DescriptionsItem>

      <DescriptionsItem
        label={<Trans i18nKey={LOCALS.id_certificate} />}
        span={2}
      >
        <EditableText
          value={idCertificate || ''}
          onChange={(idCertificate) => {
            umsMemberUpdate({
              id: member.id,
              idCertificate,
            }).then(() => {
              window.location.reload();
            });
          }}
        />
      </DescriptionsItem>

      <DescriptionsItem
        label={<Trans i18nKey={LOCALS.payment_details} />}
        span={2}
      >
        <EditableText
          value={paymentDetails || ''}
          onChange={(paymentDetails) => {
            umsMemberUpdate({
              id: member.id,
              paymentDetails,
            }).then(() => {
              window.location.reload();
            });
          }}
        />
      </DescriptionsItem>

      <DescriptionsItem label={<Trans i18nKey={LOCALS.khvsAbbLJs} />} span={4}>
        <Modal
          title="New Tag"
          open={isModalOpen}
          footer={null}
          onCancel={toggleIsModalOpen}
        >
          <div className="grid gap-4">
            <div className="flex gap-1">
              {tagConfig &&
                tagConfig[0].map((tag) => {
                  return (
                    <Tag
                      color={tagConfig[1][tag] || ''}
                      className="cursor-pointer"
                      key={tag}
                      onClick={() => {
                        handleInputConfirm(tag);
                      }}
                    >
                      {tag}
                    </Tag>
                  );
                })}
            </div>
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={() => {
                handleInputConfirm(inputValue);
              }}
              onPressEnter={() => {
                handleInputConfirm(inputValue);
              }}
            ></Input>
          </div>
        </Modal>
        <Flex gap="4px 0" wrap="wrap">
          {tags.map<React.ReactNode>((tag, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  ref={editInputRef}
                  key={tag}
                  size="small"
                  style={tagInputStyle}
                  value={editInputValue}
                  onChange={handleEditInputChange}
                  onBlur={handleEditInputConfirm}
                  onPressEnter={handleEditInputConfirm}
                />
              );
            }

            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                key={tag}
                closable={true}
                style={{ userSelect: 'none' }}
                onClose={() => handleClose(tag)}
                color={(tagConfig && tagConfig[1][tag]) || ''}
              >
                <span
                  onDoubleClick={(e) => {
                    setEditInputIndex(index);
                    setEditInputValue(tag);
                    e.preventDefault();
                  }}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </span>
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}

          <Tag
            className="cursor-pointer"
            style={tagPlusStyle}
            icon={<PlusOutlined />}
            onClick={toggleIsModalOpen}
          >
            New Tag
          </Tag>
        </Flex>
      </DescriptionsItem>
    </Descriptions>
  );
};

export default MemberBaseInfo;
