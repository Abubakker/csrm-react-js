import React from 'react';
import { useTranslation } from 'react-i18next';

interface FooterActionProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const FooterAction: React.FC<FooterActionProps> = ({ onCancel, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end mt-8 gap-2">
      <button
        className="px-6 py-3 text-black rounded-[10px] bg-gray-200 hover:bg-gray-300 tracking-[1px] text-[12px] font-bold"
        onClick={onCancel}
      >
        {t('cancel')}
      </button>
      <button
        className="px-6 py-3 bg-[#1677FF] text-white rounded-[10px] hover:bg-[#086dfc] tracking-[1px] text-[12px] font-bold"
        onClick={onConfirm}
      >
        {t('update')}
      </button>
    </div>
  );
};

export default FooterAction;
