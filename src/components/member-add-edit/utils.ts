import { message } from 'antd';
import dayjs from 'dayjs';

// 辅助函数，确保数字是两位数格式
export function padToTwoDigits(num: number): string {
  return num.toString().padStart(2, '0');
}

export function japaneseToGregorian(japaneseDate: string) {
  // 定义日本年号和对应的起始年份
  const eraMap: any = {
    R: 2019, // 令和
    H: 1989, // 平成
    S: 1926, // 昭和
    T: 1912, // 大正
    // 添加其他年号和对应的起始年份
  };

  // 解析日本年历格式
  const match = japaneseDate.match(/^([RHST])(\d+)\/(\d+)\/(\d+)$/);
  if (!match) {
    message.error('Invalid Japanese date format');
    return;
  }

  const era = match[1];
  const eraYear = parseInt(match[2], 10);
  const month = parseInt(match[3], 10);
  const day = parseInt(match[4], 10);

  // 计算对应的公历年份
  const gregorianYear = eraMap[era] + eraYear - 1;
  // 使用dayjs将日期转换为公历
  const gregorianDate = dayjs(
    `${gregorianYear}-${padToTwoDigits(month)}-${padToTwoDigits(day)}`
  ).format('YYYY-MM-DD');
  return gregorianDate;
}

// 定义日本年号和对应的起始年份
const eraMap: { [key: string]: { startYear: number; eraName: string } } = {
  R: { startYear: 2019, eraName: '令和' }, // 令和
  H: { startYear: 1989, eraName: '平成' }, // 平成
  S: { startYear: 1926, eraName: '昭和' }, // 昭和
  T: { startYear: 1912, eraName: '大正' }, // 大正
  // 添加其他年号和对应的起始年份
};

export function gregorianToJapanese(gregorianDate: string): string {
  const date = dayjs(gregorianDate, 'YYYY-MM-DD');
  const year = date.year();
  const month = date.month() + 1; // dayjs 的月份从0开始，所以需要加1
  const day = date.date();

  for (const era in eraMap) {
    if (year >= eraMap[era].startYear) {
      const eraYear = year - eraMap[era].startYear + 1;
      return `${era}${eraYear}/${padToTwoDigits(month)}/${padToTwoDigits(day)}`;
    }
  }
  throw new Error('Date is before supported eras');
}
