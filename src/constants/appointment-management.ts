import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import i18n from '../i18n';
import LOCALS from '../commons/locals';
dayjs.extend(utc);
dayjs.extend(timezone);

export const cityList = [
  { label: 'JP', value: 1 },
  { label: 'HK', value: 2 },
  { label: 'SG', value: 3 },
];

/** 店铺 */
export const storeIdMapingArray = ['', i18n.t(LOCALS.ginza_shop), i18n.t(LOCALS.hongkong_shop),i18n.t(LOCALS.singapore_shop)];
export const storeIdMapingObject: any = {};
export const storeOption = [{ label: '所有门店', value: '' }];
storeIdMapingArray.forEach((d, i) => {
  storeIdMapingObject[i] = d;
  if (i !== 0) storeOption.push({ label: d, value: i + '' });
});

/** 状态 */
export const statusMappingArray = [
  '',
  i18n.t(LOCALS.booked),
  i18n.t(LOCALS.arrived),
  i18n.t(LOCALS.no_show),
  i18n.t(LOCALS.cancelled),
];
export const statusMappingObject: any = {};
export const statusOption = [{ label: i18n.t(LOCALS.all) , value: '' }];
statusMappingArray.forEach((d, i) => {
  statusMappingObject[i] = d;
  if (i !== 0) statusOption.push({ label: d, value: i + '' });
});

export const StoreStatusOption = [
  { label: i18n.t(LOCALS.booked), value: 1 },
  { label: i18n.t(LOCALS.arrived), value: 2 },
  { label: i18n.t(LOCALS.no_show), value: 3 },
  // { label: '已取消', value: 4 },
];

export const ReservationMethodOption = [
  { label: i18n.t(LOCALS.website), value: 1 },
  { label: i18n.t(LOCALS.manual_addition), value: 2 },
];

/** 通过店铺格式化时区 */
export const handleTimezoneToStoreId = (
  date: Dayjs,
  storeId: number | string | undefined
) => {
  let timezone = 'Asia/Tokyo';
  if (Number(storeId) === 2) {
    timezone = 'Asia/Hong_Kong';
  } else if (Number(storeId) === 3) {
    timezone = 'Asia/Singapore';
  } else {
    timezone = 'Asia/Tokyo';
  }
  return date.tz(timezone);
};

// 更具时间重新设置时区
export const handleTransformTimezone = (
  date: Dayjs,
  storeId: number | string
) => {
  let timezone = 'Asia/Tokyo';
  if (Number(storeId) === 2) {
    timezone = 'Asia/Hong_Kong';
  } else if (Number(storeId) === 3) {
    timezone = 'Asia/Singapore';
  } else {
    timezone = 'Asia/Tokyo';
  }
  return dayjs.tz(date.format('YYYY-MM-DD HH:mm:ss'), timezone);
};

// 周Mapping
export const weekMapping = [
  i18n.t(LOCALS.sunday),
  i18n.t(LOCALS.monday),
  i18n.t(LOCALS.tuesday),
  i18n.t(LOCALS.wednesday),
  i18n.t(LOCALS.thursday),
  i18n.t(LOCALS.friday),
  i18n.t(LOCALS.saturday),
];
