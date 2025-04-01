import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { Status } from './EditNotification';

interface ModelFooterProps {
  onCancel: () => void;
  onSave: ({ status }: { status: string }) => Promise<void>;
  loading: string | null;
}

const ModelFooter = ({ loading, onSave, onCancel }: ModelFooterProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between mt-8">
      <button
        className="px-6 py-3 bg-[#CC4429] text-white rounded-[10px] hover:bg-[#dd4324] tracking-[1px] text-[12px] font-bold"
        onClick={onCancel}
      >
        {t('cancel')}
      </button>
      <div className="flex gap-4">
        <Button
          className={`px-6 bg-transparent text-black hover:!text-black rounded-[10px] hover:bg-gray-100 tracking-[1px] text-[12px] font-bold min-h-[42px] border-none ${
            loading && 'cursor-not-allowed'
          }`}
          loading={loading === Status.Draft}
          disabled={loading === Status.Scheduled}
          onClick={() => onSave({ status: Status.Draft })}
        >
          {loading === Status.Draft
            ? `${t('updating')}...`
            : t('DraftandUpdate')}
        </Button>

        <Button
          className={`px-6 bg-[#1677FF] text-white rounded-[10px] hover:bg-[#086dfc] hover:!text-white tracking-[1px] text-[12px] font-bold min-h-[42px] ${
            loading && 'cursor-not-allowed'
          }`}
          loading={loading === Status.Scheduled}
          onClick={() => onSave({ status: Status.Scheduled })}
          disabled={loading === Status.Draft}
        >
          {loading === Status.Scheduled ? `${t('updating')}...` : t('update')}
        </Button>
      </div>
    </div>
  );
};

export default ModelFooter;
