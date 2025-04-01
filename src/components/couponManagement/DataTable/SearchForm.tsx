import { BaseSyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Control } from 'react-hook-form';
import { Select } from 'antd';
import FormSelect from './FormSelect';
import FormActions from './FormActions';
import FormInput from './FormInput';
import { Status } from './CouponDataTable';

const { Option } = Select;

interface SearchFormProps {
  control: Control;
  handleSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  handleReset: () => void;
}

const SearchForm = ({
  control,
  handleSubmit,
  handleReset,
}: SearchFormProps) => {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 items-end mb-4 flex-wrap"
    >
      <FormInput
        name="keyword"
        control={control}
        label={`${t('keyword')}`}
        placeholder={`${t('enterKeyword')}`}
      />

      <div className="custom-select">
        <FormSelect name="status" control={control} label={`${t('status')}`}>
          <Option value={Status.Draft}>{t('draft')}</Option>
          <Option value={Status.Active}>{t('Active')}</Option>
          <Option value={Status.Inactive}>{t('Inactive')}</Option>
          <Option value={Status.Expired}>{t('Expired')}</Option>
        </FormSelect>
      </div>
      <div className="custom-select">
        <FormSelect
          name="applicable"
          control={control}
          label={`${t('appFor')}`}
        >
          <Option value="Draft">{t('draft')}</Option>
          <Option value="product">{t('product')}</Option>
          <Option value="category">{t('product_categories')}</Option>
        </FormSelect>
      </div>

      <FormActions
        onReset={handleReset}
        resetLabel={`${t('resetAllFilter')}`}
        submitLabel={`${t('search')}`}
      />
    </form>
  );
};

export default SearchForm;
