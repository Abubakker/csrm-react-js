import { Spin } from 'antd';
import TagTable, { Tag } from './TagTable';
import NoTagFound from './NoTagFound';
import { TagType } from 'pages/tags/Tags';

interface TagsSectionProps {
  type: TagType;
  tags: Tag[];
  isLoading: boolean;
  isSuccess: boolean;
  btnText: string;
  message: string;
  icon: string;
  onOpenModal: (type: TagType) => void;
  onUpdateTag: (tag: Tag) => void;
}

const TagsSection = ({
  type,
  tags,
  isLoading,
  isSuccess,
  btnText,
  message,
  icon,
  onOpenModal,
  onUpdateTag,
}: TagsSectionProps) => {
  if (isLoading) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return isSuccess && tags.length > 0 ? (
    <TagTable
      btnText={btnText}
      onClick={() => onOpenModal(type)}
      type={type}
      handleUpdate={onUpdateTag}
    />
  ) : (
    <NoTagFound
      icon={icon}
      message={message}
      btnText={btnText}
      onClick={() => onOpenModal(type)}
    />
  );
};

export default TagsSection;
