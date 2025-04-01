import { Trans } from 'react-i18next';
import LOCALS from './locals';
import i18n from 'i18next';

export const LANGUAGE_MAP = {
  EN: 'en',
  JA: 'ja',
  ZH_CN: 'zh_CN',
};

export const LANGUAGE_OPTION_LIST = [
  { value: LANGUAGE_MAP.EN, label: 'English' },
  { value: LANGUAGE_MAP.JA, label: 'Japanese' },
  { value: LANGUAGE_MAP.ZH_CN, label: '中文' },
];

export const ACCESSORY_MAP = {
  SHOULDER_STRAP: 1,
  KEYS: 2,
  PADLOCK: 3,
  CLOCHETTE: 4,
  DUSTBAG: 5,
  CITES: 6,
};

export const ACCESSORY_OPTION_LIST = [
  { value: ACCESSORY_MAP.SHOULDER_STRAP, label: 'Shoulder Strap' },
  { value: ACCESSORY_MAP.KEYS, label: 'Keys' },
  { value: ACCESSORY_MAP.PADLOCK, label: 'Padlock' },
  { value: ACCESSORY_MAP.CLOCHETTE, label: 'Clochette' },
  { value: ACCESSORY_MAP.DUSTBAG, label: 'Dustbag' },
  { value: ACCESSORY_MAP.CITES, label: 'Cites' },
];

export const CURRENCY_MAP = {
  JPY: 'JPY',
  HKD: 'HKD',
  SGD: 'SGD',
};

export const CURRENCY_MAP_TO_SHOP = {
  JPY: 1,
  HKD: 2,
  SGD: 3,
};

export const CURRENCY_OPTION_LIST = [
  { value: CURRENCY_MAP.JPY, label: <Trans i18nKey={LOCALS.jpy} /> },
  { value: CURRENCY_MAP.HKD, label: <Trans i18nKey={LOCALS.hkd} /> },
  { value: CURRENCY_MAP.SGD, label: <Trans i18nKey={LOCALS.sgd} /> },
];

export const INVENTORY_MAP = {
  IN_STOCK: 1,
  OUT_OF_STOCK: 2,
};

export const INVENTORY_OPTION_LIST = [
  { value: INVENTORY_MAP.IN_STOCK, label: <Trans i18nKey={LOCALS.in_stock} /> },
  {
    value: INVENTORY_MAP.OUT_OF_STOCK,
    label: <Trans i18nKey={LOCALS.out_of_stock} />,
  },
];

export const SOCIAL_MEDIA_MAP = {
  INSTAGRAM: 'instagram',
  WHATSAPP: 'whatsapp',
  LINE: 'line',
  FACEBOOK: 'facebook',
  WECHAT: 'wechat',
  OTHERS: 'others',
};

export const SOCIAL_MEDIA_OPTION_LIST = [
  { value: SOCIAL_MEDIA_MAP.INSTAGRAM, label: 'Instagram' },
  { value: SOCIAL_MEDIA_MAP.WHATSAPP, label: 'WhatsApp' },
  { value: SOCIAL_MEDIA_MAP.LINE, label: 'LINE' },
  { value: SOCIAL_MEDIA_MAP.FACEBOOK, label: 'Facebook' },
  { value: SOCIAL_MEDIA_MAP.WECHAT, label: 'WeChat' },
  { value: SOCIAL_MEDIA_MAP.OTHERS, label: 'Others' },
];

export const CONSULTING_SOURCE_MAP = {
  GINZA_SHOP: 1,
  HONGKONG_SHOP: 2,
  SINGAPORE_SHOP: 3,
  WEBSITE: 4,
  LINE: 5,
  INS: 6,
  WECHAT: 7,
};

export const CONSULTING_SOURCE_OPTION_LIST = [
  { value: CONSULTING_SOURCE_MAP.GINZA_SHOP, label: '银座店' },
  { value: CONSULTING_SOURCE_MAP.HONGKONG_SHOP, label: '香港店' },
  { value: CONSULTING_SOURCE_MAP.SINGAPORE_SHOP, label: '新加坡店' },
  { value: CONSULTING_SOURCE_MAP.WEBSITE, label: 'Website' },
  { value: CONSULTING_SOURCE_MAP.LINE, label: 'LINE' },
  { value: CONSULTING_SOURCE_MAP.INS, label: 'Instagram' },
  { value: CONSULTING_SOURCE_MAP.WECHAT, label: 'WeChat' },
];

export const QUOTATION_FORM_TYPE_MAP = {
  SECOND_HAND: 'second_hand',
  NEW: 'new',
};

export const QUOTATION_FORM_TYPE_OPTION_LIST = [
  {
    value: QUOTATION_FORM_TYPE_MAP.SECOND_HAND,
    label: i18n.t(LOCALS.secondhand),
  },
  { value: QUOTATION_FORM_TYPE_MAP.NEW, label: '未使用' },
];

export const STOCK_PLACE_MAP = {
  JAPAN: 'JP',
  HONGKONG: 'HK',
  SINGAPORE_ASU: 'SG',
  SINGAPORE_GX: 'SG_GX',
};

export const STOCK_PLACE_MAP_LIST = [
  '',
  STOCK_PLACE_MAP.JAPAN,
  STOCK_PLACE_MAP.HONGKONG,
  STOCK_PLACE_MAP.SINGAPORE_ASU,
  STOCK_PLACE_MAP.SINGAPORE_GX,
];

export const SG_SHOP_LIST = [
  STOCK_PLACE_MAP.SINGAPORE_ASU,
  STOCK_PLACE_MAP.SINGAPORE_GX,
];

export const STOCK_PLACE_OPTION_LIST = [
  {
    value: STOCK_PLACE_MAP.JAPAN,
    label: <Trans i18nKey={LOCALS.japan}></Trans>,
    labelKey: LOCALS.japan,
  },
  {
    value: STOCK_PLACE_MAP.HONGKONG,
    label: <Trans i18nKey={LOCALS.hongkong}></Trans>,
    labelKey: LOCALS.hongkong,
  },
  {
    value: STOCK_PLACE_MAP.SINGAPORE_ASU,
    label: <Trans i18nKey={LOCALS.ojMPRgDisg}></Trans>,
    labelKey: LOCALS.ojMPRgDisg,
  },
  {
    value: STOCK_PLACE_MAP.SINGAPORE_GX,
    label: <Trans i18nKey={LOCALS.kkIwEnEVml}></Trans>,
    labelKey: LOCALS.kkIwEnEVml,
  },
];

export const PUBLISH_STATUS_MAP = {
  ON_SHELF: 1,
  OFF_SHELF: 0,
};

export const PUBLISH_STATUS_OPTION_LIST = [
  {
    value: PUBLISH_STATUS_MAP.ON_SHELF,
    label: <Trans i18nKey={LOCALS.on_shelf}></Trans>,
  },
  {
    value: PUBLISH_STATUS_MAP.OFF_SHELF,
    label: <Trans i18nKey={LOCALS.off_shelf}></Trans>,
  },
];

export const PROMOTION_TYPE_MAP = {
  // 非特价
  NORMAL: 0,
  // 特价
  SPECIAL: 1,
};

// 商品创建来源
export const PRODUCT_CREATED_FROM_MAP = {
  WEBSITE: 0,
  GINZA: 1,
  HONGKONG: 2,
  SINGAPORE: 3,
  SNS: 4,
};

export const PRODUCT_CREATED_FROM_OPTION_LIST = [
  {
    value: PRODUCT_CREATED_FROM_MAP.WEBSITE,
    label: <Trans i18nKey={LOCALS.website}></Trans>,
  },
  {
    value: PRODUCT_CREATED_FROM_MAP.GINZA,
    label: <Trans i18nKey={LOCALS.ginza}></Trans>,
  },
  {
    value: PRODUCT_CREATED_FROM_MAP.HONGKONG,
    label: <Trans i18nKey={LOCALS.hongkong}></Trans>,
  },
  {
    value: PRODUCT_CREATED_FROM_MAP.SINGAPORE,
    label: <Trans i18nKey={LOCALS.singapore}></Trans>,
  },
  {
    value: PRODUCT_CREATED_FROM_MAP.SNS,
    label: <Trans i18nKey={LOCALS.sns}></Trans>,
  },
];

export const PRODUCT_SOURCE_TYPE_MAP = {
  RECYCLE: 0,
  CONSIGNMENT: 1,
  PROCUREMENT: 2,
};

export const PRODUCT_SOURCE_TYPE_OPTION_LIST = [
  {
    value: PRODUCT_SOURCE_TYPE_MAP.RECYCLE,
    label: <Trans i18nKey={LOCALS.recycle} />,
    labelKey: LOCALS.recycle,
  },
  {
    value: PRODUCT_SOURCE_TYPE_MAP.CONSIGNMENT,
    label: <Trans i18nKey={LOCALS.consignment} />,
    labelKey: LOCALS.consignment,
  },
  {
    value: PRODUCT_SOURCE_TYPE_MAP.PROCUREMENT,
    label: <Trans i18nKey={LOCALS.procurement} />,
    labelKey: LOCALS.procurement,
  },
];

export const MEMBER_LEVEL_MAP = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
};

export const MEMBER_LEVEL_OPTION_LIST = [
  { value: MEMBER_LEVEL_MAP.BRONZE, label: MEMBER_LEVEL_MAP.BRONZE },
  { value: MEMBER_LEVEL_MAP.SILVER, label: MEMBER_LEVEL_MAP.SILVER },
  { value: MEMBER_LEVEL_MAP.GOLD, label: MEMBER_LEVEL_MAP.GOLD },
];

export const SHOP_MAP = {
  WEBSITE: 0,
  GINZA: 1,
  HONGKONG: 2,
  SINGAPORE: 3,
  SNS: 4, // 这个店铺实际上不存在，历史遗留原因；多笔支付功能上线之后，理论上就不会有 SNS 的订单
  WHATSAPP: 5,
  INSTAGRAM: 6,
  LINE: 7,
  WECHAT: 8,
  OTHER: 9,
  APP: 10,
};

export const SHOP_OPTION_LIST = [
  {
    value: SHOP_MAP.WEBSITE,
    label: <Trans i18nKey={LOCALS.website} />,
  },
  {
    value: SHOP_MAP.GINZA,
    label: <Trans i18nKey={LOCALS.ginza_shop} />,
  },
  {
    value: SHOP_MAP.HONGKONG,
    label: <Trans i18nKey={LOCALS.hongkong_shop} />,
  },
  {
    value: SHOP_MAP.SINGAPORE,
    label: <Trans i18nKey={LOCALS.singapore_shop} />,
  },
];

export const SYS_USER_SHOP_OPTION_LIST = [
  {
    value: SHOP_MAP.GINZA,
    label: <Trans i18nKey={LOCALS.ginza_shop} />,
    currency: CURRENCY_MAP.JPY,
  },
  {
    value: SHOP_MAP.HONGKONG,
    label: <Trans i18nKey={LOCALS.hongkong_shop} />,
    currency: CURRENCY_MAP.HKD,
  },
  {
    value: SHOP_MAP.SINGAPORE,
    label: <Trans i18nKey={LOCALS.singapore_shop} />,
    currency: CURRENCY_MAP.SGD,
  },
];

const REST_ORDER_CREATED_FROM_OPTION_LIST = [
  { value: SHOP_MAP.SNS, label: 'SNS' },
  { value: SHOP_MAP.WHATSAPP, label: 'WhatsApp' },
  { value: SHOP_MAP.LINE, label: 'LINE' },
  { value: SHOP_MAP.INSTAGRAM, label: 'Instagram' },
  { value: SHOP_MAP.WECHAT, label: 'WeChat' },
  { value: SHOP_MAP.OTHER, label: 'Other' },
  { value: SHOP_MAP.APP, label: 'APP' },
];

export const ORDER_CREATED_FROM_OPTION_LIST = [
  ...SHOP_OPTION_LIST,
  ...REST_ORDER_CREATED_FROM_OPTION_LIST,
];

export const getOrderCreatedFromOptionList = (i18n: any) => {
  return [
    {
      value: SHOP_MAP.WEBSITE,
      label: i18n.t(LOCALS.website),
    },
    {
      value: SHOP_MAP.GINZA,
      label: i18n.t(LOCALS.ginza_shop),
    },
    {
      value: SHOP_MAP.HONGKONG,
      label: i18n.t(LOCALS.hongkong_shop),
    },
    {
      value: SHOP_MAP.SINGAPORE,
      label: i18n.t(LOCALS.singapore_shop),
    },
    ...REST_ORDER_CREATED_FROM_OPTION_LIST,
  ];
};

export const ORDER_STATISTIC_OPTION_LIST = [
  ...SHOP_OPTION_LIST,
  { value: SHOP_MAP.WHATSAPP, label: 'WhatsApp' },
  { value: SHOP_MAP.LINE, label: 'LINE' },
  { value: SHOP_MAP.INSTAGRAM, label: 'Instagram' },
  { value: SHOP_MAP.WECHAT, label: 'WeChat' },
  { value: SHOP_MAP.APP, label: 'APP' },
];

export const GENDER_MAP = {
  UNKNOW: 0,
  FEMALE: 1,
  MALE: 2,
};

export const GENDER_OPTION_LIST = [
  {
    value: GENDER_MAP.UNKNOW,
    label: <Trans i18nKey={LOCALS.rather_not_say} />,
  },
  {
    value: GENDER_MAP.FEMALE,
    label: <Trans i18nKey={LOCALS.female} />,
  },
  { value: GENDER_MAP.MALE, label: <Trans i18nKey={LOCALS.male} /> },
];

export const ORDER_STATUS_MAP = {
  TO_BE_PAID: 0,
  TO_BE_DELIVERED: 1,
  DELIVERED: 2,
  COMPLETED: 3,
  CANCLED: 4,
  INVALID_ORDER: 5,
  REFUND_ORDER: 6,
};

export const ORDER_STATUS_ANTD_TAG_COLOR_MAP = {
  [ORDER_STATUS_MAP.TO_BE_PAID]: '#b2c3d1',
  [ORDER_STATUS_MAP.TO_BE_DELIVERED]: '#ff8143',
  [ORDER_STATUS_MAP.DELIVERED]: '#465dd2',
  [ORDER_STATUS_MAP.COMPLETED]: '#27941d',
  [ORDER_STATUS_MAP.CANCLED]: '#ff3b1b',
  [ORDER_STATUS_MAP.INVALID_ORDER]: '#ff3b1b',
  [ORDER_STATUS_MAP.REFUND_ORDER]: '#ff3b1b',
};

export const DELIVERY_METHOD_MAP = {
  SAGAWA_EXPRESS: 'Sagawa Express',
  EMS: 'EMS',
  DHL: 'DHL',
  FEDEX: 'FedEx',
  SF_Express: 'SF Express',
  LaLa_Move: 'LaLa Move',
  UPS: 'UPS',
  Self_pick_up: 'Self pick-up',
  SingPost: 'SingPost',
};

export const DELIVERY_METHOD_OPTION_LIST = [
  {
    value: DELIVERY_METHOD_MAP.SAGAWA_EXPRESS,
    label: DELIVERY_METHOD_MAP.SAGAWA_EXPRESS,
  },
  { value: DELIVERY_METHOD_MAP.EMS, label: DELIVERY_METHOD_MAP.EMS },
  { value: DELIVERY_METHOD_MAP.DHL, label: DELIVERY_METHOD_MAP.DHL },
  { value: DELIVERY_METHOD_MAP.FEDEX, label: DELIVERY_METHOD_MAP.FEDEX },
  {
    value: DELIVERY_METHOD_MAP.SF_Express,
    label: DELIVERY_METHOD_MAP.SF_Express,
  },
  {
    value: DELIVERY_METHOD_MAP.LaLa_Move,
    label: DELIVERY_METHOD_MAP.LaLa_Move,
  },
  { value: DELIVERY_METHOD_MAP.UPS, label: DELIVERY_METHOD_MAP.UPS },
  {
    value: DELIVERY_METHOD_MAP.Self_pick_up,
    label: DELIVERY_METHOD_MAP.Self_pick_up,
  },
  {
    value: DELIVERY_METHOD_MAP.SingPost,
    label: DELIVERY_METHOD_MAP.SingPost,
  },
];

export const PAY_STATUS_MAP = {
  CREATED: '1',
  PENDING_PAY: '2',
  PENDING_CONFIRM: '3',
  CONFIRMED: '4',
  FAILED: '5',
};

export const MEMBER_UPDATE_POINT_TYPE_MAP = {
  ACTIVITY: 12,
  SYSTEM: 13,
};

export const MEMBER_UPDATE_POINT_TYPE_OPTION_LIST = [
  { value: MEMBER_UPDATE_POINT_TYPE_MAP.ACTIVITY, label: 'ACTIVITY' },
  { value: MEMBER_UPDATE_POINT_TYPE_MAP.SYSTEM, label: 'SYSTEM' },
];

export const findLabelByValue = (
  value: any,
  options: { value: string | number; label: any }[],
  defaultData?: { value: string | number; label: any },
) => {
  const t = options.find((i) => i.value === value);
  if (t) return t.label;
  if (defaultData) return defaultData.label;
  return '-';
};

export const OMS_RECYCLE_ORDER_TYPE_MAP = {
  // 未确认
  UNCONFIRMED: 0,
  // 寄卖
  CONSIGNMENT: 1,
  // 回收
  RECYCLE: 2,
};

export const OMS_RECYCLE_ORDER_TYPE_LIST = [
  {
    value: OMS_RECYCLE_ORDER_TYPE_MAP.UNCONFIRMED,
    label: <Trans i18nKey={LOCALS.unconfirmed} />,
  },
  {
    value: OMS_RECYCLE_ORDER_TYPE_MAP.CONSIGNMENT,
    label: <Trans i18nKey={LOCALS.consignment} />,
  },
  {
    value: OMS_RECYCLE_ORDER_TYPE_MAP.RECYCLE,
    label: <Trans i18nKey={LOCALS.sell} />,
  },
];

export const MEMBER_LEVEL_ID_MAP = {
  GUEST: 5,
  MEMBER: 4,
};

export const MEMBER_LEVEL_ID_OPTION_LIST = [
  {
    value: MEMBER_LEVEL_ID_MAP.MEMBER,
    label: '普通会员',
  },
  {
    value: MEMBER_LEVEL_ID_MAP.GUEST,
    label: '游客',
  },
];

export const OMS_RECYCLE_ORDER_CONTRACT_TYPE_MAP = {
  // 网站c端用户下下载
  WEBSITE: 1,
  // 门店用户
  SHOP_USER: 2,
  // 门店管理员
  SHOP_ADMIN: 3,
};

export const OMS_RECYCLE_ORDER_PRIORITY_MAP = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

export const OMS_RECYCLE_ORDER_PRIORITY_OPTION_LIST = [
  {
    value: OMS_RECYCLE_ORDER_PRIORITY_MAP.LOW,
    label: (
      <div className="bg-[#81D3F8] py-1 px-2 rounded text-xs cursor-pointer w-16 inline-block text-center">
        Low
      </div>
    ),
  },
  {
    value: OMS_RECYCLE_ORDER_PRIORITY_MAP.MEDIUM,
    label: (
      <div className="bg-[#FACD91] py-1 px-2 rounded text-xs cursor-pointer w-16 inline-block text-center">
        Medium
      </div>
    ),
  },
  {
    value: OMS_RECYCLE_ORDER_PRIORITY_MAP.HIGH,
    label: (
      <div className="bg-[#D9001B] text-white py-1 px-2 rounded text-xs cursor-pointer w-16 inline-block text-center">
        High
      </div>
    ),
  },
];

export enum CHECKOUT_OUT_PRODUCT_PRICE_TYPE {
  WITH_TAX = 'with_tax',
  WITH_OUT_TAX = 'without_tax',
}

export const CHECKOUT_OUT_PRODUCT_PRICE_TYPE_OPTION_LIST = [
  {
    value: CHECKOUT_OUT_PRODUCT_PRICE_TYPE.WITH_TAX,
    label: <Trans i18nKey={LOCALS.tax_inclusive} />,
  },
  {
    value: CHECKOUT_OUT_PRODUCT_PRICE_TYPE.WITH_OUT_TAX,
    label: <Trans i18nKey={LOCALS.tax_free} />,
  },
];

/**
 * @description 财务收款账户所属类型
 *
 * 1 现金, 2 第三方, 3 其他
 */
export const FMS_ACCOUNT_TYPE_MAP: {
  [key: string]: number;
} = {
  CASH: 1,
  THIRD_PARTY: 2,
  OTHER: 3,
};

export const FMS_ACCOUNT_TYPE_OPTION_LIST = [
  {
    value: FMS_ACCOUNT_TYPE_MAP.CASH,
    label: <Trans i18nKey={LOCALS.cash_payment} />,
  },
  {
    value: FMS_ACCOUNT_TYPE_MAP.THIRD_PARTY,
    label: <Trans i18nKey={LOCALS.third_party_payment} />,
  },
  {
    value: FMS_ACCOUNT_TYPE_MAP.OTHER,
    label: <Trans i18nKey={LOCALS.other_payment_methods} />,
  },
];

/**
 * @description 财务收款账户启用状态
 *
 * 0 启用, 1 停用
 */
export const FMS_ACCOUNT_STATUS_MAP = {
  ON: 0,
  OFF: 1,
};

export const FMS_ACCOUNT_STATUS_OPTION_LIST = [
  {
    value: FMS_ACCOUNT_STATUS_MAP.ON,
    label: '启用',
  },
  {
    value: FMS_ACCOUNT_STATUS_MAP.OFF,
    label: '停用',
  },
];

/**
 * @description 财务收款账户环境/模式
 *
 * 0 test测试, 1 live生产
 */
export const FMS_ACCOUNT_MODE_MAP = {
  TEST: 0,
  PROD: 1,
};

export const FMS_ACCOUNT_MODE_OPTION_LIST = [
  {
    value: FMS_ACCOUNT_MODE_MAP.TEST,
    label: 'test测试',
  },
  {
    value: FMS_ACCOUNT_MODE_MAP.PROD,
    label: 'live生产',
  },
];

export const INTEGRAL_MAP = {
  REGISTRATION: 'REGISTRATION',
  ORDER: 'ORDER',
};

export const INTEGRAL_OPTION_LIST = [
  {
    value: INTEGRAL_MAP.REGISTRATION,
    label: <Trans i18nKey={LOCALS.registrationPoints} />,
  },
  { value: INTEGRAL_MAP.ORDER, label: <Trans i18nKey={LOCALS.orderPoints} /> },
];

export const SMS_COUPON_TYPE = {
  NORMAL: 0,
  REGISTER_CODE: 3, // 注册送券
  SPECIAL_CODE: 4, // 特殊类型的优惠券，一段时间内开放，只能用一次
};

export const SMS_COUPON_TYPE_OPTION_LIST = [
  {
    value: SMS_COUPON_TYPE.NORMAL,
    label: '普通优惠券',
  },
  {
    value: SMS_COUPON_TYPE.REGISTER_CODE,
    label: '注册优惠券',
  },
  {
    value: SMS_COUPON_TYPE.SPECIAL_CODE,
    label: '期限优惠券',
  },
];

export const SMS_COUPON_HISTORY_STATUS = {
  UN_USED: 0,
  USED: 1,
  EXPIRED: 2,
};

export const SMS_COUPON_HISTORY_STATUS_OPTION_LIST = [
  {
    value: SMS_COUPON_HISTORY_STATUS.UN_USED,
    label: '未使用',
  },
  {
    value: SMS_COUPON_HISTORY_STATUS.USED,
    label: '已使用',
  },
  {
    value: SMS_COUPON_HISTORY_STATUS.EXPIRED,
    label: '已过期',
  },
];

/**
 * @description 商品库存状态流转图
 * @link https://www.figma.com/board/2rvgHDgiw5hxZFpjCJabPH/product_inventory_status?node-id=0-1&node-type=canvas&t=9VDodc3upMAqEpe8-0
 */
export enum PMS_PRODUCT_STOCK_STATUS {
  PENDING_ENTRY = 'PENDING_ENTRY', // -- 待入库
  STOCKED = 'STOCKED', // 已入库
  FOR_SALE = 'FOR_SALE', // 售卖中
  RESERVED = 'RESERVED', // 预留中
  LENT_OUT = 'LENT_OUT', // 已借出
  SOLD = 'SOLD', // 已售出
  INVALID = 'INVALID', // 无效库存
}

export const PMS_PRODUCT_STOCK_STATUS_OPTION_LIST = [
  {
    value: PMS_PRODUCT_STOCK_STATUS.PENDING_ENTRY,
    label: <Trans i18nKey={LOCALS.cWgwnQtBhq}></Trans>,
    labelKey: LOCALS.cWgwnQtBhq,
  },
  {
    value: PMS_PRODUCT_STOCK_STATUS.STOCKED,
    label: <Trans i18nKey={LOCALS.tPZNlIoLIJ}></Trans>,
    labelKey: LOCALS.tPZNlIoLIJ,
  },
  {
    value: PMS_PRODUCT_STOCK_STATUS.FOR_SALE,
    label: <Trans i18nKey={LOCALS.ZNabMrkXeR}></Trans>,
    labelKey: LOCALS.ZNabMrkXeR,
  },
  {
    value: PMS_PRODUCT_STOCK_STATUS.LENT_OUT,
    label: <Trans i18nKey={LOCALS.qjvTkFPhtS}></Trans>,
    labelKey: LOCALS.qjvTkFPhtS,
  },
  {
    value: PMS_PRODUCT_STOCK_STATUS.RESERVED,
    label: <Trans i18nKey={LOCALS.gCfzSuAAFu}></Trans>,
    labelKey: LOCALS.gCfzSuAAFu,
  },
  {
    value: PMS_PRODUCT_STOCK_STATUS.SOLD,
    label: <Trans i18nKey={LOCALS.JTehSPdAjL}></Trans>,
    labelKey: LOCALS.JTehSPdAjL,
  },
  {
    value: PMS_PRODUCT_STOCK_STATUS.INVALID,
    label: <Trans i18nKey={LOCALS.aDOEGIrhvq}></Trans>,
    labelKey: LOCALS.aDOEGIrhvq,
  },
];

export const BRAND_LIST = [
  {
    value: 'Hermes',
    nameJa: 'エルメス',
    nameZh: '爱马仕',
    nameEn: 'Hermès',
    descJa: ' HERMÈS エルメス ',
    descZh: ' HERMÈS 爱马仕 ',
    descEn: ' HERMÈS ',
    descZhTw: ' HERMÈS 愛馬仕 ',
  },
  {
    value: 'Chanel',
    nameJa: 'シャネル',
    nameZh: '香奈儿',
    nameEn: 'Chanel',
    descJa: ' CHANEL シャネル ',
    descZh: ' CHANEL 香奈儿 ',
    descEn: ' CHANEL ',
    descZhTw: ' CHANEL 香奈兒 ',
  },
  {
    value: 'Other',
    nameJa: 'その他',
    nameZh: '其他',
    nameEn: 'Other',
    descJa: '',
    descZh: '',
    descEn: '',
    descZhTw: '',
  },
];

export const OrderDeliveryTypeMap = {
  DELIVERY: 'DELIVERY', // 邮寄
  PICKUP: 'PICKUP', // 自提
};

export const OrderDeliveryTypeOptionList = [
  {
    value: OrderDeliveryTypeMap.DELIVERY,
    label: <Trans i18nKey={LOCALS.arvArlFrfX}></Trans>,
    color: '#ed5a65',
  },
  {
    value: OrderDeliveryTypeMap.PICKUP,
    label: <Trans i18nKey={LOCALS.xCWNaTSMxQ}></Trans>,
    color: '#ec9bad',
  },
];

export const CASH_LOG_TYPE_MAP: Record<number, string> = {
  0: '仕入れ-買取',
  1: '仕入れ-委託',
  2: 'しいれ-その他(業者仕入)',
  3: '注文-買取',
  4: '注文-委託',
  5: '注文その他(業者仕入)',
  6: '注文-その他',
};
export const TYPE_OPTIONS = [
  { label: '仕入れ-買取', value: 0 },
  { label: '仕入れ-委託', value: 1 },
  { label: '仕入れ-その他(業者仕入)', value: 2 },
  { label: '注文-買取', value: 3 },
  { label: '注文-委託', value: 4 },
  { label: '注文その他(業者仕入)', value: 5 },
  { label: '注文-その他', value: 6 },
];
