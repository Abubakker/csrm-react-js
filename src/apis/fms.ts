import { FmsAccountManagement, FmsShopCashLog } from 'types/fms';
import { ginzaxiaomaApiRequest } from '.';
import { UserInfo } from 'types/user';
import { OrdersSummaryResponse, SysShop } from 'types/sys';

export const financialManagementAddOrUpdateAccount = (
  data: FmsAccountManagement,
) => {
  return ginzaxiaomaApiRequest.post(
    '/admin/payment-account/create-or-update',
    data,
  );
};

export const financialManagementAccountList = (storeId?: UserInfo['shop']) => {
  return ginzaxiaomaApiRequest.get<FmsAccountManagement[]>(
    '/admin/payment-account/list',
    {
      params: {
        storeId,
      },
    },
  );
};

export const getShopCashLogList = (dto: {
  shopId: number;
  pageNum: number;
  pageSize: number;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  types?: string[];
}) => {
  return ginzaxiaomaApiRequest.get<{
    list: FmsShopCashLog[];
    total: number;
  }>('/admin/fms/shop-cash-log/list', {
    params: dto,
  });
};

export const addShopCashLog = (
  data: Pick<FmsShopCashLog, 'shopId' | 'amount' | 'note'>,
) => {
  return ginzaxiaomaApiRequest.post('/admin/fms/shop-cash-log/create', data);
};

export const getSysShopList = () => {
  return ginzaxiaomaApiRequest.get<SysShop[]>('/admin/fms/shop-list');
};

export const getSysSummary = (shopId: number) => {
  return ginzaxiaomaApiRequest.get<OrdersSummaryResponse>(
    `/admin/order/summary/${shopId}`,
  );
};
