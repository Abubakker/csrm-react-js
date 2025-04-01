import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlinePlusSm } from 'react-icons/hi';
import { Modal } from 'antd';

import ModalHeader from './ModalHeader';
import SelectableItem from './SelectableItem';
import ProductDropdown from './ProductDropdown';
import '../style.css';

const SelectNotification = ({
  setIsSelectedType,
}: {
  setIsSelectedType: Dispatch<SetStateAction<string | null>>;
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('general');

  const productItems = [
    { label: t('push_Order'), value: 'order_status' },
    { label: t('push_Promotion'), value: 'product_promotion' },
  ];

  const handleCreated = () => {
    if (selectedType) {
      setIsSelectedType(selectedType);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        className="px-6 py-3 rounded-[10px] bg-[#1677FF] hover:bg-[#086dfc] text-white text-[12px] font-bold inline-flex justify-center items-center gap-[6px] h-[42px] tracking-[1px]"
        onClick={() => setIsModalOpen(true)}
      >
        <HiOutlinePlusSm className="text-[16px] mt-[1px]" />
        <span className="-mt-[1px]">{t('push_newNoti')}</span>
      </button>

      {/* Selection Modal */}
      <Modal
        open={isModalOpen}
        footer={null}
        closable={false}
        centered
        className="rounded-[10px]-xl overflow-hidden customModal"
        onCancel={() => setIsModalOpen(false)}
      >
        <div className="space-y-3">
          {/* Modal Header */}
          <ModalHeader
            title={t('push_selectT')}
            onCreate={handleCreated}
            onClose={() => setIsModalOpen(false)}
            createLabel={t('push_Create')}
          />

          {/* Notification Type Selection */}
          <SelectableItem
            label={t('push_General')}
            value="general"
            selected={selectedType === 'general'}
            onClick={setSelectedType}
          />

          {/* Product Dropdown */}
          <ProductDropdown
            items={productItems}
            selectedType={selectedType}
            onSelect={setSelectedType}
          />

          {/* Payment Option */}
          <SelectableItem
            label={t('push_Payment')}
            value="payment"
            selected={selectedType === 'payment'}
            onClick={setSelectedType}
          />
        </div>
      </Modal>
    </div>
  );
};

export default SelectNotification;
