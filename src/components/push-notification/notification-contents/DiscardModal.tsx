import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';

interface DiscardModalProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  handleDiscard: () => void;
}

const DiscardModal = ({
  isModalOpen,
  handleCancel,
  handleDiscard,
}: DiscardModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      open={isModalOpen}
      closable={false}
      footer={null}
      className="rounded-xl overflow-hidden p-0"
    >
      {/* modal body */}
      <div className="h-full w-full rounded-xl m-0">
        {/* content */}
        <div className=" mt-5">
          <h1 className="text-[18px] font-bold">{t('pushDiscardTitle')} </h1>
          <p className="text-[14px] pr-2 text-[#797D91]">
            {t('pushDiscardSubTitle')}
          </p>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="bg-transparent border text-black rounded-[10px] px-6 h-[42px] text-[13px] tracking-widest font-semibold"
            onClick={() => handleCancel()}
          >
            {t('cancel')}
          </button>
          <button
            className="bg-[#CC4429] text-white rounded-[10px] px-6 h-[42px] text-[13px] tracking-widest font-semibold "
            onClick={() => handleDiscard()}
          >
            {t('delete')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DiscardModal;
