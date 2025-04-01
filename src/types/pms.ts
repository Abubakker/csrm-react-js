import {
  CHECKOUT_OUT_PRODUCT_PRICE_TYPE,
  PMS_PRODUCT_STOCK_STATUS,
} from 'commons/options';

export type ProductCategory = {
  id: number;
  name: string;
  nameJa: string;
  nameZh: string;
  nameTw: string;
  value: string;
  children?: ProductCategory[];
  size: string;
  sizeJa: string;
  sizeZh: string;
  sizeTw: string;
};

export type ProductAttributeCode = {
  id: number;
  labelCn: string;
  labelEn: string;
  labelJa: string;
  value: string;
  enabled: boolean;
  categoryId: number;
  parentId: number;
  treeIds?: string;
  sort: number;
};

export enum ProductAttributeCodeNames {
  COLOR = 'color',
  MATERIAL = 'material',
  STAMP = 'stamp',
  RANK = 'rank',
  TYPE = 'type',
  HUE = 'colors',
  HARDWARE = 'hardware',
  ACCESSORIES = 'accessories',
  COLLECTIONS = 'collection',
}

export type PmsProduct = {
  id: number;
  mainCategoryId: number;
  productCategoryId: number;
  name: string;
  pic: string;
  pic2: number;
  productSn: string;
  deleteStatus: number;
  publishStatus: number;
  price: number;
  rank: string;
  rankDescription: string;
  collections: string;
  color: string;
  subTitle: string;
  originalPrice: number;
  stock: number;
  stockStatus?: PMS_PRODUCT_STOCK_STATUS;
  albumPics: string;
  promotionType: number;
  brandName: string;
  createdFrom: number;
  createdBy: string;
  stockPlace: string;
  currency: string;
  createdTime?: string;
  sourceType: number;
  description?: string;
  costPrice?: number;
  recycleOrderId?: string;
  recycleOrderCode?: string;
  soldTime?: string;
  orderId?: number;
  entryTime?: string;
  note?: string;
  referencePrice?: number;
};

export type PmsProductWithPriceType = PmsProduct & {
  priceType: CHECKOUT_OUT_PRODUCT_PRICE_TYPE;
};

export type ProductUpdateInfo = {
  id: number;
  language: string;
  owner?: string;
  productSn: string;
  pic?: string;
  albumPics: string;
  currency: string;
  stockPlace: string;
  originalPrice: number;
  promotionType: number;
  rank: string;
  detailTitle: string;
  attrAccessory: string;
  attrColor?: string;
  attrColorRemark: string;
  attrColors: string;
  attrHardware?: string;
  attrHardwareRemark: string;
  attrMaterial: string;
  attrMaterialRemark: string;
  attrModel: string;
  attrModelFilter: string;
  attrRankDesc: string;
  attrSize: string;
  attrStamp: string;
  attrStampRemark: string;
  attrType: string;
  productCategoryId: number;
  i18nCn: any;
  i18nJa: any;
  i18nTw: any;
  sourceType: number;
  deleteStatus: number;
  publishStatus: number;
  name: string;
  subTitle: string;
  note: string;
  detailDesc: string;
  facebookEnabled?: number;
  referencePrice?: number;
  pmsProductActivityList: {
    id: number;
    createAt: string;
    userName: string;
    detail?: string;
  }[];
  //ToDo 后续不需要
  keywords?: string;
  remark?: string;
};

export type ProductCreateInfo = Omit<ProductUpdateInfo, 'id'>;

/** 价签列表传入 */
export interface PriceTagPayload {
  beginCreateTime?: string;
  endCreateTime?: string;
  keyword?: string; // 关键字
  productSn?: string; // 商品货号
  shopId?: string; // 所属店铺: 1-银座 2-香港 3-> 新加坡
  pageNum?: number;
  pageSize?: number;
  /** 前端用 */
  time?: any[];
}

interface currentcyType {
  [key: string | number]: CURRENCY_ENUM;
}

export enum CURRENCY_ENUM {
  JPY = 'JPY',
  HKD = 'HKD',
  SGD = 'SGD',
}

export const currencyMap: currentcyType = {
  '1': CURRENCY_ENUM['JPY'],
  '2': CURRENCY_ENUM['HKD'],
  '3': CURRENCY_ENUM['SGD'],
};

export const currencyItems = Object.values(currencyMap).map((d: string) => ({
  label: d,
}));

/** 价签列表 - 添加/编辑价签 */
export interface PriceTagInfo {
  color?: string; //扩展-商品颜色color
  createByL?: number; // 创建人
  createTime?: string; // 创建时间
  deleteState?: number; // 删除状态
  detailTitle?: string; // 商品标题
  hardware?: string; //  扩展-商品金属件
  id?: string; //
  material?: string; // 扩展-商品材质
  modifyBy?: number; //修改人
  modifyTime?: string; // 修改时间
  name?: string; // 商品名称
  nameAppend?: string; // 商品名称补充
  productCategoryId?: string;
  price?: number; // 价格
  costPrice?: number; // 售价价格
  currency?: string; // 币种
  productSn?: string; // 货号
  rank?: string; // 扩展-状态，等级/成色，用于二手商品
  salesCode?: string; // 销售编码
  shopId?: number | string; // 所属店铺: 1-银座 2-香港 3-> 新加坡
  sourceType?: number; // 商品来源类型， 0 自有， 1 寄卖
  stamp?: string; // 扩展-商品刻印/标记
  /** 前端维护 */
  materialAppend?: any[];
  exist?: boolean;
  brandName?: string;
  referencePrice?: number;
}

export type ProductCateType = {
  id: number;
  keywords: string;
  name: string;
  nameJa: string;
  nameZh: string;
  labelCn: string;
  labelEn: string;
  labelJa: string;
  parentId: number;
  navStatus: number;
  showStatus: number;
  treeId: string;
  value: string;
  enabled: boolean;
  categoryId: number;
  treeIds?: string;
  sort: number;
  level: number;
  icon?: string;
  size: string;
  sizeCn: string;
  sizeJa: string;
  sizeTw: string;
  extConfig: string;
  description: string;
};

export type ProductCateListPayload = {
  id?: number;
  prevId?: number;
  pageNum?: number;
  pageSize?: number;
};

export type ProductCateUpdateNavStatusPayload = Pick<
  ProductCateType,
  'navStatus'
> & { ids: string };

export type ProductCateUpdateShowStatusPayload = Pick<
  ProductCateType,
  'showStatus'
> & { ids: string };

export type ProductUpdateInfoNewType = {
  id: number;
  productSn: string;
  albumPics: string;
  name: string;
  publishStatus: number;
  stock: number;
  collections?: string;
  subTitle: string;
  rankDescription: string;
  note: string;
  detailDesc: string;
  detailTitle: string;
  stamp?: string;
  size: string;
  owner?: string;
  accessory: string;
  promotionType: number;
  extendType: string;
  productCategoryId: number;
  material: string;
  color: string;
  hardware: string;
  hardwareRemark?: string;
  colorRemark?: string;
  materialRemark?: string;
  stampRemark?: string;
  rank?: string;
  stockStatus?: string;
  orderId?: number;
  soldTime?: number;
  brandName?: string;
  price: number;
  stockPlace: string;
  pmsProductActivityList?: {
    actId: string;
    actUsername: string;
    actProductId: number;
    actProductSn: string;
    actCreateAt: string;
    actAction: string;
    actDetail: string;
  }[];
  i18nList?: {
    id: string;
    lang: string;
    productId: number;
    name?: string;
    subTitle?: string;
    note?: string;
    detailTitle?: string;
    attrRankDesc?: string;
    attrSize?: string;
    detailDesc?: string;
  }[];
  remark?: string;
  recycleOrder?: {
    memberId: number;
    email: string;
  };
};
