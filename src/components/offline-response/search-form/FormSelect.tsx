import { Select } from 'antd';
import { Controller } from 'react-hook-form';

const { Option } = Select;

interface FormSelectProps {
  control: any;
  name: string;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  label: string;
}

const FormSelect = ({
  control,
  name,
  options,
  placeholder,
  label,
}: FormSelectProps) => {
  return (
    <div className="flex flex-col gap-1 custom-select">
      <label
        htmlFor={name}
        className="uppercase text-[10px] font-medium tracking-[0.5px] leading-4 font-sans"
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            id={name}
            {...field}
            placeholder={`${placeholder}`}
            className="h-[42px] w-[180px] rounded-[10px] tracking-[1px]"
            allowClear
          >
            {options.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                <span className="capitalize">{opt.label}</span>
              </Option>
            ))}
          </Select>
        )}
      />
    </div>
  );
};

export default FormSelect;
