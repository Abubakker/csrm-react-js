import { Dispatch, SetStateAction, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCreateRewardMutation } from 'store/im-chat-stores/reward.Api';

import InputFieldNumber from './InputFieldNumber';
import SelectField from './SelectField';
import InputTitle from './InputTitle';
import DurationField from './DurationField';
import StatusRadioGroup from './StatusRadioGroup';
import ActionButtons from './ActionButtons';

interface CreateNewRewardProps {
  setIsCreateRewardActive: Dispatch<SetStateAction<boolean>>;
}

export interface FormState {
  value: number | null;
  title: string;
  type: string;
  applicableFor: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  status: string;
}

export const disabledDate = (current: Dayjs) => {
  return current && current < dayjs().startOf('day');
};

const CreateNewReward = ({ setIsCreateRewardActive }: CreateNewRewardProps) => {
  const { t } = useTranslation();
  const [createReward, { isLoading }] = useCreateRewardMutation();

  const [formState, setFormState] = useState<FormState>({
    value: null,
    title: '',
    type: 'Point',
    applicableFor: 'Purchase',
    startDate: null,
    endDate: null,
    status: 'Active',
  });

  const validateDates = () => {
    if (
      formState.startDate &&
      formState.endDate &&
      formState.startDate.isAfter(formState.endDate)
    ) {
      notification.error({
        message: 'Error',
        description: t('start_date_must_be_before_end_date'),
        duration: 2,
        placement: 'bottomRight',
      });
      return false;
    }
    return true;
  };

  const submitData = async (data: any) => {
    try {
      const response = await createReward(data);
      if ('data' in response) {
        notification.success({
          message: 'Success',
          description: t('reward_created'),
          duration: 2,
          placement: 'bottomRight',
        });
        setIsCreateRewardActive(false);
      } else {
        throw new Error(t('reward_not_created') || 'error');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t('unknown_error');
      notification.error({
        message: 'Error',
        description: errorMessage,
        duration: 2,
        placement: 'bottomRight',
      });
    }
  };

  const handleSaveAsDraft = () => {
    if (!validateDates()) return;

    const { title, type, applicableFor, startDate, endDate, value } = formState;
    if (
      !title ||
      !type ||
      !applicableFor ||
      !startDate ||
      !endDate ||
      value === null
    ) {
      notification.error({
        message: 'Error',
        description: t('all_fields_are_required'),
        duration: 2,
        placement: 'bottomRight',
      });
      return;
    }

    submitData({
      ...formState,
      status: 'Draft',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateDates()) return;

    const { startDate, endDate } = formState;
    submitData({
      ...formState,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });
  };

  const handleFieldChange = (field: keyof FormState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <h3 className="text-[#1A1A1A] text-[24px] font-bold mb-8">
        {t('create_new_reward')}
      </h3>

      <form onSubmit={onSubmit}>
        <div className="max-w-[1020px] mx-auto">
          <div className="p-6 rounded-[10px] border border-[#1677FF] bg-[#F7F8FC] shadow-[0px_0px_2px_0px] shadow-black mb-8">
            <h4 className="text-[#1A1A1A] font-bold text-[18px]">
              {t('reward_details')}
            </h4>
            <p className="font-normal text-[14px] text-[#676B80]">
              {t('reward_details_description')}
            </p>
            <div className="pt-8 border-t border-[#DADDEB] grid md:grid-cols-2 grid-cols-1 gap-6">
              <InputTitle
                placeholder={t('title_placeholder')}
                label={t('title_label')}
                id="title"
                value={formState.title}
                onChange={(value) => handleFieldChange('title', value)}
              />

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

              <SelectField
                label={t('reward_type')}
                id="reward-type"
                value={formState.type}
                onChange={(value) => handleFieldChange('type', value)}
                options={[{ value: 'Point', label: 'Point' }]}
                placeholder={t('select_placeholder') || ''}
              />

              <InputFieldNumber
                placeholder={t('reward_value_placeholder')}
                label={t('reward_value_label')}
                id="reward-value"
                value={formState.value}
                onChange={(value) => handleFieldChange('value', value)}
              />

              <DurationField
                startDate={formState.startDate}
                endDate={formState.endDate}
                onStartDateChange={(value) =>
                  handleFieldChange('startDate', value)
                }
                onEndDateChange={(value) => handleFieldChange('endDate', value)}
                disabledDate={disabledDate}
              />

              <StatusRadioGroup
                status={formState.status}
                onChange={(value) => handleFieldChange('status', value)}
              />
            </div>
          </div>

          <ActionButtons
            onDiscard={() => setIsCreateRewardActive(false)}
            onSaveAsDraft={handleSaveAsDraft}
            isLoading={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateNewReward;
