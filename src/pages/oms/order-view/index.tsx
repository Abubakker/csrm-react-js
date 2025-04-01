import { Spin } from 'antd';
import {
  getOmsOrderDetailById,
  getOmsOrderDetailV2,
  getOmsOrderMultiplePayList,
} from 'apis/oms';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OmsOrderDetail, OmsOrderMultiplePay } from 'types/oms';
import OrderStep from './step';
import OrderOperate from './order-operate';
import OrderBaseInfo from './base-info';
import RecipientInformation from './recipient-information';
import OrderItemList from './item-list';
import OrderOperateHistories from './operate-histories';
import OrderPointHistories from './point-histories';
import OmsOrderPaymentInfo from './payment-info';
import OnlinePaymentRecord from './online-payment-record';
import OfflinePaymentRecord from './offline-payment-record';
import OmsOrderMultiplePayList from './OmsOrderMultiplePayList';
import CryptoPaymentRecord from './crypto-payment-record';
import LayoutFloatButton from 'components/layout-float-button';
import OrderEmailHistory from './order-email-history';
import { UnwrapPromise } from 'types/base';

const OrderView = () => {
  const { id } = useParams<{ id: string }>();
  const [omsOrderDetail, setOmsOrderDetail] = useState<OmsOrderDetail>();
  const [omsOrderDetailV2, setOmsOrderDetailV2] =
    useState<UnwrapPromise<ReturnType<typeof getOmsOrderDetailV2>>>();
  const [omsOrderMultiplePayList, setOmsOrderMultiplePayList] = useState<
    OmsOrderMultiplePay[]
  >([]);
  useEffect(() => {
    if (!id) return;
    getOmsOrderDetailById(+id).then((res) => {
      setOmsOrderDetail(res.data);
    });
    getOmsOrderDetailV2(+id).then((res) => {
      setOmsOrderDetailV2(res);
    });
    getOmsOrderMultiplePayList(+id).then((res) => {
      setOmsOrderMultiplePayList(res);
    });
  }, [id]);

  if (!omsOrderDetail) return <Spin />;

  const { status } = omsOrderDetail;

  return (
    <div>
      <OrderStep status={status} />
      <OrderOperate omsOrderDetail={omsOrderDetail} />
      <OrderBaseInfo
        omsOrderDetail={{
          ...omsOrderDetail,
          tagList: omsOrderDetailV2?.tagList || [],
          coupon: omsOrderDetailV2?.coupon,
        }}
      />
      <RecipientInformation omsOrderDetail={omsOrderDetail} />
      <OrderItemList omsOrderDetail={omsOrderDetail} />
      <OmsOrderPaymentInfo
        omsOrderDetail={{
          ...omsOrderDetail,
          b2bPrice: omsOrderDetailV2?.b2bPrice,
        }}
      />
      <OmsOrderMultiplePayList
        omsOrderDetail={omsOrderDetail}
        data={omsOrderMultiplePayList}
      />
      <CryptoPaymentRecord omsOrderDetail={omsOrderDetail} />
      <OnlinePaymentRecord omsOrderDetail={omsOrderDetail} />
      <OfflinePaymentRecord omsOrderDetail={omsOrderDetail} />
      <OrderPointHistories orderId={omsOrderDetail.id} />
      <OrderOperateHistories omsOrderDetail={omsOrderDetail} />
      <OrderEmailHistory orderId={omsOrderDetail.id} />
      <LayoutFloatButton />
    </div>
  );
};

export default OrderView;
