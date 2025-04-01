import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

interface DiscardModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DiscardModal = ({ isOpen, onCancel, onConfirm }: DiscardModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={isOpen}
      closable={false}
      footer={null}
      className="customModal rounded-xl bg-[#F5F6FC] overflow-hidden p-0"
    >
      {/* modal body */}
      <div className="h-full w-full rounded-xl bg-[#F5F6FC] m-0">
        {/* content */}
        <div className=" mt-5">
          <h1 className="text-[18px] font-bold">{t('dames')} </h1>
          <p className="text-[14px] pr-2 text-[#797D91]">{t('noffdc')}</p>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="bg-transparent border text-black rounded-[10px] px-6 h-[42px] text-[13px] tracking-widest font-semibold"
            onClick={onCancel}
          >
            {t('cancel')}
          </button>
          <button
            className="bg-[#CC4429] text-white rounded-[10px] px-6 h-[42px] text-[13px] tracking-widest font-semibold"
            onClick={onConfirm}
          >
            {t('delete')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DiscardModal;
