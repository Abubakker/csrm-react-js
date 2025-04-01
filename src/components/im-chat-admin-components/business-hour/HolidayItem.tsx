import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Holidays } from './BusinessHour';

interface HolidayItemProps {
  holidays: Holidays;
  onDelete: () => void;
}

const HolidayItem = ({ holidays, onDelete }: HolidayItemProps) => {
  return (
    <div className="bg-[#EBEDF7] border-solid border border-[#DADDEB] rounded-lg p-3 flex justify-between items-center">
      <div>
        <p className="font-medium">{`${holidays.start_time} - ${holidays.end_time}`}</p>
      </div>
      <Button
        type="text"
        icon={<DeleteOutlined className="text-red-500" />}
        className="text-gray-500 hover:text-red-500"
        onClick={onDelete}
      />
    </div>
  );
};
export default HolidayItem;
