import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Radio,
  Select,
  Spin,
  Empty,
  Descriptions,
  Tag,
  theme,
  Modal,
} from 'antd';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import { createdFromList } from 'constants/RecyclingConsignment';
import {
  umsSearchMember,
  getMemberList,
  getMemberByIdV2,
  editUmsMemberTags,
} from 'apis/ums';
import type { FormInstance } from 'antd/es/form';
import {
  OmsRecycleOrderSNSCreateDTO,
  OmsRecycleOrderCreateDTO,
} from 'types/oms';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { useAppSelector } from 'store/hooks';
import { SHOP_OPTION_LIST, SOCIAL_MEDIA_OPTION_LIST } from 'commons/options';
import { selectUserInfo } from 'store/slices/userInfoSlice';
import { useSelector } from 'react-redux';
import { cityList } from 'constants/appointment-management';
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import CreateMemberDrawer from 'components/create-member-drawer';
import { useToggle } from 'react-use';
import { UmsMember } from 'types/ums';
import { debounce } from 'lodash-es';
import {
  setRecyclingConsignmentStore,
  getRecyclingConsignmentStore,
  ITEM_NAME_MAP,
} from '../utils';

interface Props {
  form: FormInstance<any>;
  onChange: (
    data: (OmsRecycleOrderSNSCreateDTO | OmsRecycleOrderCreateDTO) & {
      user?: UserType;
    }
  ) => void;
  type: 'intention' | 'contract';
  orderType?: number;
}

export interface UserType {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  username?: string;
  memberId?: number;
  city?: string;
  socialName?: string;
  socialAccount?: string;
  country?: string;
  detailAddress?: string;
  postCode?: string;
  idCertificate?: string;
  paymentDetails?: string;
}

export type UserInfoForm = {
  memberId: number;
  email: string;
  storeId?: number;
  memberRemark?: string;
  createdFrom?: number;
};

const UserInfo = ({ form, onChange, type, orderType }: Props) => {
  const { token } = theme.useToken();
  const location = useLocation();
  const [searchLoading, setSearchLoading] = useState(false);
  const [userList, setUserList] = useState<UmsMember[]>([]);
  const [user, setUser] = useState<UserType>({});
  const [createMemberOpen, toggleCreateMemberOpen] = useToggle(false);

  const { countryOptions } = useAppSelector(selectGlobalInfo);
  const { shop } = useSelector(selectUserInfo);

  const [userTags, setUserTags] = useState<string[]>([]);
  useEffect(() => {
    if (user && user.memberId) {
      getMemberByIdV2(user.memberId).then((res) => {
        setUserTags(res.tags || []);
      });
    }
  }, [user]);
  const [userTagAddModal, toggleUserTagAddModal] = useToggle(false);
  const [userTagValue, setUserTagValue] = useState('');

  const ItemName = useMemo(() => {
    if (type === 'contract') {
      return ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_CONTRACT;
    } else {
      return ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_INTENTION;
    }
  }, [type]);

  const handleUserData = useCallback(
    (data: UmsMember) => {
      const {
        email,
        firstName,
        lastName,
        phone,
        id,
        countryCode,
        socialName,
        country,
        city,
        detailAddress,
        socialAccount,
        idCertificate,
        paymentDetails,
      } = data;
      const phone_ = phone ? `${countryCode} ${phone}` : '';
      const phone1 = phone_ ? `${phone_}` : '';

      const social = SOCIAL_MEDIA_OPTION_LIST.find(
        (d) => d.value === socialName
      )?.label;

      setRecyclingConsignmentStore(ItemName, {
        userInfo: {
          ...form.getFieldsValue(),
          memberId: id || 0,
          email: email || '',
        },
      });

      return {
        email,
        username: `${lastName || ''} ${firstName || ''}`,
        phone: phone1,
        memberId: id,
        socialName: social,
        socialAccount,
        country,
        city,
        detailAddress,
        idCertificate,
        paymentDetails,
      };
    },
    [ItemName, form]
  );

  const searchUser = useCallback(
    (email: string) => {
      umsSearchMember(email)
        .then((data) => {
          if (data.data) {
            const t = handleUserData(data.data);
            setUser(t);
          }
        })
        .catch(() => {})
        .finally(() => {});
    },
    [handleUserData]
  );

  useEffect(() => {
    const userStore = getRecyclingConsignmentStore(ItemName)
      .userInfo as UserInfoForm;

    if (userStore?.memberId && Object.keys(user).length === 0) {
      searchUser(userStore.email);
      form.setFieldsValue({ ...userStore });
    } else {
      form.setFieldsValue({ ...user });
    }
  }, [ItemName, form, searchUser, user]);

  const debouncedHandleSearch = useMemo(() => {
    return debounce((keyword: string) => {
      keyword = keyword.trim();
      if (!keyword) {
        return;
      }
      setSearchLoading(true);
      getMemberList({ keyword, pageNum: 1, pageSize: 100 })
        .then((data) => {
          setUserList(data.data.list);
        })
        .catch(() => {})
        .finally(() => {
          setSearchLoading(false);
        });
    }, 555);
  }, []);

  const getMemberInfo = useCallback(
    (keyword: string) => debouncedHandleSearch(keyword),
    [debouncedHandleSearch]
  );

  useEffect(() => {
    if (location.state?.memberEmail && Object.keys(user).length === 0) {
      searchUser(location.state?.memberEmail);
    }
  }, [location.state?.memberEmail, searchUser, user]);

  const storeId = Form.useWatch('storeId', {
    form,
    preserve: true,
  });
  const createdFrom = Form.useWatch('createdFrom', {
    form,
    preserve: true,
  });

  useEffect(() => {
    if (user.memberId) {
      const t = { ...user, storeId, user, createdFrom };
      onChange(t);
      form.setFieldValue('keyword', user.email);
    }
  }, [form, onChange, storeId, user, createdFrom]);

  useEffect(() => {
    form.setFieldsValue({ storeId: shop || 1 });
  }, [form, shop]);

  // 详细信息
  const getDescItems = useMemo(() => {
    if (user) {
      const country = countryOptions.find((d) => d.value === user.country);

      const items = [
        {
          key: 'username',
          label: i18n.t('name'),
          children: user.username ? (
            <a
              href={`/ums/member-view/${user.memberId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.username}
            </a>
          ) : (
            '-'
          ),
        },
        {
          key: 'memberId',
          label: i18n.t('member_id'),
          children: user.memberId || '-',
        },
        {
          key: 'phone',
          label: i18n.t('phone_number'),
          children: user.phone || '-',
        },
        {
          key: 'country_region',
          label: i18n.t('country_region'),
          children: country?.label || '-',
        },
        {
          key: 'detail_address',
          label: i18n.t('detail_address'),
          children: user.detailAddress || '-',
        },
      ];

      if (user.socialName) {
        items.push({
          key: 'socialName',
          label: user.socialName,
          children: user.socialAccount || '-',
        });
      }

      items.push({
        key: 'id_certificate',
        label: i18n.t('id_certificate'),
        children: user.idCertificate || '-',
      });

      if (user.paymentDetails?.trim()) {
        items.push({
          key: 'payment_details',
          label: i18n.t('payment_details'),
          children: user.paymentDetails,
        });
      }

      items.push({
        key: 'user_tags',
        label: i18n.t(LOCALS.khvsAbbLJs),
        children: (
          <div>
            {userTags.map((tag) => {
              return (
                <Tag
                  key={tag}
                  closable
                  onClose={() => {
                    if (!user.memberId) return;
                    const newTags = userTags.filter((t) => t !== tag);
                    editUmsMemberTags({ id: user.memberId, tags: newTags });
                    setUserTags(newTags);
                  }}
                >
                  {tag}
                </Tag>
              );
            })}
            <Tag
              style={{
                height: 22,
                background: token.colorBgContainer,
                borderStyle: 'dashed',
                cursor: 'pointer',
              }}
              icon={<PlusOutlined />}
              onClick={toggleUserTagAddModal}
            >
              New Tag
            </Tag>
          </div>
        ),
      });
      return items;
    }
    return [];
  }, [
    user,
    countryOptions,
    userTags,
    token.colorBgContainer,
    toggleUserTagAddModal,
  ]);

  return (
    <div>
      <Form
        style={{}}
        initialValues={{ storeId: shop || 1 }}
        autoComplete="off"
        form={form}
        onValuesChange={(_, allValues: UserInfoForm) => {
          const newAll: UserInfoForm = { ...allValues };
          setRecyclingConsignmentStore(ItemName, {
            userInfo: {
              ...newAll,
              memberId: user?.memberId || 0,
              email: user.email || '',
            },
          });
          let payload = { ...newAll };
          onChange(payload);
        }}
      >
        <div className="flex items-center gap-4">
          <Form.Item
            rules={[{ required: true }]}
            name="keyword"
            label={i18n.t('phone_or_email')}
            className="mb-0 w-full"
          >
            <Select
              showSearch
              placeholder={i18n.t('phone_or_email')!}
              filterOption={false}
              notFoundContent={
                searchLoading ? <Spin size="small" /> : <Empty />
              }
              onSearch={getMemberInfo}
              onChange={(memberId: UmsMember['id']) => {
                const target = userList.find((i) => i.id === memberId);
                if (target) {
                  const t = handleUserData(target);
                  setUser(t);
                }
              }}
              options={userList.map((i) => {
                return {
                  ...i,
                  value: i.id,
                  label: `${i.showName}(${i.email})`,
                };
              })}
            ></Select>
          </Form.Item>
          <Button
            className="shrink-0"
            type="primary"
            onClick={() => {
              toggleCreateMemberOpen(true);
            }}
            icon={<UserAddOutlined />}
          >
            {i18n.t('add_member')}
          </Button>
        </div>

        <Descriptions
          size="small"
          items={getDescItems}
          bordered
          className="my-4"
        />

        {type === 'intention' && (
          <>
            <Row gutter={[24, 0]}>
              <Col span={24}>
                <Form.Item
                  label={i18n.t('consulting_source')}
                  name="createdFrom"
                  rules={[{ required: true }]}
                >
                  <Radio.Group
                    options={createdFromList.filter((i) => !i.hidden)}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col span={24}>
                <Form.Item label={i18n.t(LOCALS.note)} name="memberRemark">
                  <Input.TextArea maxLength={200} />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        {type === 'contract' && (
          <Form.Item
            name="storeId"
            label={i18n.t('shop')}
            rules={[{ required: true }]}
          >
            <Radio.Group
              options={cityList.map(({ value, label }) => {
                const newLabel =
                  SHOP_OPTION_LIST.find((i) => i.value === value)?.label ||
                  label;
                return { value, label: newLabel };
              })}
              disabled={Boolean(shop)}
              optionType="button"
            />
          </Form.Item>
        )}
      </Form>

      <CreateMemberDrawer
        open={createMemberOpen}
        onClose={() => toggleCreateMemberOpen(false)}
        setUmsMember={(data: UmsMember) => {
          setUser(handleUserData(data));
        }}
      />

      <Modal
        title="New Tag"
        open={userTagAddModal}
        onCancel={toggleUserTagAddModal}
        okButtonProps={{ disabled: !userTagValue.trim() }}
        onOk={() => {
          if (!user.memberId) return;
          if (userTagValue && !userTags.includes(userTagValue)) {
            setUserTags([...userTags, userTagValue]);
            editUmsMemberTags({
              id: user.memberId,
              tags: [...userTags, userTagValue],
            });
          }
          setUserTagValue('');
          toggleUserTagAddModal();
        }}
      >
        <Input
          value={userTagValue}
          onChange={(e) => {
            setUserTagValue(e.target.value);
          }}
        ></Input>
      </Modal>
    </div>
  );
};

export default UserInfo;
