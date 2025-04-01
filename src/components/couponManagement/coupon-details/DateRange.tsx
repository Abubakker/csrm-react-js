import { DatePicker } from 'antd';
import dayjs from 'dayjs';

interface DateRangeProps {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  onStartChange: (date: dayjs.Dayjs | null) => void;
  onEndChange: (date: dayjs.Dayjs | null) => void;
  disabledDate: (current: dayjs.Dayjs) => boolean;
}

const DateRange = ({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  disabledDate,
}: DateRangeProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <DatePicker
        placeholder="Start Date"
        className="h-[42px] rounded-[10px] w-full"
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
        value={startDate}
        onChange={onStartChange}
        disabledDate={disabledDate}
      />
      <DatePicker
        placeholder="End Date"
        className="h-[42px] rounded-[10px] w-full"
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
        value={endDate}
        onChange={onEndChange}
        disabledDate={disabledDate}
      />
    </div>
  );
};

export default DateRange;
