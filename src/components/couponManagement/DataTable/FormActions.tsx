import { Button } from 'antd';

interface FormActionsProps {
  onSubmit?: () => void;
  onReset?: () => void;
  htmlType?: 'submit' | 'button' | 'reset';
  submitLabel?: string;
  resetLabel?: string;
}

const FormActions = ({
  onSubmit,
  onReset,
  htmlType = 'submit',
  resetLabel,
  submitLabel,
}: FormActionsProps) => {
  return (
    <>
      <Button
        type="primary"
        htmlType={htmlType}
        onClick={onSubmit}
        className="h-[42px] rounded-[10px] px-6 tracking-[1px] font-bold leading-[18px] text-[12px] bg-[#0B53B8] hover:bg-[#0B53B8]/90"
      >
        {submitLabel}
      </Button>
      <Button
        onClick={onReset}
        className="h-[42px] rounded-[10px] px-6 tracking-[1px] font-bold leading-[18px] text-[12px] border border-black bg-white hover:bg-slate-100"
      >
        {resetLabel}
      </Button>
    </>
  );
};
export default FormActions;
