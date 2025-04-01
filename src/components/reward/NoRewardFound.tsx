import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { GiftIcon } from 'assets/images';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface NoRewardFoundProps {
  setIsCreateRewardActive: Dispatch<SetStateAction<boolean>>;
}

const NoRewardFound = ({ setIsCreateRewardActive }: NoRewardFoundProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)] gap-3 flex-col">
      <img src={GiftIcon} alt="reward" />
      <h3 className="font-[#1A1A1A] font-normal text-[16px]">
        {t('no_reward_managed_yet')}
      </h3>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="font-bold text-[12px] rounded-[10px] h-[42px]"
        onClick={() => setIsCreateRewardActive(true)}
      >
        {t('create_new_reward')}
      </Button>
    </div>
  );
};

export default NoRewardFound;
