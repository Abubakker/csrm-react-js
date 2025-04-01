import { ginzaxiaomaApiRequest } from 'apis';
import { UnwrapPromise } from 'types/base';

export type Advertise = {
  id: number;
  name: string;
  type: number;
  pic: string;
  startTime: string;
  endTime: string;
  status: number;
  language: string;
  url: string;
  note: string;
};

const SmsApi = {
  getCouponList: (params: { pageNum: number; pageSize: number }) => {
    return ginzaxiaomaApiRequest.get<{
      total: number;
      list: {
        id: number;
        type: number;
        name: string;
        platform: number;
        minPoint?: number;
        amount?: number;
        startTime?: string;
        endTime?: string;
        note?: string;
        code?: string;
      }[];
    }>('/admin/sms/coupon-list', {
      params,
    });
  },
  getCouponHistoryList: (params: {
    pageNum: number;
    pageSize: number;
    couponId?: number;
    useStatus?: number;
  }) => {
    return ginzaxiaomaApiRequest.get<{
      total: number;
      list: {
        id: number;
        couponId: number;
        memberId?: number;
        couponCode?: string;
        useStatus: number;
        amount?: number;
        createTime?: string;
        useTime?: string;
        orderSn?: string;
        orderId?: number;
        smsCoupon: SmsCoupon;
        umsMember?: {
          id: number;
          email: string;
          firstName?: string;
          lastName?: string;
        };
      }[];
    }>('/admin/sms/coupon-history-list', {
      params,
    });
  },
  getADList: (params: {
    keyword?: string;
    type?: number;
    langList?: string;
    pageNum: number;
    pageSize: number;
  }) => {
    return ginzaxiaomaApiRequest.get<{
      total: number;
      list: Advertise[];
    }>('/admin/ad/ad-list', {
      params,
    });
  },
  AdEditService: (params: Advertise) => {
    return ginzaxiaomaApiRequest.post('/admin/ad/ad-edit', params);
  },
  getAdDetail(id: Advertise['id']) {
    return ginzaxiaomaApiRequest.get<Advertise>(`/admin/ad/ad-detail/${id}`);
  },
  AdDelete(id: Advertise['id']) {
    return ginzaxiaomaApiRequest.delete(`/admin/ad/ad-delete/${id}`);
  },
};

export type SmsCoupon = UnwrapPromise<
  ReturnType<typeof SmsApi.getCouponList>
>['list'][number];

export type SmsCouponHistory = UnwrapPromise<
  ReturnType<typeof SmsApi.getCouponHistoryList>
>['list'][number];

export default SmsApi;
