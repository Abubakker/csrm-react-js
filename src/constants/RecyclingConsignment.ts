import { OmsRecycleOrder } from 'types/oms';
import i18n from '../i18n';
import LOCALS from '../commons/locals';

/** 订单类型 */
export const OrderType = [
  {
    label: i18n.t(LOCALS.all),
    value: '',
  },
  {
    label: i18n.t(LOCALS.sell_consignment),
    value: 0,
  },
  {
    label: i18n.t(LOCALS.sell),
    value: 2,
  },
  {
    label: i18n.t(LOCALS.consignment),
    value: 1,
  },
];

/** 订单进度 */
export const OrderProgress = [
  {
    label: i18n.t(LOCALS.all),
    value: '',
  },
  {
    label: i18n.t(LOCALS.inquiry_order_progress),
    value: '1',
  },
  {
    label: i18n.t(LOCALS.intentional_order_progress),
    value: '2',
  },
  {
    label: i18n.t(LOCALS.contract_order_progress),
    value: '3',
  },
];

/** 下拉搜索 */
export const SelectSearchOption = [
  {
    value: 'keyword',
    label: i18n.t(LOCALS.all),
    key: 1,
    type: 'string',
  },
  {
    value: 'code',
    label: i18n.t(LOCALS.code),
    key: 2,
    type: 'string',
  },
  {
    value: 'memberId',
    label: i18n.t(LOCALS.member_id),
    key: 3,
    type: 'number',
  },
  {
    value: 'phone',
    label: i18n.t(LOCALS.phone_number),
    key: 4,
    type: 'string',
  },
  {
    value: 'email',
    label: i18n.t(LOCALS.email),
    key: 5,
    type: 'string',
  },
  {
    value: 'productTitle',
    label: i18n.t(LOCALS.product_name),
    key: 6,
    type: 'string',
  },
  {
    value: 'submissionId',
    label: i18n.t(LOCALS.sHXnOEVSrC),
    key: 7,
    type: 'number',
  },
];

/** 默认分页 */
export const DefaultPagination = { pageNum: 0, pageSize: 10 };

interface MappingType {
  [key: string | number]: string;
}
export const SHOP_MAP = {
  GINZA: 1,
  HONGKONG: 2,
  SINGAPORE: 3,
};

/** 店铺ID，1-银座 2-香港 3-新加坡 */
export const ShopMaping: MappingType = {
  [SHOP_MAP.GINZA]: i18n.t(LOCALS.ginza_shop),
  [SHOP_MAP.HONGKONG]: i18n.t(LOCALS.hongkong_shop),
  [SHOP_MAP.SINGAPORE]: i18n.t(LOCALS.singapore_shop),
};

export const OMS_RECYCLE_ORDER_STATUS_MAP = {
  // 待初步估值
  WAIT_FIRST_VALUATION: 1,
  // 已初步估值
  HAS_BEEN_FIRST_VALUATION: 2,
  // 待收货
  WAIT_GOODS_RECEIVED: 3,
  // 待最终报价
  WAIT_FINAL_VALUATION: 4,
  // 提交最终报价，待客户确认
  WAIT_AGREE_FINAL_VALUATION: 5,
  // 寄卖中
  ON_SALE: 6,
  // 待打款
  WAIT_PAYMENT: 7,
  // 待退货
  WAIT_RETURN_GOODS: 8,
  // 交易完成
  COMPLETE: 9,
  // 已取消
  CANCEL: 10,
  // 退回待收货
  WAIT_RETURN_GOODS_RECEIVED: 11,
  // 退回已收货
  RETURN_GOODS_RECEIVED: 12,
  // 已打款，待确认收款
  WAIT_PAYMENT_RECEIVED: 13,
  // 初步估值3天自动过期
  VALUATION_EXPIRED: 14,
};

/** 回收状态: 回收状态:
 * 1-待初步估值，3-待收货(2-客户同意初步报价)，4-待最终报价，
 * 5-待客户确认，6-寄卖中，7-待打款，
 * 8-待退货，9-交易完成，10-已取消(11-退回待收货，12-退回已收货
 * 13-表示已打款，但是还没确认收款 */
export const StatusMapping: MappingType = {
  '1': i18n.t(LOCALS.pending_initial_appraisal),
  '2': i18n.t(LOCALS.preliminary_valuation_completed),
  '3': i18n.t(LOCALS.dispatched),
  '4': i18n.t(LOCALS.pending_final_appraisal),
  '5': i18n.t(LOCALS.pending_customer_confirmation),
  '6': i18n.t(LOCALS.on_consignment),
  '7': i18n.t(LOCALS.pending_payment_r),
  '8': i18n.t(LOCALS.pending_return),
  '9': i18n.t(LOCALS.transaction_completed),
  '10': i18n.t(LOCALS.cancelled),
  '11': i18n.t(LOCALS.cancelled),
  '12': i18n.t(LOCALS.cancelled),
  '13': i18n.t(LOCALS.payment_made),
  '14': i18n.t(LOCALS.valuation_expired),
};

export const getRecycleOrderStatusText = (
  omsRecycleOrder?: OmsRecycleOrder
) => {
  if (!omsRecycleOrder) return '-';
  const { status, appointmentId, isSaleToRecycle } = omsRecycleOrder;

  if (!status) return '-';

  if (status === OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_GOODS_RECEIVED) {
    if (appointmentId) {
      return i18n.t(LOCALS.waiting_store_arrival);
    } else {
      return i18n.t(LOCALS.dispatched);
    }
  }

  if (status === OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_FINAL_VALUATION) {
    if (isSaleToRecycle) {
      return i18n.t(LOCALS.consignment_pending);
    } else {
      return i18n.t(LOCALS.pending_final_appraisal);
    }
  }

  if (status === OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_AGREE_FINAL_VALUATION) {
    if (isSaleToRecycle) {
      return i18n.t(LOCALS.consignment_in_progress);
    } else {
      return i18n.t(LOCALS.pending_customer_confirmation);
    }
  }

  return StatusMapping[status] || '-';
};

export const StatusListDefault = [
  {
    label: i18n.t(LOCALS.pending_initial_appraisal),
    key: '1',
    filed: 'waitFirstValuation',
  },
  {
    label: i18n.t(LOCALS.initial_appraisal),
    key: '2',
    filed: 'waitGoodsReceiveUnconfirmed',
  },
  {
    label: i18n.t(LOCALS.dispatched),
    key: '3',
    filed: 'waitGoodsReceiveConfirmed',
  },
  {
    label: i18n.t(LOCALS.pending_final_appraisal),
    key: '4',
    filed: 'waitFinalValuation',
  },
  {
    label: i18n.t(LOCALS.pending_customer_confirmation),
    key: '5',
    filed: 'waitAgreeFirstValuation',
  },
  {
    label: i18n.t(LOCALS.on_consignment),
    key: '6',
    filed: 'onSale',
  },
  {
    label: i18n.t(LOCALS.pending_payment_r),
    key: '7',
    filed: 'waitPayment',
  },
  {
    label: i18n.t(LOCALS.pending_return),
    key: '8',
    filed: 'waitReturnGoods',
  },
  {
    label: i18n.t(LOCALS.valuation_expired),
    key: '14',
    filed: 'valuationExpired',
  },
  {
    label: i18n.t(LOCALS.transaction_completed),
    key: '9',
    filed: 'complete',
  },
  {
    label: i18n.t(LOCALS.all_orders),
    key: 'all',
    filed: 'count',
  },
];

/** 订单类型 */
export const CurrencyOption = [
  {
    label: 'JPY',
    value: 'JPY',
    numberValue: 1,
  },
  {
    label: 'HKD',
    value: 'HKD',
    numberValue: 2,
  },
  {
    label: 'SGD',
    value: 'SGD',
    numberValue: 3,
  },
];

/** 合同订单 */
export const ContractOrder = [
  {
    label: '寄卖订单',
    value: '寄卖订单',
  },
  {
    label: '回收订单',
    value: '回收订单',
  },
];

/** 收款方式 */
export const PaymentMethod = [
  {
    label: i18n.t('cash'),
    value: 1,
  },
  {
    label: i18n.t('accounting_settlement'),
    value: 2,
  },
];

/**
 * 商品图片顺序 从上到下
 * front 正面
 * back 背面
 * interior 内里
 * hardware 金属件
 * blindStamp 刻印
 * signsOfWear 使用痕迹
 * accessories 配件
 * more 上传更多
 */
export const ProductImageSort = [
  'front',
  'back',
  'interior',
  'blindStamp',
  'hardware',
  'hardware0',
  'hardware1',
  'hardware2',
  'hardware3',
  'hardware4',
  'hardware5',
  'hardware6',
  'hardware7',
  'hardware8',
  'signsOfWear',
  'signsOfWear0',
  'signsOfWear1',
  'signsOfWear2',
  'signsOfWear3',
  'signsOfWear4',
  'signsOfWear5',
  'signsOfWear6',
  'signsOfWear7',
  'signsOfWear8',
  'accessories',
  'accessories0',
  'accessories1',
  'accessories2',
  'accessories3',
  'accessories4',
  'accessories5',
  'accessories6',
  'accessories7',
  'accessories8',
  'more',
  'more0',
  'more1',
  'more2',
  'more3',
  'more4',
  'more5',
  'more6',
  'more7',
  'more8',
];

/** 商品配件 对应关系 */
export const AccessoriesMapping: MappingType = {
  '1': '肩带',
  '2': '锁头钥匙',
  '3': '尘袋',
  '4': '羊毛毡',
  '5': '包装盒',
  '6': '小票',
  '7': 'CITES',
};
export const AccessoriesList = Object.keys(AccessoriesMapping).map((key) => ({
  label: AccessoriesMapping[key],
  value: key,
}));

/** 回收寄卖详情 客户信息常量 */
export const CustomerInfoDefault = [
  {
    label: i18n.t(LOCALS.member_id),
    field: 'memberId',
    value: '',
  },
  {
    label: i18n.t(LOCALS.name),
    field: 'name',
    value: '',
  },
  {
    label: i18n.t(LOCALS.phone_number),
    field: 'phone',
    value: '',
  },
  {
    label: i18n.t(LOCALS.email),
    field: 'email',
    value: '',
  },
  {
    label: i18n.t(LOCALS.social_media),
    field: 'social',
    value: '',
  },
  {
    label: i18n.t(LOCALS.id_passport_number),
    field: 'code',
    value: '',
  },
];

/** 回收寄卖详情 用户提交商品信息常量 */
export const UserProductInfoDefault = [
  {
    label: i18n.t(LOCALS.product_image_gallery),
    field: 'picList',
    value: '',
  },
  {
    label: i18n.t(LOCALS.rank),
    field: 'rank',
    value: '',
  },
  {
    label: i18n.t(LOCALS.product_info),
    field: 'productTitle',
    value: '',
  },
  {
    label: i18n.t(LOCALS.accessories),
    field: 'accessoriesList',
    value: '',
  },
  {
    label: i18n.t(LOCALS.remark),
    field: 'memberRemark',
    value: '',
  },
  {
    label: i18n.t('product_pictures'),
    field: 'storeReceiptPicsList',
    value: '',
  },
];

/** 回收寄卖详情 商品实际信息 */
export const ProductInfoDefault = [
  {
    label: i18n.t(LOCALS.product_image_gallery),
    field: 'picList',
    value: '',
  },
  {
    label: i18n.t(LOCALS.bag_style),
    field: 'category',
    value: '',
  },
  {
    label: i18n.t(LOCALS.accessories),
    field: 'accessoriesList',
    value: '',
  },
  {
    label: i18n.t(LOCALS.product_info),
    field: 'info',
    value: '',
    span: 3,
  },
  {
    label: i18n.t(LOCALS.service_comments),
    field: 'firstValuationShopRemark',
    value: '',
  },
  {
    label: i18n.t(LOCALS.stock_availability),
    field: 'firstValuationStock',
    value: '',
  },
  {
    label: i18n.t(LOCALS.remark),
    field: 'firstValuationStockRemark',
    value: '',
  },
];

/** 估值信息 */
export const ValuationInfoDefault = [
  {
    label: i18n.t(LOCALS.instant_sale),
    field: 'RecyclePrice',
    value: '',
  },
  {
    label: i18n.t(LOCALS.consignment_preliminary_valuation),
    field: 'SalePrice',
    value: '',
  },
  {
    label: i18n.t(LOCALS.initial_appraisal_time),
    field: 'createTime',
    value: '',
  },
  {
    label: i18n.t(LOCALS.recycling_confirmation_quote),
    field: 'finalRecyclePrice',
    value: '',
  },
  {
    label: i18n.t(LOCALS.consignment_confirmation_quote),
    field: 'finalSalePrice',
    value: '',
  },
  {
    label: i18n.t(LOCALS.quotation_confirmation_time),
    field: 'modifyTime',
    value: '',
  },
];

/** 物流信息 */
export const LogisticsInfoDefault = [
  {
    label: i18n.t(LOCALS.name),
    field: 'name',
    value: '',
  },
  {
    label: i18n.t(LOCALS.phone_number),
    field: 'phone',
    value: '',
  },
  {
    label: i18n.t(LOCALS.postal_code),
    field: 'postCode',
    value: '',
  },
  {
    label: i18n.t(LOCALS.country_region),
    field: 'country',
    value: '',
  },
  {
    label: i18n.t(LOCALS.state_province_city),
    field: 'city',
    value: '',
  },
  {
    label: i18n.t(LOCALS.detail_address),
    field: 'detailAddress',
    value: '',
  },
  {
    label: i18n.t(LOCALS.mailing_information),
    field: 'mailingInfoPhoto',
    value: '',
  },
  {
    label: i18n.t(LOCALS.cargo_information),
    field: 'cargoInfoPhoto',
    value: '',
  },
  {
    label: i18n.t(LOCALS.receiving_status),
    field: 'status',
    value: '',
  },
  {
    label: i18n.t(LOCALS.receipt_photo),
    field: 'receivingPhoto',
    value: '',
  },
  {
    label: i18n.t(LOCALS.receiving_time),
    field: 'createTime',
    value: '',
  },
  {
    label: i18n.t(LOCALS.recipient),
    field: 'receiverName',
    value: '',
  },
];

/** 退货信息 */
export const ReturnGoodsDefault = [
  {
    label: i18n.t(LOCALS.express_company_name),
    field: 'returnExpressCompany',
    value: '',
  },
  {
    label: i18n.t(LOCALS.tracking_number),
    field: 'returnTrackingNumber',
    value: '',
  },
  {
    label: i18n.t(LOCALS.cargo_information),
    field: 'returnVoucher',
    value: '',
  },
  {
    label: i18n.t(LOCALS.return_type),
    field: 'returnType',
    value: '',
  },
  {
    label: i18n.t(LOCALS.return_time),
    field: 'time',
    value: '',
  },
];

/** 收款信息 */
export const CollectionDefault = [
  {
    label: i18n.t(LOCALS.payment_information),
    field: 'financialPaymentInfo',
    value: '',
    span: 3,
  },
  {
    label: i18n.t(LOCALS.payment_amount),
    field: 'financialPaymentAmount',
    value: '',
  },
  {
    label: i18n.t(LOCALS.payment_status),
    field: 'status',
    value: '',
  },
  {
    label: i18n.t(LOCALS.payment_time),
    field: 'time',
    value: '',
  },
  {
    label: i18n.t(LOCALS.payment_voucher),
    field: 'financialPaymentVoucher',
    value: '',
  },
  {
    label: i18n.t(LOCALS.payment_method),
    field: 'settlementType',
    value: '',
  },
];

/** 合同记录 */
export const ContractDefault = [
  {
    label: i18n.t(LOCALS.contract_expiry_time),
    field: 'time',
    value: '',
  },
  {
    label: i18n.t(LOCALS.contract_content),
    field: 'url',
    value: '',
  },
  {
    label: i18n.t(LOCALS.contract_status),
    field: 'status',
    value: '',
  },
];

/** 操作记录 */
export const OptionListDefault = [
  {
    label: i18n.t(LOCALS.operation_time),
    field: 'time',
    value: '',
  },
  {
    label: i18n.t(LOCALS.operator),
    field: 'personnel',
    value: '',
  },
  {
    label: i18n.t(LOCALS.operation_content),
    field: 'remark',
    value: '',
  },
];

/** 回填图片对象 */
export const getUploadImageObj = (
  url = 'https://img.ginzaxiaoma.com/images/20230809/我司雇我在_596.jpeg',
  index = 0
): any => {
  //const time = new Date().getTime();
  const uid = `rc-upload-${url}-${index}`;
  return {
    uid,
    name: uid,
    status: 'done',
    url,
    response: {
      code: 200,
      message: '操作成功',
      data: {
        url: url,
        name: '我司雇我在_596.jpeg',
      },
    },
  };
};

/** 合同状态 1-自动续约 2-寄卖转回收 3-终止合同 4-商品退回 5-交易完成 6-修改价格 */
export const contractType = [
  '',
  '自動續約',
  '寄賣轉回收',
  '寄賣取消',
  '寄賣取消',
  '寄賣完成',
  '價格調整',
  '生成合同',
];

// 订单创建平台：0->网站；1->银座店 ；2->香港店 ；3->新加坡店；
// 4->LINE；5->INS；6->微信；7->谷歌；8->Facebook；9->others；
export const consultingSource = [
  {
    label: 'Line',
    value: 4,
  },
  {
    label: 'INS',
    value: 5,
  },
  {
    label: 'Wechat',
    value: 6,
  },
  {
    label: 'Google',
    value: 7,
  },
  {
    label: 'Facebook',
    value: 8,
  },
  {
    label: i18n.t(LOCALS.lzzZmOTmSS),
    value: 10,
  },
  {
    label: 'others',
    value: 9,
  },
];
export const storeSource = [
  {
    label: ShopMaping[SHOP_MAP.GINZA],
    value: SHOP_MAP.GINZA,
  },
  {
    label: ShopMaping[SHOP_MAP.HONGKONG],
    value: SHOP_MAP.HONGKONG,
  },
  {
    label: ShopMaping[SHOP_MAP.SINGAPORE],
    value: SHOP_MAP.SINGAPORE,
  },
];
export const createdFromList: {
  label: string;
  value: number;
  hidden?: boolean;
}[] = [
  {
    label: i18n.t(LOCALS.website),
    value: 0,
    hidden: true,
  },
  ...storeSource,
  ...consultingSource,
];

// 订单类型
export const orderOptions = [
  { label: i18n.t('consignment_contract'), value: 1 },
  { label: i18n.t('recovery_contract'), value: 2 },
];

// 发货地mapping
/** 店铺ID，1-银座 2-香港 3-新加坡 */
export const storeAddressList = [
  {
    label: '日本',
    value: 1,
    name: 'GINZA XIAOMA',
    address: '〒104-0061 日本东京都中央区银座7丁目6-11 1F',
    phone: '+81 03-6264-5267',
  },
  {
    label: '香港',
    value: 2,
    name: 'GINZA XIAOMA',
    address: '香港中环皇后大道中16-18号新世界大厦1座1705',
    phone: '+852 5612 1451',
  },
  {
    label: '新加坡',
    value: 3,
    name: 'GINZA XIAOMA',
    address: '新加坡乌节路391号义安城B座2305室',
    phone: '+65 6530 3529',
  },
  {
    label: '其他地区',
    value: 4,
    name: 'GINZA XIAOMA',
    address: '香港中环皇后大道中16-18号新世界大厦1座1705',
    phone: '+852 5612 1451',
  },
];

export const LANGUAGE_MAP = {
  ZH_CN: 'zh_CN',
  EN: 'en',
  JA: 'ja',
  ZH_TW: 'zh_TW',
};

export const LANGUAGE_NAME_MAPPING = {
  [LANGUAGE_MAP.ZH_CN]: i18n.t(LOCALS.chinese),
  [LANGUAGE_MAP.EN]: i18n.t(LOCALS.english),
  [LANGUAGE_MAP.JA]: i18n.t(LOCALS.japanese),
  [LANGUAGE_MAP.ZH_TW]: i18n.t(LOCALS.traditional_chinese),
};

export const LANGUAGE_PLACEHOLDER_MAPPING = {
  [LANGUAGE_MAP.ZH_CN]: i18n.t(LOCALS.language_zh_cn),
  [LANGUAGE_MAP.EN]: i18n.t(LOCALS.language_en),
  [LANGUAGE_MAP.JA]: i18n.t(LOCALS.language_ja),
  [LANGUAGE_MAP.ZH_TW]: i18n.t(LOCALS.language_zh_tw),
};
export const MEMBER_PAYMENT_ACCOUNT_SUB_TYPE_MAP = {
  BANK: 1,
  FPS: 2,
  PAY_NOW: 3,
};

export const MEMBER_PAYMENT_ACCOUNT_TYPE_MAP = {
  // 海外账户
  OVERSEA: 1,
  // 香港账户
  HONG_KONG: 2,
  // 日本
  JP: 3,
  // 新加坡
  SG: 4,
};

export const CreateOrderTypeList = [
  {
    label: i18n.t(LOCALS.create_sales_order),
    key: '1',
    value: '1',
  },
  {
    label: i18n.t(LOCALS.recyclingContractOrder),
    key: '2',
    value: '2',
  },
  {
    label: i18n.t(LOCALS.consignmentContractOrder),
    key: '4',
    value: '4',
  },
  {
    label: i18n.t(LOCALS.creating_intent_order_for_recycling_consignment_sales),
    key: '3',
    value: '3',
  },
];
