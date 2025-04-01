import { useTranslation } from 'react-i18next';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import ReactTimeAgo from 'react-time-ago';
import {
  useCreateRewardMutation,
  useGetRewardsQuery,
  useUpdateRewardMutation,
} from 'store/im-chat-stores/reward.Api';

import { notification, PaginationProps, Table } from 'antd';

import SelectField from '../create-new-reward/SelectField';
import FilterActions from './FilterActions';
import InputField from './InputField';
import ActionDropdownMenu from './ActionDropdownMenu';
import { ViewRewardState } from 'pages/reward';
import StatusBadge from './StatusBadge';
import ButtonCreate from './ButtonCreate';

export enum BadgeStatus {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  EXPIRED = 'Expired',
}

interface SearchQuery {
  keyword: string;
  status: string;
  type: string;
  applicableFor: string;
  pageNum: number;
  pageSize: number;
}

interface RewardTableProps {
  setIsCreateRewardActive: Dispatch<SetStateAction<boolean>>;
  setIsViewRewardActive: (value: ViewRewardState) => void;
}

const RewardTable = ({
  setIsCreateRewardActive,
  setIsViewRewardActive,
}: RewardTableProps) => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [applicableFor, setApplicableFor] = useState('');
  const [data, setData] = useState([]);
  const locale = useSelector((state: any) => state.imManagerSettings.locale);

  const [updateReward] = useUpdateRewardMutation();
  const [createReward] = useCreateRewardMutation();

  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    keyword: '',
    status: '',
    type: '',
    applicableFor: '',
    pageNum: 1,
    pageSize: 10,
  });

  const {
    data: rewardsData,
    isSuccess,
    isLoading,
  } = useGetRewardsQuery(searchQuery);

  const transformedData = useMemo(() => {
    if (!isSuccess) return [];

    return rewardsData?.rewards
      ?.map((reward: any) => ({
        key: reward.id,
        title: reward.title,
        status: reward.status,
        type: reward.type,
        applicableFor: reward.applicableFor,
        duration: `${new Date(reward.startDate).toLocaleDateString(
          'en-CA'
        )} to ${new Date(reward.endDate).toLocaleDateString('en-CA')}`,
        availed: reward.value,
        creationTime: (
          <ReactTimeAgo date={new Date(reward.createdAt)} locale={locale} />
        ),
        createdBy: reward.createdBy.username,
        id: reward.id,
        rewardData: reward,
      }))
      .reverse();
  }, [isSuccess, rewardsData, locale]);

  useEffect(() => {
    setData(transformedData);
  }, [transformedData]);

  const handleDuplicate = useCallback(
    async (rewardData: any) => {
      try {
        const duplicateData = {
          title: `${rewardData.title} (Copy)`,
          type: rewardData.type,
          applicableFor: rewardData.applicableFor,
          startDate: rewardData.startDate,
          endDate: rewardData.endDate,
          status: rewardData.status,
          value: Number(rewardData.value),
        };
        const response = await createReward(duplicateData);
        if ('data' in response) {
          notification.success({
            message: 'Success',
            description: t('reward_created'),
            duration: 2,
            placement: 'bottomRight',
          });
        } else {
          throw new Error(t('reward_not_created') || '');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : t('unknown_error');

        notification.error({
          message: 'Error',
          description: errorMessage,
          duration: 2,
          placement: 'bottomRight',
        });
      }
    },
    [createReward, t]
  );

  const handleUpdateStatus = useCallback(
    (id: any) => {
      updateReward({
        id,
        data: {
          status: 'Inactive',
        },
      });
    },
    [updateReward]
  );

  const columns = useMemo(
    () => [
      {
        title: t('title_label'),
        dataIndex: 'title',
        key: 'title',
        width: 220,
      },
      {
        title: t('status_title'),
        dataIndex: 'status',
        key: 'status',
        render: (status: BadgeStatus) => <StatusBadge status={status} />,
        width: 161,
      },
      {
        title: t('type_title'),
        dataIndex: 'type',
        key: 'type',
        width: 161,
      },
      {
        title: t('applicable_title'),
        dataIndex: 'applicableFor',
        key: 'applicableFor',
        width: 161,
      },
      {
        title: t('duration_title'),
        dataIndex: 'duration',
        key: 'duration',
        width: 302,
      },
      {
        title: t('availed_title'),
        dataIndex: 'availed',
        key: 'availed',
        width: 161,
      },
      {
        title: t('creation_time'),
        dataIndex: 'creationTime',
        key: 'creationTime',
        width: 222,
      },
      {
        title: t('created_by'),
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: 142,
      },
      {
        title: t('action'),
        key: 'action',
        render: (item: any) => (
          <ActionDropdownMenu
            itemId={item.id}
            rewardData={item.rewardData}
            onView={(id) =>
              setIsViewRewardActive({ status: true, id: Number(id) })
            }
            onDuplicate={handleDuplicate}
            onInactive={handleUpdateStatus}
          />
        ),
        width: 82,
      },
    ],
    [t, setIsViewRewardActive, handleDuplicate, handleUpdateStatus]
  );

  // Pagination change handler
  const handleTableChange = (pagination: PaginationProps) => {
    setSearchQuery((prev) => ({
      ...prev,
      pageNum: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    }));
  };

  const handleSearch = () => {
    setSearchQuery({
      keyword,
      status,
      type,
      applicableFor,
      pageNum: 1,
      pageSize: searchQuery.pageSize,
    });
  };

  const handleResetFilter = () => {
    setKeyword('');
    setStatus('');
    setType('');
    setApplicableFor('');
    setSearchQuery({
      keyword: '',
      status: '',
      type: '',
      applicableFor: '',
      pageNum: 1,
      pageSize: 10,
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-[#1A1A1A] text-[24px] font-bold my-auto">
          {t('reward_management')}
        </h3>
        <ButtonCreate onClick={() => setIsCreateRewardActive(true)}>
          {t('create_new_reward')}
        </ButtonCreate>
      </div>

      {/* Search form */}
      <div className="flex gap-4 items-end">
        <InputField
          id="keyword"
          label={t('keyword_label')}
          placeholder={t('keyword_placeholder') || ''}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <SelectField
          label={t('status_title')}
          id="status"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
            { value: 'Draft', label: 'Draft' },
          ]}
          placeholder={t('select_placeholder') || ''}
        />
        <SelectField
          label={t('type_title')}
          id="type"
          value={type}
          onChange={setType}
          options={[
            { value: 'Point', label: 'Point' },
            { value: '', label: 'All' },
          ]}
          placeholder={t('select_placeholder') || ''}
        />

        <SelectField
          label={t('applicable_title')}
          id="applicable-for"
          value={applicableFor}
          onChange={setApplicableFor}
          options={[
            { value: 'Purchase', label: 'Purchase' },
            { value: 'Check-In', label: 'Check-In' },
          ]}
          placeholder={t('select_placeholder') || ''}
        />

        <FilterActions onSearch={handleSearch} onReset={handleResetFilter} />
      </div>
      <div className="custom-table mt-6">
        <Table
          pagination={{
            current: rewardsData?.pageNum || 1,
            pageSize: searchQuery.pageSize,
            total: rewardsData?.total || 0,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            position: ['bottomRight'],
          }}
          loading={isLoading}
          onChange={handleTableChange}
          columns={columns}
          dataSource={data}
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

export default RewardTable;
