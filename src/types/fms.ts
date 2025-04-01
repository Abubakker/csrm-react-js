export type FmsAccountManagement = {
  id: string;
  accountCode: string;
  accountName: string;
  accountDescribe: string; // 描述
  status: number; // 状态(0 启用,1 停用)
  deleteStatus: number; // 删除状态
  storeId: number; // 店铺ID，1-银座 2-香港 3-新加坡
  sort: number;
  isCash: number;
};

export type FmsShopCashLog = {
  id: number; // auto increment
  shopId: number; // 关联的店铺ID
  amount: number; // 变动金额（正数表示收入，负数表示支出）
  balanceBefore: number; // 变动前的店铺现金余额
  balanceAfter: number; // 变动后的店铺现金余额
  createdBy: string; // 操作人
  createdAt: string; // 操作时间 (formatted as a string e.g., 'YYYY-MM-DD HH:MM:SS')
  note?: string | null; // 备注
  deletedAt?: string | null; // 软删除时间
  type?: number | null; // 分类(0.仕入れ-買取 1.仕入れ-委託 2.仕入れ-その他(業者仕入) 3.注文-買取 4.注文-委託 5.注文その他(業者仕入) 6.注文-その他)
};
