import { useToggle } from 'react-use';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

const CouponDescriptionDialog = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const [open, toggleOpen] = useToggle(true);

  return (
    <div className="ml-2 flex h-full cursor-pointer items-center justify-center">
      <QuestionCircleOutlined className="w-4" onClick={toggleOpen} />
      <Modal open={open} onCancel={toggleOpen} onOk={toggleOpen} title={title}>
        <p className="whitespace-pre-line">{description}</p>
      </Modal>
    </div>
  );
};

export default CouponDescriptionDialog;
