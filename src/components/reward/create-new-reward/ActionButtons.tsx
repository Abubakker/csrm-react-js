import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

interface ActionButtonsProps {
  onDiscard: () => void;
  onSaveAsDraft: () => void;
  isLoading: boolean;
}

const ActionButtons = ({
  onDiscard,
  onSaveAsDraft,
  isLoading,
}: ActionButtonsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 justify-between">
      <Button
        type="primary"
        className="h-[42px] rounded-[10px] font-bold text-[12px] !bg-[#CC4429]"
        onClick={onDiscard}
        danger
      >
        {t('discard_btn')}
      </Button>
      <div className="flex gap-6 items-center">
        <Button
          type="link"
          className="font-bold text-[#1A1A1A] text-[12px]"
          onClick={onSaveAsDraft}
        >
          {t('save_as_draft')}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          className="h-[42px] rounded-[10px] font-bold text-[12px] bg-[#1677FF]"
          disabled={isLoading}
        >
          {t('create_btn')}
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
