import React from 'react';
import { Input, Button } from 'antd';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  onSearch?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const SearchBar = ({ onSearch, onChange, value }: SearchBarProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-4 items-end mt-6">
      <div>
        <label
          htmlFor="keyword"
          className="font-medium text-[10px] text-[#1A1A1A] uppercase leading-[16px]"
        >
          {t('search_btn')}
        </label>
        <Input
          id="keyword"
          placeholder={`${t('search_placeholder')}`}
          className="border border-[#DADDEB] rounded-[10px] h-[42px] p-3 mt-1"
          value={value}
          onChange={onChange}
        />
      </div>
      <Button
        type="primary"
        className="h-[42px] rounded-[10px] font-bold text-[12px]"
        onClick={onSearch}
      >
        {t('search_btn')}
      </Button>
    </div>
  );
};

export default SearchBar;
