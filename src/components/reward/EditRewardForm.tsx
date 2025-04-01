import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import DurationField from './create-new-reward/DurationField';
import InputFieldNumber from './create-new-reward/InputFieldNumber';
import InputTitle from './create-new-reward/InputTitle';
import SelectField from './create-new-reward/SelectField';
import StatusRadioGroup from './create-new-reward/StatusRadioGroup';
import { FormState } from './ViewReward';
import { Dayjs } from 'dayjs';

interface EditRewardFormProps {
  formState: FormState;
  setFormState: Dispatch<SetStateAction<FormState>>;
  disabledDate: (current: Dayjs) => boolean;
}

const EditRewardForm = ({
  formState,
  setFormState,
  disabledDate,
}: EditRewardFormProps) => {
  const { t } = useTranslation();

  const handleFieldChange = (field: keyof FormState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pt-8 border-t border-[#DADDEB] grid md:grid-cols-2 grid-cols-1 gap-6">
      {/* Title */}
      <InputTitle
        placeholder={t('title_placeholder')}
        label={t('title_label')}
        id="title"
        value={formState.title}
        onChange={(value) => handleFieldChange('title', value)}
      />

      {/* Applicable For */}
      <SelectField
        label={t('applicable_title')}
        id="applicable-for"
        value={formState.applicableFor}
        onChange={(value) => handleFieldChange('applicableFor', value)}
        options={[
          { value: 'Purchase', label: 'Purchase' },
          { value: 'Check-In', label: 'Check-In' },
        ]}
        placeholder={t('select_placeholder') || ''}
      />

      {/* Reward Type */}
      <SelectField
        label={t('reward_type')}
        id="reward-type"
        value={formState.type}
        onChange={(value) => handleFieldChange('type', value)}
        options={[{ value: 'Point', label: 'Point' }]}
        placeholder={t('select_placeholder') || ''}
      />

      {/* Reward Value */}
      <InputFieldNumber
        placeholder={t('reward_value_placeholder')}
        label={t('reward_value_label')}
        id="reward-value"
        value={formState.value}
        onChange={(value) => handleFieldChange('value', value)}
      />

      {/* Duration */}
      <DurationField
        startDate={formState.startDate}
        endDate={formState.endDate}
        onStartDateChange={(value) => handleFieldChange('startDate', value)}
        onEndDateChange={(value) => handleFieldChange('endDate', value)}
        disabledDate={disabledDate}
      />

      {/* Status */}
      <StatusRadioGroup
        status={formState.status}
        onChange={(value) => handleFieldChange('status', value)}
      />
    </div>
  );
};
export default EditRewardForm;
