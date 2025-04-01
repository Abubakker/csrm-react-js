import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface NoTagFoundProps {
  icon: string;
  message: string;
  btnText: string;
  onClick: () => void;
}

const NoTagFound: React.FC<NoTagFoundProps> = ({
  icon,
  message,
  btnText,
  onClick,
}) => {
  return (
    <div className="flex justify-center items-center h-full gap-3 flex-col">
      <img src={icon} alt="tag" />
      <h3 className="font-[#1A1A1A] font-normal text-[16px]">{message}</h3>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="font-bold text-[12px] rounded-[10px] h-[42px]"
        onClick={onClick}
      >
        {btnText}
      </Button>
    </div>
  );
};

export default NoTagFound;
