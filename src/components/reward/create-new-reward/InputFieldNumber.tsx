import { InputNumber } from 'antd';

interface InputFieldNumberProps {
  value: any;
  onChange: (value: any) => void;
  label: string;
  placeholder: string;
  id: string;
}

const InputFieldNumber = ({
  value,
  onChange,
  label,
  placeholder,
  id,
}: InputFieldNumberProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-medium text-[10px] text-[#1A1A1A] uppercase leading-[16px]"
      >
        {label}
      </label>
      <InputNumber
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ''}
        className="border border-[#DADDEB] rounded-[10px] h-[42px] p-3 mt-1 w-full flex items-center"
        required
        min={0}
        precision={0}
      />
    </div>
  );
};

export default InputFieldNumber;
