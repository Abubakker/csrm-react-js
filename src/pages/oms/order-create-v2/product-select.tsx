import { Button, Select, Spin } from 'antd';
import { getProductList } from 'apis/pms';
import { useCallback, useState } from 'react';
import { useToggle } from 'react-use';
import { PmsProduct } from 'types/pms';
import ProductList from './product-list';
import { thousands } from 'utils/tools';
import {
  CHECKOUT_OUT_PRODUCT_PRICE_TYPE,
  PMS_PRODUCT_STOCK_STATUS,
  PMS_PRODUCT_STOCK_STATUS_OPTION_LIST,
  PUBLISH_STATUS_OPTION_LIST,
  STOCK_PLACE_MAP,
  STOCK_PLACE_OPTION_LIST,
  findLabelByValue,
} from 'commons/options';
import { StoreConfirmOrder } from 'types/oms';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';

interface Props {
  setPayload: (data: {
    productList: (PmsProduct & {
      isTaxFree: number;
    })[];
  }) => void;
  confirmOrderInfo?: StoreConfirmOrder;
  receiveAddressCountry?: string;
  productList: (PmsProduct & {
    isTaxFree: number;
  })[];
}

const ProductSelect = ({
  setPayload,
  confirmOrderInfo,
  receiveAddressCountry,
  productList,
}: Props) => {
  const [loading, toggleLoading] = useToggle(false);
  const [productOptionList, setProductOptionList] = useState<PmsProduct[]>([]);
  const handleSearch = useCallback(
    (keyword: string) => {
      keyword = keyword.trim();
      if (!keyword) {
        setProductOptionList([]);
        return;
      }

      toggleLoading(true);
      getProductList({
        keyword,
        pageNum: 1,
        pageSize: 10,
        transformPriceToJpyFlag: 0,
        stockStatuses: [PMS_PRODUCT_STOCK_STATUS.FOR_SALE],
      })
        .then((data) => {
          setProductOptionList(data.data.list);
        })
        .catch()
        .finally(() => toggleLoading(false));
    },
    [toggleLoading]
  );

  return (
    <div className="p-4">
      <div className="flex justify-center items-center mb-4">
        <Select
          size="large"
          placeholder={i18n.t(LOCALS.sku_or_keywords) || '商品编号/名称'}
          className="w-full"
          filterOption={false}
          notFoundContent={loading ? <Spin size="small" /> : null}
          onSearch={handleSearch}
          value={null}
          showSearch
          onChange={(pmsProductId: PmsProduct['id']) => {
            const target = productOptionList.find((i) => i.id === pmsProductId);
            if (target && !productList.find((i) => i.id === target.id)) {
              const isTaxFree =
                receiveAddressCountry &&
                target.stockPlace === STOCK_PLACE_MAP.JAPAN &&
                receiveAddressCountry !== 'JPN'
                  ? 1
                  : 0;

              setPayload({
                productList: [...productList, { ...target, isTaxFree }],
              });
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
              productSn,
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
              <div>
                <span className="mr-2">{productSn}</span>
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
                {findLabelByValue(publishStatus, PUBLISH_STATUS_OPTION_LIST)}
                {` / ${stock}`}
              </div>
            );
          }}
        />
        <Button
          onClick={() => {
            window.open('/pms/product-add', '_blank');
          }}
          size="large"
          className="ml-4"
          type="primary"
        >
          {i18n.t(LOCALS.add)}
        </Button>
      </div>

      <ProductList
        confirmOrderInfo={confirmOrderInfo}
        onPriceTypeChange={({ productId, priceType }) => {
          const newProductList = productList.map((i) => {
            if (i.id === productId) {
              return {
                ...i,
                isTaxFree:
                  priceType === CHECKOUT_OUT_PRODUCT_PRICE_TYPE.WITH_OUT_TAX
                    ? 1
                    : 0,
              };
            }
            return i;
          });
          setPayload({
            productList: newProductList,
          });
        }}
        productList={productList}
        onDelete={(id) => {
          setPayload({
            productList: productList.filter((i) => i.id !== id),
          });
        }}
      />
    </div>
  );
};

export default ProductSelect;
