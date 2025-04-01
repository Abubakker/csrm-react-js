import {
  useCallback,
  memo,
  useRef,
  useEffect,
  useState,
  CSSProperties,
} from 'react';
import styles from './index.module.scss';
import dayjs from 'dayjs';
import { Badge, Tag } from 'antd';
import { OmsAppointmentRecordVO } from 'types/oms';
import _ from 'lodash';
import { handleTimezoneToStoreId } from 'constants/appointment-management';
import FastMarquee from 'react-fast-marquee';

const cellHeight = 60;

interface randerTbodyTdProps {
  data: any;
  setOpen: (
    b: boolean,
    data: OmsAppointmentRecordVO,
    dataSource: dataSourceType
  ) => void;
  setOpenCancel: (id: string) => void;
}

export interface dataSourceType {
  data: OmsAppointmentRecordVO;
  rowSpan: number;
  firstColumn: boolean;
  minute: string;
  height: number;
  rowspan_classname: string;
  td_style: CSSProperties;
  rest?: boolean;
  /** 1日期过期   2没过期 */
  timeStatus: number;
  rowspan_style: CSSProperties;
  text: string;
  update?: boolean;
}
const RanderTbodyTd_Defaylt = {
  data: {},
  rowSpan: 1,
  firstColumn: false,
  minute: '',
  height: cellHeight,
  rowspan_classname: '',
  rowspan_style: {},
  td_style: {},
  rest: false,
  timeStatus: 0,
  text: '',
  update: false,
};

const TbodyTd = memo(({ data, setOpen, setOpenCancel }: randerTbodyTdProps) => {
  const [dataSource, setDataSource] = useState<dataSourceType>({
    ...RanderTbodyTd_Defaylt,
  });

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;
    // console.log('🚀  useEffect  data:', data);
    if (data['rest']) {
      const tt = { ...RanderTbodyTd_Defaylt };
      tt.rest = true;
      tt.rowSpan = data['span'];
      tt.height = cellHeight * tt.rowSpan;
      tt.td_style = { background: '#dfe4ea' };

      setDataSource(tt);
    } else {
      const t: dataSourceType = { ...RanderTbodyTd_Defaylt };
      t.firstColumn = data['firstColumn'];
      t.text = data['text'];
      if (t.firstColumn) {
        t.data = data;
      }
      t.data = data['data'] || {};
      t.rowSpan = data['span'];
      const height = cellHeight * t.rowSpan;
      t.rowspan_classname = styles['rowspan'];

      const { appointmentTimeConfiguration, omsAppointmentStoreRecord } =
        t.data as OmsAppointmentRecordVO;
      const {
        beginTime,
        endTime,
        storeId = 1,
      } = appointmentTimeConfiguration || {};
      t.update = Boolean(omsAppointmentStoreRecord?.beforeBeginTime);

      const [beginDayjs, endDayjs] = [
        handleTimezoneToStoreId(dayjs(endTime), storeId),
        handleTimezoneToStoreId(dayjs(beginTime), storeId),
      ];
      const toDay = handleTimezoneToStoreId(dayjs(), storeId);

      t.timeStatus = endDayjs.unix() - toDay.unix() >= 0 ? 2 : 1;
      t.rowspan_style =
        t.timeStatus === 1 ? { height, background: '#dfe4ea' } : { height };
      // 已到店
      if (
        endDayjs.unix() < toDay.unix() &&
        toDay.unix() < beginDayjs.unix() &&
        omsAppointmentStoreRecord
      ) {
        t.rowspan_classname = styles['rowspan-current'];
        // 选中优先级更高
        t.rowspan_style.background = '';
      }
      // 超时未到店
      if (omsAppointmentStoreRecord?.status === 3) {
        t.rowspan_classname = styles['rowspan-expired'];
      }

      // 非首列的需要继续计算
      if (!t.firstColumn) {
        // 计算时间
        const diff = beginDayjs.diff(endDayjs, 'minute');
        t.minute =
          diff === 60 || !omsAppointmentStoreRecord ? '' : diff + 'min';
      }
      if (data['data']?.omsAppointmentStoreRecord) {
        console.log('🚀  有数据单元格', t.data);
        // console.log('🚀  data data:', data);
      }
      // if (data.key === '14221400') {
      //   console.log('🚀  TbodyTd  dataSource:', data);
      //   console.log('🚀  useEffect  t:', t);
      // }
      setDataSource(t);
      // if (t.firstColumn) {
      //   console.log('🚀  useEffect  t:', t);
      //   console.log('🚀  useEffect  data:', data);
      // }
    }
  }, [data]);

  return (
    <div
      className={styles['table-cell-td']}
      style={{
        height: cellHeight,
      }}
    >
      <div
        className={styles['td']}
        style={{
          ...dataSource.td_style,
          height: dataSource.height,
          zIndex: dataSource.rowSpan === 2 ? 2 : '',
        }}
      >
        {/* 首列 和 后续列*/}
        {dataSource.firstColumn ? (
          <div
            className={styles['firstTD']}
            style={{
              height: cellHeight * dataSource.rowSpan,
              width: '100%',
            }}
          >
            {dataSource.rowSpan === 2 ? (
              <div
                className={styles['firstTD-rowspan']}
                style={{
                  height: cellHeight * dataSource.rowSpan,
                  width: '100%',
                }}
              >
                {dataSource.text}
              </div>
            ) : (
              <div>{dataSource.text}</div>
            )}
          </div>
        ) : (
          <div
            style={{ ...dataSource.rowspan_style }}
            className={dataSource.rowspan_classname}
          >
            <div className={styles['tdContent']}>
              <div
                className={styles['left']}
                onClick={() => {
                  setOpen(true, data['data'], dataSource);
                }}
              >
                {dataSource.data.omsAppointmentStoreRecord ? (
                  <div className={styles['info']}>
                    <div className={styles['name']}>
                      {dataSource.data.omsAppointmentStoreRecord?.username ||
                        '-'}
                    </div>
                    <div className={styles['num']}>
                      {dataSource.data.omsAppointmentStoreRecord
                        ?.productAmount || '-'}{' '}
                      items
                    </div>
                    <div className={styles['phone']}>
                      +{dataSource.data.omsAppointmentStoreRecord?.phone || '-'}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className={styles['right']}>
                {dataSource.data.cancelRecords && (
                  <>
                    {/* 取消预约集合 */}
                    <FastMarquee pauseOnHover gradient={false} speed={10}>
                      {dataSource.data.cancelRecords?.map((d) => (
                        <Tag onClick={() => setOpenCancel(d.id!)} key={d.id}>
                          {d.username || '-'}
                        </Tag>
                      ))}
                    </FastMarquee>
                  </>
                )}
              </div>
            </div>
            {/* 绝对定位区域 */}
            <div>
              {/* 时间 */}
              <div className={styles['minute']}>{dataSource.minute}</div>
              {/* 更改过 */}
              {dataSource.update && (
                <div className={styles['update']}>
                  <Badge color="#f50" dot />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 休 */}
        {dataSource.rest && <div className={styles['rest']}>休</div>}
      </div>
    </div>
  );
});

export default TbodyTd;
