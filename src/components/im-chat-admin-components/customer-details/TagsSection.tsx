import { Button, Select, Typography } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { hexToRgb } from '../helpers/utils';

interface TagsSectionProps {
  isEditing: boolean;
  selectedTags: (string | number)[];
  allTags: { label: string; value: string | number }[];
  tagList?: any;
  updateTagLoading: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onTagsChange: (tags: (string | number)[]) => void;
  onSave: () => void;
}

const { Text } = Typography;

const TagsSection = ({
  isEditing,
  selectedTags,
  allTags,
  tagList,
  updateTagLoading,
  onEdit,
  onCancelEdit,
  onTagsChange,
  onSave,
}: TagsSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2 justify-between items-center">
        <Text className="text-[12px] text-grey-50 font-medium leading-[18px] cursor-default">
          {t('user_tags')}
        </Text>
        {isEditing ? (
          <CloseOutlined onClick={onCancelEdit} className="cursor-pointer" />
        ) : (
          <EditOutlined onClick={onEdit} className="cursor-pointer" />
        )}
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        {isEditing ? (
          <Select
            mode="tags"
            allowClear
            style={{ width: '100%' }}
            placeholder={t('please_select')}
            value={selectedTags}
            onChange={onTagsChange}
            options={allTags}
          />
        ) : tagList.length > 0 ? (
          tagList.map((tag: any) => (
            <div
              key={tag.id}
              style={{
                backgroundColor: `rgba(${hexToRgb(tag.color)}, 0.1)`,
                color: tag.color,
                borderColor: `rgba(${hexToRgb(tag.color)}, 0.5)`,
              }}
              className="py-1 text-[12px] leading-[18px] px-2 h-[26px] border rounded-[6px]"
            >
              {tag.name}
            </div>
          ))
        ) : (
          <span className="text-[12px] text-[#C5C8D9]">{t('no_tags_yet')}</span>
        )}
      </div>

      {isEditing && (
        <Button
          onClick={onSave}
          type="primary"
          className="rounded w-full"
          disabled={updateTagLoading}
        >
          {t('save')}
        </Button>
      )}
    </div>
  );
};

export default TagsSection;
