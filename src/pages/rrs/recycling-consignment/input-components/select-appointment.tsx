import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import styles from './index.module.scss';
import { Radio, Spin, Tag } from 'antd';
import {
  cityList,
  handleTimezoneToStoreId,
  weekMapping,
} from 'constants/appointment-management';
import { fetchShopValidReservationTime } from 'apis/oms';
import { OmsAppointmentDateListVO, OmsAppointmentRecordDTO } from 'types/oms';
import dayjs from 'dayjs';
const { CheckableTag } = Tag;

interface Props {
  onChange?: (data: OmsAppointmentRecordDTO) => void;
  value?: OmsAppointmentRecordDTO;
}

const SelectAppointment = ({ onChange, value }: Props) => {
  const [loadingValidTime, setLoadingValidTime] = useState(false);
  const [validTimeList, setValidTimeList] = useState<
    OmsAppointmentDateListVO[]
  >([]);
  const [validTimeIndex, setValidTimeIndex] = useState<number>(0);

  const store = useMemo(() => {
    return value?.storeId;
  }, [value?.storeId]);
  const timeID = useMemo(() => {
    return value?.appointmentTimeId;
  }, [value?.appointmentTimeId]);
  const toDay = useMemo(() => {
    return handleTimezoneToStoreId(dayjs(), store);
  }, [store]);

  useEffect(() => {
    setValidTimeIndex(0);
    /** 可预约时段 */
    if (store) {
      setLoadingValidTime(true);
      fetchShopValidReservationTime(store)
        .then(({ data }) => {
          setValidTimeList(data);
        })
        .finally(() => {
          setLoadingValidTime(false);
        });
    }
  }, [store]);

  const triggerChange = useCallback(
    (changedValue: OmsAppointmentRecordDTO) => {
      onChange?.({
        ...value,
        ...changedValue,
      });
    },
    [onChange, value]
  );

  return (
    <div className={styles.SelectAppointment}>
      <div className={styles.store}>
        <Radio.Group
          options={cityList}
          value={store}
          onChange={(e) => {
            const val = e.target.value;
            triggerChange({ storeId: val, appointmentTimeId: '' });
          }}
        />
      </div>

      <div className={styles.calendar}>
        <Spin spinning={loadingValidTime}>
          {/* 日期选择 */}
          <div className={styles.dayWarp}>
            {validTimeList.map((d, i) => {
              const currentDay = handleTimezoneToStoreId(
                dayjs(d.omsAppointmentDateConfiguration?.appointmentDate),
                store
              );
              // 日本店 禁用当天
              const JP_Disabled =
                toDay.format('DD') === currentDay.format('DD') && store === 1;
              // 香港 新加坡 禁用周天
              const HK_SG_Disabled =
                currentDay.day() === 0 && [2, 3].includes(store!);
              return (
                <div
                  className={styles.dayItems}
                  key={d.omsAppointmentDateConfiguration?.id}
                >
                  <CheckableTag
                    className={`${styles.tag} ${
                      JP_Disabled || HK_SG_Disabled ? styles.disabled : ''
                    }`}
                    checked={validTimeIndex === i}
                    onChange={() => {
                      if (!JP_Disabled) {
                        setValidTimeIndex(i);
                        triggerChange({ appointmentTimeId: '' });
                      }
                    }}
                  >
                    {currentDay.format('DD')}
                    <span>({weekMapping[currentDay.day()]})</span>
                  </CheckableTag>
                </div>
              );
            })}
          </div>
          {/* 时间段选择 */}
          <div className={styles.timeWarp}>
            {!!validTimeList.length &&
              validTimeList[
                validTimeIndex
              ].omsAappointmentTimeConfigurationList?.map((d) => {
                const begin = handleTimezoneToStoreId(
                  dayjs(d.beginTime),
                  store
                );
                const end = handleTimezoneToStoreId(dayjs(d.endTime), store);
                const currentDay = handleTimezoneToStoreId(
                  dayjs(
                    validTimeList[validTimeIndex]
                      .omsAppointmentDateConfiguration?.appointmentDate
                  ),
                  store
                );
                // 日本店 禁用当天
                const JP_Disabled =
                  toDay.format('DD') === currentDay.format('DD') && store === 1;
                // 香港 新加坡 禁用周天
                const HK_SG_Disabled =
                  end.day() === 0 && [2, 3].includes(store!);
                // 已经被预约
                const status_Disabled = [1, 2, 3].includes(d.status || 0);
                // 是否过期
                const expired = begin.unix() - toDay.unix() < 0;
                // 集合
                const disabled =
                  expired || JP_Disabled || HK_SG_Disabled || status_Disabled;
                const notDisabled =
                  !expired &&
                  !JP_Disabled &&
                  !HK_SG_Disabled &&
                  !status_Disabled;
                return (
                  <div key={d.id} className={styles.timeItems}>
                    <CheckableTag
                      className={`${styles.tag}  ${
                        disabled ? styles.disabled : ''
                      }`}
                      checked={timeID === d.id}
                      onChange={() => {
                        if (notDisabled) {
                          triggerChange({ appointmentTimeId: d.id! });
                        }
                      }}
                    >
                      {begin.format('HH:mm')}~{end.format('HH:mm')}
                    </CheckableTag>
                  </div>
                );
              })}
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default memo(SelectAppointment);
