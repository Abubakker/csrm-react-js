import { BaseRes } from 'types/base';
import {
  PmsProduct,
  ProductAttributeCode,
  ProductCategory,
  ProductCreateInfo,
  ProductUpdateInfo,
  PriceTagPayload,
  PriceTagInfo,
  ProductCateType,
  ProductCateListPayload,
  ProductCateUpdateNavStatusPayload,
  ProductCateUpdateShowStatusPayload,
  ProductUpdateInfoNewType,
} from 'types/pms';
import request, { ginzaxiaomaApiRequest } from '.';
import { PMS_PRODUCT_STOCK_STATUS } from 'commons/options';
import * as XLSX from 'xlsx';

export const getProductCategoryTree = () =>
  request.get<BaseRes<ProductCategory[]>>(
    '/pms/productCategory/list/withChildren'
  );

export const getProductAttributeCodeList = () =>
  request.get<
    BaseRes<
      {
        name: string;
        itemList: ProductAttributeCode[];
      }[]
    >
  >('/pms/productAttributeCode/list');

type GetProductListDto = {
  pageSize: number;
  pageNum: number;
  productCategoryId?: number;
  keyword?: string;
  stockPlace?: string;
  isFilterPromotion?: boolean;
  publishStatus?: number;
  transformPriceToJpyFlag?: number;
  productSn?: string;
  supportCrypto?: boolean;
  start?: string;
  end?: string;
  stockStatuses?: string[];
  stockPlaceList?: string[];
  rankList?: string[];
  sourceTypeList?: number[];
  oldProductSn?: string;
  soldStart?: string;
  soldEnd?: string;
  isHavePic?: boolean;
};

export const getProductList = (data: GetProductListDto) =>
  request.post<
    BaseRes<{
      pageNum: number;
      pageSize: number;
      total: number;
      list: PmsProduct[];
    }>
  >('/pms/product/list', data, {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
    },
  });

export type PmsProductEs = Pick<
  PmsProduct,
  | 'id'
  | 'name'
  | 'productSn'
  | 'stockStatus'
  | 'price'
  | 'currency'
  | 'stock'
  | 'publishStatus'
  | 'stockPlace'
  | 'description'
  | 'recycleOrderCode'
  | 'recycleOrderId'
  | 'promotionType'
  | 'costPrice'
  | 'originalPrice'
  | 'brandName'
  | 'sourceType'
  | 'soldTime'
  | 'orderId'
  | 'productCategoryId'
  | 'referencePrice'
  | 'rank'
  | 'createdTime'
  | 'pic'
> & {
  material?: string[];
  hardware?: string[];
  colors?: string;
  stamp?: string;
  priceJpy: number;
  materialStr: string;
};

/** 新版商品列表 */
export const getProductListNew = (data: GetProductListDto) => {
  return ginzaxiaomaApiRequest.post<{
    total: number;
    list: PmsProductEs[];
    statisticsResult: {
      stockStatus: string;
      count: number;
    }[];
  }>('/admin/pms/product/list', data);
};

export const getProductUpdateInfo = (id: number) => {
  return request.get<BaseRes<ProductUpdateInfo>>(
    `/pms/product/updateInfo/${id}`
  );
};

export const getProductUpdateInfoNew = (id: number) => {
  return ginzaxiaomaApiRequest.get<ProductUpdateInfoNewType>(
    `/admin/pms/product/${id}`
  );
};

export const updateProduct = (productUpdateInfo: ProductUpdateInfo) => {
  return request.post<BaseRes<{ data: number }>>(
    `/pms/product/update/${productUpdateInfo.id}`,
    productUpdateInfo
  );
};
export const deleteProduct = (id: number) => {
  return ginzaxiaomaApiRequest.delete(`/admin/pms/product/${id}`);
};

export const createProduct = (productCreateInfo: ProductCreateInfo) => {
  return request.post<BaseRes<{ data: number }>>(
    '/pms/product/create',
    productCreateInfo
  );
};

// 创建支付链接
export const createProductSimple = (productCreateInfo: {
  expiredHours: string;
  name: string;
  price: string;
  productCategoryId: number;
  productSn: string;
}) => {
  return request.post<BaseRes<number>>(
    '/pms/product/create',
    productCreateInfo
  );
};

/** 价签列表 */
export const getPriceTagList = (data: PriceTagPayload) =>
  request.post<
    BaseRes<{
      pageNum: number;
      pageSize: number;
      total: number;
      list: PriceTagInfo[];
    }>
  >('/pms/productTag/page', data, {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
    },
  });

/** 价签新增 */
export const createPriceTag = (payload: PriceTagInfo) => {
  return request.post<BaseRes<{ data: number }>>(
    '/pms/productTag/create',
    payload
  );
};

/** 编辑 */
export const updatePriceTag = (payload: PriceTagInfo) => {
  return request.put<BaseRes<{ data: number }>>(
    '/pms/productTag/update',
    payload
  );
};

/** 删除价签 */
export const deletePriceTag = (id: string) => {
  return request.delete<BaseRes<PriceTagInfo>>(`/pms/productTag/${id}`);
};

/** 详情 */
export const getPriceTagDetail = (id: string) => {
  return request.get<BaseRes<PriceTagInfo>>(`/pms/productTag/${id}`);
};

/** 刻印 */
export const getStampList = () => {
  return request.get<
    BaseRes<
      {
        name: string;
        itemList: ProductAttributeCode[];
      }[]
    >
  >(`/pms/productAttributeCode/list?name=stamp&categoryId=0&parentId=0`);
};

export const publishProduct = (idList: number[]) => {
  return ginzaxiaomaApiRequest.post('/search-product-es/publish-batch-auth', {
    idList,
  });
};

export const unPublishProduct = (idList: number[]) => {
  return ginzaxiaomaApiRequest.post(
    '/search-product-es/un-publish-batch-auth',
    {
      idList,
    }
  );
};

export const syncProductToEs = (idList: number[]) => {
  return ginzaxiaomaApiRequest.post('/search-product-es/update-batch', {
    idList,
  });
};

export const getProductCateList = ({
  id = 0,
  pageNum = 1,
  pageSize = 10,
}: ProductCateListPayload) => {
  return request.get<
    BaseRes<{
      pageNum: number;
      pageSize: number;
      total: number;
      list: ProductCateType[];
    }>
  >(`pms/productCategory/list/${id}`, { params: { pageNum, pageSize } });
};

export const getProductCateUpdateNavStatus = (
  params: ProductCateUpdateNavStatusPayload
) => {
  return request.post(`pms/productCategory/update/navStatus`, null, { params });
};

export const getProductCateUpdateShowStatus = (
  params: ProductCateUpdateShowStatusPayload
) => {
  return request.post(`pms/productCategory/update/showStatus`, null, {
    params,
  });
};

export const getProductCateOperation = (
  id: ProductCateType['id'],
  type: 'enable' | 'disable'
) => {
  return request.post(`pms/productCategory/${type}/${id}`, null);
};

export const getProductCate = (id: ProductCateType['id']) => {
  return request.get<BaseRes<ProductCateType>>(`pms/productCategory/${id}`);
};

export const getProductCateCreate = (data: ProductCateType) => {
  return request.post<BaseRes<ProductCateType>>(
    `pms/productCategory/create`,
    data
  );
};

export const getProductCateUpdate = (data: ProductCateType) => {
  return request.post<BaseRes<ProductCateType>>(
    `pms/productCategory/update/${data.id}`,
    data
  );
};

/** 翻译 */
export const omsTranslate = (data: any) => {
  return ginzaxiaomaApiRequest.post(`/admin/translate`, data);
};

export const getProductStockStatusHistory = (productId: number) => {
  return ginzaxiaomaApiRequest.get<
    {
      id: number;
      productId: number;
      previousStockStatus?: string;
      currentStockStatus: string;
      transactionTime: string;
      note: string;
      createdBy: string;
    }[]
  >(`/admin/pms/product-stock-status/history/${productId}`);
};

export const updateStockStatus = (dto: {
  productIdList: number[];
  newStockStatus: PMS_PRODUCT_STOCK_STATUS;
  note?: string;
  autoPublish?: boolean;
}) => {
  return ginzaxiaomaApiRequest.post(
    '/admin/pms/product/update-stock-status',
    dto
  );
};

export const getProductPriceComparison = () => {
  return ginzaxiaomaApiRequest.get<{
    mismatches: {
      dbPrice: number;
      esPrice: number;
      productId: number;
      productSn: string;
      currency: string;
    }[];
  }>('/admin/pms/product-price-comparison');
};

export const createStockTaking = (data: {
  name: string;
  stockPlaces: string[];
  note?: string;
}) => {
  return ginzaxiaomaApiRequest.post(
    '/admin/pms/product/stock-taking/dashboard',
    data
  );
};

export enum STOCK_TAKING_RECORD_CHECK_STATUS {
  CONFIRMED = 'CONFIRMED',
  UNCONFIRMED = 'UNCONFIRMED',
}

export type PmsProductStockTakingRecord = {
  id: number;
  stockTakingId: number;
  productId: number;
  productSn: string;
  productName: string;
  productPic: string;
  stockStatus: PMS_PRODUCT_STOCK_STATUS;
  checkMan?: string;
  checkStatus: STOCK_TAKING_RECORD_CHECK_STATUS;
  stock: number;
  currency: string;
  price: number;
};

export type PmsProductStockTaking = {
  id: number;
  name: string;
  stockPlace: string;
  operateMan: string;
  createTime: string;
  note?: string;
};

export const getStockTakingList = (data: {
  pageNum: number;
  pageSize: number;
  keyword?: string;
}) => {
  return ginzaxiaomaApiRequest.get<{
    total: number;
    list: PmsProductStockTaking[];
  }>('/admin/pms/product/stock-taking/list', {
    params: data,
  });
};

export const getStockTakingDetail = (stockTakingId: number) => {
  return ginzaxiaomaApiRequest.get<
    PmsProductStockTaking & {
      recordList: {
        [key: string]: PmsProductStockTakingRecord[];
      };
    }
  >(`/admin/pms/product/stock-taking/dashboard`, {
    params: {
      stockTakingId,
    },
  });
};
export const updateStockTaking = (data: {
  stockTakingId: number;
  name: string;
  note?: string;
}) => {
  return ginzaxiaomaApiRequest.put(
    `/admin/pms/product/stock-taking/dashboard`,
    data
  );
};

export const deleteStockTaking = (stockTakingId: number) => {
  return ginzaxiaomaApiRequest.delete(
    `/admin/pms/product/stock-taking/dashboard`,
    {
      data: {
        stockTakingId,
      },
    }
  );
};

export const updateStockStatusForStockTaking = (data: {
  productIdList: number[];
  newStockTakingStatus: STOCK_TAKING_RECORD_CHECK_STATUS;
  stockTakingId: number;
}) => {
  return ginzaxiaomaApiRequest.post(
    '/admin/pms/product/update-stock-status/stock-taking',
    data
  );
};

export const downloadStockTakingCsv = async (stockTakingId: number) => {
  try {
    // 发起请求获取数据
    const data = await ginzaxiaomaApiRequest.get<{
      stockTaking: PmsProductStockTaking;
      stockTakingRecordList: PmsProductStockTakingRecord[];
    }>(`/admin/pms/product/stock-taking/csv/${stockTakingId}`);

    const { stockTaking, stockTakingRecordList } = data;
    const headers = ['商品ID', '商品名', '確認状態', '価格', '在庫数'];
    const mappedData = stockTakingRecordList.map(
      ({ productId, productName, checkStatus, price, stock, currency }) => {
        return {
          商品ID: productId,
          商品名: productName,
          確認状態:
            checkStatus === STOCK_TAKING_RECORD_CHECK_STATUS.CONFIRMED
              ? '確認済み'
              : '確認待ち',
          価格: `${currency} ${price.toLocaleString('en-US')}`,
          在庫数: stock,
        };
      }
    );

    // 将数据转换为 Excel 格式
    const worksheet = XLSX.utils.json_to_sheet(mappedData, {
      header: headers,
    });

    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Taking');

    // 生成 Excel 文件并触发下载
    XLSX.writeFile(workbook, `棚卸確認-${stockTaking.name}.xlsx`);
  } catch (error) {
    console.error('下载 Excel 文件时出错:', error);
  }
};

export const printReceiptProductName = (productIdList: number[]) => {
  return ginzaxiaomaApiRequest.post<{ [key: string]: string[] }>(
    '/admin/pms/print-receipt/product-name',
    {
      productIdList,
    }
  );
};
