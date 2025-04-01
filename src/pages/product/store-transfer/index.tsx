import { Button, InputNumber, message, Modal, Select, Spin, Table } from 'antd';
import { useTodayRateMap } from 'apis/home';
import { productStoreTransfer } from 'apis/oms';
import { PmsProductEs, getProductList } from 'apis/pms';
import LOCALS from 'commons/locals';
import {
  CURRENCY_MAP,
  findLabelByValue,
  PMS_PRODUCT_STOCK_STATUS,
  PMS_PRODUCT_STOCK_STATUS_OPTION_LIST,
  PUBLISH_STATUS_OPTION_LIST,
  SHOP_MAP,
  STOCK_PLACE_MAP,
  STOCK_PLACE_OPTION_LIST,
  SYS_USER_SHOP_OPTION_LIST,
} from 'commons/options';
import i18n from 'i18n';
import { debounce } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';
import { useToggle } from 'react-use';
import { PmsProduct } from 'types/pms';
import { priceToWithoutTax } from 'utils/price-change';
import { thousands } from 'utils/tools';

function convertCurrency(
  from: string,
  to: string,
  rates: Record<string, number>,
  amount: number
): number {
  if (!rates[from] || !rates[to]) {
    throw new Error('Invalid currency code');
  }

  // 先将 from 货币转换为 JPY, 再从 JPY 转换为 to 货币
  const amountInJPY = amount / rates[from];
  return Math.ceil(amountInJPY * rates[to]);
}

const StoreTransfer = () => {
  const [fromShop, setFromShop] = useState<number>();
  const [toShop, setToShop] = useState<number>();

  const [submitting, toggleSubmitting] = useToggle(false);
  const [orderId, setOrderId] = useState<number>();

  const [loading, toggleLoading] = useToggle(false);
  const [productOptionList, setProductOptionList] = useState<PmsProduct[]>([]);
  const [productList, setProductList] = useState<
    (PmsProduct & {
      b2bPrice?: number;
      priceWithoutTax: number;
    })[]
  >([]);

  const toShopCurrency = useMemo(() => {
    return SYS_USER_SHOP_OPTION_LIST.find((i) => i.value === toShop)?.currency;
  }, [toShop]);

  const debounceHandleSearchProduct = useMemo(() => {
    return debounce((keyword: string) => {
      keyword = keyword.trim();
      if (!keyword) {
        setProductOptionList([]);
        return;
      }

      toggleLoading(true);

      let stockPlaceList: string[] | undefined;
      if (fromShop === SHOP_MAP.GINZA) {
        stockPlaceList = [STOCK_PLACE_MAP.JAPAN];
      } else if (fromShop === SHOP_MAP.HONGKONG) {
        stockPlaceList = [STOCK_PLACE_MAP.HONGKONG];
      } else if (fromShop === SHOP_MAP.SINGAPORE) {
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
  }, [fromShop, toggleLoading]);

  const rateMap = useTodayRateMap();

  const handleSearchProduct = useCallback(
    (keyword: string) => {
      debounceHandleSearchProduct(keyword);
    },
    [debounceHandleSearchProduct]
  );

  return (
    <div className="h-full flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <div>
          <h2 className="text-center">调出店铺</h2>
          <Select
            value={fromShop}
            className="w-80"
            options={SYS_USER_SHOP_OPTION_LIST}
            onChange={(shop) => {
              setFromShop(shop);
            }}
          ></Select>
        </div>
        <div>
          <h2 className="text-center">调入店铺</h2>
          <Select
            disabled={!fromShop}
            value={toShop}
            className="w-80"
            options={SYS_USER_SHOP_OPTION_LIST.filter(
              (i) => i.value !== fromShop
            )}
            onChange={(shop) => {
              setToShop(shop);
            }}
          ></Select>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 w-full">
        <h2 className="text-center">调出商品</h2>
        <Select
          disabled={!fromShop || !toShop}
          placeholder={i18n.t(LOCALS.keyword) || ''}
          className="w-96"
          filterOption={false}
          notFoundContent={loading ? <Spin size="small" /> : null}
          onSearch={handleSearchProduct}
          value={null}
          showSearch
          onChange={(pmsProductId: PmsProductEs['id']) => {
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

              const priceWithoutTax =
                product.currency === CURRENCY_MAP.JPY
                  ? priceToWithoutTax(product.price)
                  : product.price;
              setProductList([
                ...productList,
                {
                  ...product,
                  priceWithoutTax,
                },
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
            data: PmsProductEs;
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
                {findLabelByValue(publishStatus, PUBLISH_STATUS_OPTION_LIST)}
                {` / ${stock}`}
              </div>
            );
          }}
        />
        <Table
          rowKey={(record) => record.id}
          className="w-full"
          bordered
          dataSource={productList}
          pagination={false}
          columns={[
            {
              title: i18n.t(LOCALS.sales_product_id),
              dataIndex: 'id',
              key: 'id',
              render: (id: number) => {
                return (
                  <a
                    href={`/pms/product-view/${id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {id}
                  </a>
                );
              },
            },
            {
              title: i18n.t(LOCALS.SYLYoWTeQq),
              dataIndex: 'description',
              key: 'description',
              render: (description: string) => {
                return description || '-';
              },
            },
            {
              title: '商品名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: i18n.t(LOCALS.selling_price),
              dataIndex: 'price',
              key: 'price',
              render: (price: number, record: PmsProduct) => {
                return (
                  <div>
                    <div>{`${record.currency} ${thousands(price)}`}</div>
                    <div>
                      {toShopCurrency}{' '}
                      {thousands(
                        convertCurrency(
                          record.currency,
                          toShopCurrency || '',
                          rateMap,
                          price
                        )
                      )}
                    </div>
                  </div>
                );
              },
            },
            {
              title: i18n.t(LOCALS.price_tax_free),
              dataIndex: 'priceWithoutTax',
              key: 'priceWithoutTax',
              render: (
                priceWithoutTax: number,
                record: PmsProduct & {
                  priceWithoutTax: number;
                }
              ) => {
                return (
                  <div>
                    <div>{`${record.currency} ${priceWithoutTax.toLocaleString(
                      'en-US'
                    )}`}</div>
                    <div>
                      {toShopCurrency}{' '}
                      {thousands(
                        convertCurrency(
                          record.currency,
                          toShopCurrency || '',
                          rateMap,
                          priceWithoutTax
                        )
                      )}
                    </div>
                  </div>
                );
              },
            },
            {
              title: i18n.t(LOCALS.purchase_price),
              key: 'costPrice',
              dataIndex: 'costPrice',
              render(
                costPrice: PmsProduct['costPrice'],
                record: PmsProduct & {
                  priceWithoutTax: number;
                }
              ) {
                if (!costPrice) return '-';

                return (
                  <div>
                    <div>
                      {record.currency} {thousands(costPrice)}
                    </div>
                    <div>
                      {toShopCurrency}{' '}
                      {thousands(
                        convertCurrency(
                          record.currency,
                          toShopCurrency || '',
                          rateMap,
                          Number(costPrice)
                        )
                      )}
                    </div>
                  </div>
                );
              },
            },
            {
              title: '产地',
              dataIndex: 'stockPlace',
              key: 'stockPlace',
              render: (stockPlace: string) => {
                return findLabelByValue(stockPlace, STOCK_PLACE_OPTION_LIST);
              },
            },
            {
              title: '库存',
              dataIndex: 'stock',
              key: 'stock',
            },
            {
              title: '状态',
              dataIndex: 'stockStatus',
              key: 'stockStatus',
              render: (stockStatus: string) => {
                return findLabelByValue(
                  stockStatus,
                  PMS_PRODUCT_STOCK_STATUS_OPTION_LIST
                );
              },
            },
            {
              title: 'B2B价格',
              dataIndex: 'b2bPrice',
              key: 'b2bPrice',
              width: 208,
              render: (
                b2bPrice: number,
                record: PmsProduct & {
                  priceWithoutTax: number;
                }
              ) => {
                return (
                  <div>
                    <InputNumber
                      prefix={record.currency}
                      className="w-52"
                      type="number"
                      value={b2bPrice}
                      max={record.priceWithoutTax}
                      onChange={(value) => {
                        if (!value) return;
                        setProductList(
                          productList.map((i) => {
                            if (i.id === record.id) {
                              return {
                                ...i,
                                b2bPrice: value,
                              };
                            }
                            return i;
                          })
                        );
                      }}
                    />
                    {b2bPrice && (
                      <div>
                        {toShopCurrency}{' '}
                        {thousands(
                          convertCurrency(
                            record.currency,
                            toShopCurrency || '',
                            rateMap,
                            b2bPrice
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              },
            },
            {
              title: '操作',
              dataIndex: 'id',
              key: 'option',
              render: (id: number) => {
                return (
                  <Button
                    type="link"
                    danger
                    onClick={() => {
                      setProductList(productList.filter((i) => i.id !== id));
                    }}
                  >
                    删除
                  </Button>
                );
              },
            },
          ]}
        ></Table>
      </div>

      <div>
        <Button
          type="primary"
          loading={submitting}
          disabled={
            !fromShop ||
            !toShop ||
            !productList.length ||
            productList.some((i) => !i.b2bPrice)
          }
          onClick={async () => {
            if (!fromShop || !toShop || !productList.length) return;

            toggleSubmitting();

            const { omsOrder } = await productStoreTransfer({
              fromShopId: fromShop,
              toShopId: toShop,
              productList: productList.map((i) => ({
                id: i.id,
                b2bPrice: i.b2bPrice || 0,
              })),
            });
            setOrderId(omsOrder.id);
            message.success('提交成功');
            toggleSubmitting();
          }}
        >
          提交
        </Button>
      </div>

      <Modal
        open={!!orderId}
        title="调货成功"
        onCancel={() => {
          window.location.reload();
        }}
        onOk={() => {
          window.location.reload();
        }}
      >
        <a href={`/oms/order-view/${orderId}`} target="_blank" rel="noreferrer">
          查看订单 {orderId}
        </a>
      </Modal>
    </div>
  );
};

export default StoreTransfer;
