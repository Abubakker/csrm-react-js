import { Radio } from 'antd';

interface RadioGroupProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}

const RadioGroup = ({ options, value, onChange }: RadioGroupProps) => {
  return (
    <Radio.Group
      onChange={(e) => onChange(e.target.value)}
      value={value}
      className="grid grid-cols-2 gap-3"
    >
      {options.map((option) => (
        <span
          key={option.value}
          className={`flex items-center tracking-[1px] h-[42px] ${
            value === option.value
              ? 'bg-white border border-[#DADDEB]'
              : 'bg-transparent border border-[#DADDEB]'
          } rounded-[10px] px-3 w-full`}
        >
          <Radio
            value={option.value}
            className="text-[12px] font-medium tracking-[1px]"
          >
            {option.label}
          </Radio>
        </span>
      ))}
    </Radio.Group>
  );
};

export default RadioGroup;
