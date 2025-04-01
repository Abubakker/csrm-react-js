import { IoIosCheckmarkCircle } from 'react-icons/io';

interface SelectableItemProps {
  label: string;
  value: string;
  selected: boolean;
  onClick: (value: string) => void;
}

const SelectableItem = ({
  label,
  value,
  selected,
  onClick,
}: SelectableItemProps) => (
  <div
    className={`w-full border border-[#EBEDF7] p-2 rounded-[10px] text-sm font-normal cursor-pointer flex justify-between items-center h-10 text-[14px] ${
      selected ? 'text-[#1677FF]' : 'text-black'
    }`}
    onClick={() => onClick(value)}
  >
    {label}
    {selected && (
      <span className="text-[20px] font-bold text-[#1677FF]">
        <IoIosCheckmarkCircle />
      </span>
    )}
  </div>
);

export default SelectableItem;
