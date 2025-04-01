import { Typography } from 'antd';

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

const { Text } = Typography;

const DetailRow = ({ label, children }: DetailRowProps) => (
  <div className="flex gap-2 w-full">
    <Text className="w-1/2 text-[12px] text-grey-50 font-medium leading-[18px] cursor-default text-[#676B80]">
      {label}
    </Text>
    <Text className="w-1/2 text-[#1A1A1A] text-[12px]">{children}</Text>
  </div>
);

export default DetailRow;
