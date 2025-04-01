import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './index.module.scss';
import dayjs, { Dayjs } from 'dayjs';
import {
  Button,
  Spin,
  Form,
  Input,
  Row,
  Col,
  Select,
  Modal,
  message,
  InputNumber,
} from 'antd';
import {
  StoreStatusOption,
  ReservationMethodOption,
  handleTimezoneToStoreId,
  handleTransformTimezone,
} from 'constants/appointment-management';
import { Trans } from 'react-i18next';
import LOCALS from 'commons/locals';
import InputReservationUser, {
  ReservationUserType,
} from './input-reservation-user';
import InputTimeFrame, { TimeFrameType } from './input-time-frame';
import InputSelectTable from './input-select-table';
import {
  OmsAppointmentRecordInfoVO,
  OmsAppointmentStoreRecord,
  OmsRecycleOrderDetail,
  OmsAppointmentRecordVO,
} from 'types/oms';
import {
  fetchAppointmentCreate,
  fetchRecycleOrderInfo,
  fetchCancelRecycle,
  fetchAppointmentUpdate,
  fetchAppointmentStoreRecordInfo,
  fetchUnFinishedAppointmentList,
} from 'apis/oms';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { useAppSelector } from 'store/hooks';
import UploadImageTips from 'components/upload-image-tips';
import ClipboardJS from 'clipboard';
import ImageSliceShow from 'components/image-slice-show';
import i18n from 'i18next';

let timeout: any = undefined;

interface Props {
  open: boolean;
  onClose: () => void;
  data: OmsAppointmentRecordInfoVO;
  cellData: OmsAppointmentRecordVO;
  storeId: number;
  modalType: 'add' | 'viewDetail';
  getLoad: () => void;
  cancelRecordId: string;
}

interface ReservationFormType extends OmsAppointmentStoreRecord {
  user?: ReservationUserType;
  time?: TimeFrameType;
}

const ReservationModal = ({
  open,
  onClose,
  data,
  cellData,
  storeId,
  modalType,
  getLoad,
  cancelRecordId,
}: Props) => {
  const [form] = Form.useForm<ReservationFormType>();
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  /** 查询用户已初步估值订单信息 */
  const [orderList, setOrderList] = useState<OmsRecycleOrderDetail[]>([]);
  /** 担当者 */
  const { staffSelectOptions } = useAppSelector(selectGlobalInfo);

  /** 表单数据  */
  const [formTime, setFormTime] = useState<TimeFrameType>(); // 时段
  const [formUpload, setFormUpload] = useState<string[]>([]); // 上传图片
  const [formoSelectID, setFormoSelectID] = useState<string[]>([]); // 回收寄卖单id
  const [userData, setUserData] = useState<ReservationUserType>({});

  /** 渲染数据 */
  const [dataSource, setDataSource] = useState<OmsAppointmentRecordInfoVO>({}); // 最终的数据
  const [statusSelect, setStatusSelect] = useState<number>(1);

  useEffect(() => {
    new ClipboardJS('.copy-btn');
  }, []);

  useEffect(() => {
    if (cancelRecordId) getDetail(cancelRecordId);
  }, [cancelRecordId]);

  useEffect(() => {
    // const { memberId, email } = userData;
    // if (memberId) {
    //   getUnFinishedAppointmentList({ memberId });
    // } else {
    //   if (email) getUnFinishedAppointmentList({ email });
    // }
  }, [userData]);

  /** 单元格数据 通过id查询 */
  useEffect(() => {
    if (cellData && cellData.omsAppointmentStoreRecord) {
      getDetail(cellData.omsAppointmentStoreRecord.id + '');
    }
    const { beginTime, endTime } = cellData?.appointmentTimeConfiguration || {};
    if (beginTime && endTime) {
      setFormTime({ beginTime, endTime });
    }
  }, [cellData]);

  /** 处理详情数据 */
  const handleDetailDate = useCallback(
    (data: OmsAppointmentRecordInfoVO) => {
      if (Object.keys(data).length === 0) return;
      const { omsAppointmentStoreRecord, omsRecycleOrderInfoVOS } = data;
      if (omsAppointmentStoreRecord) {
        const {
          beginTime,
          endTime,
          followUpUserId,
          omsRecycleOrderIds,
          productAmount,
          productPics,
          createFrom,
          productTitle,
          remark,
          status,
          beforeBeginTime,
          beforeEndTime,
        } = omsAppointmentStoreRecord;
        setStatusSelect(status || 1);
        if (beginTime && endTime) {
          setFormTime({ beginTime, endTime, beforeBeginTime, beforeEndTime });
        }
        if (productPics) {
          const picList = JSON.parse(productPics);
          setFormUpload(picList);
        }
        if (omsRecycleOrderIds) {
          setFormoSelectID(JSON.parse(omsRecycleOrderIds));
        }
        form.setFieldsValue({
          productAmount,
          createFrom,
          productTitle,
          remark,
          omsRecycleOrderIds,
          followUpUserId,
        });
        setDataSource(data);
      }
      if (omsRecycleOrderInfoVOS && omsRecycleOrderInfoVOS.length > 0) {
        setOrderList(omsRecycleOrderInfoVOS);
      }
    },
    [form]
  );

  /** 表格数据 */
  useEffect(() => {
    if (data) {
      handleDetailDate(data);
    }
  }, [data, handleDetailDate]);

  /** 渲染表头 */
  const renderTitle = useCallback(() => {
    if (modalType === 'add') {
      return (
        <div className={styles.warpTitle}>
          <div className={styles.title}>{i18n.t(LOCALS.add_appointment_information)}</div>
        </div>
      );
    }
    if (modalType === 'viewDetail') {
      const beginTime = dataSource?.omsAappointmentTimeConfiguration?.beginTime;

      let classname = styles.select;
      let options = [...StoreStatusOption];
      if (statusSelect === 3) {
        classname = styles['select-red'];
      } else if (statusSelect === 2) {
        classname = styles['select-blue'];
      }
      const toDay = handleTimezoneToStoreId(dayjs(), storeId);
      const diff = dayjs(beginTime).unix() - toDay.unix() > 0;
      if (diff) {
        options = StoreStatusOption.filter((d) => [1, 2].includes(d.value));
      }

      return (
        <div className={styles.warpTitle}>
          <div className={styles.title}>{i18n.t(LOCALS.appointment_details)}</div>
          <div>
            {statusSelect === 4 ? (
              <>已取消</>
            ) : (
              <Select
                options={options}
                className={classname}
                bordered={false}
                value={statusSelect}
                onChange={(e) => {
                  setStatusSelect(e);
                }}
              ></Select>
            )}
          </div>
        </div>
      );
    }
  }, [modalType, statusSelect, dataSource, storeId]);

  /** 渲染用户信息 */
  const renderUserInfo = useCallback(() => {
    if (dataSource) {
      const { omsAppointmentStoreRecord } = dataSource;
      if (omsAppointmentStoreRecord) {
        const { email, phone, username, status, memberId } =
          omsAppointmentStoreRecord;
        let background = 'rgba(250, 250, 250, 1)';
        let color = '';
        if (status === 2) background = 'rgba(232, 244, 255, 1)';
        else if (status === 3) {
          background = 'rgba(197, 0, 0, 0.1)';
          color = 'rgba(197, 0, 0, 1)';
        } else if (status === 4) {
          background = 'rgba(0, 0, 0, 0.1)';
          color = 'rgba(0, 0, 0, 1)';
        }

        return (
          <>
            {modalType === 'viewDetail' && (
              <Row style={{ background }} className={styles.info}>
                <Col span={20} className={styles.left}>
                  <div className={styles.name}>{username}</div>
                  {memberId && (
                    <div className={styles.items}>{i18n.t(LOCALS.member_id)}：{memberId}</div>
                  )}
                  <div className={styles.items}>
                    {i18n.t(LOCALS.phone_number)}：+{phone}
                    <Button
                      type="link"
                      style={{ color }}
                      data-clipboard-text={`+${phone}`}
                      className="copy-btn"
                      onClick={() => message.success(i18n.t(LOCALS.successful_operation))}
                    >
                     {i18n.t(LOCALS.copy)}
                    </Button>
                  </div>
                  <div className={styles.items}>
                    {i18n.t(LOCALS.email)}：{}
                    <Button
                      type="link"
                      style={{ color }}
                      data-clipboard-text={email}
                      className="copy-btn"
                      onClick={() => message.success(i18n.t(LOCALS.successful_operation))}
                    >
                      {i18n.t(LOCALS.copy)}
                    </Button>
                  </div>
                </Col>
                <Col span={4} className={styles.right}>
                  <div> {i18n.t(LOCALS.appointment_number)}：{omsAppointmentStoreRecord.code}</div>
                </Col>
              </Row>
            )}
          </>
        );
      }
    }
  }, [dataSource, modalType]);

  /** 创建预约 */
  const getCreate = useCallback(
    (data: OmsAppointmentStoreRecord) => {
      setEditLoading(true);
      fetchAppointmentCreate(data)
        .then((data) => {
          message.success(i18n.t(LOCALS.successful_operation));
          getLoad();
          onClose();
        })
        .catch((e) => {
          message.error(e.message);
        })
        .finally(() => {
          setEditLoading(false);
        });
    },
    [getLoad, onClose]
  );

  /** 修改预约 */
  const getUpdate = useCallback(
    (data: OmsAppointmentStoreRecord) => {
      setEditLoading(true);
      fetchAppointmentUpdate(data)
        .then((data) => {
          message.success(i18n.t(LOCALS.successful_operation));
          getLoad();
          onClose();
        })
        .catch((e) => {
          message.error(e.message);
        })
        .finally(() => {
          setEditLoading(false);
        });
    },
    [getLoad, onClose]
  );

  /** 查询用户已初步估值订单信息 */
  const getRecycleOrderInfo = (memberId: number) => {
    setLoading(true);
    fetchRecycleOrderInfo(memberId)
      .then((data) => {
        setOrderList(data.data);
      })
      .catch((e) => {
        message.error(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /** 查询用户当前是否有未完成的预约 */
  const getUnFinishedAppointmentList = ({
    memberId,
    email,
  }: {
    memberId?: number;
    email?: string;
  }) => {
    setLoading(true);
    fetchUnFinishedAppointmentList({ memberId, email })
      .then((data) => {
        if (data.data.length) {
          message.warning(i18n.t(LOCALS.no_new_appointments_allowed), 6);
          onClose();
        } else {
          if (memberId) getRecycleOrderInfo(memberId);
        }
      })
      .catch((e) => {
        message.error(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /** 取消预约 */
  const getCancel = useCallback(() => {
    const { omsAppointmentStoreRecord } = dataSource;
    const { id } = omsAppointmentStoreRecord || {};
    setCancelLoading(true);
    fetchCancelRecycle(id + '')
      .then((data) => {
        message.success(i18n.t(LOCALS.successful_operation));
        getLoad();
        onClose();
      })
      .catch((e) => {
        message.error(e.message);
      })
      .finally(() => {
        setCancelLoading(false);
      });
  }, [dataSource, getLoad, onClose]);

  /** 获取详情信息 */
  const getDetail = (id: string) => {
    setLoading(true);
    fetchAppointmentStoreRecordInfo(id)
      .then((data) => {
        handleDetailDate(data.data);
      })
      .catch((e) => {
        message.error(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /** 搜索 */
  const onFinish = useCallback(() => {
    form
      .validateFields()
      .then((values: ReservationFormType) => {
        setLoading(true);
        console.log('🚀  .then  values:', values);
        //
        const {
          user,
          followUpUserId,
          omsRecycleOrderIds = [],
          productAmount,
          productPics,
          productTitle,
          remark,
          time,
        } = values;

        const { beginTime, endTime } = time || {};

        if (omsRecycleOrderIds?.length === 0 && !productPics) {
          message.warning('商品和商品照片必须选择一项');
          return;
        }

        if (modalType === 'add') {
          const { appointmentTimeConfiguration } = cellData;
          const { id: appointmentTimeId } = appointmentTimeConfiguration || {};
          let username: string = '';
          username += user?.firstName;
          username += user?.lastName;
          const payload: OmsAppointmentStoreRecord = {
            appointmentTimeId: appointmentTimeId + '',
            email: user?.email,
            memberId: user?.memberId,
            phone: user?.phone,
            followUpUserId,
            beginTime: handleTransformTimezone(
              dayjs(beginTime),
              storeId
            ).format(),
            endTime: handleTransformTimezone(dayjs(endTime), storeId).format(),
            productAmount,
            productPics,
            productTitle,
            remark,
            omsRecycleOrderIds: JSON.stringify(omsRecycleOrderIds),
            storeId,
            username,
          };
          getCreate(payload);
        } else if (modalType === 'viewDetail') {
          //
          const {
            omsAppointmentStoreRecord,
            omsAappointmentTimeConfiguration,
          } = dataSource;
          const appointmentTimeId = omsAappointmentTimeConfiguration?.id;
          const { id: appointmentId } = omsAppointmentStoreRecord || {};

          const payload: OmsAppointmentStoreRecord = {
            appointmentId: appointmentId + '',
            appointmentTimeId: appointmentTimeId,
            beginTime: handleTransformTimezone(
              dayjs(beginTime),
              storeId
            ).format(),
            endTime: handleTransformTimezone(dayjs(endTime), storeId).format(),
            followUpUserId,
            productAmount,
            productPics,
            productTitle,
            remark,
            omsRecycleOrderIds: JSON.stringify(omsRecycleOrderIds),
            storeId,
            status: statusSelect,
          };
          getUpdate(payload);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [
    cellData,
    dataSource,
    form,
    getCreate,
    modalType,
    storeId,
    getUpdate,
    statusSelect,
  ]);

  /** 渲染弹窗按钮 */
  const renderFooter = useCallback(() => {
    // 已取消，不能再操作
    const status = dataSource?.omsAppointmentStoreRecord?.status;
    if (status === 4 || status === 3) {
      return [];
    }
    // 判断时间是否过期
    // const { omsAappointmentTimeConfiguration } = dataSource;
    // const {
    //   beginTime,
    //   endTime,
    //   storeId = 1,
    // } = omsAappointmentTimeConfiguration || {};
    // const [beginDayjs, endDayjs] = [
    //   handleTimezoneToStoreId(dayjs(endTime), storeId),
    //   handleTimezoneToStoreId(dayjs(beginTime), storeId),
    // ];
    // const toDay = handleTransformTimezone(dayjs(), storeId);
    /** 1日期过期   2没过期 */
    // const timeTtatus = beginDayjs.unix() - toDay.unix() >= 0 ? 2 : 1;
    // if (timeTtatus === 1) {
    //   return [];
    // }

    if (modalType === 'viewDetail') {
      return [
        <Button onClick={() => onClose()} key={'cancel'}>
          {i18n.t(LOCALS.cancel)}
        </Button>,
        <Button
          onClick={() => getCancel()}
          key={'cancelAnAppointment'}
          loading={cancelLoading}
        >
          {i18n.t(LOCALS.cancel_appointment)}
        </Button>,
        <Button
          type="primary"
          onClick={() => onFinish()}
          key={'save'}
          loading={editLoading}
        >
          {i18n.t(LOCALS.confirm)}
        </Button>,
      ];
    } else if (modalType === 'add') {
      return [
        <Button onClick={() => onClose()} key={'cancel'}>
          {i18n.t(LOCALS.cancel)}
        </Button>,
        <Button
          type="primary"
          onClick={() => onFinish()}
          key={'add'}
          loading={editLoading}
        >
          {i18n.t(LOCALS.add)}
        </Button>,
      ];
    }
  }, [
    modalType,
    onFinish,
    editLoading,
    onClose,
    getCancel,
    cancelLoading,
    dataSource,
  ]);

  const status = dataSource.omsAppointmentStoreRecord?.status || 1;

  return (
    <Modal
      open={open}
      title={renderTitle()}
      onCancel={() => onClose()}
      onOk={onFinish}
      className={styles.ReservationModal}
      destroyOnClose
      confirmLoading={loading}
      width={'60%'}
      footer={renderFooter()}
    >
      {renderUserInfo()}

      <Spin spinning={loading}>
        <Form
          form={form}
          layout="horizontal"
          initialValues={{ createFrom: 2 }}
          className={styles.form}
        >
          <Row gutter={[24, 0]}>
            {modalType === 'add' && (
              <Col span={24}>
                <Form.Item
                  label={i18n.t(LOCALS.customer_info)}
                  name="user"
                  validateTrigger="onChange"
                  rules={[
                    { required: true },
                    {
                      validator: async (_, value) => {
                        if (!value.firstName || !value.lastName) {
                          return Promise.reject(i18n.t(LOCALS.fill_in_customer_name));
                        }
                        if (!value.phone) {
                          return Promise.reject(i18n.t(LOCALS.fill_in_phone_number));
                        }
                        if (!value.email) {
                          return Promise.reject(i18n.t(LOCALS.fill_in_email));
                        }
                        // 优先memberId
                        if (value.memberId) {
                          /** 防抖 */
                          if (timeout) {
                            clearTimeout(timeout);
                            timeout = null;
                          }
                          const p = new Promise((resolve, reject) => {
                            timeout = setTimeout(async () => {
                              const { data } =
                                await fetchUnFinishedAppointmentList({
                                  memberId: value.memberId,
                                  email: '',
                                });
                              if (data.length > 0) {
                                const message = i18n.t(LOCALS.no_new_appointments_allowed);
                                return reject(
                                  new Error(
                                    message
                                  )
                                );
                              } else {
                                getRecycleOrderInfo(value.memberId);
                              }
                              return resolve(undefined);
                            }, 666);
                          });
                          await p;
                        }
                        if (value.email && !value.memberId) {
                          /** 防抖 */
                          if (timeout) {
                            clearTimeout(timeout);
                            timeout = null;
                          }
                          const p = new Promise((resolve, reject) => {
                            timeout = setTimeout(async () => {
                              const { data } =
                                await fetchUnFinishedAppointmentList({
                                  memberId: 0,
                                  email: value.email,
                                });
                              if (data.length > 0) {
                                const message = i18n.t(LOCALS.no_new_appointments_allowed);
                                return reject(
                                  new Error(
                                    message
                                  )
                                );
                              }
                              return resolve(undefined);
                            }, 666);
                          });
                          await p;
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputReservationUser
                    onChange={(e) => {
                      setUserData(e);
                    }}
                  />
                </Form.Item>
              </Col>
            )}

            <Col span={12}>
              <Form.Item
                label={i18n.t(LOCALS.appointment_time_slot)}
                name="time"
                rules={[{ required: true }]}
              >
                <InputTimeFrame
                  data={formTime}
                  storeId={storeId}
                  // disabled={modalType === 'add'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={i18n.t(LOCALS.staff)} name="followUpUserId">
                <Select options={staffSelectOptions}></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={i18n.t(LOCALS.appointment_method)}
                name="createFrom"
                rules={[{ required: true }]}
              >
                <Select options={ReservationMethodOption} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={i18n.t(LOCALS.quantity_of_products)}
                name="productAmount"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} />
              </Form.Item>
            </Col>

            {orderList.length ? (
              <Col span={24}>
                <Form.Item
                  label={modalType === 'viewDetail' ? null : '选择商品'}
                  name="omsRecycleOrderIds"
                  validateTrigger="onChange"
                >
                  <InputSelectTable
                    dataSource={orderList}
                    selectId={formoSelectID}
                  />
                </Form.Item>
              </Col>
            ) : null}

            <Col span={24}>
              <Form.Item
                label={modalType === 'viewDetail' ? null : i18n.t(LOCALS.product_photos)}
                name="productPics"
                shouldUpdate
                rules={[
                  {
                    validator: async (_: any, value: any) => {
                      const omsRecycleOrderIds =
                        form.getFieldValue('omsRecycleOrderIds');
                      if (omsRecycleOrderIds && omsRecycleOrderIds.length) {
                        return Promise.resolve();
                      }
                      if (value && value.length) {
                        return Promise.resolve();
                      }
                      if (formoSelectID.length > 0) {
                        return Promise.resolve();
                      }
                      // 不知道什么原因，写上这个err是会弹出，但不影响提交
                      // return Promise.reject('请输入');
                    },
                  },
                ]}
              >
                {/* 已取消的只展示 */}
                {status === 4 ? (
                  <ImageSliceShow
                    imgList={formUpload}
                    endSliceNumber={formUpload.length}
                  />
                ) : (
                  <UploadImageTips max={9} uploadList={formUpload} disabled />
                )}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label={i18n.t(LOCALS.product_info)} name="productTitle">
                {status === 4 ? (
                  <div className={styles.formItemText}>
                    {dataSource.omsAppointmentStoreRecord?.productTitle}
                  </div>
                ) : (
                  <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={i18n.t(LOCALS.remark)} name="remark">
                {status === 4 ? (
                  <div>{dataSource.omsAppointmentStoreRecord?.remark}</div>
                ) : (
                  <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};
export default ReservationModal;
