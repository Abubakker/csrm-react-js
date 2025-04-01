import { useTranslation } from 'react-i18next';

interface FooterActionsProps {
  onDiscard: () => void;
  onSaveDraft: () => void;
  onCreateAndPublish: () => void;
}

const CreateResponseFooterActions = ({
  onDiscard,
  onSaveDraft,
  onCreateAndPublish,
}: FooterActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between mt-8">
      <button
        className="px-6 py-3 bg-[#CC4429] text-white rounded-[10px] hover:bg-[#dd4324] tracking-[1px] text-[12px] font-bold"
        onClick={onDiscard}
      >
        {t('discard')}
      </button>
      <div className="flex gap-4">
        <button
          className="px-6 py-3 bg-transparent text-black rounded-[10px] hover:bg-gray-200 tracking-[1px] text-[12px] font-bold"
          onClick={onSaveDraft}
        >
          {t('sasd')}
        </button>
        <button
          className="px-6 py-3 bg-[#1677FF] text-white rounded-[10px] hover:bg-[#086dfc] tracking-[1px] text-[12px] font-bold"
          onClick={onCreateAndPublish}
        >
          {t('crap')}
        </button>
      </div>
    </div>
  );
};

export default CreateResponseFooterActions;
