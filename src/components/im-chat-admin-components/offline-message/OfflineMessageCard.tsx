import { useTranslation } from 'react-i18next';
import { Button, Input } from 'antd';
import { DeleteIcon } from '../assets/IMChatIcons.jsx';

const { TextArea } = Input;

interface OfflineMessageCardProps {
  id: string;
  buttonContent: string;
  replyMessage: string;
  isEditing: boolean;
  onInputChange: (id: string, field: string, value: string) => void;
  onSave: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

export const OfflineMessageCard = ({
  id,
  buttonContent,
  replyMessage,
  isEditing,
  onInputChange,
  onSave,
  onCancel,
  onDelete,
}: OfflineMessageCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#F5F6FC] p-4 rounded-lg mb-3">
      <Input
        placeholder={`${t('enter_button_content')}`}
        className="p-[10px]"
        value={buttonContent}
        onChange={(e) => onInputChange(id, 'buttonContent', e.target.value)}
      />
      <TextArea
        placeholder={`${t('auto_reply_message')}`}
        rows={3}
        className="mt-2 p-[10px] bg-white border rounded-lg"
        value={replyMessage}
        onChange={(e) => onInputChange(id, 'replyMessage', e.target.value)}
      />
      <div className="mt-2 flex justify-end space-x-2">
        <Button type="primary" disabled={!isEditing} onClick={() => onSave(id)}>
          {t('save')}
        </Button>
        <Button disabled={!isEditing} onClick={() => onCancel(id)}>
          {t('cancel')}
        </Button>
        <Button
          danger
          icon={<DeleteIcon />}
          onClick={() => onDelete(id)}
        ></Button>
      </div>
    </div>
  );
};
