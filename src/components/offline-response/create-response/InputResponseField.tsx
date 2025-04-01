import { TextArea } from 'antd-mobile';
import { useTranslation } from 'react-i18next';

interface InputResponseFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const InputResponseField = ({
  value,
  onChange,

  error,
}: InputResponseFieldProps) => {
  const { t } = useTranslation();

  return (
    <>
      <label className="block text-[10px] tracking-[0.5px] font-medium mb-2 uppercase font-sans">
        {t('response')}
      </label>
      <TextArea
        showCount
        maxLength={1000}
        className="offline-custom-textArea custom-textArea-form w-full p-3 border border-gray-200 rounded-[10px] text-[12px]  bg-white tracking-[1px] relative"
        value={value}
        onChange={onChange}
        placeholder={`${t('plh_aures')}...`}
        style={{ height: 314 }}
        rows={15}
      />

      {/* validation message */}
      {error && <p className="text-red-500 text-[10px]">{error}</p>}
    </>
  );
};

export default InputResponseField;
