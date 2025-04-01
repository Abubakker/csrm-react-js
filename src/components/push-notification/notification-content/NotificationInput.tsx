import { Input } from 'antd';
import { TextArea } from 'antd-mobile';

interface NotificationInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: 'input' | 'textarea';
  maxLength?: number;
  rows?: number;
}

const NotificationInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'input',
  maxLength = 240,
  rows = 8,
}: NotificationInputProps) => {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.5px] font-medium mb-2 uppercase font-sans">
        {label}
      </label>
      {type === 'input' ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="custom-input w-full p-3 border border-gray-200 rounded-[10px] text-[12px] tracking-[1px] mb-6 bg-white h-[42px]"
        />
      ) : (
        <TextArea
          showCount
          value={value}
          maxLength={maxLength}
          className="custom-textArea w-full p-3 border border-gray-200 rounded-[10px] text-[12px] bg-white tracking-[1px] relative"
          onChange={(value) => onChange(value)}
          placeholder={placeholder}
          rows={rows}
        />
      )}
    </div>
  );
};

export default NotificationInput;
