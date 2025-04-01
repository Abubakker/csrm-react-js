export type SysUser = {
  id: number;
  username: string;
  password: string;
  icon: string;
  email?: string;
  nickName: string;
  note?: string;
  createTime: string;
  loginTime?: string;
  shop?: number;
};

export type SysDict = {
  id: number;
  type: string;
  valueList: {
    zh_TW: string;
    ja: string;
    en: string;
    zh_CN: string;
    value: string;
    zh: string;
  }[];
  status: number;
  remark: string;
};

export type SeoConfig = {
  id: number;
  page: string;
  title: { ja: string; en: string; cn: string; tw?: string };
  keywords: { ja: string; en: string; cn: string; tw?: string };
  description: { ja: string; en: string; cn: string; tw?: string };
  remark: any;
  enable: boolean;
  lastupdateBy: string;
  lastupdateTime: string;
};

export type SysRole = {
  id: number;
  name: string;
  description?: string;
  createTime: string;
  status: number;
  sort?: number;
};

export type SysMenu = {
  id: number;
  parentId: number;
  createTime: string;
  title: string;
  level: number;
  sort: number;
  name: string;
  hidden: number;
  children?: SysMenu[];
};

export type SysRoleResourcesCategory = {
  id: number;
  name: string;
  createTime: string;
  sort: number;
};

export type SysRoleResources = {
  id: number;
  name: string;
  createTime: string;
  url: string;
  categoryId: number;
  description: string;
};

export type SysRoleResourcesCategoryList = SysRoleResourcesCategory & {
  children: (SysRoleResources & { key: string })[];
  key: string;
};

export type SysRoleResourceRelations = {
  id: number;
  roleId: string;
  resourceId: string;
};

export type SysAdminRole = {
  id: number;
  adminId: number;
  roleId: number;
};

export type SysShop = {
  id: number;
  name: string;
  cashBalance: number;
  currency: string;
};

// 订单汇总数据类型
interface OrderSummary {
  month: string;
  orderCount: string;
  totalIntegration: string;
  totalUseIntegration: string;
  totalPromotionAmount: string;
  totalPayAmount: string;
  totalCost: string;
  grossProfit: string;
  procurementCount: string;
  consignmentCount: string;
  recyclingCount: string;
  procurementCost: string;
  consignmentCost: string;
  recyclingCost: string;
  consignmentSales: string;
  recyclingSales: string;
  procurementProfit: string;
  consignmentProfit: string;
  recyclingProfit: string;
  totalCostWithoutTax: number;
  procurementCostWithoutTax: number;
  consignmentCostWithoutTax: number;
  recyclingCostWithoutTax: number;
}

// 回收订单汇总数据类型
interface RecycleOrderSummary {
  month: string;
  recycleCount: string;
  saleCount: string;
  totalRecyclePrice: string;
  totalSalePrice: string;
  totalRecyclePriceWithoutTax: number;
  totalSalePriceWithoutTax: number;
}

// 完整的响应数据类型
export type OrdersSummaryResponse = {
  orderSummaries: OrderSummary[];
  omsRecycleOrderSummaries: RecycleOrderSummary[];
};
