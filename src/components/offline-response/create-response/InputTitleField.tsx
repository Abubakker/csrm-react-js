import { Input } from 'antd';

import { useTranslation } from 'react-i18next';

interface InputTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const InputTitleField = ({ value, onChange, error }: InputTitleFieldProps) => {
  const { t } = useTranslation();

  return (
    <>
      <label className="block text-[10px] tracking-[0.5px] font-medium mb-2 uppercase font-sans ">
        {t('title')}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${t('en_btn_na')}`}
        className="w-full p-3 border border-gray-200 rounded-[10px] text-[12px] tracking-[1px] mb-6  bg-white custom-input"
      />
      {/* validation message */}
      {error && <p className="text-red-500 text-[10px]">{error}</p>}
    </>
  );
};

export default InputTitleField;
