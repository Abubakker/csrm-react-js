import { HiOutlinePlusSm } from 'react-icons/hi';

const CreateResponseButton = ({ setIsCreated, buttonText }: any) => {
  return (
    <div>
      <div
        className={`px-6 py-3 rounded-[10px] items-center gap-[6px] 
                             bg-[#1677FF] hover:bg-[#086dfc] text-white
                           text-[12px] font-bold inline-flex justify-center tracking-[1px] -mt-2 cursor-pointer`}
        onClick={() => setIsCreated(true)}
      >
        <span className="font-extrabold text-[16px] mt-[1px]">
          <HiOutlinePlusSm />
        </span>
        <span className=" ">{buttonText}</span>
      </div>
    </div>
  );
};

export default CreateResponseButton;
