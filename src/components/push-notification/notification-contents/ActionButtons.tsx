import { useTranslation } from 'react-i18next';
import { Button } from 'antd';

interface ActionButtonsProps {
  showModal: () => void;
  pushSubmit: (status: string) => void;
  loadingButton: string | null;
  isLoading: boolean;
}

const ActionButtons = ({
  showModal,
  pushSubmit,
  loadingButton,
  isLoading,
}: ActionButtonsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between mt-8">
      <button
        className="px-6 py-3 bg-[#CC4429] text-white rounded-[10px] hover:bg-[#dd4324] tracking-[1px] text-[12px] font-bold"
        onClick={() => showModal()}
      >
        {t('discard')}
      </button>
      <div className="flex gap-4">
        <Button
          className={`px-6 bg-transparent text-black hover:!text-black rounded-[10px] hover:bg-gray-100 tracking-[1px] text-[12px] font-bold min-h-[42px] border-none ${
            isLoading && 'cursor-not-allowed'
          }`}
          loading={loadingButton === 'Draft'}
          onClick={() => pushSubmit('Draft')}
          disabled={loadingButton === 'Scheduled'}
        >
          {loadingButton === 'Draft' ? t('creating') + '...' : t('sasd')}
        </Button>

        <Button
          className={`px-6 bg-[#1677FF] text-white rounded-[10px] hover:bg-[#086dfc] hover:!text-white tracking-[1px] text-[12px] font-bold min-h-[42px] ${
            isLoading && 'cursor-not-allowed'
          }`}
          loading={loadingButton === 'Scheduled'}
          onClick={() => pushSubmit('Scheduled')}
          disabled={loadingButton === 'Draft'}
        >
          {loadingButton === 'Scheduled'
            ? t('creating') + '...'
            : t('push_Create')}
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
