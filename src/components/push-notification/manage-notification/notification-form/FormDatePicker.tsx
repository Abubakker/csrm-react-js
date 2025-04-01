import { DatePicker } from 'antd';
import { Control, Controller } from 'react-hook-form';

interface FormDatePickerProps {
  label?: string;
  name: string;
  control: Control;
  format?: string;
}

const FormDatePicker = ({
  label,
  name,
  control,

  format = 'YYYY-MM-DD',
}: FormDatePickerProps) => {
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
          <DatePicker
            {...field}
            id={name}
            className="h-[42px] w-[180px] rounded-[10px] tracking-[1px]"
            format={format}
          />
        )}
      />
    </div>
  );
};
export default FormDatePicker;
