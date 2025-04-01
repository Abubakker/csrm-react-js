import React from 'react';

const SubmitButton = ({btnText}:{btnText:string}) => {
    return (
        <button
                type="submit"
                className="h-[42px] rounded-[10px] px-6 tracking-[1px] font-bold leading-[18px] bg-[#1677FF] hover:bg-[#086dfc] hover:text-white text-white text-[12px]"
              >
              {btnText}
              </button>
    );
};

export default SubmitButton;