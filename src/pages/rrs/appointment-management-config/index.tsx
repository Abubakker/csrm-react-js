import { useCallback, useRef, useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Button, Table, message, Radio, Switch } from 'antd';
import TimeFrameEditModal from './components/time-frame-edit-modal';
import {
  fetchAppointmentDateList,
  fetchOperateAppointmentDate,
  fetchUpdateAppointmentDate,
} from 'apis/oms';
import {
  OmsAppointmentDateListVO,
  OmsOperateAppointment,
  OmsAppointmentDateUpdate,
} from 'types/oms';
import dayjs from 'dayjs';
import {
  cityList,
  handleTimezoneToStoreId,
} from 'constants/appointment-management';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';

const AppointmentManagementConfig = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const currRowRef = useRef<OmsAppointmentDateListVO>();
  const [storeId, setStoreId] = useState<number>(1);

  const [dataSource, setDataSource] = useState<OmsAppointmentDateListVO[]>();

  useEffect(() => {
    getLoad();
  }, [storeId]);

  const getLoad = () => {
    setLoading(true);
    fetchAppointmentDateList(storeId)
      .then((d) => {
        const { data } = d;
        setDataSource(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /** 切换状态 */
  const operateAppointmentDate = useCallback(
    (data: OmsOperateAppointment) => {
      fetchOperateAppointmentDate({ ...data, storeId })
        .then((d) => {
          message.success(i18n.t(LOCALS.successful_operation));
          getLoad();
        })
        .catch((d) => {
          message.error(d.message);
        })
        .finally(() => {});
    },
    [storeId]
  );

  /** 弹窗保存 */
  const updateAppointmentDate = (data: OmsAppointmentDateUpdate) => {
    fetchUpdateAppointmentDate(data)
      .then((d) => {
        message.success(i18n.t(LOCALS.successful_operation));
        setOpen(false);
        getLoad();
      })
      .catch((d) => {
        message.error(d.message);
      })
      .finally(() => {});
  };

  return (
    <div className={styles.AppointmentManagementConfig}>
      <div className={styles.title}>
        <div className={styles.subTitle}>{i18n.t(LOCALS.appointment_date_configuration)}</div>
        <div>
          <Radio.Group
            options={cityList}
            onChange={(e) => setStoreId(e.target.value)}
            value={storeId}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
      </div>

      <div className={styles.table}>
        <Table
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
              width: '10%',
              render: (_, _1, index) => index + 1,
            },
            {
              title: i18n.t(LOCALS.date),
              dataIndex: 'date',
              key: 'date',
              width: '10%',
              render: (_, record) =>
                handleTimezoneToStoreId(
                  dayjs(
                    record?.omsAppointmentDateConfiguration?.appointmentDate
                  ),
                  storeId
                ).format('MM-DD'),
            },
            {
              title: i18n.t(LOCALS.time_slot),
              dataIndex: 'time',
              key: 'time',
              width: '50%',
              render: (_, record) => {
                const list =
                  record?.omsAappointmentTimeConfigurationList?.map((d) => {
                    const beginTime = handleTimezoneToStoreId(
                      dayjs(d.beginTime),
                      storeId
                    ).format('HH:mm');
                    const endTime = handleTimezoneToStoreId(
                      dayjs(d.endTime),
                      storeId
                    ).format('HH:mm');
                    return `${beginTime}~${endTime}`;
                  }) || [];
                return (
                  <div className={styles.timeWarp}>
                    {list.map((d) => (
                      <div className={styles.time} key={d}>
                        {d}
                      </div>
                    ))}
                  </div>
                );
              },
            },
            {
              title: i18n.t(LOCALS.note),
              dataIndex: 'remark',
              key: 'remark',
              width: '10%',
              render: (_, record) =>
                record?.omsAppointmentDateConfiguration?.remark,
            },
            {
              title: i18n.t(LOCALS.status),
              dataIndex: 'status',
              key: 'status',
              width: '10%',
              render: (_, record) => (
                <Switch
                  checkedChildren="NO"
                  unCheckedChildren="OFF"
                  checked={
                    record?.omsAppointmentDateConfiguration?.status === 0
                  }
                  onChange={(e) => {
                    operateAppointmentDate({
                      appointmentDateId:
                        record.omsAppointmentDateConfiguration?.id!,
                      status: e ? 0 : 1,
                    });
                  }}
                />
              ),
            },
            {
              title: i18n.t(LOCALS.option),
              dataIndex: 'option',
              key: 'option',
              width: '10%',
              render: (_, record) => (
                <Button
                  type="link"
                  onClick={() => {
                    currRowRef.current = record;
                    setOpen(true);
                  }}
                >
                  {i18n.t(LOCALS.edit)}
                </Button>
              ),
            },
          ]}
          dataSource={dataSource}
          scroll={{ x: 'max-content', y: 'max-content' }}
          rowKey={(d) => d.omsAppointmentDateConfiguration?.id || 0}
          loading={loading}
        />
      </div>

      {open && (
        <TimeFrameEditModal
          open={open}
          onClose={() => setOpen(false)}
          data={currRowRef.current}
          onOk={updateAppointmentDate}
        />
      )}
    </div>
  );
};
export default AppointmentManagementConfig;
