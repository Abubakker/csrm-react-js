import { useRef, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Spin, Divider } from 'antd';
import TableRowSpan from './components/table-row-span';
import BarTop from './components/bar-top';
import BarSearch from './components/bar-search';
import TableList from './components/table-list';
import ReservationModal from './components/reservation-modal';
import {
  fetchWeekTotalList,
  fetchAppointmentStoreRecordPage,
  fetchAppointmentStatusTotal,
} from 'apis/oms';
import {
  OmsAppointmentPayload,
  OmsAppointmentDateVO,
  OmsAppointmentRecordInfoVO,
  OmsAppointmentStatusTotal,
  OmsAppointmentRecordVO,
} from 'types/oms';
import usePagination from 'commons/hooks/usePagination';

const AppointmentManagementList = () => {
  /** 弹窗相关 */
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'viewDetail'>('add');
  const rowData = useRef<OmsAppointmentRecordInfoVO>({}); // 预约总览行点击
  const cellData = useRef<OmsAppointmentRecordVO>({}); // 周视图单元格点击
  const cancelRecordId = useRef<string>(''); // 取消的预约

  const [loadingView, setLoadingView] = useState(false);
  /** 视图数据 */
  const [tableSpanData, setTableSpanData] = useState<OmsAppointmentDateVO[]>(
    []
  );
  /** 统计总数 */
  const [statusTotal, setStatusTotal] = useState<OmsAppointmentStatusTotal>({});
  /** 传入参数 全局参数 视图参数*/
  const payloadWeekRef = useRef<OmsAppointmentPayload>({ storeId: 1 });
  /** 传入参数 部分参数 总览参数*/
  const payloadOverviewRef = useRef<OmsAppointmentPayload>({
    pageNum: 1,
    pageSize: 10,
  });

  /** Table */
  const {
    loading,
    setLoading,
    pageNum,
    setPageNum,
    pageSize,
    setPageSize,
    total,
    setTotal,
    dataSource,
    setDataSource,
  } = usePagination<OmsAppointmentRecordInfoVO>();

  /** 视图接口 */
  const getTableSpan = () => {
    setLoadingView(true);
    fetchWeekTotalList(payloadWeekRef.current)
      .then((d) => {
        const { data } = d;
        setTableSpanData(data);
      })
      .finally(() => {
        setLoadingView(false);
      });
  };

  /** 表格接口 */
  const getOverview = () => {
    setLoading(true);
    fetchAppointmentStoreRecordPage({
      ...payloadWeekRef.current,
      ...payloadOverviewRef.current,
    })
      .then((d) => {
        const { data } = d;
        const { list, total, pageNum, pageSize } = data;
        if (data) {
          setDataSource(list as OmsAppointmentRecordInfoVO[]);
          setTotal(total || 0);
          setPageNum(pageNum || 1);
          setPageSize(pageSize || 10);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /** 统计接口 */
  const getStatusTotal = () => {
    fetchAppointmentStatusTotal(payloadWeekRef.current.storeId || 1)
      .then((d) => {
        const { data } = d;
        setStatusTotal(data);
      })
      .finally(() => {});
  };

  return (
    <div className={styles.AppointmentManagementList}>
      {/* 视图 */}
      <Spin spinning={loadingView}>
        <BarTop
          setPayload={(week, storeId) => {
            const payload = {
              beginDate: week[0],
              endDate: week[1],
              storeId,
            };
            payloadWeekRef.current = payload;
            getTableSpan();
            getOverview();
            getStatusTotal();
          }}
        />
        <Divider />
        <TableRowSpan
          storeId={payloadWeekRef.current.storeId || 1}
          data={tableSpanData}
          setOpen={(b, data, dataSource) => {
            cellData.current = data;
            rowData.current = {};
            cancelRecordId.current = '';
            // 过期
            if (dataSource.timeStatus === 1) {
              // 有数据
              if (data.omsAppointmentStoreRecord) {
                setModalType('viewDetail');
                setOpen(b);
              }
            }
            // 没过期
            if (dataSource.timeStatus === 2) {
              if (data.omsAppointmentStoreRecord) {
                setModalType('viewDetail');
              } else {
                setModalType('add');
              }
              setOpen(b);
            }
          }}
          setOpenCancel={(id: string) => {
            cancelRecordId.current = id;
            setModalType('viewDetail');
            setOpen(true);
          }}
        />
      </Spin>
      {/* 预约总览 */}
      <Spin spinning={loading}>
        <BarSearch
          statusTotal={statusTotal}
          total={total}
          onSearch={(data: OmsAppointmentPayload) => {
            payloadOverviewRef.current = { ...data, pageNum: 1, pageSize: 10 };
            getOverview();
          }}
        />
        <TableList
          dataSource={dataSource}
          total={total}
          pageNum={pageNum}
          pageSize={pageSize}
          setOpen={(b, data, modalType) => {
            setOpen(b);
            cellData.current = {};
            rowData.current = data;
            cancelRecordId.current = '';
            setModalType(modalType);
          }}
          setPage={(page, pageSize) => {
            payloadOverviewRef.current.pageNum = page;
            payloadOverviewRef.current.pageSize = pageSize;
            getOverview();
          }}
        />
      </Spin>

      {open && (
        <ReservationModal
          open={open}
          modalType={modalType}
          storeId={payloadWeekRef.current.storeId || 1}
          onClose={() => setOpen(false)}
          data={rowData.current}
          cellData={cellData.current}
          cancelRecordId={cancelRecordId.current}
          getLoad={() => {
            getTableSpan();
            getOverview();
            getStatusTotal();
          }}
        />
      )}
    </div>
  );
};
export default AppointmentManagementList;
