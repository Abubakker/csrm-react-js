import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

interface ActionButtonsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const ActionButtons = ({
  isEditing,
  isSubmitting,
  onSave,
  onCancel,
}: ActionButtonsProps) => {
  const { t } = useTranslation();

  return (
    <div className="mt-3 flex gap-2">
      <Button
        type="primary"
        disabled={!isEditing}
        loading={isSubmitting}
        onClick={onSave}
      >
        {t('save')}
      </Button>
      <Button onClick={onCancel} disabled={!isEditing}>
        {t('cancel')}
      </Button>
    </div>
  );
};

export default ActionButtons;
