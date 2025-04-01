import { Input } from 'antd';
import { Controller } from 'react-hook-form';

interface FormInputProps {
  control: any;
  name: string;
  placeholder: string;
  label: string;
}

const FormInput = ({ control, name, placeholder, label }: FormInputProps) => {
  return (
    <div className="flex flex-col gap-1">
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
          <Input
            {...field}
            id={name}
            placeholder={`${placeholder}`}
            className="h-[42px] w-[300px] rounded-[10px] tracking-[1px] custom-input"
          />
        )}
      />
    </div>
  );
};

export default FormInput;
