import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { BusinessHourData } from './BusinessHour';

interface BusinessHourItemProps {
  businessHour: BusinessHourData;
  onDelete: () => void;
}

const BusinessHourItem = ({
  businessHour,
  onDelete,
}: BusinessHourItemProps) => {
  return (
    <div className="bg-[#EBEDF7] border-solid border border-[#DADDEB] rounded-lg p-3 flex justify-between items-center">
      <div>
        <p className="font-medium">{businessHour.working_days.join(', ')}</p>
        <p className="text-gray-600">{`${businessHour.start_time} - ${businessHour.end_time}`}</p>
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

export default BusinessHourItem;
