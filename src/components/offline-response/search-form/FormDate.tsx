import { DatePicker } from 'antd';
import { Controller } from 'react-hook-form';

interface FormDateProps {
  control: any;
  name: string;

  label: string;
}

const FormDate = ({ control, label, name }: FormDateProps) => {
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
          <DatePicker
            {...field}
            id={name}
            onChange={(date) => field.onChange(date)}
            className="h-[42px] w-[180px] rounded-[10px] tracking-[1px]"
          />
        )}
      />
    </div>
  );
};
export default FormDate;
