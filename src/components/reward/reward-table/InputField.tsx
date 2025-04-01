import { Input } from 'antd';

interface InputFieldProps {
  value: any;
  onChange: (value: any) => void;
  label: string;
  placeholder: string;
  id: string;
}

const InputField = ({
  value,
  onChange,
  label,
  id,
  placeholder,
}: InputFieldProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-medium text-[10px] text-[#1A1A1A] uppercase leading-[16px]"
      >
        {label}
      </label>
      <Input
        id="keyword"
        placeholder={placeholder}
        className="border border-[#DADDEB] rounded-[10px] h-[42px] p-3 mt-1 w-[276px] block"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
