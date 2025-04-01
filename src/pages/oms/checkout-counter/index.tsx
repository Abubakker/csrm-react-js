import { Select, Spin, message } from 'antd';
import { getProductList } from 'apis/pms';
import UmsMemberSelect from 'components/ums-member-select';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToggle } from 'react-use';
import { PmsProductWithPriceType, PmsProduct } from 'types/pms';
import ProductTable from './product-table';
import {
  CHECKOUT_OUT_PRODUCT_PRICE_TYPE,
  PUBLISH_STATUS_OPTION_LIST,
  STOCK_PLACE_MAP,
  STOCK_PLACE_OPTION_LIST,
  findLabelByValue,
  SYS_USER_SHOP_OPTION_LIST,
  SHOP_MAP,
  PMS_PRODUCT_STOCK_STATUS,
  PMS_PRODUCT_STOCK_STATUS_OPTION_LIST,
} from 'commons/options';
import { produce } from 'immer';
import PaymentInfo from './payment-info';
import useCurrentShopStaffs from 'commons/hooks/useCurrentShopStaffs';
import PayloadContextProvider from './utils/payload-context';
import { usePayloadContext } from './utils/payload-context';
import { ActionType } from './utils/payload-reducer';
import { useAppSelector } from 'store/hooks';
import { selectUserInfo } from 'store/slices/userInfoSlice';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';
import { thousands } from 'utils/tools';
import { debounce } from 'lodash-es';
import { StoreConfirmOrder } from 'types/oms';
import connectToPosPrinter, {
  posPrinterSetting,
} from 'utils/connect-to-pos-printer';
import { useSearchParams } from 'react-router-dom';

const CHECKOUT_COUNTER_CACHE_SHOP_ID_KEY = 'CHECKOUT_COUNTER_CACHE_SHOP_ID_KEY';

// 处理产地
const handleProductPriceType = (
  product: PmsProduct
): PmsProductWithPriceType => {
  return {
    ...product,
    priceType: CHECKOUT_OUT_PRODUCT_PRICE_TYPE.WITH_TAX,
  };
};

const OmsCheckoutCounter = () => {
  const [productList, setProductList] = useState<PmsProductWithPriceType[]>([]);
  const [loadingProductList] = useToggle(false);
  const staffSelectOptions = useCurrentShopStaffs();
  const { nickName, shop } = useAppSelector(selectUserInfo);
  const { dispatch, state } = usePayloadContext();
  // 合计金额集合
  const [orderResult, setOrderResult] = useState<
    StoreConfirmOrder | undefined
  >();

  const { createdFrom } = state;

  useEffect(() => {
    if (posPrinterSetting.communicationType.get() === 'socket') {
      connectToPosPrinter().catch((err) => {
        console.log(err);
      });
    }
  }, []);

  // 改变payload参数
  useEffect(() => {
    const list = [...productList];
    const products = list.map((d) => {
      const {
        id,
        priceType,
        stockPlace,
        productSn,
        name,
        subTitle,
        brandName,
        price,
        currency,
      } = d;
      return {
        id,
        isTaxFree:
          priceType === CHECKOUT_OUT_PRODUCT_PRICE_TYPE.WITH_TAX ? 0 : 1,
        stockPlace,
        productSn,
        name,
        subTitle,
        brandName,
        price,
        currency,
      };
    });
    dispatch({
      type: ActionType.UPDATE_BATCH,
      payload: {
        productList: products,
      },
    });
  }, [productList, dispatch]);

  useEffect(() => {
    if (nickName) {
      const cachedShopIdStr = localStorage.getItem(
        CHECKOUT_COUNTER_CACHE_SHOP_ID_KEY
      );
      const cachedShopId = cachedShopIdStr ? parseInt(cachedShopIdStr) : null;

      dispatch({
        type: ActionType.UPDATE_BATCH,
        payload: {
          staffName: nickName,
          createdFrom: shop || cachedShopId || SHOP_MAP.GINZA,
        },
      });
    }
  }, [dispatch, nickName, shop]);

  const [loading, toggleLoading] = useToggle(false);
  const [productOptionList, setProductOptionList] = useState<PmsProduct[]>([]);

  const debounceHandleSearchProduct = useMemo(() => {
    return debounce((keyword: string) => {
      keyword = keyword.trim();
      if (!keyword) {
        setProductOptionList([]);
        return;
      }

      toggleLoading(true);

      let stockPlaceList: string[] | undefined;
      if (createdFrom === SHOP_MAP.GINZA) {
        stockPlaceList = [STOCK_PLACE_MAP.JAPAN];
      } else if (createdFrom === SHOP_MAP.HONGKONG) {
        stockPlaceList = [STOCK_PLACE_MAP.HONGKONG];
      } else if (createdFrom === SHOP_MAP.SINGAPORE) {
        stockPlaceList = [
          STOCK_PLACE_MAP.SINGAPORE_ASU,
          STOCK_PLACE_MAP.SINGAPORE_GX,
        ];
      }

      getProductList({
        keyword,
        pageNum: 1,
        pageSize: 10,
        transformPriceToJpyFlag: 0,
        stockStatuses: [PMS_PRODUCT_STOCK_STATUS.FOR_SALE],
        stockPlaceList,
      })
        .then((data) => {
          setProductOptionList(data.data.list);
        })
        .catch()
        .finally(() => toggleLoading(false));
    }, 300);
  }, [createdFrom, toggleLoading]);

  const handleSearchProduct = useCallback(
    (keyword: string) => {
      debounceHandleSearchProduct(keyword);
    },
    [debounceHandleSearchProduct]
  );

  const [searchParams] = useSearchParams();
  useEffect(() => {
    const productSn = searchParams.get('productSn');
    if (!productSn) return;

    getProductList({
      keyword: productSn,
      pageNum: 1,
      pageSize: 10,
      transformPriceToJpyFlag: 0,
      stockStatuses: [PMS_PRODUCT_STOCK_STATUS.FOR_SALE],
    }).then((res) => {
      const productSnList = productSn.split('\n');
      const { list } = res.data;

      const tempProductList = list
        .filter((i) => productSnList.includes(i.productSn))
        .map((i) => {
          return handleProductPriceType(i);
        });

      setProductList((productList) => {
        return [...productList, ...tempProductList];
      });
    });
  }, [searchParams]);

  return (
    <div>
      {/* 会员选择 */}
      <UmsMemberSelect />

      {/* 商品选择 */}
      <div>
        <h2>{i18n.t(LOCALS.product_selection)}</h2>
        <div className="flex items-center">
          <div className="flex w-full">
            <Select
              placeholder={i18n.t(LOCALS.product_sn) || '商品编号'}
              className="w-full"
              filterOption={false}
              notFoundContent={loading ? <Spin size="small" /> : null}
              onSearch={handleSearchProduct}
              value={null}
              showSearch
              onChange={(pmsProductId: PmsProduct['id']) => {
                const product = productOptionList.find(
                  (i) => i.id === pmsProductId
                );
                if (product && !productList.find((i) => i.id === product.id)) {
                  // 产地判断
                  const b = productList.every(
                    (d) =>
                      d.stockPlace === product.stockPlace ||
                      d.stockPlace === STOCK_PLACE_MAP.SINGAPORE_ASU ||
                      d.stockPlace === STOCK_PLACE_MAP.SINGAPORE_GX
                  );
                  if (!b) {
                    message.warning({
                      content: '有商品不属于同一产地，无法计算价格',
                      key: 'stockPlace',
                    });
                  }
                  setProductList([
                    ...productList,
                    handleProductPriceType(product),
                  ]);
                  setProductOptionList([]);
                }
              }}
              options={productOptionList.map((i) => {
                return {
                  ...i,
                  value: i.id,
                  label: i.productSn,
                };
              })}
              // @ts-ignore
              optionRender={({
                data: {
                  id,
                  price,
                  currency,
                  stockPlace,
                  publishStatus,
                  stock,
                  stockStatus,
                },
              }: {
                data: PmsProduct;
              }) => {
                return (
                  <div className="flex items-center">
                    <span className="mr-2">{id}</span>
                    <span className="mr-2">{`${currency} ${thousands(
                      price
                    )}`}</span>
                    <span className="mr-2">
                      {findLabelByValue(stockPlace, STOCK_PLACE_OPTION_LIST)}
                    </span>
                    <span className="mr-2">
                      {findLabelByValue(
                        stockStatus,
                        PMS_PRODUCT_STOCK_STATUS_OPTION_LIST
                      )}
                    </span>
                    {findLabelByValue(
                      publishStatus,
                      PUBLISH_STATUS_OPTION_LIST
                    )}
                    {` / ${stock}`}
                  </div>
                );
              }}
            />
          </div>

          <div className="ml-4 flex shrink-0 items-center">
            {i18n.t(LOCALS.shop)}：
            <Select
              disabled={!!shop}
              value={state.createdFrom}
              className="w-36"
              options={SYS_USER_SHOP_OPTION_LIST}
              onChange={(e) => {
                localStorage.setItem(
                  CHECKOUT_COUNTER_CACHE_SHOP_ID_KEY,
                  `${e}`
                );
                dispatch({
                  type: ActionType.UPDATE_BATCH,
                  payload: {
                    createdFrom: e,
                  },
                });
                setTimeout(() => {
                  window.location.reload();
                }, 300);
              }}
            ></Select>
          </div>

          <div className="ml-4 flex shrink-0 items-center">
            {i18n.t(LOCALS.staff)}：
            <Select
              value={state.staffName}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').includes(input)
              }
              className="w-32"
              options={staffSelectOptions.map((d) => ({
                value: d.label,
                label: d.label,
              }))}
              onChange={(e) => {
                dispatch({
                  type: ActionType.UPDATE_BATCH,
                  payload: {
                    staffName: e,
                  },
                });
              }}
            ></Select>
          </div>
        </div>
        {/* 商品表格 */}
        <ProductTable
          orderResult={orderResult}
          loading={loadingProductList}
          productList={productList}
          mode="list"
          onChange={(product) => {
            const newProductList = produce(productList, (draft) => {
              const targetProduct = draft.find((i) => i.id === product.id);

              if (targetProduct) {
                targetProduct.priceType = product.priceType;
              }
            });
            setProductList(newProductList);
          }}
          onDelete={(product) => {
            setProductList(productList.filter((i) => i.id !== product.id));
          }}
        />
      </div>

      {/* 支付细节 */}
      <PaymentInfo
        orderResult={orderResult}
        setOrderResult={setOrderResult}
        productList={productList}
      />
    </div>
  );
};

const OmsCheckoutCounterWarp = () => (
  <PayloadContextProvider>
    <OmsCheckoutCounter />
  </PayloadContextProvider>
);
export default OmsCheckoutCounterWarp;
