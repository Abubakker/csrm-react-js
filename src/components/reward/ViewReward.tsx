import { lazy, Suspense, useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import {
  useGetRewardDetailsQuery,
  useGetRewardPointsQuery,
  useUpdateRewardMutation,
} from 'store/im-chat-stores/reward.Api';

import { notification } from 'antd';
import { CloseCircleIcon, Edit2Icon, RewardTick } from 'assets/images';
import { ViewRewardState } from 'pages/reward';

import ReadOnlyRewardDetails from './ReadOnlyRewardDetails';
import Loading from 'components/shared/Loading';
import ViewRewardHeader from './ViewRewardHeader';
import RewardPointsTable from './RewardPointsTable';

const EditRewardForm = lazy(() => import('./EditRewardForm'));

interface ViewRewardProps {
  id: number | null;
  setIsViewRewardActive: (value: ViewRewardState) => void;
}

export interface RewardData {
  id: string;
  value: number;
  title: string;
  type: string;
  applicableFor: string;
  startDate: string;
  endDate: string;
  status: string;
  createdBy: {
    username: string;
  };
}

export interface TableData {
  key: string;
  id: string;
  username: string;
  email: string;
  availed_count: string;
}

export interface FormState {
  value: number | null;
  title: string;
  type: string;
  applicableFor: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  status: string;
}

const ViewReward = ({ id, setIsViewRewardActive }: ViewRewardProps) => {
  const { data: rewardData, isLoading: loading } = useGetRewardDetailsQuery(id);
  const { t } = useTranslation();
  const [isEditActive, setIsEditActive] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    value: null as number | null,
    title: '',
    type: '',
    applicableFor: '',
    startDate: null as Dayjs | null,
    endDate: null as Dayjs | null,
    status: '',
  });

  const [searchKeyword, setSearchKeyword] = useState('');
  const [rewardPointsData, setRewardPointsData] = useState([]);

  const [updateReward, { isLoading }] = useUpdateRewardMutation();
  const { data: rewardPoints, isSuccess: isPointSuccess } =
    useGetRewardPointsQuery({
      keyword: searchKeyword,
      id,
    });

  // Date validation
  const disabledDate = useCallback(
    (current: Dayjs) => current && current < dayjs().startOf('day'),
    []
  );

  const validateDates = useCallback(() => {
    if (
      formState.startDate &&
      formState.endDate &&
      formState.startDate.isAfter(formState.endDate)
    ) {
      notification.error({
        message: 'Error',
        description: t('start_date_must_be_before_end_date'),
      });
      return false;
    }
    return true;
  }, [formState.startDate, formState.endDate]);

  const handleUpdate = useCallback(async () => {
    if (!validateDates() || isLoading) return;

    const { title, type, applicableFor, startDate, endDate, status, value } =
      formState;

    if (
      !title ||
      !type ||
      !applicableFor ||
      !startDate ||
      !endDate ||
      !status ||
      value === null
    ) {
      notification.error({
        message: 'Error',
        description: t('all_fields_are_required'),
        duration: 2,
        placement: 'bottomRight',
      });
      return;
    }

    try {
      const prepareData = {
        title,
        type: type,
        applicableFor,
        startDate: startDate
          ? dayjs(startDate).format('YYYY-MM-DD HH:mm')
          : undefined,
        endDate: endDate
          ? dayjs(endDate).format('YYYY-MM-DD HH:mm')
          : undefined,
        status,
        value: Number(value),
      };

      const response = await updateReward({
        id: rewardData?.id || '',
        data: prepareData,
      });

      if ('data' in response) {
        notification.success({
          message: 'Success',
          description: t('reward_updated'),
          duration: 2,
          placement: 'bottomRight',
        });
        setIsEditActive(false);
      } else {
        throw new Error(t('reward_not_updated') || 'Reward update failed');
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
  }, [formState, isLoading, rewardData, t]);

  const handleCancelEdit = useCallback(() => {
    if (rewardData) {
      setFormState({
        value: rewardData.value,
        title: rewardData.title,
        type: rewardData.type,
        applicableFor: rewardData.applicableFor,
        startDate: rewardData.startDate ? dayjs(rewardData.startDate) : null,
        endDate: rewardData.endDate ? dayjs(rewardData.endDate) : null,
        status: rewardData.status,
      });
    }
    setIsEditActive(false);
  }, [rewardData]);

  useEffect(() => {
    if (rewardData) {
      setFormState({
        value: rewardData.value,
        title: rewardData.title,
        type: rewardData.type,
        applicableFor: rewardData.applicableFor,
        startDate: rewardData.startDate ? dayjs(rewardData.startDate) : null,
        endDate: rewardData.endDate ? dayjs(rewardData.endDate) : null,
        status: rewardData.status,
      });
    }
  }, [rewardData]);

  useEffect(() => {
    if (rewardPoints?.data !== rewardPointsData) {
      setRewardPointsData(rewardPoints?.data || []);
    }
  }, [rewardPoints, isPointSuccess]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <ViewRewardHeader setIsViewRewardActive={setIsViewRewardActive} />

      <div className="max-w-[1020px] mx-auto mb-12">
        <div className="p-6 rounded-[10px] border border-[#1677FF] bg-[#F7F8FC] shadow-[0px_0px_2px_0px] shadow-black">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h4 className="text-[#1A1A1A] font-bold text-[18px] my-auto">
              {t('reward_details')}
            </h4>
            {isEditActive ? (
              <div className="flex items-center gap-3">
                <span
                  onClick={handleUpdate}
                  className={isLoading ? 'cursor-wait' : 'cursor-pointer'}
                >
                  <img src={RewardTick} alt="" />
                </span>
                <span onClick={handleCancelEdit} className="cursor-pointer">
                  <img src={CloseCircleIcon} alt="" />
                </span>
              </div>
            ) : (
              <span
                onClick={() => setIsEditActive(true)}
                className="cursor-pointer"
              >
                <img src={Edit2Icon} alt="" />
              </span>
            )}
          </div>

          {isEditActive ? (
            <Suspense fallback={<div>Loading...</div>}>
              <EditRewardForm
                formState={formState}
                setFormState={setFormState}
                disabledDate={disabledDate}
              />
            </Suspense>
          ) : (
            <ReadOnlyRewardDetails rewardData={rewardData} />
          )}
        </div>
      </div>

      <RewardPointsTable
        setSearchKeyword={setSearchKeyword}
        rewardPointsData={rewardPointsData}
      />
    </div>
  );
};

export default ViewReward;
