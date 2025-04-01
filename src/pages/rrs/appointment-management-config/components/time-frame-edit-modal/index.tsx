import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.module.scss';
import dayjs from 'dayjs';
import {
  Form,
  Input,
  Row,
  Col,
  Modal,
  Popconfirm,
  TimePicker,
  message,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  OmsAppointmentDateListVO,
  OmsAppointmentDateUpdate,
  OmsAappointmentTimeConfiguration,
} from 'types/oms';
import {
  handleTimezoneToStoreId,
  handleTransformTimezone,
} from 'constants/appointment-management';
import LOCALS from 'commons/locals';
import i18n from 'i18next';
interface Props {
  open: boolean;
  onClose: () => void;
  data?: OmsAppointmentDateListVO;
  onOk: (data: OmsAppointmentDateUpdate) => void;
}
/** 非入侵试的 type */
interface tempType1 {
  del?: number;
  add?: number;
}
interface OmsAappointmentTimeConfigurationTempType
  extends OmsAappointmentTimeConfiguration,
    tempType1 {}

const TimeFrameEditModal = ({ open, onClose, data, onOk }: Props) => {
  const [form] = Form.useForm<any>();
  const [loading] = useState(false);
  /** Form渲染 */
  const [timeList, setTimeList] = useState<
    OmsAappointmentTimeConfigurationTempType[]
  >([]);
  console.log('🚀  TimeFrameEditModal  timeList:', timeList);

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;
    const storeId = data?.omsAppointmentDateConfiguration?.storeId || 1;
    const formData: any = {};
    const list: OmsAappointmentTimeConfiguration[] = [];
    data.omsAappointmentTimeConfigurationList?.forEach((d) => {
      const beginTime = handleTimezoneToStoreId(dayjs(d.beginTime), storeId);
      const endTime = handleTimezoneToStoreId(dayjs(d.endTime), storeId);
      formData[d.id || 0] = [beginTime, endTime];
      list.push({
        ...d,
        beginTime: beginTime.format(),
        endTime: endTime.format(),
      });
    });
    setTimeList(list);
    form.setFieldsValue(formData);
  }, [data]);

  useEffect(() => {}, []);

  /** 确认 */
  const onFinish = () => {
    form.validateFields().then((values: any) => {
      const { remark } = values;
      const deleteIds: string[] = [];
      const appointmentTimes: { beginTime: string; endTime: string }[] = [];
      const { id, storeId = 1 } = data?.omsAppointmentDateConfiguration || {};
      let b = timeList.every((d) => {
        if (d.del) {
          deleteIds.push(d.id + '');
          return true;
        } else {
          appointmentTimes.push({
            beginTime: handleTimezoneToStoreId(
              dayjs(d.beginTime).second(0),
              storeId
            ).format(),
            endTime: handleTimezoneToStoreId(
              dayjs(d.endTime).second(0),
              storeId
            ).format(),
          });
          if (
            ['00', '30'].includes(dayjs(d.beginTime).format('mm')) &&
            ['00', '30'].includes(dayjs(d.endTime).format('mm'))
          ) {
            return true;
          }
          return false;
        }
      });
      if (!b) {
        message.warning('时间格式错误');
        return;
      }

      const payload = {
        appointmentDateId: id,
        storeId,
        deleteIds,
        remark,
        appointmentTimes,
      } as OmsAppointmentDateUpdate;
      console.log('🚀  form.validateFields  payload:', payload);
      onOk(payload);
    });
  };

  /** 标题 */
  const title = useCallback(() => {
    const storeId = data?.omsAppointmentDateConfiguration?.storeId || 1;
    return `${handleTimezoneToStoreId(
      dayjs(data?.omsAppointmentDateConfiguration?.appointmentDate),
      storeId
    ).format('YYYY-MM-DD')} ${i18n.t(LOCALS.appointment_slot_editing)}`;
  }, [data]);

  /** 删除 */
  const onDel = (data: OmsAappointmentTimeConfiguration, index: number) => {
    const list = [...timeList];
    if (list[index].add) {
      // 如果是手动增加的，则直接删除
      list.splice(index, 1);
    } else {
      list[index].del = 1;
    }
    setTimeList(list);
  };

  /** 增加 */
  const onAdd = (data: OmsAappointmentTimeConfiguration, index: number) => {
    const list = [...timeList];
    const id = `${data?.id || 0}_${index + 1}_copy`;
    list.splice(index + 1, 0, { id, add: 1 });
    setTimeList(list);
  };

  const storeId = data?.omsAppointmentDateConfiguration?.storeId || 1;

  return (
    <Modal
      open={open}
      title={title()}
      onCancel={() => onClose()}
      onOk={onFinish}
      className={styles.TimeFrameEditModal}
      destroyOnClose
      confirmLoading={loading}
      width={500}
    >
      <Form
        form={form}
        layout="horizontal"
        initialValues={{}}
        className={styles.form}
      >
        <Row gutter={[24, 0]}>
          <Col span={24}>
            {timeList.map(
              (d, i) =>
                !d.del && (
                  <Row gutter={[24, 0]} key={i}>
                    <Col span={20} className={styles.input} key={d.id}>
                      <Form.Item
                        name={d.id}
                        rules={[
                          {
                            required: true,
                            message: '请输入完整',
                          },
                        ]}
                      >
                        <TimePicker.RangePicker
                          style={{ width: '100%' }}
                          format={'HH:mm'}
                          minuteStep={30}
                          onChange={(e) => {
                            if (e && e.length && e[0] && e[1]) {
                              const list = [...timeList];
                              const appointmentDate =
                                data?.omsAppointmentDateConfiguration
                                  ?.appointmentDate;
                              const day = handleTimezoneToStoreId(
                                dayjs(appointmentDate),
                                storeId
                              ).format('YYYY-MM-DD');
                              const val0 = dayjs(
                                e[0].format(`${day} HH:mm:ss`)
                              );
                              list[i].beginTime = handleTransformTimezone(
                                val0,
                                storeId
                              ).format();
                              const val1 = dayjs(
                                e[1].format(`${day} HH:mm:ss`)
                              );
                              list[i].endTime = handleTransformTimezone(
                                val1,
                                storeId
                              ).format();
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4} className={styles.btn}>
                      <PlusOutlined onClick={() => onAdd(d, i)} />
                      <Popconfirm
                        title={i18n.t(LOCALS.caution)}
                        description={
                          <div className={styles.Popconfirm}>{i18n.t(LOCALS.confirm_submission)}</div>
                        }
                        onConfirm={() => onDel(d, i)}
                        okText={i18n.t(LOCALS.confirm)}
                        cancelText={i18n.t(LOCALS.cancel)}
                        key={'ok'}
                      >
                        <DeleteOutlined />
                      </Popconfirm>
                    </Col>
                  </Row>
                )
            )}
          </Col>
          <Col span={24}>
            <Form.Item label={i18n.t(LOCALS.remark)} name="remark">
              <Input.TextArea maxLength={500} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default TimeFrameEditModal;
