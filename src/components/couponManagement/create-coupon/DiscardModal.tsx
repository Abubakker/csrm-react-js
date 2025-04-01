import { Modal } from 'antd';
import Button from './Button';

interface DiscardModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const DiscardModal = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  message,
}: DiscardModalProps) => (
  <Modal
    open={isOpen}
    closable={false}
    footer={null}
    className="rounded-xl overflow-hidden p-0"
  >
    <div className="h-full w-full rounded-xl m-0">
      <div className="mt-5">
        <h1 className="text-[18px] font-bold">{title}</h1>
        <p className="text-[14px] pr-2 text-[#797D91]">{message}</p>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </div>
  </Modal>
);

export default DiscardModal;
