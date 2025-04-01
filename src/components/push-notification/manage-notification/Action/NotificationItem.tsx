import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface NotificationItemProps {
  item: {
    id: number;
    name: string;
    subTitle: string;
    content: JSX.Element;
  };
  onToggle: (id: number) => void;
  openContentTab: number | null;
}
const NotificationItem = ({
  item,
  onToggle,
  openContentTab,
}: NotificationItemProps) => {
  return (
    <article
      className={`bg-[#FFFFFF] rounded-[10px] p-5  ${
        openContentTab === item?.id && 'border border-[#1677FF]'
      }`}
      key={item?.name}
    >
      <div
        className="w-full  p-2 rounded text-sm font-normal flex items-start justify-between cursor-pointer"
        onClick={() => onToggle(item.id)}
      >
        <span>
          <h1 className="text-[18px] font-bold">{item?.name}</h1>
          <p className="text-[14px] font-normal text-[#676B80] -mt-1">
            {item?.subTitle}
          </p>
        </span>
        {openContentTab === item?.id ? (
          <span className="text-[20px] font-bold">
            <IoIosArrowUp />
          </span>
        ) : (
          <span className="text-[20px] font-bold">
            <IoIosArrowDown />
          </span>
        )}
      </div>

      {/* Dropdown Content */}
      {openContentTab === item.id && <div className="">{item.content}</div>}
    </article>
  );
};
export default NotificationItem;
