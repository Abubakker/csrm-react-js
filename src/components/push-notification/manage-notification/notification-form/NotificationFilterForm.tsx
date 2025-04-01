import { useTranslation } from 'react-i18next';

import { Controller, FieldValues, Control } from 'react-hook-form';
import { DatePicker, Select } from 'antd';
import { MessageType, NotificationStatus } from '../ManageNotification';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormDatePicker from './FormDatePicker';
import FormActions from './FormActions';

interface NotificationFilterFormProps {
  control: Control<FieldValues, any>;
  onSubmit: () => void;
  onReset: () => void;
}

const { Option } = Select;

const NotificationFilterForm = ({
  control,
  onSubmit,
  onReset,
}: NotificationFilterFormProps) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="flex gap-4 items-end mb-4 flex-wrap">
      {/* keyword */}
      <FormInput
        name="keyword"
        label={`${t('keyword')}`}
        placeholder={`${t('enterKeyword')}`}
        control={control}
      />

      {/* status */}
      <FormSelect
        label={`${t('status')}`}
        placeholder={`${t('allSelect')}`}
        name="status"
        control={control}
      >
        <Option value={NotificationStatus.Draft}>{t('draft')}</Option>
        <Option value={NotificationStatus.Published}>{t('published')}</Option>
        <Option value={NotificationStatus.Published}>{t('unpublish')}</Option>
        <Option value={NotificationStatus.Scheduled}>{t('scheduled')}</Option>
        <Option value={NotificationStatus.Failed}>{t('failed')}</Option>
      </FormSelect>

      {/* Message type */}
      <FormSelect
        label={`${t('mesType')}`}
        placeholder={`${t('allSelect')}`}
        name="messageType"
        control={control}
      >
        <Option value={MessageType.General}>{t('push_General')}</Option>
        <Option value={MessageType.ProductPromotion}>
          {t('push_Promotion')}
        </Option>
        <Option value={MessageType.OrderStatus}>{t('push_Order')}</Option>
        <Option value={MessageType.Payment}>{t('push_Payment')}</Option>
      </FormSelect>

      {/* language */}
      <FormSelect
        label={`${t('language')}`}
        placeholder={`${t('allSelect')}`}
        name="language"
        control={control}
      >
        <Option value="English">{t('english')}</Option>
        <Option value="Japanese">{t('japanese')}</Option>
        <Option value="simplified Chinese">{t('chinese')}</Option>
        <Option value="Traditional Chinese">{t('traditional_chinese')}</Option>
      </FormSelect>

      {/* filter by date */}
      <FormDatePicker
        name="creationDate"
        label={`${t('off_cred')}`}
        control={control}
      />

      {/* push date */}
      <FormDatePicker
        name="pushDate"
        label={`${t('pushDate')}`}
        control={control}
      />

      {/* submit button */}
      <FormActions
        onReset={onReset}
        submitLabel={`${t('search')}`}
        resetLabel={`${t('resetAllFilter')}`}
      />
    </form>
  );
};

export default NotificationFilterForm;
