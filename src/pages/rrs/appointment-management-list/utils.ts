import dayjs, { Dayjs } from 'dayjs';
import type { DatePickerProps } from 'antd';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export const customWeekStartEndFormat: DatePickerProps['format'] = (value) =>
  `${dayjs(value).startOf('day').format('YYYY-MM-DD')} ~ ${dayjs(value)
    .add(3, 'day')
    .endOf('day')
    .format('MM-DD')}`;

export const dateFormat = (data: any, format = 'YYYY-MM-DD') => {
  return data?.format(format);
};

/** 通过店铺格式话时区 */
export const handleTimezoneToStoreId = (date: Dayjs, storeId: number) => {
  let timezone = 'Asia/Tokyo';
  if (storeId === 2) {
    timezone = 'Asia/Hong_Kong';
  } else if (storeId === 3) {
    timezone = 'Asia/Singapore';
  } else {
    timezone = 'Asia/Tokyo';
  }
  return date.tz(timezone);
};

// handleTimezoneToStoreId;
