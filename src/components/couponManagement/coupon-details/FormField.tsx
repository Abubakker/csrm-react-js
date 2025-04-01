import { Input, Select, InputNumber } from 'antd';

interface FormFieldProps {
  label?: string;
  type: 'input' | 'select' | 'number';
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  options?: Array<{ value: any; label: string }>;
  disabled?: boolean;
  mode?: 'tags';
  min?: number;
  precision?: number;
  readOnly?: boolean;
}

const FormField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  options,
  disabled,
  mode,
  min = 1,
  precision = 0,
  readOnly = false,
}: FormFieldProps) => {
  return (
    <div>
      {label && (
        <label className="block text-[10px] tracking-[0.5px] font-medium mb-2 uppercase font-sans">
          {label}
        </label>
      )}

      {type === 'input' && (
        <Input
          readOnly={readOnly}
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          placeholder={placeholder}
          className="custom-input w-full p-3 border border-[#DADDEB] rounded-[10px] text-[12px] tracking-[1px] bg-white h-[42px]"
        />
      )}

      {type === 'select' && (
        <Select
          mode={mode}
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          className="w-full rounded-[10px] text-[12px] tracking-[1px] font-medium min-h-[42px] custom-select"
          onChange={onChange}
          options={options}
        />
      )}

      {type === 'number' && (
        <InputNumber
          readOnly={readOnly}
          value={value}
          onChange={(val) => {
            if (val === null || val < 0) return;
            onChange(val);
          }}
          placeholder={placeholder}
          className="custom-input w-full p-2 border border-[#DADDEB] rounded-[10px] text-[12px] tracking-[1px] bg-white h-[42px]"
          min={min}
          precision={precision}
        />
      )}
    </div>
  );
};

export default FormField;
