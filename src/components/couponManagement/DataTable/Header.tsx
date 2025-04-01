import { LeftSquareOutlined } from '@ant-design/icons';

interface HeaderProps {
  onBack: () => void;
  label?: string;
}

const Header = ({ onBack, label }: HeaderProps) => {
  return (
    <div className="flex items-center justify-start gap-3 mb-8">
      <LeftSquareOutlined
        onClick={onBack}
        className="cursor-pointer text-[24px]"
      />
      {label && (
        <h3 className="text-[#1A1A1A] text-[24px] font-bold m-0">{label}</h3>
      )}
    </div>
  );
};

export default Header;
