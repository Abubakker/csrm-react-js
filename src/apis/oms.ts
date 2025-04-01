import { BaseRes, PageQuery } from 'types/base';
import {
  OmsOrder,
  OmsOrderDetail,
  QuotationForm,
  SellYourBagRecord,
  OmsOrderMultiplePay,
  OmsRecyclingList,
  OmsRecycleOrderPayload,
  OmsRecycleOrderValuationPayload,
  OmsRecycleOrderDetail,
  OmsRecycleOrderFirstValuationSaveInfo,
  OmsRecycleOrderStatusTotal,
  OmsAppointmentPayload,
  OmsAppointmentDateVO,
  OmsAppointmentList,
  OmsAppointmentDateListVO,
  OmsOperateAppointment,
  OmsAppointmentDateUpdate,
  OmsAppointmentStatusTotal,
  OmsAppointmentStoreRecord,
  OmsAppointmentRecordInfoVO,
  OmsRecycleOrderSNSCreateDTO,
  OmsRecycleOrderCreateDTO,
  OmsAppointmentRecordDTO,
  omsRecycleOrderCreateLogisticsAddressDTO,
  OmsRecycleOrderFillInMemberPaymentInfoDTO,
  OmsRecycleOrder,
  OrderGenerateForMemberDto,
  StoreConfirmOrder,
  omsStoreFinalPaymentPayload,
  OmsOneCompletionPayload,
  StoreCreateOrderDto,
  StoreConfirmOrderDto,
  OmsConsignmentToRecycling,
  OmsOrderItem,
  OmsOrderPayment,
} from 'types/oms';
import request, { ginzaxiaomaApiRequest } from '.';
import { PmsProduct } from 'types/pms';

export const getSellYourBagList = (params: {
  current: number;
  size: number;
  productName: string;
}) => {
  return request.get<
    BaseRes<{
      total: number;
      records: SellYourBagRecord[];
    }>
  >('/oms/recycling/', {
    params,
  });
};

export const getSellYourBagDetail = (id: string) => {
  return request.get<BaseRes<SellYourBagRecord>>(`/oms/recycling/get/${id}`);
};

export const createQuotationForm = (quotationForm: QuotationForm) => {
  return request.post<BaseRes<number>>(
    '/oms/quotation-form/create',
    quotationForm
  );
};

export const getQuotationForm = (id: number) => {
  return request.get<BaseRes<QuotationForm>>(`/oms/quotation-form/get/${id}`);
};

export const updateQuotationForm = (quotationForm: QuotationForm) => {
  return request.post<BaseRes<number>>(
    '/oms/quotation-form/update',
    quotationForm
  );
};

export const deleteQuotationForm = (id: number) => {
  return request.post<BaseRes<number>>('/oms/quotation-form/update', {
    id,
    deletedStatus: 1,
  });
};

export type SearchQuotationFormDto = {
  pageSize: number;
  pageNum: number;
  startTime?: string;
  endTime?: string;
  keyword?: string;
};

export const searchQuotationForm = (data: SearchQuotationFormDto) => {
  return request.post<
    BaseRes<{
      list: QuotationForm[];
      total: number;
    }>
  >('/oms/quotation-form/search', data);
};

export type GetOrderListDto = {
  memberId?: string;
  status?: number | string | null;
  statuses?: number[];
  start?: string;
  end?: string;
  createdFroms?: number[];
  receiverKeyword?: string;
  deliveryType?: string;
  currencyList?: string[];
} & PageQuery;

export const getOrderList = (data: GetOrderListDto) => {
  return request.post<
    BaseRes<{
      list: OmsOrder[];
      total: number;
    }>
  >('/oms/order/list', data, {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
    },
  });
};

export type GetOrderListV2Res = {
  list: (Pick<
    OmsOrder,
    | 'id'
    | 'orderSn'
    | 'deliveryType'
    | 'memberUsername'
    | 'totalAmountActualCurrency'
    | 'memberId'
    | 'orderType'
    | 'payAmount'
    | 'payAmountActualCurrency'
    | 'createdFrom'
    | 'createTime'
    | 'multiplePayStatus'
    | 'status'
    | 'totalTaxAmount'
    | 'paymentTime'
  > & {
    orderItems: (Pick<
      OmsOrderItem,
      | 'id'
      | 'orderId'
      | 'productSn'
      | 'productPic'
      | 'productId'
      | 'actualCurrency'
    > & {
      product: Pick<
        PmsProduct,
        'productSn' | 'description' | 'costPrice' | 'price'
      >;
    })[];
    tagList: {
      id: number;
      orderId: number;
      tag: string;
    }[];
    orderPayList: Pick<
      OmsOrderPayment,
      'payType' | 'payStatus' | 'payAmount'
    >[];
  })[];
  total: number;
};

export const getOrderListV2 = (data: GetOrderListDto) => {
  return ginzaxiaomaApiRequest.post<GetOrderListV2Res>(
    '/admin/order/search/list',
    data
  );
};

export const getOmsOrderDetailById = (id: OmsOrder['id']) => {
  return request.get<BaseRes<OmsOrderDetail>>(`/oms/order/${id}`);
};

export const getOmsOrderDetailV2 = (id: number) => {
  return ginzaxiaomaApiRequest.get<
    Pick<OmsOrderDetail, 'id' | 'b2bPrice'> & {
      tagList: {
        id: number;
        tag: string;
      }[];
    } & {
      coupon?: {
        name?: string;
        note?: string;
        i18nDescription?: {
          [key: string]: {
            title: string;
            description: string;
          };
        };
      };
    }
  >(`/admin/order/detail/${id}`);
};

export const updateOmsOrderDetail = (
  id: number,
  data: Pick<OmsOrder, 'b2bPrice' | 'staffName'> & {
    tagList?: string[];
  }
) => {
  return ginzaxiaomaApiRequest.put(`/admin/order/update/${id}`, data);
};

export const getOmsOrderMultiplePayList = (id: OmsOrder['id']) => {
  return ginzaxiaomaApiRequest.get<OmsOrderMultiplePay[]>(
    `/admin/order/multiple-pay-set-info/${id}`
  );
};

export const setOmsOrderMultiplePayList = (
  id: OmsOrder['id'],
  data: OmsOrderMultiplePay[]
) => {
  return ginzaxiaomaApiRequest.post(
    `/admin/order/multiple-pay-set-edit/${id}`,
    { list: data }
  );
};

type OmsOrderReceiverInfoUpdateDto = {
  orderId: number;
  status: number;
  receiverName: string;
  receiverPhone: string;
  receiverPostCode: string;
  receiverDetailAddress: string;
  receiverProvince: string;
  receiverCity: string;
};

export const omsOrderReceiverInfoUpdate = (
  data: OmsOrderReceiverInfoUpdateDto
) => {
  return request.post('/oms/order/update/receiverInfo', data);
};

type OmsOrderAddOperationNoteDto = {
  id: number;
  note: string;
  status: number;
};

export const omsOrderAddOperationNote = (data: OmsOrderAddOperationNoteDto) => {
  return request.post('/oms/order/update/note', {}, { params: data });
};

type OmsOrderDeliverUpdateDto = {
  orderId: number;
  deliveryCompany: string;
  deliverySn: string;
}[];

export const omsOrderDeliverUpdate = (data: OmsOrderDeliverUpdateDto) => {
  return ginzaxiaomaApiRequest.post('/admin/order/update/delivery', data);
};

export const omsOrderFinish = ({
  orderId,
  ...rest
}: {
  orderId: number;
  note?: string;
  isPointsGiven: boolean;
}) => {
  return ginzaxiaomaApiRequest.post(
    `/admin/order/order-finish/${orderId}`,
    rest
  );
};

export const cancelOrderByAdmin = (data: { id: number; note: string }) => {
  return ginzaxiaomaApiRequest.post('/admin/order/cancel-order', data);
};

export const omsOrderOfflinePayAccept = (data: {
  orderId: number;
  note: string;
}) => {
  return ginzaxiaomaApiRequest.post('/admin/order/bank-transfer-review', {
    ...data,
    isPass: true,
  });
};

export const omsOrderOfflinePayReject = (data: {
  orderId: number;
  note: string;
}) => {
  return ginzaxiaomaApiRequest.post('/admin/order/bank-transfer-review', {
    ...data,
    isPass: false,
  });
};

/** 回收寄卖列表 */
export const fetchOmsRecyclingList = (data: OmsRecycleOrderPayload) => {
  return request
    .post<BaseRes<OmsRecyclingList>>('/oms/recycleOrder/page', data, {
      params: {
        pageNum: data.pageNum,
        pageSize: data.pageSize,
      },
    })
    .then((res) => {
      res.data.list.forEach((i) => {
        // @ts-ignore 这里是因为列表页返回的日志信息是 omsRecycleOrderLogs 字段
        // 为了和详情页 omsRecycleOrderLogList 统一，这里强制改了下
        i.omsRecycleOrderLogList = i.omsRecycleOrderLogs;
      });
      return res;
    });
};

/** 初步估值 */
export const fetchFirstValuation = (data: OmsRecycleOrderValuationPayload) => {
  return request.post<BaseRes<string>>(
    '/oms/recycleOrder/firstValuation',
    data
  );
};

/** 拒绝估值 */
export const fetchTerminationFirstValuation = (data: {
  remark?: string;
  id?: string /** 回收寄卖ID */;
}) => {
  return request.post<BaseRes<string>>(
    '/oms/recycleOrder/terminationFirstValuation',
    data
  );
};

/** 上传shiplable */
export const fetchUploadShiplable = (data: {
  id?: string /** 回收寄卖ID */;
  shippingLabel?: string /** 物流单 */;
}) => {
  return request.post<BaseRes<string>>(
    '/oms/recycleOrder/createLogisticsCertificate',
    data
  );
};

/** 确认收货 */
export const fetchGoodsReceived = (data: {
  content?: string /** 收货内容 */;
  id?: string /** 回收寄卖ID */;
  receiptPics?: string /** 收货图片 */;
}) => {
  return request.post<BaseRes<string>>('/oms/recycleOrder/goodsReceived', data);
};

/** 最终报价 */
export const fetchFinalValuation = (data: {
  finalRecyclePrice?: number /** 最终回收价格 */;
  finalSalePrice?: number /** 最终售卖价格 */;
  omsRecycleOrderItemId?: string /** 回收寄卖商品ID */;
  omsRecycleOrderType?: number; // 回收类型 : 1-寄卖，2-回收
  settlementType?: number; // 订单结算类型：1-现金结算 2-财务打款
  emailRemark?: string; // 邮件备注
  currency?: string;
}) => {
  return request.post<BaseRes<string>>(
    '/oms/recycleOrder/finalValuation',
    data
  );
};

/** 拒绝最终报价 */
export const fetchterminationFinalValuation = (data: {
  remark?: string;
  id?: string /** 回收寄卖ID */;
}) => {
  return request.post<BaseRes<string>>(
    '/oms/recycleOrder/terminationFinalValuation',
    data
  );
};

/** 回收寄卖详情 */
export const fetchRecycleOrderDetail = (data: {
  id?: string /** 回收寄卖ID */;
}) => {
  return request.post<BaseRes<OmsRecycleOrderDetail>>(
    `/oms/recycleOrder/info/${data.id}`
  );
};

/** 上传物流凭证 */
export const fetchUploadShippingDocument = (data: {
  id?: string /** 回收寄卖ID */;
  stateWrapperShippingDocument?: string;
}) => {
  return request.post<BaseRes<string>>(
    `/oms/recycleOrder/uploadStateWrapperShippingDocument`,
    data
  );
};

/** 修改最终报价 */
export const fetchUpdateFinalValuation = (data: {
  finalRecyclePrice?: number /** 最终回收价格 */;
  finalSalePrice?: number /** 最终售卖价格 */;
  id?: string /** 回收寄卖ID */;
  emailRemark?: string; // 邮件备注
}) => {
  return request.post<BaseRes<string>>(
    `/oms/recycleOrder/updateFinalValuation`,
    data
  );
};

/** 确认结算 */
export const fetchConfirmSettlement = (data: {
  settlementType?: number /** 订单结算类型：1-现金结算 2-财务打款 */;
  id?: string /** 回收寄卖ID */;
}) => {
  return request.post<BaseRes<string>>(
    `/oms/recycleOrder/confirmSettlement`,
    data
  );
};

/** 确认退货 */
export const fetchConfirmReturn = (data: {
  id?: string /** 回收寄卖ID */;
  returnType?: number /** 退货类型：1:门店自提，2:邮寄 */;
  returnVoucher?: string /** 退货凭证 */;
  returnExpressCompany?: string /** 退货快递公司 */;
  returnTrackingNumber?: string /** 退货快递单号  */;
}) => {
  return request.post<BaseRes<string>>(`/oms/recycleOrder/confirmReturn`, data);
};

/** 录入打款信息 / 重复打款信息 */
export const fetchPaymentVoucher = (data: {
  /** 1-现金,2-会计打款 */
  settlementType: number;
  /** 0-未确认，1-寄卖，2-回收 */
  type: string;
  /** 财务付款金额 */
  financialPaymentAmount?: string;
  /** 财务付款信息 */
  financialPaymentInfo?: string;
  /** 财务付款凭证 */
  financialPaymentVoucher?: string;
  /** 是否完成订单 0-不完成,1-完成 */
  isOrderCompleted: number;
  /** 回收寄卖ID */
  id: number;
}) => {
  const url =
    data.type === 'create'
      ? `/oms/recycleOrder/createPaymentVoucher`
      : `/oms/recycleOrder/updatePaymentVoucher`;
  return request.post<BaseRes<string>>(url, data);
};

/** 初步估值前补充信息 */
export const fetchFirstValuationSaveInfo = (
  data: OmsRecycleOrderFirstValuationSaveInfo
) => {
  return request.post<BaseRes<string>>(
    `/oms/recycleOrder/firstValuationSaveInfo`,
    data
  );
};

/** 订单取消 */
export const fetchCancelRecycleOrder = (data: {
  /** 回收寄卖ID */
  id?: string;
  /** 原因 */
  remark?: string;
}) => {
  return request.post<BaseRes<string>>(`/oms/recycleOrder/cancel`, data);
};

/** 状态总数 */
export const fetchStatusTotal = () => {
  return request.post<BaseRes<OmsRecycleOrderStatusTotal>>(
    `/oms/recycleOrder/getPageStatusTotal`
  );
};

/** 预约视图 */
export const fetchWeekTotalList = (data: OmsAppointmentPayload) => {
  return request.post<BaseRes<OmsAppointmentDateVO[]>>(
    `/oms/appointmentStoreRecord/weekTotalList`,
    data
  );
};

/** 预约列表 */
export const fetchAppointmentStoreRecordPage = (
  data: OmsAppointmentPayload
) => {
  return request.post<BaseRes<OmsAppointmentList>>(
    `/oms/appointmentStoreRecord/page`,
    data
  );
};

/** 预约配置表 */
export const fetchAppointmentDateList = (storeId: number) => {
  return request.post<BaseRes<OmsAppointmentDateListVO[]>>(
    `/oms/appointmentStoreRecord/appointmentDateList?storeId=${storeId}`
  );
};

/** 列表状态 */
export const fetchOperateAppointmentDate = (data: OmsOperateAppointment) => {
  return request.post<BaseRes<string>>(
    `/oms/appointmentStoreRecord/operateAppointmentDate`,
    data
  );
};

/** 某天时间段调整 */
export const fetchUpdateAppointmentDate = (data: OmsAppointmentDateUpdate) => {
  return request.post<BaseRes<string>>(
    `/oms/appointmentStoreRecord/modifyAppointmentTime`,
    data
  );
};

/** 预约总览状态数 */
export const fetchAppointmentStatusTotal = (storeId: number) => {
  return request.post<BaseRes<OmsAppointmentStatusTotal>>(
    `/oms/appointmentStoreRecord/getPageStatusTotal?storeId=${storeId}`
  );
};

/** 创建预约 */
export const fetchAppointmentCreate = (data: OmsAppointmentStoreRecord) => {
  return request.post<BaseRes<string>>(
    `/oms/appointmentStoreRecord/create`,
    data
  );
};

/** 修改预约 */
export const fetchAppointmentUpdate = (data: OmsAppointmentStoreRecord) => {
  return request.post<BaseRes<string>>(
    `/oms/appointmentStoreRecord/update`,
    data
  );
};

/** 查询用户已初步估值订单信息 */
export const fetchRecycleOrderInfo = (memberId: number) => {
  return request.post<BaseRes<OmsRecycleOrderDetail[]>>(
    `/oms/appointmentStoreRecord/omsRecycleOrderInfo?memberId=${memberId}`
  );
};

/** 取消预约 */
export const fetchCancelRecycle = (appointmentId: string) => {
  return request.post<BaseRes<string>>(
    `/oms/appointmentStoreRecord/cancel?appointmentId=${appointmentId}`
  );
};

/** 预约详情 */
export const fetchAppointmentStoreRecordInfo = (id: string) => {
  return request.post<BaseRes<OmsAppointmentRecordInfoVO>>(
    `/oms/appointmentStoreRecord/info/${id}`
  );
};

// 修改订单信息
export const modifyOmsRecycleOrderDetails = (data: {
  id: string;
  logisticsName?: string;
  logisticsPhone?: string;
  logisticsPostCode?: string;
  logisticsCountry?: string;
  logisticsCity?: string;
  logisticsDetailAddress?: string;
  memberCredentialNo?: string;
  memberPaymentBankCountry?: string;
  memberPaymentBankNo?: string;
  memberPaymentBankName?: string;
  memberPaymentBankAddress?: string;
  memberPaymentSwiftCode?: string;
  memberPaymentAccountType?: string;
  memberPaymentAccountSubType?: string;
  memberPaymentRoutingNo?: string;
  memberPaymentFpsNo?: string;
  memberPaymentFpsAccountName?: string;
  memberPaymentBankPhone?: string;
  memberPaymentPayNowNo?: string;
  memberPaymentPayNowAccountName?: string;
  memberPaymentAccountNo?: string;
  memberPaymentAccountName?: string;
  memberPaymentAccountAddress?: string;
  memberPaymentKiGo?: string;
  memberPaymentBangGo?: string;
}) => {
  return request.post<BaseRes<string>>(
    `/oms/recycleOrder/modifyOmsRecycleOrderDetails`,
    data
  );
};

/** 查询用户当前是否有未完成的预约 */
export const fetchUnFinishedAppointmentList = ({
  memberId,
  email,
}: {
  memberId?: number;
  email?: string;
}) => {
  return request.post<BaseRes<OmsAppointmentStoreRecord[]>>(
    `/oms/appointmentStoreRecord/unfinishedAppointmentList?memberId=${
      memberId || ''
    }&email=${email}`
  );
};

/** 创建合同订单 */
export const fetchCreateSnsRecycleOrder = (
  data: OmsRecycleOrderSNSCreateDTO
) => {
  return request.post<BaseRes<string>>(
    `/oms/recycleOrder/createSnsRecycleOrder`,
    data
  );
};

/** 创建订单 */
export const fetchRecycleOrderCreate = (data: OmsRecycleOrderCreateDTO) => {
  return request.post<BaseRes<string>>(`/oms/recycleOrder/create`, data);
};

/** 店铺可预约时间段 */
export const fetchShopValidReservationTime = (storeId: number) => {
  return request.post<BaseRes<OmsAppointmentDateListVO[]>>(
    `/oms/appointmentStoreRecord/shopValidReservationTime?storeId=${storeId}`
  );
};

/** sns订单-提交预约信息 */
export const fetchOrderReservation = (data: OmsAppointmentRecordDTO) => {
  return request.post<BaseRes<OmsAppointmentDateListVO[]>>(
    `/oms/appointmentStoreRecord/snsOrderReservation`,
    data
  );
};

/** sns订单-提交邮寄信息 */
export const fetchCreateLogisticsAddress = (
  data: omsRecycleOrderCreateLogisticsAddressDTO
) => {
  return request.post<BaseRes<string>>(
    `/oms/recycleOrder/createLogisticsAddressAndMailingVoucher`,
    data
  );
};

/** sns订单-确认最终报价 */
export const fetchAgreeFinalValuation = (data: {
  id: string;
  type: number;
}) => {
  return request.post<BaseRes<string>>(
    `/oms/recycleOrder/agreeFinalValuation`,
    data
  );
};

/** sns订单-打款 */
export const fetchFillInMemberPaymentInfo = (
  data: OmsRecycleOrderFillInMemberPaymentInfoDTO
) => {
  return request.post<BaseRes<string>>(
    `/oms/recycleOrder/fillInMemberPaymentInfo`,
    data
  );
};

export const changeOrderPriority = (
  data: Pick<OmsRecycleOrder, 'id' | 'priority'>
) => {
  return request.post<BaseRes<string>>(
    `/oms/recycleOrder/changeOrderPriority`,
    data
  );
};

export const omsOrderInvalid = (
  id: OmsOrder['id'],
  note: string,
  autoPublish: number
) => {
  return ginzaxiaomaApiRequest.post(`/admin/order/orderInvalid/${id}`, {
    note,
    autoPublish,
  });
};

// 修改操作信息
export const modifyOmsOperation = (data: {
  id: string;
  shopRemark?: string;
}) => {
  return request.post<BaseRes<string>>(
    `/oms/recycleOrder/addOmsRecycleOrderLog`,
    data
  );
};

/** 订单计算合计金额 */
export const omsGenerateConfirmOrder = (
  data: Pick<
    OrderGenerateForMemberDto,
    | 'productIdList'
    | 'taxFreeProductIdList'
    | 'useIntegration'
    | 'promotionAmount'
    | 'memberId'
    | 'couponCode'
    | 'receiveAddressId'
    | 'orderStatus'
  >
) => {
  return ginzaxiaomaApiRequest.post<StoreConfirmOrder>(
    `/admin/order/generate-confirm-order`,
    data
  );
};

// 创建订单
export const omsGenerateForMember = (data: OrderGenerateForMemberDto) => {
  return ginzaxiaomaApiRequest.post<{ omsOrder: OmsOrder }>(
    `/admin/order/generate-for-member`,
    data
  );
};

/** 创建收银台订单 */
export const omsCreateCheckoutCounter = (data: StoreCreateOrderDto) => {
  return ginzaxiaomaApiRequest.post<StoreConfirmOrder>(
    `/checkout-counter/store`,
    data
  );
};

/** 合计金额 */
export const omsStoreConfirmOrder = (data: StoreConfirmOrderDto) => {
  return ginzaxiaomaApiRequest.post<StoreConfirmOrder>(
    `/checkout-counter/store-confirm-order`,
    data
  );
};

/** 结算尾款 */
export const omsStoreFinalPayment = (data: omsStoreFinalPaymentPayload) => {
  return ginzaxiaomaApiRequest.post<StoreConfirmOrder>(
    `/checkout-counter/store-final-payment`,
    data
  );
};

/** 一键完成 */
export const oneCompletion = (data: OmsOneCompletionPayload) => {
  return request.post(`/oms/recycleOrder/completeOrder`, data);
};

export const orderTaxFree = (orderId: number) => {
  return ginzaxiaomaApiRequest.post(`/admin/order/tax-free/${orderId}`);
};

type WantBookRecord = {
  id: number;
  memberId?: number;
  email: string;
  socialName: string;
  socialAccount: string;
  phone?: string;
  productSn?: string;
  productName: string;
  productDesc?: string;
  productPics: any;
  status: number;
  remarks: string;
  createTime: string;
  updateTime?: string;
  firstName: string;
  lastName: string;
};

export const wantBookList = (dto: {
  pageNum: number;
  pageSize: number;
  status?: number;
  productName?: string;
}) => {
  return request.get<
    BaseRes<{
      total: number;
      records: WantBookRecord[];
    }>
  >('/oms/wantbook/list', { params: dto });
};

export const wantBookUpdate = (dto: WantBookRecord) => {
  return request.post(`/oms/wantbook/update/${dto.id}`, dto);
};

export const getOrderStatusStatistics = (dto: { createdFroms?: number[] }) => {
  return ginzaxiaomaApiRequest.get<
    {
      status: number;
      count: string;
    }[]
  >('/admin/order/status-statistics', { params: dto });
};

// 修改订单信息
export const modifyOmsInitialValuation = (data: {
  id: string;
  currency: string;
  minRecyclePrice: number;
  maxRecyclePrice: number;
  minSalePrice: number;
  maxSalePrice: number;
}) => {
  return request.post<BaseRes<string>>(
    `/oms/recycleOrder/modifyInitialValuation`,
    data
  );
};

// 手动完成多笔支付
export const omsOrderCompleteMultiplePay = (data: {
  orderId: number;
  multiplePaySetId: string;
  note?: string;
}) => {
  return ginzaxiaomaApiRequest.post(
    `/admin/order/complete-multiple-pay-set`,
    data
  );
};

export const consignmentToRecycling = (data: OmsConsignmentToRecycling) => {
  return request.post(`/oms/recycleOrder/saleToRecycle`, data);
};

export const getTripleaPaymentDetail = (paymentReference: string) => {
  return ginzaxiaomaApiRequest.get(
    `/admin/order/triplea-payment-details/${paymentReference}`
  );
};

export const productStoreTransfer = (data: {
  toShopId: number;
  fromShopId: number;
  productList: {
    id: number;
    b2bPrice: number;
  }[];
}) => {
  return ginzaxiaomaApiRequest.post<{
    omsOrder: { id: number };
  }>(`/admin/order/product-store-transfer`, data);
};
