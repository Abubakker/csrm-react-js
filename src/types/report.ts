export type OrderStatisticsType = {
  orderId: number;
  date: string;
  memberId: number;
  productIds: ProductDetailType[];
  salesQuantity: number;
  payAmount: number;
  totalAmount: number;
  payAmountActualCurrency: number;
  totalAmountActualCurrency: number;
  grossProfit: number;
  hasMissingCostPrice: boolean;
  discountAmount: number;
  taxAmount: number;
  paymentMethod: Record<string, number>;
  createdBy: number;
  note: string;
  currency: string;
  totalCost: number;
  orderSn: string;
};

export type PurchaseReportType = {
  date: string;
  productId: number;
  purchaseQuantity: number;
  costPrice: number;
  supplierId: string;
  categoryId: number;
  paymentMethod: number;
  owner: string;
  remark: string;
  currency: string;
};

export type ConsignmentReportType = {
  date: string;
  productId: number;
  purchaseQuantity: number;
  costPrice: number;
  price: number;
  publishStatus: number;
  categoryId: number;
  paymentMethod: number;
  owner: string;
  remark: string;
  consignor: number;
  currency: string;
};

// 新增订单汇总统计类型
export type OrderSummaryType = {
  totalOrders: number;
  totalSalesQuantity: number;
  totalPayAmount: number;
  totalOrderAmount: number;
  totalDiscountAmount: number;
  totalTaxAmount: number;
};

// 订单完整数据类型
export type OrderStatisticsDataType = {
  orders: OrderStatisticsType[];
  summary: OrderSummaryType;
};

export type consignmentStatisticsType = {
  totalPurchaseQuantity: number;
  totalCostPrice: number;
  totalPrice: number;
};

export type purchaseStatisticsType = {
  totalCostPrice: number;
  totalPurchaseQuantity: number;
};

export type DailyStatisticsType = {
  orderStatistics: OrderStatisticsDataType;
  purchaseReport: {
    records: PurchaseReportType[];
    statistics: purchaseStatisticsType;
  };
  consignmentReport: {
    records: ConsignmentReportType[];
    statistics: consignmentStatisticsType;
  };
};

export type ProductDetailType = {
  productId: number;
  sourceType: number;
};
