import { Input } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { RewardData } from './ViewReward';

interface ReadOnlyRewardDetailsProps {
  rewardData: Partial<RewardData> & {
    title: string;
    applicableFor: string;
    type: string;
    value: number;
    status: string;
  };
}

const ReadOnlyRewardDetails = ({ rewardData }: ReadOnlyRewardDetailsProps) => {
  const { t } = useTranslation();

  const ReadOnlyField = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <div>
      <label className="font-medium text-[10px] text-[#1A1A1A] uppercase leading-[16px]">
        {label}
      </label>
      <Input
        value={value?.toString()}
        className="border focus:border-[#DADDEB] focus:shadow-none  hover:border-[#DADDEB] border-[#DADDEB] rounded-[10px] h-[42px] p-3 mt-1"
        readOnly
      />
    </div>
  );

  const DurationDisplay = () => (
    <div className="flex gap-3 items-end">
      <div className="w-1/2">
        <ReadOnlyField
          label={t('duration_title')}
          value={`${dayjs(rewardData.startDate).format('YYYY-MM-DD')} ${dayjs(
            rewardData.startDate
          ).format('HH:mm')}`}
        />
      </div>
      <div className="w-1/2">
        <ReadOnlyField
          label=""
          value={`${dayjs(rewardData.endDate).format('YYYY-MM-DD')} ${dayjs(
            rewardData.endDate
          ).format('HH:mm')}`}
        />
      </div>
    </div>
  );

  const StatusDisplay = () => (
    <div>
      <label className="font-medium text-[10px] text-[#1A1A1A] uppercase leading-[16px]">
        {t('status_title')}
      </label>
      <div
        className={`border border-[#DADDEB] rounded-[10px] h-[42px] p-3 w-1/2 flex items-center bg-white`}
      >
        {t(
          rewardData.status === 'Active'
            ? 'active_placeholder'
            : 'inactive_placeholder'
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-8 border-t border-[#DADDEB] grid md:grid-cols-2 grid-cols-1 gap-6">
      <ReadOnlyField label={t('title_label')} value={rewardData.title} />
      <ReadOnlyField
        label={t('applicable_title')}
        value={rewardData.applicableFor}
      />
      <ReadOnlyField label={t('reward_type')} value={rewardData.type} />
      <ReadOnlyField label={t('reward_value_label')} value={rewardData.value} />
      <DurationDisplay />
      <StatusDisplay />
    </div>
  );
};

export default ReadOnlyRewardDetails;
