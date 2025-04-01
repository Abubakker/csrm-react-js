import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface DurationFieldProps {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  onStartDateChange: Dispatch<SetStateAction<dayjs.Dayjs | null>>;
  onEndDateChange: Dispatch<SetStateAction<dayjs.Dayjs | null>>;
  disabledDate?: (current: dayjs.Dayjs) => boolean;
  // startDatePlaceholder?: string;
  // endDatePlaceholder?: string;
  // startDateId?: string;
  // endDateId?: string;
  // label?: string;
}

const DurationField = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  disabledDate,
}: DurationFieldProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 items-end">
      <div className="w-1/2">
        <label className="font-medium text-[10px] text-[#1A1A1A] uppercase leading-[16px]">
          {t('duration_title')}
        </label>
        <DatePicker
          value={startDate}
          onChange={(date) => onStartDateChange(date)}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder={t('start_date_placeholder') || ''}
          className="border border-[#DADDEB] rounded-[10px] h-[42px] p-3 mt-1 w-full"
          disabledDate={disabledDate}
        />
      </div>
      <div className="w-1/2">
        <DatePicker
          value={endDate}
          onChange={(date) => onEndDateChange(date)}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder={t('end_date_placeholder') || ''}
          className="border border-[#DADDEB] rounded-[10px] h-[42px] p-3 w-full"
          disabledDate={disabledDate}
        />
      </div>
    </div>
  );
};

export default DurationField;
