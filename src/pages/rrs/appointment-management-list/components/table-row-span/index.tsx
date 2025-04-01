import { useCallback, memo, useRef, useEffect, useState } from 'react';
import styles from './index.module.scss';
import dayjs, { Dayjs } from 'dayjs';
import { Empty } from 'antd';
import { OmsAppointmentRecordVO, OmsAppointmentDateVO } from 'types/oms';
import TbodyTd, { dataSourceType } from './tbody-td';
import _ from 'lodash';
import { handleTimezoneToStoreId } from 'constants/appointment-management';
import { handleStep1, handleStep2, handleStep3 } from './utils';

const handleData = (dataSource: OmsAppointmentDateVO[], storeId: number) => {
  const { beginList_All, endList_All, thead } = handleStep1(
    dataSource,
    storeId
  );

  const { contentList, dayTimeFrame, halfHour } = handleStep2(
    dataSource,
    beginList_All,
    endList_All,
    storeId
  );

  const { tbody } = handleStep3(contentList, dayTimeFrame, thead, halfHour);

  return { thead, tbody };
};

interface Props {
  data: OmsAppointmentDateVO[];
  setOpen: (
    b: boolean,
    data: OmsAppointmentRecordVO,
    dataSource: dataSourceType
  ) => void;
  setOpenCancel: (id: string) => void;
  storeId: number;
}

const TableRowSpan = ({ data, setOpen, storeId, setOpenCancel }: Props) => {
  const [{ thead, tbody }, setDataSource] = useState<any>({
    thead: {},
    tbody: [],
  });

  useEffect(() => {
    if (data.length === 0) {
      setDataSource({ thead: {}, tbody: [] });
      return;
    }
    const { thead, tbody } = handleData(data, storeId);
    setDataSource({ thead, tbody });
  }, [data, storeId]);

  return (
    <div className={styles['TableRowSpan']}>
      <div className={styles['table']}>
        {/* 表头 */}
        <div className={styles['table-thead']}>
          <div className={styles['table-row']}>
            {Object.keys(thead).map((key) => {
              let toDay_classname = '';
              if (typeof thead[key] === 'object' && thead[key]) {
                toDay_classname =
                  handleTimezoneToStoreId(dayjs(), storeId).format('DD') ===
                  thead[key]['date']
                    ? styles['toDay']
                    : '';
              }
              return (
                <div className={styles['table-cell-th']} key={key}>
                  {typeof thead[key] === 'object' && thead[key] ? (
                    <div className={styles['th']}>
                      <div className={toDay_classname}>
                        <div className={styles['week']}>
                          {thead[key]['week']}
                        </div>
                        <div className={styles['date']}>
                          {thead[key]['date']}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles['th']}>
                      <div className={styles['week']}>{thead[key]}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* 内容  */}
        <div className={styles['table-tbody']}>
          {tbody.map((tr: any) => (
            <div className={styles['table-row']} key={tr.key}>
              {Object.keys(thead).map((key) => (
                <TbodyTd
                  data={tr[key]}
                  key={key}
                  setOpen={setOpen}
                  setOpenCancel={setOpenCancel}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {data.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </div>
  );
};
export default TableRowSpan;
