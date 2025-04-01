import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface CouponSectionProps {
  id: number;
  name: string;
  subTitle: string;
  content: React.ReactNode;
  isOpen: boolean;
  onToggle: (id: number) => void;
}

const CouponSection = ({
  id,
  name,
  subTitle,
  content,
  isOpen,
  onToggle,
}: CouponSectionProps) => (
  <div
    className={`bg-[#F5F6FC] rounded-[10px] p-4 ${
      isOpen && 'border border-[#1677FF]'
    }`}
  >
    <div
      className="w-full p-2 rounded text-sm font-normal flex items-start justify-between cursor-pointer"
      onClick={() => onToggle(isOpen ? 0 : id)}
    >
      <span>
        <h1 className="text-[18px] font-bold">{name}</h1>
        <p className="text-[14px] font-normal text-[#676B80] -mt-1">
          {subTitle}
        </p>
      </span>
      <span className="text-[20px] font-bold">
        {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </span>
    </div>
    {isOpen && <div className="">{content}</div>}
  </div>
);

export default CouponSection;
