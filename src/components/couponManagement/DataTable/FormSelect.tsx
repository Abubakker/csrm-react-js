import { Select } from 'antd';
import { ReactNode } from 'react';
import { Control, Controller } from 'react-hook-form';

interface FormSelectProps {
  label?: string;
  placeholder?: string;
  name: string;
  control: Control;
  children: ReactNode;
}

const FormSelect = ({
  label,
  name,
  control,
  placeholder,
  children,
}: FormSelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className="uppercase text-[10px] font-medium tracking-[0.5px] leading-4 font-sans"
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            className="h-[42px] w-[180px] rounded-[10px] custom-select tracking-[1px]"
            allowClear
            id={name}
            placeholder={placeholder}
          >
            {children}
          </Select>
        )}
      />
    </div>
  );
};
export default FormSelect;
