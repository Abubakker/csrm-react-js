import { Button } from 'antd';

interface FilterActionsProps {
  onSearch: () => void;
  onReset: () => void;
}

const FilterActions = ({ onSearch, onReset }: FilterActionsProps) => (
  <>
    <Button
      type="primary"
      onClick={onSearch}
      className="h-[42px] rounded-[10px] font-bold text-[12px]"
    >
      Search
    </Button>
    <Button
      onClick={onReset}
      className="h-[42px] rounded-[10px] border border-[#1A1A1A] font-bold text-[12px]"
    >
      Reset
    </Button>
  </>
);

export default FilterActions;
