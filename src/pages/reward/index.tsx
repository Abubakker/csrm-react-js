import RewardTable from 'components/reward/reward-table/RewardTable';
import { lazy, memo, Suspense, useState } from 'react';
import '../../components/reward/rewardDataTable.css';
import { useGetRewardsQuery } from 'store/im-chat-stores/reward.Api';

import NoRewardFound from 'components/reward/NoRewardFound';
import Loading from 'components/shared/Loading';

const ViewReward = lazy(() => import('components/reward/ViewReward'));
const CreateNewReward = lazy(
  () => import('components/reward/create-new-reward/CreateNewReward')
);

export interface ViewRewardState {
  status: boolean;
  id: number | null;
}

const Reward = () => {
  const [isCreateRewardActive, setIsCreateRewardActive] =
    useState<boolean>(false);
  const [isViewRewardActive, setIsViewRewardActive] = useState<ViewRewardState>(
    {
      status: false,
      id: null,
    }
  );

  const {
    data: rewardsData,
    isLoading,
    isSuccess,
  } = useGetRewardsQuery({ keyword: '', pageSize: 1, pageNum: 1 });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="-mx-8 -my-10 overflow-hidden min-h-[91vh] bg-white font-NotoSans">
      {isSuccess &&
        (isCreateRewardActive ? (
          <Suspense fallback={<Loading />}>
            <CreateNewReward
              setIsCreateRewardActive={setIsCreateRewardActive}
            />
          </Suspense>
        ) : isViewRewardActive.status ? (
          <Suspense fallback={<Loading />}>
            <ViewReward
              id={isViewRewardActive.id}
              setIsViewRewardActive={setIsViewRewardActive}
            />
          </Suspense>
        ) : rewardsData?.rewards?.length > 0 ? (
          <RewardTable
            setIsCreateRewardActive={setIsCreateRewardActive}
            setIsViewRewardActive={setIsViewRewardActive}
          />
        ) : (
          <NoRewardFound setIsCreateRewardActive={setIsCreateRewardActive} />
        ))}
    </div>
  );
};

export default memo(Reward);
