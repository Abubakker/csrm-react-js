import { useCallback, useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Form, Modal, message, Radio, Space, Spin, Input } from 'antd';
import {
  OmsRecycleOrderDetail,
  OmsAppointmentRecordDTO,
  omsRecycleOrderCreateLogisticsAddressDTO,
} from 'types/oms';
import { UmsMemberReceiveAddressV1 } from 'types/ums';
import { fetchOrderReservation, fetchCreateLogisticsAddress } from 'apis/oms';
import { getMemberReceiveAddressListV1 } from 'apis/ums';
import UploadImageTips from '../input-components/upload-image-tips';
import SelectStoreAddress from '../input-components/select-store-address';
import SelectAppointment from '../input-components/select-appointment';

interface Props {
  open: boolean;
  onClose: () => void;
  data: OmsRecycleOrderDetail;
  reload: () => void;
}

const DeliverGoodsModal = ({ open, onClose, data, reload }: Props) => {
  const [form] = Form.useForm<any>();
  const [loading, setLoading] = useState(false);
  /** 用户收货地址集合 */
  const [addressList, setAddressList] = useState<UmsMemberReceiveAddressV1[]>(
    []
  );
  const [loadingAddress, setLoadingAddress] = useState(false);
  /** 预约 or 邮寄 */
  const [switchType, setSwitchType] = useState(1);

  /** 用户寄件地址 */
  const fetchMemberReceiveAddressList = useCallback(
    (memberId: number) => {
      setLoadingAddress(true);
      getMemberReceiveAddressListV1(memberId)
        .then(({ data }) => {
          setAddressList(data);
          // 选中默认地址
          const t = data.find((d) => d.defaultStatus === 1);
          form.setFieldsValue({ address: t?.id });
        })
        .finally(() => {
          setLoadingAddress(false);
        });
    },
    [form]
  );

  useEffect(() => {
    if (Object.keys(data).length && data?.omsRecycleOrder?.memberId) {
      fetchMemberReceiveAddressList(data?.omsRecycleOrder?.memberId);
    }
  }, [data, fetchMemberReceiveAddressList]);

  /** 获取用户收货地址 */

  const onFinish = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);
        const id = data.omsRecycleOrder?.id;
        if (switchType === 1) {
          const { remark } = values.selectAppointmentt;
          const payload = values.selectAppointmentt as OmsAppointmentRecordDTO;
          const memberId = data?.omsRecycleOrder?.memberId;
          const omsRecycleOrderIds = JSON.stringify([id]);
          fetchOrderReservation({
            ...payload,
            remark,
            memberId,
            omsRecycleOrderIds,
            productPics: '[]',
          })
            .then(() => {
              message.success('上传成功！');
              onClose();
              reload();
            })
            .catch((e) => {
              message.error(e.message);
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          const { addressId, postStore, shippingDocument } = values;
          const shippingJSON = JSON.parse(shippingDocument);
          const image = shippingJSON.length ? shippingJSON[0] : '';
          const {
            city,
            detailAddress,
            memberId,
            name,
            phoneNumber,
            postCode,
            province,
          } = addressList.find((d) => d.id === addressId)!;

          const payload: omsRecycleOrderCreateLogisticsAddressDTO = {
            city: city.code,
            country: province,
            detailAddress,
            memberId,
            name,
            phone: phoneNumber,
            postCode,
            omsRecycleOrderId: id,
            stateWrapper: 0,
            postStore,
            shippingDocument: JSON.stringify(['', image]),
          };
          fetchCreateLogisticsAddress(payload)
            .then(() => {
              message.success('上传成功！');
              onClose();
              reload();
            })
            .catch((e) => {
              message.error(e.message);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      })
      .catch(() => {});
  }, [data, form, switchType, onClose, reload, addressList]);

  return (
    <>
      <Modal
        open={open}
        title={'客户的邮寄凭证'}
        onCancel={() => onClose()}
        onOk={onFinish}
        className={styles.DeliverGoodsModal}
        destroyOnClose
        width={700}
        confirmLoading={loading}
      >
        <div className={styles.switch}>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            value={switchType}
            onChange={(e) => setSwitchType(e.target.value)}
          >
            <Radio value={1}>预约到店</Radio>
            <Radio value={2}>邮寄到店</Radio>
          </Radio.Group>
        </div>
        {switchType === 2 && (
          <div>
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              initialValues={{ postStore: 1 }}
            >
              <Form.Item
                label={'店铺收货地址'}
                rules={[{ required: true }]}
                name="postStore"
              >
                <SelectStoreAddress />
              </Form.Item>
              <Spin spinning={loadingAddress}>
                <Form.Item
                  label={'客户寄件地址'}
                  rules={[{ required: true }]}
                  name="addressId"
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      {addressList.map((d) => (
                        <Radio value={d.id} key={d.id}>
                          {d.name} | {d.phoneNumber} |
                          {d?.country?.nameI18n?.zh_CN}
                          {d?.city?.nameI18n?.zh_CN}
                          {d.detailAddress}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Spin>
              <Form.Item
                label={'快递面单'}
                name="shippingDocument"
                rules={[{ required: true }]}
              >
                <UploadImageTips />
              </Form.Item>
            </Form>
          </div>
        )}
        {switchType === 1 && (
          <div>
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              initialValues={{
                selectAppointmentt: {
                  storeId: 1,
                },
              }}
            >
              <Form.Item
                label={'预约时段'}
                name="selectAppointmentt"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value || Object.keys(value).length === 0) {
                        return Promise.reject('请输入完整');
                      }
                      if (value && !value.appointmentTimeId) {
                        return Promise.reject('请选择时段');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <SelectAppointment />
              </Form.Item>
              <Form.Item label={'备注'} name="remark">
                <Input.TextArea maxLength={200} />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DeliverGoodsModal;
