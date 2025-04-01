import { useRef, useState } from 'react';
import { Button, Form, message, Modal, Divider } from 'antd';
import { OmsRecycleOrderSNSCreateDTO } from 'types/oms';
import UserInfo, { UserType } from '../components/user-info';
import ProductPriceInfo from '../components/product-info';
import { fetchCreateSnsRecycleOrder } from 'apis/oms';
import { useNavigate } from 'react-router-dom';
import i18n from 'i18n';
import {
  removeRecyclingConsignmentStore,
  ITEM_NAME_MAP,
} from '../components/utils';
import PayInfo from '../components/pay-info';

interface OrderResult {
  orderSn: string;
  id: string;
}
const CreateOrderIntention = () => {
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const [loading, setLoading] = useState(false);
  const [form0] = Form.useForm<OmsRecycleOrderSNSCreateDTO>();
  const [form1] = Form.useForm<OmsRecycleOrderSNSCreateDTO>();
  const [form2] = Form.useForm<OmsRecycleOrderSNSCreateDTO>();

  const [userInfo, setUserInfo] = useState<UserType>();

  const payloadRef = useRef<OmsRecycleOrderSNSCreateDTO>({});

  const success = () => {
    Promise.all([
      form0.validateFields(),
      form1.validateFields(),
      form2.validateFields(),
    ])
      .then(() => {
        getCreate();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getCreate = () => {
    const { memberId } = payloadRef.current;
    if (!memberId) {
      message.error(i18n.t('please_select_a_member'));
      return;
    }
    setLoading(true);
    fetchCreateSnsRecycleOrder({ ...payloadRef.current })
      .then((d) => {
        const dParse = JSON.parse(d.data) as OrderResult[];
        removeRecyclingConsignmentStore(
          ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_INTENTION
        );
        modal.info({
          title: i18n.t('successful_operation'),
          content: (
            <div>
              {dParse.map((d) => (
                <div key={d.id}>
                  <a href={`/rrs/recycling-consignment-detail/${d.id}`}>
                    {d.orderSn}
                  </a>
                </div>
              ))}
            </div>
          ),
          onOk: () => {
            navigate(`/rrs/recycling-consignment-list`);
          },
        });
      })
      .catch((d) => {
        message.error(d.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="text-2xl text-center">{i18n.t('intentional_order')}</div>

      <div className="flex justify-center">
        <div className="w-full">
          <Divider orientation="center">
            <div className="text-2xl">{i18n.t('member_info')}</div>
          </Divider>
          <UserInfo
            form={form0}
            type="intention"
            onChange={({ user, ...data }) => {
              payloadRef.current = {
                ...payloadRef.current,
                ...data,
                storeId: data.createdFrom,
              };
              setUserInfo(user);
            }}
          />
          <Divider orientation="center">
            <div className="text-2xl">{i18n.t('product_info')}</div>
          </Divider>
          <ProductPriceInfo
            form={form1}
            onChange={(data) => {
              payloadRef.current = {
                ...payloadRef.current,
                ...data,
              };
            }}
            type="intention"
          />
          <div className="mb-4">
            <Divider orientation="center">
              <div className="text-2xl">{i18n.t('payment_information')}</div>
            </Divider>
            <PayInfo
              form={form2}
              type="contract"
              onChange={(data) => {
                payloadRef.current = { ...payloadRef.current, ...data };
              }}
              userInfo={userInfo}
            />
          </div>
        </div>
      </div>
      <div className="text-center space-x-2">
        <Button type="primary" onClick={() => success()} loading={loading}>
          {i18n.t('submit')}
        </Button>
        <Button
          type="primary"
          onClick={() => {
            form0.resetFields();
            form1.resetFields();
            form2.resetFields();
            removeRecyclingConsignmentStore(
              ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_INTENTION
            );
            window.location.reload();
          }}
        >
          {i18n.t('reset')}
        </Button>
      </div>

      {contextHolder}
    </div>
  );
};

export default CreateOrderIntention;
