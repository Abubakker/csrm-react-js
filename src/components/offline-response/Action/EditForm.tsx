import { Input } from 'antd';
import { TextArea } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import ErrorMassage from './ErrorMassage';

interface EditFormProps {
  buttonText: string;
  responseText: string;
  onButtonTextChange: (value: string) => void;
  onResponseTextChange: (value: string) => void;
  titleError: boolean;
  responseError: boolean;
}

const EditForm = ({
  buttonText,
  responseText,
  onButtonTextChange,
  onResponseTextChange,
  titleError,
  responseError,
}: EditFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="border border-blue-300 bg-white p-5 rounded-[10px]">
      <div className="mb-6">
        <label className="block text-[10px] tracking-[0.5px] font-medium mb-2 uppercase font-sans">
          {t('title')}
        </label>
        <Input
          value={buttonText}
          onChange={(e) => onButtonTextChange(e.target.value)}
          placeholder={`${t('en_btn_na')}`}
          className="w-full p-3 border border-gray-200 rounded-[10px] text-[12px] tracking-[1px]  bg-white custom-input"
        />
        {/* validation */}
        {titleError && (
          <ErrorMassage>Please fill all title field.</ErrorMassage>
        )}
      </div>
      <div>
        <label className="block text-[10px] tracking-[0.5px] font-medium mb-2 uppercase font-sans">
          {t('response')}
        </label>
        <TextArea
          showCount
          value={responseText}
          onChange={(value) => onResponseTextChange(value)}
          maxLength={1000}
          className="offline-custom-textArea custom-textArea-form w-full p-3 border border-gray-200 rounded-[10px] text-[12px] bg-white tracking-[1px]"
          placeholder={`${t('plh_aures')}...`}
          style={{ height: 185 }}
          rows={8}
        />
        {/* validation */}
        {responseError && (
          <ErrorMassage>Please fill all response field.</ErrorMassage>
        )}
      </div>
    </div>
  );
};

export default EditForm;
