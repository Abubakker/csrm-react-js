import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosCheckmarkCircle,
} from 'react-icons/io';

interface ProductDropdownProps {
  items: Array<{ label: string; value: string }>;
  selectedType: string;
  onSelect: (value: string) => void;
}

const ProductDropdown = ({
  items,
  selectedType,
  onSelect,
}: ProductDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="border border-[#EBEDF7] rounded-[10px]">
      <div
        className="w-full p-2 text-sm font-normal flex items-center justify-between cursor-pointer text-[14px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {t('push_Products')}
        {isOpen ? (
          <IoIosArrowUp className="text-[19px]" />
        ) : (
          <IoIosArrowDown className="text-[19px]" />
        )}
      </div>

      {isOpen && (
        <div>
          {items.map((item) => (
            <div
              key={item.value}
              className={`w-full p-1 text-sm font-normal flex items-center justify-between pl-5 mt-1 hover:bg-slate-100 cursor-pointer text-[14px] ${
                selectedType === item.value
                  ? 'text-[#1677FF]'
                  : 'text-[#3F4252]'
              }`}
              onClick={() => onSelect(item.value)}
            >
              {item.label}
              {selectedType === item.value && (
                <span className="text-[20px] font-bold text-[#1677FF]">
                  <IoIosCheckmarkCircle />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDropdown;
