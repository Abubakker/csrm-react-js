import { LeftSquareOutlined } from '@ant-design/icons';
import { ViewRewardState } from 'pages/reward';
import { useTranslation } from 'react-i18next';

interface ViewRewardHeaderProps {
  setIsViewRewardActive: (value: ViewRewardState) => void;
}

const ViewRewardHeader = ({ setIsViewRewardActive }: ViewRewardHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-start gap-3 mb-8">
      <LeftSquareOutlined
        onClick={() => setIsViewRewardActive({ status: false, id: null })}
        className="cursor-pointer text-[24px]"
      />
      <h3 className="text-[#1A1A1A] text-[24px] font-bold m-0">
        {t('view_reward')}
      </h3>
    </div>
  );
};

export default ViewRewardHeader;
