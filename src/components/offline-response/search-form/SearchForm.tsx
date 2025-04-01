import SubmitButton from 'components/shared/SubmitButton';
import { useTranslation } from 'react-i18next';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormDate from './FormDate';
import { Control, FieldValues } from 'react-hook-form';
import { BaseSyntheticEvent } from 'react';

interface SearchFormProps {
  control: Control<FieldValues, any>;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  onReset: () => void;
}

const SearchForm = ({ control, onSubmit, onReset }: SearchFormProps) => {
  const { t } = useTranslation();
  const statusOptions = [
    { value: '1', label: t('draft') },
    { value: '2', label: t('unpublished') },
    { value: '3', label: t('published') },
  ];

  const languageOptions = [
    { value: 'en', label: t('english') },
    { value: 'ja', label: t('japanese') },
    { value: 'zh_CN', label: t('zh_CN') },
    { value: 'zh_TW', label: t('traditional_chinese') },
  ];

  return (
    <form onSubmit={onSubmit} className="flex gap-4 items-end mb-4 flex-wrap">
      <FormInput
        control={control}
        name="keyword"
        placeholder={t('enterKeyword')}
        label={t('keyword')}
      />
      <FormSelect
        label={t('status')}
        control={control}
        name="status"
        options={statusOptions}
        placeholder={t('allSelect')}
      />
      <FormSelect
        label={t('language')}
        control={control}
        name="language"
        options={languageOptions}
        placeholder={t('allSelect')}
      />

      <FormDate label={t('off_cred')} control={control} name="date" />

      <SubmitButton btnText={t('search')} />
      <button
        type="button"
        onClick={onReset}
        className="h-[42px] rounded-[10px] px-6 border border-black bg-white hover:bg-slate-100"
      >
        {t('resetAllFilter')}
      </button>
    </form>
  );
};

export default SearchForm;
