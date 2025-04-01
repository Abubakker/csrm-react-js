import { Radio } from 'antd';
import { useTranslation } from 'react-i18next';

interface StatusRadioGroupProps {
  status: string;
  onChange: (value: string) => void;
  activeLabel?: string;
  inactiveLabel?: string;
  groupLabel?: string;
  activeId?: string;
  inactiveId?: string;
}

const StatusRadioGroup = ({ status, onChange }: StatusRadioGroupProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <label className="font-medium text-[10px] text-[#1A1A1A] uppercase leading-[16px]">
        {t('status_title')}
      </label>
      <Radio.Group
        onChange={(e) => onChange(e.target.value)}
        value={status}
        className="w-full mt-1 flex items-center gap-3"
      >
        <Radio
          value={'Active'}
          className={`border border-[#DADDEB] rounded-[10px] h-[42px] p-3 w-1/2 flex items-center ${
            status === 'Active' ? 'bg-white' : ''
          }`}
        >
          {t('active_placeholder')}
        </Radio>
        <Radio
          value={'Inactive'}
          className={`border border-[#DADDEB] rounded-[10px] h-[42px] p-3 w-1/2 flex items-center ${
            status === 'Inactive' ? 'bg-white' : ''
          }`}
        >
          {t('inactive_placeholder')}
        </Radio>
      </Radio.Group>
    </div>
  );
};

export default StatusRadioGroup;
