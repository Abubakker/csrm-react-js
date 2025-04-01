import tik from '../../../assets/icons/tick-circle.svg';
import close from '../../../assets/icons/close-circle.svg';

const EditControls = ({
  onSave,
  onCancel,
}: {
  onSave: () => void;
  onCancel: () => void;
}) => (
  <div className="flex items-center gap-3 pb-2">
    <img
      src={tik}
      alt="Save"
      onClick={onSave}
      className="cursor-pointer size-6"
    />
    <img
      src={close}
      alt="Cancel"
      onClick={onCancel}
      className="cursor-pointer size-6"
    />
  </div>
);

export default EditControls;
