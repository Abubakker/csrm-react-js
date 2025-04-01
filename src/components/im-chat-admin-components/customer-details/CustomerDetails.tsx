import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { SearchOutlined } from '@ant-design/icons';
import { SkeletonLoader } from '../loader/SkeletonLoader.jsx';
import { getLocalStorageToken } from 'commons';
import axios from 'axios';
import { useCreateTagMutation } from 'store/im-chat-stores/imManagerChatApi.js';
import CustomerInfo from './CustomerInfo';
import TagsSection from './TagsSection';
import IntegrationMemberItem from './IntegrationMemberItem';
import { PAGE_SIZE, TAG_COLORS } from '../constants/constants';

interface IntegrationState {
  id: number | null;
  status: boolean;
}

export interface TagOption {
  label: string;
  value: string | number;
}

interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface CustomerDetailsData {
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: number;
  phone?: string;
  birthday?: string;
  socialAccount?: string;
  country?: string;
  city?: string;
  detailAddress?: string;
  tag_list?: Tag[];
}

export const CustomerDetails = () => {
  const [adminUmsMembers, setAdminUmsMembers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pageNum] = useState(1);

  const [countDown, setCountDown] = useState<number | null>(null);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState<(string | number)[]>([]);
  const [createTag] = useCreateTagMutation();
  const [updateTagLoading, setUpdateTagLoading] = useState(false);

  const [inteGrating, setIntegrating] = useState<IntegrationState>({
    id: null,
    status: false,
  });
  const [isIntegrated, setIsIntegrated] = useState<IntegrationState>({
    id: null,
    status: false,
  });

  const token = useMemo(
    () => getLocalStorageToken().replace('Bearer ', ''),
    []
  );

  const session = useSelector(
    (state: any) => state.imManagerSettings.selectedSession
  );
  const customer = useSelector(
    (state: any) => state.imManagerSettings.selectedCustomer
  );
  const baseUrl = useSelector((state: any) => state.imManagerSettings.baseUrl);

  const [userId, setUserId] = useState(customer.user_id);

  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setUserId(customer.user_id);
    setIsEditing(false);
    setSearchKeyword('');
  }, [customer]);

  const startIntegrationCountdown = (id: number) => {
    setIntegrating({ id, status: true });
    let countdownValue = 3;
    setCountDown(countdownValue);
    intervalIdRef.current = setInterval(() => {
      countdownValue -= 1;
      setCountDown(countdownValue);

      if (countdownValue === 0) {
        clearInterval(intervalIdRef.current!);
        setIntegrating({ id: null, status: false });
        axios
          .put(`${baseUrl}/media-users/assign-user-id`, {
            identifier: session?.identifier,
            user_id: id,
          })
          .then(() => {
            setIsIntegrated({ id, status: true });
            setUserId(id);
            setSearchKeyword('');
          })
          .catch((error) => console.error('Failed to assign user id:', error));
      }
    }, 1000);
  };

  const handleCancel = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      setIntegrating({ id: null, status: false });
      setCountDown(null);
    }
  };

  // fetch admin umsMember list
  const fetchAdminUmsMembers = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/admin/umsMember/list`,
        {
          pageNum,
          pageSize: PAGE_SIZE,
          keyword: searchKeyword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdminUmsMembers(data?.list);
    } catch (error) {
      console.error('Failed to fetch admin umsMembers:', error);
    }
  }, [token, pageNum, searchKeyword, baseUrl]);

  useEffect(() => {
    fetchAdminUmsMembers();
  }, [fetchAdminUmsMembers]);

  const fetchAllTags = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/tags?type=user&isActive=true`
      );
      const tags = response.data;
      const tagList = tags?.map((tag: any) => ({
        label: tag.name,
        value: tag.id,
      }));
      setAllTags(tagList);
    } catch (error) {
      console.error('Failed to fetch all tags:', error);
    }
  }, [baseUrl]);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      setIsLoading(true);

      try {
        if (!userId) {
          setCustomerDetails(null);
          setIsLoading(false);
          return;
        }
        const response = await axios.get(`${baseUrl}/tags/userid/${userId}`);
        const customerData = response.data;
        setCustomerDetails(customerData);
        const tagIds = customerData?.tag_list?.map((tag: any) => tag.id);
        setSelectedTags(tagIds);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Failed to fetch customer details:', error);
      }
    };
    fetchCustomerDetails();
    fetchAllTags();
  }, [token, userId, customer, baseUrl, fetchAllTags]);

  const handleEdit = () => {
    setIsEditing(true);
    fetchAllTags();
  };

  const handleUpdateTags = async () => {
    try {
      if (updateTagLoading) return;
      setUpdateTagLoading(true);
      const [newTags, existingTags] = selectedTags.reduce<[string[], number[]]>(
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

      existingTags.push(...validNewTagIds);

      const response = await axios.post(`${baseUrl}/tags/assign`, {
        tagIds: existingTags,
        userId: userId,
      });
      const updateTags = response.data;
      setCustomerDetails({ ...customerDetails, tag_list: updateTags.tag_list });
      setIsEditing(false);
      setUpdateTagLoading(false);
    } catch (error) {
      console.error('Failed to update chat info:', error);
      setUpdateTagLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="bg-white rounded-[10px] p-3 shadow-[0_0_2px_rgba(0,0,0,0.2)] space-y-3 font-NotoSans">
          <h3 className="font-bold text-[14px] leading-5 text-[#3F4252] font-NotoSans">
            {t('customer_details')}
          </h3>

          {userId && customerDetails ? (
            <div className="flex flex-wrap space-y-5">
              <CustomerInfo customerDetails={customerDetails} />

              <div className="w-full space-y-2">
                <TagsSection
                  isEditing={isEditing}
                  selectedTags={selectedTags}
                  allTags={allTags}
                  tagList={customerDetails.tag_list}
                  updateTagLoading={updateTagLoading}
                  onEdit={handleEdit}
                  onCancelEdit={() => setIsEditing(false)}
                  onTagsChange={setSelectedTags}
                  onSave={handleUpdateTags}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-[10px] relative">
              <p className="bg-[#FFF0DB] rounded-lg px-2 py-1 text-[#FF9500] mb-0 font-medium">
                {t('no_customer_details')}
              </p>
              <Input
                className="rounded-lg p-2"
                placeholder={`${t('customer_details_search_placeholder')}`}
                prefix={<SearchOutlined className="text-[#C5C8D9]" />}
                onChange={(e) => setSearchKeyword(e.target.value)}
                value={searchKeyword}
              />

              {adminUmsMembers?.length > 0 && searchKeyword.length > 0 && (
                <div className="p-1 rounded-md bg-white shadow-[0_0_5px_rgba(0,0,0,0.2)] absolute top-[125px] left-1 right-1 space-y-4 z-10 max-h-[336px] overflow-y-auto tag-scroll">
                  {adminUmsMembers.map((umsMember: any) => (
                    <IntegrationMemberItem
                      key={umsMember.id}
                      member={umsMember}
                      integrating={inteGrating}
                      isIntegrated={isIntegrated}
                      countDown={countDown}
                      onStartIntegration={startIntegrationCountdown}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
