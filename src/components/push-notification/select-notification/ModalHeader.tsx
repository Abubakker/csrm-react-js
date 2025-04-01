import { IoMdClose } from 'react-icons/io';

interface ModalHeaderProps {
  title: string;
  onCreate: () => void;
  onClose: () => void;
  createLabel: string;
}

const ModalHeader = ({
  title,
  onCreate,
  onClose,
  createLabel,
}: ModalHeaderProps) => (
  <div className="flex justify-between items-center">
    <p className="text-lg font-bold">{title}</p>
    <div className="flex gap-5 items-center -mt-3">
      <button
        className="rounded-[10px] px-3 py-[6px] font-bold text-[12px] bg-[#1677FF] hover:bg-[#086dfc] text-white tracking-[1.5px] font-sans"
        onClick={onCreate}
      >
        {createLabel}
      </button>
      <span className="text-2xl mt-[6px] cursor-pointer" onClick={onClose}>
        <IoMdClose />
      </span>
    </div>
  </div>
);

export default ModalHeader;
