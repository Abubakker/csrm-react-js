import { Input } from 'antd';

interface InputTitleProps {
  value: any;
  onChange: (value: any) => void;
  label: string;
  placeholder: string;
  id: string;
}

const InputTitle = ({
  value,
  onChange,
  label,
  id,
  placeholder,
}: InputTitleProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-medium text-[10px] text-[#1A1A1A] uppercase leading-[16px]"
      >
        {label}
      </label>
      <Input
        id={id}
        value={value}
        onChange={(val: any) => onChange(val.target.value)}
        placeholder={placeholder || ''}
        className="border border-[#DADDEB] rounded-[10px] h-[42px] p-3 mt-1"
        required
      />
    </div>
  );
};

export default InputTitle;
