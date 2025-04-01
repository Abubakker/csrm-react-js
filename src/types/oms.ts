import { UmsMember } from './ums';
import { SysUser } from './sys';
import { PmsProduct } from './pms';

export type SellYourBagRecord = {
  id: string;
  accessories: string; // "1,5" 逗号分隔字符串
  createTime: string;
  email: string;
  memberId: number;
  phone: string;
  productName: string;
  productPics: {
    id: number;
    name: string;
    src: string;
  }[];
  quoteRemark: string;
  remarks: string;
  socialAccount: string;
  socialName: string;
};

export type QuotationForm = {
  id?: number;
  category: string;
  material: string;
  type: string;
  currency: string;
  username: string;
  email: string;
  phone: string;
  socialMedia: string;
  socialHandle: string;
  note: string;
  stamp: string;
  recyclePrice: number;
  consignmentPrice: number;
  substitutePrice: number;
  dealPrice: number;
  productPics: string;
  consultingSource: number;
  color: string;
  createdTime?: string;
  createdBy?: string;
  updatedTime?: string;
  updatedBy?: string;
  staff: number;
  inventory: number;
};

export type OmsOrder = {
  id: number;
  orderSn: string;
  memberId?: number;
  memberUsername: string;
  orderType: number;
  sourceType: number;
  createdFrom: number;
  status: number;
  note?: string;
  createTime: string;
  modifyTime?: string;
  totalAmount: number;
  payAmount: number;
  paymentTime?: string;
  freightAmount: number;
  freightAmountActualCurrency: number;
  promotionAmount: number;
  integrationAmount: number;
  couponId?: number;
  couponAmount: number;
  discountAmount: number;
  useIntegration: number;
  integration: number;
  deliveryCompany?: string;
  deliverySn?: string;
  deliveryTime?: string;
  confirmStatus: number;
  autoConfirmDay: number;
  receiveTime?: string;
  receiverName: string;
  receiverPhone: string;
  receiverCountry?: string;
  receiverPostCode?: string;
  receiverProvince: string;
  receiverCity: string;
  receiverRegion: string;
  receiverDetailAddress: string;
  totalAmountActualCurrency: number | null;
  payAmountActualCurrency: number | null;
  multiplePayStatus?: number;
  orderItemList: OmsOrderItem[];
  confirmedPayAmount?: number; // 已确认付款金额
  createdBy?: number;
  promotionAmountActualCurrency?: number;
  couponCode?: string;
  totalTaxAmount?: number;
  staffName?: string;
  deliveryType: string;
  signUrl?: string;
  pickupTime?: string;
  b2bPrice?: number;
};

export type OmsOrderItem = {
  id: number;
  orderId: number;
  orderSn: string;
  productId: number;
  productSn: string;
  productSnDes: string;
  productPrice: number;
  productPic: string;
  productName: string;
  productBrand: string;
  promotionAmount: number;
  couponAmount: number;
  integrationAmount: number;
  realAmount: number;
  actualCurrency?: string;
  realAmountCurrency?: number;
  actualCurrencyRate?: number;
  taxAmount?: number;
  i18n?: {
    name: string;
  };
  isTaxFree: number;
  productPriceActualCurrency: number;
};

export type OmsOrderOperateHistory = {
  id: number;
  operateMan: string;
  createTime: string;
  orderStatus: number;
  note: string;
};

export type OmsOrderPayment = {
  id: string;
  orderId?: number;
  orderSn?: string;
  payMode: string;
  payType: string;
  tradeNo?: string;
  payId?: string;
  payAmount: number;
  payCurrency?: string;
  payTime?: string;
  payStatus?: string;
  extJson?: string;
  memberTransferVoucher?: string;
  memberTransferDesc?: string;
  confirmUser?: string;
  confirmTime?: string;
  extJsonNew?: string;
  createTime?: string;
};

export type OmsOrderDetail = OmsOrder & {
  orderItemList: OmsOrderItem[];
  historyList?: OmsOrderOperateHistory[];
  payList?: OmsOrderPayment[];
};

export type OmsOrderMultiplePay = {
  sortId: number;
  needPayAmount: number;
  omsOrderPayId?: string;
  currency: string;
};

export type OmsOrderMultiplePayV2 = Pick<
  OmsOrderMultiplePay,
  'sortId' | 'needPayAmount' | 'currency'
>;

/** 回收寄卖列表 */
export interface OmsRecyclingList {
  list: OmsRecycleOrderDetail[];
  pageNum?: number;
  pageSize?: number;
  total?: number;
  totalPage?: number;
}

/** 回收寄卖详细信息 */
export interface OmsRecycleOrderDetail {
  /** 预约信息 */
  omsAppointmentStoreRecord?: OmsAppointmentStoreRecord;
  /** 回收寄卖单信息 */
  omsRecycleOrder?: OmsRecycleOrder;
  /** 回收寄卖商品信息 */
  omsRecycleOrderItem?: OmsRecycleOrderItem;
  /** 物流信息 */
  omsRecycleOrderLogistics?: OmsRecycleOrderLogistics;
  /** 日志信息 */
  omsRecycleOrderLogList?: OmsRecycleOrderLog[];
  /** 产品信息 */
  omsRecycleOrderProduct?: OmsRecycleOrderProduct;
  /** 产品信息 */
  umsMember?: UmsMember;
  /** 产品信息 */
  umsAdmin?: SysUser;
  i18nList?: OmsRecycleOrderProductI18n[];
}

/** 预约信息 */
export interface OmsAppointmentStoreRecord {
  /** 开始时间 */
  beginTime?: string;
  /** 预约编号 */
  code?: string;
  /** 创建者 */
  createBy?: number;
  /** 创建时间 */
  createTime?: string;
  /** 删除状态 */
  deleteStatus?: string;
  /** 结束时间 */
  endTime?: string;
  /** 跟进人ID */
  followUpUserId?: number;
  /** id */
  id?: string;
  /** 会员ID */
  memberId?: number;
  /** 修改者 */
  modifyBy?: number;
  /** 修改时间 */
  modifyTime?: string;
  /** 状态：1.已预约，2.已到店，3.超时未到店，4.已取消 */
  status?: number;
  /** 店铺ID，1-银座 2-香港 3-> 新加坡 */
  storeId?: number;
  /** 预约类型：1.回收寄卖预约 */
  type?: string;
  appointmentId?: string;
  /** 预约时段ID */
  appointmentTimeId?: string;
  /** 联系邮箱 */
  email?: string;
  /** 回收寄卖订单id */
  omsRecycleOrderIds?: string;
  /** 联系电话，区号[空格]手机号，示例: +86 17374651688 */
  phone?: string;
  /** 商品数量 */
  productAmount?: number;
  /** 商品图片 */
  productPics?: string;
  /** 商品名称 */
  productTitle?: string;
  /** 备注 */
  remark?: string;
  /** 用户名 */
  username?: string;
  createFrom?: number;
  beforeBeginTime?: string;
  beforeEndTime?: string;
}

/** 回收寄卖单信息 */
export interface OmsRecycleOrder {
  /** 预约记录ID */
  appointmentId?: number;
  /** 取消备注 */
  cancelRemark?: string;
  /** 取消原因：1-拒绝估值/2-估值过期/3-无法估值/4-后台关闭 */
  cancelType?: number;
  /** 订单编号:RS+年月日+4位数字，示例：RS202307190000 */
  code?: string;
  /** 提交日期 */
  commitTime?: string;
  /** 订单完成时间 */
  completeTime?: string;
  /** 合同创建时间 */
  contractCreateTime?: string;
  /** 合同过期时间 */
  contractExpirationTime?: string;
  /** 合同语言 */
  contractLang?: string;
  /** 预约来店或者直接店头创建的情况，门店自留的合同，有地方需要签名 */
  contractLinkShopAdmin?: string;
  /** 预约来店或者直接店头创建的情况，客人版本的合同，有地方需要签名 */
  contractLinkShopMember?: string;
  /** 网站端用户看到的合同链接，一定不需要签名 */
  contractLinkWebsite?: string;
  /** 创建者 */
  createBy?: number;
  /** 创建时间 */
  createTime?: string;
  /** 订单创建平台：0->网站；1->银座店 ；2->香港店 ；3->新加坡店； */
  createdFrom?: number;
  /** 币种：JPY/HKD/SGD */
  currency?: string;
  /** 删除状态 */
  deleteStatus?: string;
  name?: string;
  /** 联系邮箱 */
  email?: string;
  /** 财务付款金额 */
  financialPaymentAmount?: string;
  /** 财务付款信息 */
  financialPaymentInfo?: string;
  /** 财务付款时间 */
  financialPaymentTime?: string;
  /** 财务付款凭证 */
  financialPaymentVoucher?: string;
  /** 初步估值时间 */
  firstValuationTime?: string;
  /** 确认收货时间 */
  goodsReceivedTime?: string;
  /** id */
  id?: string;
  /** 用户ID/护照号 */
  memberCredentialNo?: string;
  /** 会员ID */
  memberId?: number;
  /** 客户收款-账户人地址 */
  memberPaymentAccountAddress?: string;
  /** 客户收款-账户人名字 */
  memberPaymentAccountName?: string;
  /** 客户收款-账户号码 */
  memberPaymentAccountNo?: string;
  /** 客户收款-账户类型：1-海外账户 2-香港账户 3-日本 4-新加坡 */
  memberPaymentAccountType?: number;
  /** 客户收款-账户子类型：1-银行转账 2-FPS转账 3-PayNow转账 , */
  memberPaymentAccountSubType?: number;
  memberPaymentRoutingNo?: string;
  memberPaymentFpsNo?: string;
  memberPaymentFpsAccountName?: string;
  memberPaymentBankPhone?: string;
  memberPaymentPayNowNo?: string;
  memberPaymentPayNowAccountName?: string;
  /** 客户收款-番号，日本专用 */
  memberPaymentBangGo?: string;
  /** 客户收款-银行地址 */
  memberPaymentBankAddress?: string;
  /** 客户收款-银行所在国家 */
  memberPaymentBankCountry?: string;
  /** 客户收款-银行名称 */
  memberPaymentBankName?: string;
  /** 客户收款-银行编号 */
  memberPaymentBankNo?: string;
  /** 客户收款-记号，日本专用 */
  memberPaymentKiGo?: string;
  /** 客户收款-SWIFT code */
  memberPaymentSwiftCode?: string;
  /** 客户备注 */
  memberRemark?: string;
  /** 修改者 */
  modifyBy?: number;
  /** 修改时间 */
  modifyTime?: string;
  /** 订单 取消 阶段 */
  orderCancelType?: number;
  /** 关联订单 id */
  orderId?: number;
  /** 关联订单编号 */
  orderSn?: string;
  /** 阶段类型 : 1-咨询，2-意向，3-合同 4-交易完成 5-取消订单 */
  phaseType?: number;
  /** 联系电话，区号[空格]手机号，示例: +86 17374651688 */
  phone?: string;
  /** 关联商品 ID */
  productId?: number;
  /** 退货快递公司 */
  returnExpressCompany?: string;
  /** 确认退货时间 */
  returnTime?: string;
  /** 退货快递单号 */
  returnTrackingNumber?: string;
  /** 退货类型：0：正常交易，1:门店自提，2:邮寄 */
  returnType?: number;
  /** 退货凭证 */
  returnVoucher?: string;
  /** 收货人名称 */
  receiverName?: string;
  /** 订单结算类型：1-现金结算 2-财务打款 */
  settlementType?: number;
  /** 社交账号 */
  socialAccount?: string;
  /** 社交渠道名称 */
  socialName?: string;
  /** 排序ID */
  sortId?: number;
  /** 回收状态: 1-待初步估值，2-客户同意初步报价，3-待收货，
   * 4-待最终报价，5-待客户确认，6-寄卖中，
   * 7-待打款，8-待退货，9-交易完成，10-已取消，
   * 11-退回待收货，12-退回已收货 */
  status?: number;
  /** 店铺ID，1-银座 2-香港 3-新加坡 */
  storeId?: number;
  /** 回收类型 : 0-未确认，1-寄卖，2-回收 */
  type?: number;
  // 订单是否是寄卖转回收，0不是 1是 默认 0
  isSaleToRecycle?: number;
  priority?: number;
  submissionId?: number;
}

/** 回收寄卖商品信息 */
export interface OmsRecycleOrderItem {
  /** 同意最终报价时间 */
  agreeFinalValuationTime?: string;
  /** 同意初步估值时间 */
  agreeFirstValuationTime?: string;
  /** 创建者 */
  createBy?: number;
  /** 创建时间 */
  createTime?: string;
  /** 删除状态 */
  deleteStatus?: string;
  /** 最终回收价格 */
  finalRecyclePrice?: number;
  /** 最终售卖价格 */
  finalSalePrice?: number;
  /** 最终报价时间 */
  finalValuationTime?: string;
  /** 客服初步估值选择配件 */
  firstValuationProductAccessories?: string;
  /** 客服初步估值填写客服备注 */
  firstValuationShopRemark?: string;
  /** 客服初步估值选择有无库存：1-无；2-有 */
  firstValuationStock?: number;
  /** 客服初步估值填写有无库存备注 */
  firstValuationStockRemark?: string;
  /** 初步估值时间 */
  firstValuationTime?: string;
  /** id */
  id?: string;
  /** 初步估值：回收价格最大值 */
  maxRecyclePrice?: number;
  /** 初步估值：寄卖价格最大值 */
  maxSalePrice?: number;
  /** 会员ID */
  memberId?: number;
  /** 初步估值：回收价格最低值 */
  minRecyclePrice?: number;
  /** 初步估值：寄卖价格最低值 */
  minSalePrice?: number;
  /** 修改者 */
  modifyBy?: number;
  /** 修改时间 */
  modifyTime?: string;
  /** 回收寄卖ID */
  omsRecycleOrderId?: number;
  /** 商品配件，JSON格式 */
  productAccessories?: string | any;
  /** 关联商品 ID */
  productId?: number;
  /** 商品图片信息，JSON格式，示例:["正面" */
  productPics?: string | any;
  storeReceiptPics?: string | any;
  /** 商品状态：1-全新/未使用；2-中古 */
  productStatus?: number;
  /** 商品名称 */
  productTitle?: string;
  /** 售卖商品ID */
  sellProductId?: number;
  /** 售出状态：1-已售出 */
  sellStatus?: number;
  /** 排序ID */
  sortId?: number;
  guestRemarks?: string;
}

/** 日志信息 */
export interface OmsRecycleOrderLog {
  /** 操作后回收状态 */
  afterStatus?: number;
  /** 操作前回收状态 */
  beforeStatus?: number;
  /** 创建者 */
  createBy?: number;
  /** 创建时间 */
  createTime: string;
  /** 删除状态 */
  deleteStatus?: string;
  /** id */
  id?: string;
  /** 会员ID */
  memberId?: number;
  /** 客户操作内容 */
  memberRemark?: string;
  /** 修改者 */
  modifyBy?: number;
  /** 修改时间 */
  modifyTime?: string;
  /** 回收寄卖ID */
  omsRecycleOrderId?: number;
  /** 店家操作内容 */
  shopRemark?: string;
  name?: string;
}

/** 物流信息 */
export interface OmsRecycleOrderLogistics {
  /** 市 */
  city?: string;
  /** 国家/地区 */
  country?: string;
  /** 创建者 */
  createBy?: number;
  /** 创建时间 */
  createTime?: string;
  /** 删除状态 */
  deleteStatus?: string;
  /** 详细地址 */
  detailAddress?: string;
  /** id */
  id?: number;
  /** 会员ID */
  memberId?: number;
  /** 修改者 */
  modifyBy?: number;
  /** 修改时间 */
  modifyTime?: string;
  /** 寄件人姓名 */
  name?: string;
  /** 回收寄卖ID */
  omsRecycleOrderId?: number;
  /** 寄件人电话 */
  phone?: string;
  /** 邮编 */
  postCode?: string;
  /** 邮寄门店:1.银座店，2.香港店，3.新加坡店 */
  postStore?: number;
  /** 省/直辖市 */
  province?: string;
  /** 商品收到货的图片信息 */
  receiptPics?: string;
  /** 区 */
  region?: string;
  /** 物流公司 */
  shippingCompany?: string;
  /** 物流凭证 */
  shippingDocument?: string;
  /** 物流单 */
  shippingLabel?: string;
  /** 包装材料:1.需要，0：不需要 */
  stateWrapper?: number;
  /** 物流凭证 */
  stateWrapperShippingDocument?: string;
}

/** 商品信息 */
export interface OmsRecycleOrderProduct {
  /** 附件/配件 */
  accessory?: string;
  /** 画册图片，连产品图片限制为5张，以逗号分割 */
  albumPics?: string;
  /** 附件/配件 */
  attrAccessory?: string;

  attrColor?: string;

  attrColorRemark?: string;

  attrColors?: string;

  attrHardware?: string;

  attrHardwareRemark?: string;

  attrMaterial?: string;

  attrMaterialRemark?: string;

  attrModel?: string;

  attrModelFilter?: string;

  attrRankDesc?: string;

  attrSize?: string;

  attrStamp?: string;

  attrStampRemark?: string;

  attrType?: string;
  /** 品牌id */
  brandId?: number;
  /** 品牌名称 */
  brandName?: string;

  collections?: string;
  /** 状态，等级/成色，用于二手商品 */
  condition?: string;
  /** 创建人 */
  createdBy?: string;
  /** 商品创建平台：0->线上；1->银座店 ；2->香港店 ；3->新加坡店 */
  createdFrom?: number;
  /** 创建时间 */
  createdTime?: string;
  /** 货币 */
  currency?: string;
  /** 删除状态：0->未删除；1->已删除 */
  deleteStatus?: number;
  /** 商品描述 */
  description?: string;
  /** 详情描述 */
  detailDesc?: string;
  /** 产品详情网页内容 */
  detailHtml?: string;
  /** 移动端网页详情 */
  detailMobileHtml?: string;
  /** 详情标题 */
  detailTitle?: string;
  /** 过期时间 */
  expiredTime?: string;

  extendType?: string;

  facebookEnabled?: number;
  /** 运费模版id */
  feightTemplateId?: number;
  /** 赠送的成长值 */
  giftGrowth?: number;
  /** 赠送的积分 */
  giftPoint?: number;
  /** google shop 同步状态，0未同步 1已同步 */
  googleMerchantUploadStatus?: number;

  id?: number;
  /** 是否新品，1-新品， 2-非新品 */
  isNew?: number;
  /** 关键字 */
  keywords?: string;
  /** 库存预警值 */
  lowStock?: number;
  /** 第一级分类 */
  mainCategoryId?: string;
  /** 修改时间 */
  modifyTime?: string;
  /** 名称 */
  name?: string;
  /** 新品状态:0->不是新品；1->新品 */
  newStatus?: number;
  /** 备注 */
  note?: string;
  /** 市场价 */
  originalPrice?: number;

  owner?: string;
  /** 图片 */
  pic?: string;
  /** 图片2 */
  pic2?: string;
  /** 图片 500px 宽度 */
  pic500w?: string;
  /** 是否为预告商品：0->不是；1->是 */
  previewStatus?: number;
  /** 价格 */
  price?: number;
  /** 商品属性分类id */
  productAttributeCategoryId?: number;
  /** 分类id */
  productCategoryId?: number;
  /** 商品分类名称 */
  productCategoryName?: string;
  /** 货号 */
  productSn?: string;
  /** 促销结束时间 */
  promotionEndTime?: string;
  /** 活动限购数量 */
  promotionPerLimit?: number;
  /** 促销价格 */
  promotionPrice?: number;
  /** 促销开始时间 */
  promotionStartTime?: string;
  /** 促销类型：0->没有促销使用原价;1->使用促销价；2->使用会员价；3->使用阶梯价格；4->使用满减价格；5->限时购 */
  promotionType?: number;
  /** 上架状态：0->下架；1->上架 */
  publishStatus?: number;

  rank?: string;
  /** 推荐状态；0->不推荐；1->推荐 */
  recommandStatus?: number;
  /** 销量 */
  sale?: number;
  /** 以逗号分割的产品服务：1->无忧退货；2->快速退款；3->免费包邮 */
  serviceIds?: string;
  /** 排序 */
  sort?: number;

  sourceType?: number;
  /** 库存 */
  stock?: number;
  /** 仓储地 */
  stockPlace?: string;
  /** 副标题 */
  subTitle?: string;
  /** 单位 */
  unit?: string;
  /** 限制使用的积分数 */
  usePointLimit?: number;
  /** 审核状态：0->未审核；1->审核通过 */
  verifyStatus?: number;
  /** 商品重量，默认为克 */
  weight?: number;

  fullStamp?: string;
}

/** 回收寄卖请求参数 */
export interface OmsRecycleOrderPayload {
  /** 开始提交日期 */
  beginCommitTime?: string;
  /** 订单编号:RS+年月日+4位数字，示例：RS202307190000 */
  code?: string;
  /** 联系邮箱 */
  email?: string;
  /** 结束提交日期 */
  endCommitTime?: string;
  /** 搜索关键词 */
  keyword?: string;
  /** 会员ID */
  memberId?: number;
  pageNum?: number;
  pageSize?: number;
  /** 阶段类型 : 1-咨询，2-意向，3-合同 */
  phaseType?: number;
  /** 联系电话，区号[空格]手机号，示例: +86 17374651688 */
  phone?: string;
  /** 回收状态: 回收状态: 1-待初步估值，3-待收货(2-客户同意初步报价)，4-待最终报价，5-待客户确认，6-寄卖中，7-待打款，8-待退货，9-交易完成，10-已取消(11-退回待收货，12-退回已收货 */
  status?: number | string;
  /** 回收类型 : 0-未确认，1-寄卖，2-回收 */
  type?: number;
  /** 前端维护字段 */
  time?: any[];
  submissionId?: number;
  selectSearch?: OmsRecycleOrderPayload;
}

/** 初步估值 */
export interface OmsRecycleOrderValuationPayload {
  /** 初步估值：回收价格最大值 */
  maxRecyclePrice?: number;
  /** 初步估值：寄卖价格最大值 */
  maxSalePrice?: number;
  /** 初步估值：回收价格最低值 */
  minRecyclePrice?: number;
  /** 初步估值：寄卖价格最低值 */
  minSalePrice?: number;
  /** 回收寄卖商品ID */
  omsRecycleOrderItemId?: string;
  emailRemark?: string;
  /** 拒绝原因 */
  remark?: string;
  /** 前端维护 */
  SalePrice?: number[];
  RecyclePrice?: number[];
}

export interface onError {
  [key: string]: any;
}

/** 回收寄卖详情 基础信息 */
export interface OmsRecycleOrderBaseInfo {
  /** 订单编号:RS+年月日+4位数字，示例：RS202307190000 */
  code?: string;
  /** 订单类型 : 0-未确认，1-寄卖，2-回收 */
  type?: string;
  /** 订单状态: 回收状态: 1-待初步估值，3-待收货(2-客户同意初步报价)，4-待最终报价，5-待客户确认，6-寄卖中，7-待打款，8-待退货，9-交易完成，10-已取消(11-退回待收货，12-退回已收货 */
  status?: string;
  /** 创建时间 */
  createTime?: string;
  /** 意向确认时间 */
  intentionTime?: string;
  /** 合同确认时间 */
  contractTime?: string;
  /** 交易完成时间 */
  tradingTime?: string;
  /** 关联销售订单 */
  relatedSalesOrder?: string;
  /** 关联商品编号 */
  associatedProductId?: string;
  /** 持込形式 来源渠道*/
  channel?: string;
  /** 创建人 */
  memberId?: number;
  emailMember?: string;
  /** 跟进门店 */
  store?: string;
  createBy?: string;
  createOwner?: string;
  orderId?: number;
  createId?: string;
}

/** 回收寄卖详情 客户信息 */
export interface OmsRecycleOrderCustomerInfo extends onError {
  /** 创建人 */
  memberId?: number;
  emailMember?: string;
  /** 联系电话 */
  phone?: string;
  /** 联系邮箱 */
  email?: string;
  /** 社交账号 */
  socialAccount?: string;
  /** 社交渠道名称 */
  socialName?: string;
  /** 社交媒体 */
  social?: string;
  name?: string;
}

/** 用户提交商品信息 */
export interface OmsRecycleOrderUserProductInfo extends onError {
  /** 商品配件，JSON格式 */
  productAccessories?: string;
  accessoriesList?: any;
  /** 商品图片信息，JSON格式，示例:["正面" */
  productPics?: string;
  picList?: any;
  /** 商品名称 */
  productTitle?: string;
  memberRemark?: string;
  /** 后台创建订单时 临时图片 */
  storeReceiptPics?: string;
  storeReceiptPicsList?: any;
}

/** 商品实际信息 */
export interface OmsRecycleOrderProductInfo extends onError {}

/* 估值信息 */
export interface OmsRecycleOrderValuationInfo extends onError {
  /** 最终回收价格 */
  finalRecyclePrice?: number | string;
  /** 最终售卖价格 */
  finalSalePrice?: number | string;
  /** 初步估值：回收价格最大值 */
  maxRecyclePrice?: number;
  /** 初步估值：寄卖价格最大值 */
  maxSalePrice?: number;
  /** 初步估值：回收价格最低值 */
  minRecyclePrice?: number;
  /** 初步估值：寄卖价格最低值 */
  minSalePrice?: number;
  /** 创建时间 */
  createTime?: string;
  /** 修改时间 */
  modifyTime?: string;
  /** 币种：JPY/HKD/SGD */
  currency?: string;
  /** 初步估值 */
  RecyclePrice?: string;
  SalePrice?: string;
}

/** 物流信息 */
export interface OmsRecycleOrderLogisticsInfo extends onError {
  /** 姓名 */
  name?: string;
  /** 手机号 */
  phone?: string;
  /** 邮编 */
  postCode?: string;
  /** 国家 */
  country?: string;
  /** 地区 */
  city?: string;
  /** 详细地址 */
  detailAddress?: string;
  /** 邮寄信息 */
  mailingInfoPhoto?: string[] | any;
  /** 货物信息 */
  cargoInfoPhoto?: string[] | any;
  /** 收货状态 */
  status?: string | any;
  /** 收货照片 */
  receivingPhoto?: string[] | any;
  /** 收货时间 */
  createTime?: string;
  /** 收货人 */
  memberId?: number;
  emailMember?: string | number;
}

/** 退货信息 */
export interface OmsRecycleOrderReturnGoodsInfo extends onError {
  /** 快递名称 */
  returnExpressCompany?: string;
  /** 快递单号 */
  returnTrackingNumber?: string;
  /** 快递时间 */
  createTime?: string;
  /** 货物信息 */
  returnVoucher?: string[];
  /** 到店自取 */
  returnType?: string;
  /** 自取时间 */
  time?: string;
}

/** 收款信息 */
export interface OmsRecycleOrderCollectionInfo extends onError {
  financialPaymentInfo?: any;
  financialPaymentAmount?: string;
  status?: string;
  time?: string;
  financialPaymentVoucher?: string[];
  /** 订单结算类型：1-现金结算 2-财务打款 */
  settlementType?: string;
}

/** 日志信息 */
export interface OmsRecycleOrderLogInfo extends onError {
  time?: string;
  personnel?: string;
  remark?: string;
  statusChage?: string;
}

/** 合同信息 */
export interface OmsRecycleOrderContractInfo extends onError {
  maturityTime?: string;
  url?: string;
  status?: string;
}

/** 初步估值前补充信息 */
export type OmsRecycleOrderFirstValuationSaveInfo = {
  /** 颜色 */
  color?: string | string[];
  /** 客服初步估值选择配件 */
  firstValuationProductAccessories?: string;
  /** 客服初步估值填写客服备注 */
  firstValuationShopRemark?: string;
  /** 客服初步估值选择有无库存：1-无；2-有 */
  firstValuationStock?: number;
  /** 客服初步估值填写有无库存备注 */
  firstValuationStockRemark?: string;
  /** 金属配件 */
  hardware?: string | string[];
  /** 材质 */
  material?: string | string[];
  /** 回收寄卖商品ID */
  omsRecycleOrderItemId?: string;
  /** 商品分类 */
  productCategoryId?: number | number[];
  /** 附属品 */
  accessory?: string | string[];
  /** 成色 */
  rank?: string;
  /** 刻印 */
  stamp?: string;
  currency?: string;
  i18nJa?: OmsRecycleOrderProductI18n;
  i18nCn?: OmsRecycleOrderProductI18n;
  i18nTw?: OmsRecycleOrderProductI18n;
} & OmsRecycleOrderProductI18n;

export interface ProductToForm {
  /** 颜色 */
  color?: string | string[];
  /** 金属配件 */
  hardware?: string | string[];
  /** 材质 */
  material?: string | string[];
  /** 回收寄卖商品ID */
  omsRecycleOrderItemId?: string;
  /** 商品分类 */
  productCategoryId?: number | number[];
  /** 成色 */
  rank?: string;
  /** 刻印 */
  stamp?: string;
  currency?: string;
}

/** 状态总数 */
export interface OmsRecycleOrderStatusTotal {
  [key: string]: number;

  cancel: number;
  waitPayment: number;
  waitAgreeFirstValuation: number;
  waitFirstValuation: number;
  waitGoodsReceived: number;
  complete: number;
  count: number;
  waitGoodsReceiveConfirmed: number;
  waitGoodsReceiveUnconfirmed: number;
  valuationExpired: number;
}

/** 合同列表 */
export interface OmsRecycleOrderContractLog {
  id: number;
  type: number;
  prev_start_time: string;
  prev_end_time: string;
  new_start_time: string;
  new_end_time: string;
  prev_price: number;
  new_price: number;
  currency: string;
  create_time: string;
  return_express_company: string;
  return_tracking_number: string;
}

/** 预约列表周汇总 + 预约总览*/
export interface OmsAppointmentPayload {
  /** 开始日期 */
  beginDate?: string;
  /** 联系邮箱 */
  email?: string;
  /** 结束日期 */
  endDate?: string;
  /** 搜索关键词 */
  keyword?: string;

  pageNum?: number;

  pageSize?: number;
  /** 联系电话，区号[空格]手机号，示例: +86 17374651688 */
  phone?: string;
  /** 状态：1.已预约，2.已到店，3.超时未到店，4.已取消 */
  status?: number;
  /** 店铺ID，1-银座 2-香港 3-> 新加坡 */
  storeId?: number;
  /** 客户名称 */
  userName?: string;
}

/** 预约列表 */
export interface OmsAppointmentDateVO {
  appointmentDate?: OmsAppointmentDateConfiguration;
  omsAppointmentRecordVOS?: OmsAppointmentRecordVO[];
}

export interface OmsAppointmentDateConfiguration {
  /** 日期 */
  appointmentDate?: string;
  /** 删除状态 */
  deleteStatus?: string;
  /** id */
  id?: string;
  /** 修改者 */
  modifyBy?: number;
  /** 修改时间 */
  modifyTime?: string;
  /** 备注 */
  remark?: string;

  status?: number; // 0.已启用 1.已禁用;
  /** 店铺ID，1-银座 2-香港 3-> 新加坡 */
  storeId?: number;
}

export interface OmsAppointmentRecordVO {
  /** 预约日期时段 */
  appointmentTimeConfiguration?: OmsAappointmentTimeConfiguration;
  /** 预约门店记录 */
  omsAppointmentStoreRecord?: OmsAppointmentStoreRecord;
  /** 取下预约列表 */
  cancelRecords?: OmsAppointmentStoreRecord[];
}

export interface OmsAappointmentTimeConfiguration {
  /** 预约日期id */
  appointmentDateId?: number;
  /** 预约记录id */
  appointmentId?: number;
  /** 开始时间 */
  beginTime?: string;
  /** 删除状态 */
  deleteStatus?: string;
  /** 结束时间 */
  endTime?: string;
  /** id */
  id?: string;
  /** 修改者 */
  modifyBy?: number;
  /** 修改时间 */
  modifyTime?: string;

  status?: number; //0.空闲 1.已预约 2.已删除;
  /** 店铺ID，1-银座 2-香港 3-> 新加坡 */
  storeId?: number;
}

//Reservation overview
export interface OmsAppointmentList {
  list?: OmsAppointmentRecordInfoVO;
  pageNum?: number;
  pageSize?: number;
  total?: number;
  totalPage?: number;
}

export interface OmsAppointmentRecordInfoVO {
  /** 预约门店记录 */
  omsAppointmentStoreRecord?: OmsAppointmentStoreRecord;
  /** 回收寄卖单信息 */
  omsRecycleOrderInfoVOS?: OmsRecycleOrderDetail[];
  /** 时段记录 */
  omsAappointmentTimeConfiguration?: OmsAappointmentTimeConfiguration;

  /** 自己增加 */
  modalType?: 'add' | 'viewDetail';
}

export interface OmsAppointmentDateListVO {
  omsAappointmentTimeConfigurationList?: OmsAappointmentTimeConfiguration[];

  omsAppointmentDateConfiguration?: OmsAppointmentDateConfiguration;
}

export interface OmsOperateAppointment {
  appointmentDateId: string;
  status: number;
  storeId?: number;
}

export interface OmsAppointmentDateUpdate {
  /** 预约日期ID */
  appointmentDateId?: number;
  /** 预约时段 */
  appointmentTimes?: { beginTime: string; endTime: string }[];
  /** 删除时段id */
  deleteIds?: string[];
  /** 备注 */
  remark?: string;

  status?: number; //0.启用 1.禁用;
  /** 店铺ID，1-银座 2-香港 3-> 新加坡 */
  storeId?: number;
  /** 前端维护 */
  date?: string;
  week?: string;
}

export interface OmsAppointmentStatusTotal {
  /** 已到店 */
  arrived?: number;
  /** 已预约 */
  reserved?: number;
  cancel?: number;
  timeout?: number;
}

export interface OmsRecycleOrderProductI18n {
  name?: string;
  subTitle?: string;
  note?: string;
  detailTitle?: string;
  attrRankDesc?: string;
  attrSize?: string;
  attrRanDesc?: string;
  lang?: string;
  id?: string;
}

export type OmsRecycleOrderCreateProducts = {
  /** 附属品/配件 */
  accessory?: string;
  /** 颜色 */
  color?: string;
  /** 币种：JPY/HKD/SGD */
  currency?: string;
  /** 金属配件 */
  hardware?: string;
  /** 材质 */
  material?: string;
  /** 初步估值：回收价格最大值 */
  maxRecyclePrice?: number;
  /** 初步估值：寄卖价格最大值 */
  maxSalePrice?: number;
  /** 客户备注 */
  memberRemark?: string;
  /** 初步估值：回收价格最低值 */
  minRecyclePrice?: number;
  /** 初步估值：寄卖价格最低值 */
  minSalePrice?: number;
  /** 商品分类 */
  productCategoryId?: number;
  /** 商品图片信息，JSON格式，示例:["正面" */
  productPics?: string;
  /** 商品名称 */
  productTitle?: string;
  /** 成色 */
  rank?: string;
  /** 最终回收价格 */
  finalRecyclePrice?: number;
  /** 最终售卖价格 */
  finalSalePrice?: number;
  stamp?: string;
  i18nJa?: OmsRecycleOrderProductI18n;
  i18nCn?: OmsRecycleOrderProductI18n;
  i18nTw?: OmsRecycleOrderProductI18n;
  guestRemarks?: string;
};

/** 创建合同订单 */
export type OmsRecycleOrderCreateDTO = {
  /** 联系邮箱 */
  email?: string;
  /** 订单创建平台：0->网站；1->银座店 ；2->香港店 ；3->新加坡店；4->LINE；5->INS；6->微信；7->谷歌；8->Facebook；9->others； */
  createdFrom?: number;
  /** 会员ID */
  memberId?: number;
  /** 客户收款-账户人地址 */
  memberPaymentAccountAddress?: string;
  /** 客户收款-账户人名字 */
  memberPaymentAccountName?: string;
  /** 客户收款-账户号码 */
  memberPaymentAccountNo?: string;
  /** 客户收款-账户子类型：1-银行转账 2-FPS转账 3-PayNow转账 */
  memberPaymentAccountSubType?: number;
  /** 客户收款-账户类型：1-海外账户 2-香港账户 */
  memberPaymentAccountType?: number;
  /** 客户收款-番号，日本专用 */
  memberPaymentBangGo?: string;
  /** 客户收款-银行地址 */
  memberPaymentBankAddress?: string;
  /** 客户收款-银行所在国家 */
  memberPaymentBankCountry?: string;
  /** 客户收款-银行名称 */
  memberPaymentBankName?: string;
  /** 客户收款-银行编号 */
  memberPaymentBankNo?: string;
  /** 客户收款-银行预留电话 */
  memberPaymentBankPhone?: string;
  /** 客户收款-FPS账户人姓名 香港 fps 专用 */
  memberPaymentFpsAccountName?: string;
  /** 客户收款-FPS号码 香港 fps 专用 */
  memberPaymentFpsNo?: string;
  /** 客户收款-记号，日本专用 */
  memberPaymentKiGo?: string;
  /** 客户收款-payNow账户人姓名 新加坡 payNow 专用 */
  memberPaymentPayNowAccountName?: string;
  /** 客户收款-payNow号码 新加坡 payNow 专用 */
  memberPaymentPayNowNo?: string;
  /** 客户收款-routingNo 美国账户专用 */
  memberPaymentRoutingNo?: string;
  /** 客户收款-SWIFT code */
  memberPaymentSwiftCode?: string;
  /** 客服初步估值选择配件 */
  firstValuationProductAccessories?: string;
  /** 客服初步估值填写客服备注 */
  firstValuationShopRemark?: string;
  /** 客服初步估值选择有无库存：1-无；2-有 */
  firstValuationStock?: number;
  /** 客服初步估值填写有无库存备注 */
  firstValuationStockRemark?: string;
  /** 联系电话，区号[空格]手机号，示例: +86 17374651688 */
  phone?: string;
  /** 订单结算类型：1-现金结算 2-财务打款 */
  settlementType?: number;
  /** 社交账号 */
  socialAccount?: string;
  /** 社交渠道名称 */
  socialName?: string;
  /** 刻印 */
  stamp?: string;
  /** 店铺ID，1-银座 2-香港 3-新加坡 */
  storeId?: number;
  /** 合同订单类型：1->寄卖合同单；2->回收合同单； */
  type?: number;
  /** 成色 */
  rank?: string;
  /** 币种：JPY/HKD/SGD */
  currency?: string;
  name?: string;
  postPhone?: string;
  phoneNumber?: string;
  defaultStatus?: number;
  postCode?: string;
  province?: string;
  country?: string;
  city?: string;
  detailAddress?: string;
  productParamList?: OmsRecycleOrderCreateProducts[];
} & OmsRecycleOrderProductI18n;

/** 创建意向订单 */
export type OmsRecycleOrderSNSCreateDTO = {
  /** 联系邮箱 */
  email?: string;
  /** 会员ID */
  memberId?: number;
  /** 订单创建平台：0->网站；1->银座店 ；2->香港店 ；3->新加坡店；4->LINE；5->INS；6->微信；7->谷歌；8->Facebook；9->others； */
  createdFrom?: number;
  /** 联系电话，区号[空格]手机号，示例: +86 17374651688 */
  phone?: string;
  /** 社交账号 */
  socialAccount?: string;
  /** 社交渠道名称 */
  socialName?: string;
  /** 刻印 */
  stamp?: string;
  /** 店铺ID，1-银座 2-香港 3-新加坡 */
  storeId?: number;
  /** 成色 */
  rank?: string;
  /** 币种：JPY/HKD/SGD */
  currency?: string;
  type?: number;
  /** 客服初步估值选择配件 */
  firstValuationProductAccessories?: string;
  /** 客服初步估值填写客服备注 */
  firstValuationShopRemark?: string;
  /** 客服初步估值选择有无库存：1-无；2-有 */
  firstValuationStock?: number;
  /** 客服初步估值填写有无库存备注 */
  firstValuationStockRemark?: string;
  productParamList?: OmsRecycleOrderCreateProducts[];
} & OmsRecycleOrderProductI18n;

/** sns订单-提交预约信息 */
export interface OmsAppointmentRecordDTO {
  /** 预约时段ID */
  appointmentTimeId?: string;
  /** 会员ID */
  memberId?: number;
  /** 回收寄卖订单id JSON格式 */
  omsRecycleOrderIds?: string;
  /** 商品图片 JSON格式 */
  productPics?: string;
  /** 备注 */
  remark?: string;
  /** 店铺ID，1-银座 2-香港 3-> 新加坡 */
  storeId?: number;
}

/** sns订单-邮寄 */
export interface omsRecycleOrderCreateLogisticsAddressDTO {
  omsRecycleOrderId?: string;
  name?: string;
  phone?: string;
  country?: string;
  city?: string;
  postCode?: string;
  detailAddress?: string;
  stateWrapper?: number;
  postStore?: string;
  memberId?: number;
  shippingDocument?: string;
}

export interface OmsRecycleOrderFillInMemberPaymentInfoDTO {
  /** 回收寄卖ID */
  id?: string;
  /** 客户收款-账户人地址 */
  memberPaymentAccountAddress?: string;
  /** 客户收款-账户人名字 */
  memberPaymentAccountName?: string;
  /** 客户收款-账户号码 */
  memberPaymentAccountNo?: string;
  /** 客户收款-账户子类型：1-银行转账 2-FPS转账 3-PayNow转账 */
  memberPaymentAccountSubType?: number;
  /** 客户收款-账户类型：1-海外账户 2-香港账户 */
  memberPaymentAccountType?: number;
  /** 客户收款-番号，日本专用 */
  memberPaymentBangGo?: string;
  /** 客户收款-银行地址 */
  memberPaymentBankAddress?: string;
  /** 客户收款-银行所在国家 */
  memberPaymentBankCountry?: string;
  /** 客户收款-银行名称 */
  memberPaymentBankName?: string;
  /** 客户收款-银行编号 */
  memberPaymentBankNo?: string;
  /** 客户收款-银行预留电话 */
  memberPaymentBankPhone?: string;
  /** 客户收款-FPS账户人姓名 香港 fps 专用 */
  memberPaymentFpsAccountName?: string;
  /** 客户收款-FPS号码 香港 fps 专用 */
  memberPaymentFpsNo?: string;
  /** 客户收款-记号，日本专用 */
  memberPaymentKiGo?: string;
  /** 客户收款-payNow账户人姓名 新加坡 payNow 专用 */
  memberPaymentPayNowAccountName?: string;
  /** 客户收款-payNow号码 新加坡 payNow 专用 */
  memberPaymentPayNowNo?: string;
  /** 客户收款-routingNo 美国账户专用 */
  memberPaymentRoutingNo?: string;
  /** 客户收款-SWIFT code */
  memberPaymentSwiftCode?: string;
}

// 收银台 - 支付详情列表
export interface CheckoutCounterPayload_paymentList {
  payType: string; //支付类型 必传,
  payAmount: number; //支付金额
}

// 收银台 - 购买商品列表
export type CheckoutCounterPayload_productList = Partial<
  Pick<
    PmsProduct,
    | 'id'
    | 'stockPlace'
    | 'name'
    | 'productSn'
    | 'subTitle'
    | 'brandName'
    | 'price'
    | 'currency'
  >
> & {
  isTaxFree: number; //是否含税 0 含税 1 免税
  actualCurrency?: string;
  actualCurrencyRate: number;
  productSn?: string;
  productBrand?: string;
  productName?: string;
  realAmountCurrency?: string;
  taxAmount?: number;
  productPrice: number;
  productId: number;
  productPriceActualCurrency: number;
};

export interface StoreConfirmOrder {
  omsOrder: {
    id?: number;
    promotionAmount: number;
    integrationAmount: number;
    useIntegration: number;
    totalAmount: number;
    payAmount: number;
    totalAmountActualCurrency: number; // 实际币值总额
    payAmountActualCurrency: number; // 总金额实际币种
    totalTaxAmount: number;
    createTime: string;
    orderSn: string;
    integration: number;
    memberUsername: string;
    couponAmount: number;
    freightAmountActualCurrency: number;
    currency: string;
  };
  omsOrderItems: CheckoutCounterPayload_productList[];
  smsCouponHistory?: OmsCouponDetail & {
    i18nDescription?: {
      [key: string]: {
        title: string;
        description: string;
      };
    };
  };
}

export interface StoreConfirmOrderDto {
  memberId?: number;
  useIntegration: number;
  promotionAmount: number;
  couponCode?: string;
  productList: (Pick<PmsProduct, 'id'> & Pick<OmsOrderItem, 'isTaxFree'>)[];
}

export interface StoreCreateOrderDto {
  memberId?: number;
  useIntegration: number;
  promotionAmount: number;
  isPointsGiven: boolean;
  paymentList?: {
    payType: string;
    payAmount: number;
  }[];
  productList: (Pick<PmsProduct, 'id'> & Pick<OmsOrderItem, 'isTaxFree'>)[];
  payMode?: number;
  couponCode?: string;
  createdFrom?: number;
  staffName?: string;
  note?: string;
  b2bPrice?: number;
}

export interface omsStoreFinalPaymentPayload {
  orderId: number;
  //"支付详情列表",必传
  paymentList: CheckoutCounterPayload_paymentList[];
  memberId?: number;
}

// 创建订单
export type omsOrderCreate_productList = Pick<PmsProduct, 'id' | 'price'>;

export interface OrderGenerateForMemberDto {
  memberId?: number;
  productIdList: number[];
  taxFreeProductIdList?: number[];
  useIntegration: number;
  promotionAmount: number;
  receiveAddressId?: number;
  multiplePaySet?: OmsOrderMultiplePayV2[];
  couponCode?: string;
  createdFrom: number;
  orderStatus?: number;
  note?: string;
  isKeepProduct?: boolean;
}

export type OmsOneCompletionPayload = {
  id: string;
  type: number;
  storeId: number;
  finalRecyclePrice: number;
  finalSalePrice: number;
} & PaymentInfo;

export type ReceiptDto = Pick<
  OmsOrder,
  | 'orderSn'
  | 'totalTaxAmount'
  | 'totalAmountActualCurrency'
  | 'createTime'
  | 'staffName'
  | 'couponAmount'
  | 'payAmountActualCurrency'
  | 'useIntegration' // 使用积分
  | 'integration' // 赠送积分
  | 'createdFrom'
  | 'promotionAmount'
  | 'id'
  | 'paymentTime'
  | 'memberId'
> & {
  omsOrderItems: Pick<
    OmsOrderItem,
    | 'isTaxFree'
    | 'productSn'
    | 'productBrand'
    | 'productName'
    | 'productPrice'
    | 'productId'
    | 'productPriceActualCurrency'
  >[];
  stockPlace: string;
  cumulativePoints: number;
  receivedAmount: number; // 实际收款
  changeAmount: number; // 找零
  payList?: {
    name: string;
    amount: number;
  }[];
};

export interface OmsCouponDetail {
  id: number;
  couponId: number;
  memberId: number;
  couponCode: string;
  useStatus: number;
  amount: number;
  useTime: string;
  orderSn: string;
  orderId: number;
  smsCoupon: {
    id: number;
    type: number;
    name: string;
    amount: number;
  };
}

interface PaymentInfo {
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
}

export type OmsConsignmentToRecycling = {
  id: string;
  settlementType: number;
  finalRecyclePrice: number;
} & PaymentInfo;
