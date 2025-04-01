import dayjs from 'dayjs';
import {
  OmsAppointmentRecordVO,
  OmsAppointmentDateVO,
  OmsAppointmentDateUpdate,
} from 'types/oms';
import _ from 'lodash';
import {
  handleTimezoneToStoreId,
  weekMapping,
} from 'constants/appointment-management';

// 间隔30分钟 生成两个时间内的所有时间
const TimePoints = (time1: string, time2: string, storeId: number) => {
  // 定义开始时间和结束时间
  const startTime = dayjs(`2023-09-11 ${time1}:00`);
  const endTime = dayjs(`2023-09-11 ${time2}:00`);

  // 初始化时间点列表，包括开始时间
  const timePoints = [startTime];

  // 计算每隔30分钟生成一个时间点，直到结束时间
  let currentTime = startTime;
  while (currentTime.isBefore(endTime)) {
    currentTime = currentTime.add(30, 'minute');
    timePoints.push(currentTime);
  }

  // 打印生成的时间点列表
  return timePoints.map((timePoint) => {
    return timePoint.format('HH:mm');
  });
};

// 格式化分钟
const minuteFormat = (time: string, format = 'HHmm', storeId: number) => {
  return dayjs(`2023-09-11 ${time}:00`).format(format);
};

interface dataSourceType {
  key?: string; // key值
  keyBegin?: string; // key值 begin为键
  begin?: string; // 时间 节选
  beginTime?: string; // 时间 节选
  end?: string; // 时间 节选
  endTime?: string; // 时间 节选
  text?: string; // 显示内容
  span?: number; // 跨行
  time?: string; // 时间
  date?: string; // 时间
  data?: OmsAppointmentRecordVO; // 时间数据
}

/**
 * 1、遍历所有天，设置为对应时区  获得表头
 * 2、遍历所有天下面的所有的开始时间、结束时间段
 */
export const handleStep1 = (
  dataSource: OmsAppointmentDateVO[],
  storeId: number
) => {
  // 所有天
  const dayList_All: OmsAppointmentDateUpdate[] = [];
  // 所有开始
  const beginList_All: dataSourceType[] = [];
  // 所有结束
  const endList_All: dataSourceType[] = [];
  // 表头
  const thead: any = { row0: '时段' };

  dataSource.forEach((d, i) => {
    const { appointmentDate, omsAppointmentRecordVOS } = d;
    // 处理所有天，处理时区
    const appointmentDate_c = handleTimezoneToStoreId(
      dayjs(appointmentDate?.appointmentDate),
      storeId
    );
    const date = appointmentDate_c.format('DD');
    const week = weekMapping[appointmentDate_c.day()];
    dayList_All.push({ ...appointmentDate, date, week });
    thead[`row${i + 1}`] = { ...appointmentDate, date, week };
    // 处理所有 时段
    omsAppointmentRecordVOS?.forEach((dd) => {
      const { appointmentTimeConfiguration } = dd;
      const { beginTime, endTime } = appointmentTimeConfiguration || {};
      const [begin_dayjs, end_dayjs] = [
        handleTimezoneToStoreId(dayjs(beginTime), storeId),
        handleTimezoneToStoreId(dayjs(endTime), storeId),
      ];
      beginList_All.push({
        key: begin_dayjs.format('HHmm'),
        text: begin_dayjs.format('HH:mm'),
        time: beginTime,
      });
      endList_All.push({
        key: end_dayjs.format('HHmm'),
        text: end_dayjs.format('HH:mm'),
        time: endTime,
      });
    });
  });

  // console.group('Step1');
  // console.log('🚀  当前周所有天', dayList_All);
  // console.log('🚀  表头', thead);

  // console.log('🚀  所有开始', beginList_All);
  // console.log('🚀  所有结束', endList_All);
  // console.groupEnd();

  return {
    dayList_All,
    beginList_All,
    endList_All,
    thead,
  };
};

/**
 * 1、获得去重后的所有开始和结束时间段、并排序、拿到最大最小值
 * 2、以30分钟为节点，遍历最大最小值内的所有存在的时间段，
 * 3、遍历数据给到的所有时间段
 */
export const handleStep2 = (
  dataSource: OmsAppointmentDateVO[],
  beginList_All: any[],
  endList_All: any[],
  storeId: number
) => {
  const allTimeList: dataSourceType[] = [];
  // 去重后的所有时段
  const timeDiff: dataSourceType[] = _.unionBy(
    beginList_All,
    endList_All,
    'key'
  );
  // 排序
  timeDiff.sort((a, b) => Number(a.key) - Number(b.key));
  // 所有的时段
  timeDiff.forEach((d, i) => {
    // 最后一项不遍历
    if (i + 1 === timeDiff.length) return;
    const begin = d.text;
    const beginTime = d.time;
    const end = timeDiff[i + 1].text;
    const endTime = timeDiff[i + 1].time;
    const begin_key = d.key;
    const end_key = timeDiff[i + 1].key;
    allTimeList.push({
      begin,
      beginTime,
      end,
      endTime,
      key: `${Number(end_key)}${begin_key}`,
    });
  });

  const contentList: dataSourceType[] = [];
  const beginTime = allTimeList[0].begin;
  const endTime = allTimeList[allTimeList.length - 1].end;
  const tableAllTime: string[] = TimePoints(beginTime!, endTime!, storeId);
  tableAllTime.forEach((d, i) => {
    if (i + 1 === tableAllTime.length) return;

    const beginTime = d;
    const endTime = tableAllTime[i + 1];
    if (!['13:00', '13:30'].includes(d)) {
      contentList.push({
        time: `${beginTime} ~ ${endTime}`,
        keyBegin: minuteFormat(beginTime, undefined, storeId),
      });
    }
  });

  const allTimeFrameObj: any = {};
  // 每一天
  dataSource.forEach((d, i) => {
    const { omsAppointmentRecordVOS } = d;

    allTimeFrameObj[i] = [];
    // 每天的时段
    omsAppointmentRecordVOS?.forEach((dd) => {
      const { appointmentTimeConfiguration } = dd;
      const { beginTime, endTime, status } = appointmentTimeConfiguration || {};
      const [begin_dayjs, end_dayjs] = [
        handleTimezoneToStoreId(dayjs(beginTime), storeId),
        handleTimezoneToStoreId(dayjs(endTime), storeId),
      ];
      const key = `${end_dayjs.format('HHmm')}${begin_dayjs.format('HHmm')}`;
      const keyBegin = begin_dayjs.format('HHmm');
      // 计算两个小时之间有多少个 30 分钟
      const minutesDifference = end_dayjs.diff(begin_dayjs, 'minutes');
      const begin_end_diff = Math.floor(minutesDifference / 30) || 1;
      if (status !== 2) {
        allTimeFrameObj[i].push({
          key,
          keyBegin,
          span: begin_end_diff,
          date: d.appointmentDate?.appointmentDate,
          data: dd,
        });
      }

      //
    });
  });

  const dayTimeFrame: dataSourceType[][] = Object.values(allTimeFrameObj);

  const halfHour: any = {};
  dayTimeFrame.forEach((d: any) => {
    d.forEach((dd: any) => {
      const data: OmsAppointmentRecordVO = dd.data;
      const { beginTime, storeId = 1 } =
        data.appointmentTimeConfiguration || {};
      const begin = handleTimezoneToStoreId(dayjs(beginTime), storeId);
      if (begin.format('mm') === '30') {
        halfHour[`${begin.format('HHmm')}`] = 1;
      }
    });
  });

  // console.group('Step2');
  // console.log('🚀  去重后的所有时间节点', timeDiff);
  // console.log('🚀  所有的开始和结束:', allTimeList);
  // console.log('🚀  30分钟为节点的所有时间:', tableAllTime);
  // console.log('🚀  30分钟为单位全部的时段:', contentList);
  // console.log('🚀  以天为单位的所有时段+数据:', dayTimeFrame);
  // console.log('🚀  被拆分过的时段:', halfHour);
  // console.groupEnd();

  return {
    contentList,
    dayTimeFrame,
    halfHour,
  };
};

export const handleStep3 = (
  contentList: any[],
  dayTimeFrame: any[],
  thead: any,
  halfHour: any[]
) => {
  const rowList: any[] = [];
  contentList.forEach((d: any) => {
    rowList.push({
      row0: d.time,
      ...d,
    });
  });

  rowList.forEach((row) => {
    dayTimeFrame.forEach((list: any, i: number) => {
      const field = `row${i + 1}`;
      list.forEach((dd: any) => {
        if (row.keyBegin === dd.keyBegin) {
          row[field] = { ...dd };
        }
      });
    });
  });

  const theadKeyList = Object.keys(thead);
  const tbody: any = [];

  const unMerge: number[] = [];
  Object.keys(halfHour).forEach((d) => {
    const index = rowList.findIndex((dd: any) => dd.keyBegin === d.toString());
    // 上一个
    if (rowList[index - 1]) {
      unMerge.push(index - 1);
    }
    //
    unMerge.push(index);
  });

  rowList.forEach((d, i) => {
    const { keyBegin, row0 } = d;
    const obj: any = { key: keyBegin };
    theadKeyList.forEach((key) => {
      if (d[key]) {
        obj[key] = d[key];
      } else {
        /** 休的时段 */
        // obj[key] = null;
        obj[key] = {
          rest: true,
          span: 1,
        };
      }
    });

    const span = !unMerge.includes(i) && keyBegin.substring(2) === '00' ? 2 : 1;
    const time = dayjs()
      .hour(keyBegin.substring(0, 2))
      .minute(keyBegin.substring(2));
    const end = time.add(30 * span, 'minute');
    const text = `${time.format('HH:mm')}~${end.format('HH:mm')}`;
    obj['row0'] = {
      text: text,
      firstColumn: true,
      span: span,
    };
    obj['row01'] = row0;
    tbody.push(obj);
  });

  // 判断 休 的状态是否跨行
  const restList: any = [];
  tbody.forEach((d: any) => {
    const temp: any = [];
    dayTimeFrame.forEach((_, i) => {
      const rowField = `row${i + 1}`;
      if (d[rowField].rest) {
        temp.push(i + 1);
      }
    });
    restList.push(temp);
  });
  // console.log('🚀  restList:', restList);

  let index_prev = 0;
  let index_next = 1;
  let index = 0;
  // 找到两个数组的交集

  while (restList[index_prev] && restList[index_next]) {
    const intersection = _.intersection(
      restList[index_prev],
      restList[index_next]
    );
    // console.group(index_prev, index_next);

    // eslint-disable-next-line no-loop-func
    intersection.forEach((d) => {
      // console.log('🚀  intersection.forEach  d:', d);
      const rowField = `row${d}`;
      // const rowData = tbody[index_prev][rowField];
      // console.log('🚀  intersection.forEach  rowField:', rowField);
      // console.log('🚀  intersection.forEach  tbody[index]:', tbody[index_prev]);
      // console.log('🚀  intersection.forEach  rowData:', rowData);

      tbody[index_prev][rowField].span = 2;
    });
    // console.groupEnd();

    index_prev += 2;
    index_next += 2;
    index += 1;
  }
  console.log('🚀  tbody:', tbody);

  return { tbody };
};
