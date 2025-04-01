import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import dayjs, { Dayjs } from 'dayjs';
import { Row, Col, DatePicker, TimePicker } from 'antd';
import { handleTimezoneToStoreId } from 'constants/appointment-management';

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export interface TimeFrameType {
  endTime: string;
  beginTime: string;
  beforeBeginTime?: string;
  beforeEndTime?: string;
}

interface Props {
  onChange?: (data: TimeFrameType) => void;
  data?: TimeFrameType;
  storeId: number;
  disabled?: boolean;
}

const InputTimeFrame = ({ onChange, data, storeId, disabled }: Props) => {
  const [date, setDate] = useState<Dayjs>(); // dayjs()
  const [timeStart, seTimeStart] = useState<Dayjs>(); // dayjs().set('hour', 10).set('minute', 0).set('second', 0)
  const [timeEnd, seTimeEnd] = useState<Dayjs>(); //  dayjs().set('hour', 11).set('minute', 0).set('second', 0)

  /** 依赖中加入 onChange会卡死 */
  useEffect(() => {
    if (onChange) {
      if (date && timeStart && timeEnd) {
        const dateFormat = handleTimezoneToStoreId(date, storeId).format(
          'YYYY-MM-DD'
        );
        const startFormat = handleTimezoneToStoreId(timeStart, storeId).format(
          'HH:mm:00'
        );
        const endFormat = handleTimezoneToStoreId(timeEnd, storeId).format(
          'HH:mm:00'
        );
        //
        const beginTime = handleTimezoneToStoreId(
          dayjs(`${dateFormat} ${startFormat}`),
          storeId
        ).format();
        const endTime = handleTimezoneToStoreId(
          dayjs(`${dateFormat} ${endFormat}`),
          storeId
        ).format();
        onChange({ beginTime, endTime });
      }
    }
  }, [date, timeStart, timeEnd, storeId]);

  useEffect(() => {
    setDate(handleTimezoneToStoreId(dayjs(data?.beginTime), storeId));
    seTimeStart(handleTimezoneToStoreId(dayjs(data?.beginTime), storeId));
    seTimeEnd(handleTimezoneToStoreId(dayjs(data?.endTime), storeId));
  }, [data, storeId]);

  return (
    <div className={styles.InputTimeFrame}>
      <Row gutter={[24, 0]}>
        <Col span={12} className={styles.date}>
          <DatePicker
            value={date}
            disabled={disabled}
            style={{ width: '100%' }}
            onChange={(e) => {
              if (e) setDate(e);
            }}
          />
        </Col>
        <Col span={12} className={styles.time}>
          <Row>
            <Col span={10} className={styles.timeStart}>
              <TimePicker
                disabled={disabled}
                value={timeStart}
                format={'HH:mm'}
                minuteStep={30}
                showNow={false}
                disabledTime={(now: Dayjs) => ({
                  disabledHours: () => [...range(0, 9), ...range(19, 24)],
                })}
                onChange={(e) => {
                  if (e) seTimeStart(e);
                }}
              />
            </Col>
            <Col span={4} className={styles.middle}>
               -
            </Col>
            <Col span={10} className={styles.timeEnd}>
              <TimePicker
                disabled={disabled}
                value={timeEnd}
                format={'HH:mm'}
                minuteStep={30}
                disabledTime={(now: Dayjs) => ({
                  disabledHours: () => [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 19, 20, 21, 22, 23, 24,
                  ],
                })}
                onChange={(e) => {
                  if (e) seTimeEnd(e);
                }}
              />
            </Col>
          </Row>
        </Col>
        {data?.beforeEndTime && (
          <Col span={24}>
            <div className={styles.tips}>
              原预约时间：
              {dayjs(data?.beforeBeginTime).format('YYYY年MM月DD日 HH:mm')}~
              {dayjs(data?.beforeEndTime).format('HH:mm')}
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};
export default InputTimeFrame;
