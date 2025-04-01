import classNames from 'classnames';
import { ReactNode } from 'react';
import { HiOutlinePlusSm } from 'react-icons/hi';

interface ButtonCreateProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

const ButtonCreate = ({ onClick, children, className }: ButtonCreateProps) => {
  return (
    <button
      className={classNames(
        `px-6 py-3  rounded-[10px] items-center gap-[6px] 
                  bg-[#1677FF] hover:bg-[#086dfc] text-white
                text-[12px] font-bold inline-flex justify-center tracking-[1px] h-[42px]`,
        className
      )}
      onClick={onClick}
    >
      <span className="font-extrabold text-[17px] pt-[2px]">
        <HiOutlinePlusSm />
      </span>
      <span className="cursor-pointer -mt-[1px]">{children}</span>
    </button>
  );
};

export default ButtonCreate;
