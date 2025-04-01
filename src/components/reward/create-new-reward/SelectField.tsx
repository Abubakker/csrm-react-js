import { Select } from 'antd';

interface SelectFieldProps {
  label: string;
  id: string;
  value: any;
  onChange: (value: any) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

const SelectField = ({
  label,
  id,
  value,
  onChange,
  options,
  placeholder,
}: SelectFieldProps) => (
  <div className="custom-select">
    <label
      htmlFor={id}
      className="font-medium text-[10px] text-[#1A1A1A] uppercase leading-[16px]"
    >
      {label}
    </label>
    <Select
      id={id}
      value={value}
      onChange={(value) => onChange(value)}
      className="w-full mt-1 h-[42px]"
      placeholder={placeholder}
      options={options}
    />
  </div>
);

export default SelectField;
