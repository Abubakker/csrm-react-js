import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Button, Row, Col, Radio, DatePicker } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {
  cityList,
  handleTimezoneToStoreId,
} from 'constants/appointment-management';
import { customWeekStartEndFormat } from '../../utils';
import dayjs, { Dayjs } from 'dayjs';
import LOCALS from '../../../../../commons/locals';
import i18n from '../../../../../i18n';

interface Props {
  setPayload: (week: string[], storeId: number) => void;
}

const BarTop = ({ setPayload }: Props) => {
  const [day, setDay] = useState<Dayjs>(dayjs());
  const [storeId, setStoreId] = useState<number>(1);

  // !别加依赖 setPayload 会无线循环 有时间再调整
  useEffect(() => {
    if (day && storeId) {
      const w = [
        handleTimezoneToStoreId(day, storeId).startOf('day').format(),
        handleTimezoneToStoreId(day, storeId)
          .add(3, 'day')
          .endOf('day')
          .format(),
      ];
      setPayload(w, storeId);
    }
  }, [day, storeId]);

  return (
    <div className={styles.barTop}>
      <Row>
        <Col span={12} className={styles.left}>
          <div className={styles.dateWeek}>
            <div
              className={styles.leftBtn}
              onClick={() => {
                setDay((old) => old.add(-4, 'day'));
              }}
            >
              <LeftOutlined />
            </div>
            <div>
              <DatePicker
                onChange={(e) => {
                  setDay(e!);
                }}
                bordered={false}
                allowClear={false}
                value={day}
                format={customWeekStartEndFormat}
                size="large"
              />
            </div>
            <div
              className={styles.rightBtn}
              onClick={() => {
                setDay((old) => old.add(4, 'day'));
              }}
            >
              <RightOutlined />
            </div>
          </div>
          <div className={styles.btn}>
            <Button
              type="link"
              onClick={() => {
                setDay(dayjs());
              }}
            >
              {i18n.t(LOCALS.today)}
            </Button>
          </div>
        </Col>
        <Col span={12} className={styles.right}>
          <Radio.Group
            options={cityList}
            onChange={(e) => setStoreId(e.target.value)}
            value={storeId}
            optionType="button"
            buttonStyle="solid"
          />
        </Col>
      </Row>
    </div>
  );
};
export default BarTop;
