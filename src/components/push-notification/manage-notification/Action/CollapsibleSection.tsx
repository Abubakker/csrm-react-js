import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface CollapsibleSectionProps {
  title: string;
  subtitle: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const CollapsibleSection = ({
  isOpen,
  onToggle,
  children,
  title,
  subtitle,
}: CollapsibleSectionProps) => {
  return (
    <div className=" mb-6">
      <div
        className={`bg-[#FFFFFF] rounded-lg p-5 
              ${isOpen && 'border border-[#1677FF]'}
             }`}
      >
        <div
          className="w-full  p-2 rounded text-sm font-normal flex items-start justify-between cursor-pointer"
          onClick={() => onToggle(!isOpen)}
        >
          <span>
            <h1 className="text-[18px] font-bold">{title}</h1>
            <p className="text-[14px] font-normal text-[#676B80] -mt-1">
              {subtitle}
            </p>
          </span>
          {isOpen ? (
            <span className="text-[20px] font-bold">
              <IoIosArrowUp />
            </span>
          ) : (
            <span className="text-[20px] font-bold">
              <IoIosArrowDown />
            </span>
          )}
        </div>

        {/* show content  */}
        {isOpen && (
          <div className="px-2 border-t border-gray-200 pt-5">{children}</div>
        )}
      </div>
    </div>
  );
};

export default CollapsibleSection;
