import { Button, Input } from 'antd';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  keyword: string;
  placeholder: string;
  onSearch: () => void;
  onReset: () => void;
  onKeywordChange: (value: string) => void;
}

const SearchBar = ({
  keyword,
  onSearch,
  onReset,
  onKeywordChange,
}: SearchBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-4 items-end mt-6">
      <div>
        <label
          htmlFor="keyword"
          className="font-medium text-[10px] text-[#1A1A1A] uppercase leading-[16px]"
        >
          {t('keyword_label')}
        </label>
        <Input
          id="keyword"
          placeholder={`${t('search_by_tag_title')}`}
          className="border border-[#DADDEB] rounded-[10px] h-[42px] p-3 mt-1"
          value={keyword}
          onChange={(e) => {
            const value = e.target.value;
            onKeywordChange(value);
            if (!value) onReset();
          }}
          onPressEnter={onSearch}
          allowClear
        />
      </div>

      <Button
        type="primary"
        onClick={onSearch}
        className="h-[42px] rounded-[10px] font-bold text-[12px]"
      >
        {t('search_btn')}
      </Button>
    </div>
  );
};

export default SearchBar;
