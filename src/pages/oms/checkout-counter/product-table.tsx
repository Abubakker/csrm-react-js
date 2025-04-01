import { Button, Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import LOCALS from 'commons/locals';
import {
  CHECKOUT_OUT_PRODUCT_PRICE_TYPE_OPTION_LIST,
  CHECKOUT_OUT_PRODUCT_PRICE_TYPE,
  STOCK_PLACE_OPTION_LIST,
  findLabelByValue,
  PUBLISH_STATUS_OPTION_LIST,
  PMS_PRODUCT_STOCK_STATUS_OPTION_LIST,
} from 'commons/options';
import { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { PmsProductWithPriceType } from 'types/pms';
import i18n from '../../../i18n';
import { StoreConfirmOrder } from 'types/oms';

const ProductTable = ({
  loading,
  productList,
  onChange,
  onDelete,
  mode,
  orderResult,
}: {
  loading: boolean;
  productList: PmsProductWithPriceType[];
  onChange?: (product: PmsProductWithPriceType) => void;
  onDelete?: (product: PmsProductWithPriceType) => void;
  mode: 'list' | 'modal'; // 使用的场景
  orderResult?: StoreConfirmOrder;
}) => {
  const getColumns = useMemo(() => {
    let columns: ColumnsType<PmsProductWithPriceType> = [
      {
        title: '商品ID',
        dataIndex: 'id',
        key: 'id',
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
        dataIndex: 'pic',
        key: 'pic',
        title: <Trans i18nKey={LOCALS.product_pictures} />,
        render: (pic: string) => {
          if (!pic) return <span>-</span>;

          return <img src={pic} width={100} height={100} alt={pic} />;
        },
      },
      {
        dataIndex: 'name',
        key: 'name',
        title: <Trans i18nKey={LOCALS.product_name} />,
      },
      // {
      //   title: i18n.t(LOCALS.product_source),
      //   key: 'sourceType',
      //   dataIndex: 'sourceType',
      //   render: (sourceType: PmsProductWithPriceType['sourceType']) => {
      //     return findLabelByValue(sourceType, PRODUCT_SOURCE_TYPE_OPTION_LIST);
      //   },
      // },
      {
        dataIndex: 'price',
        key: 'price',
        title: <Trans i18nKey={LOCALS.price} />,
        render: (price: number, product: PmsProductWithPriceType) => {
          const { id } = product;

          const omsOrderItem = orderResult?.omsOrderItems.find(
            (i) => i.productId === id
          );

          if (!omsOrderItem) return null;
          return (
            <div>
              {omsOrderItem.actualCurrency}{' '}
              {omsOrderItem.productPriceActualCurrency.toLocaleString()}
            </div>
          );
        },
      },
      {
        dataIndex: 'stockStatus',
        key: 'stockStatus',
        title: i18n.t(LOCALS.uMihwkqqts),
        render(stockStatus: PmsProductWithPriceType['stockStatus']) {
          return (
            <div>
              {findLabelByValue(
                stockStatus,
                PMS_PRODUCT_STOCK_STATUS_OPTION_LIST
              )}
            </div>
          );
        },
      },
      {
        dataIndex: 'publish_status',
        key: 'publish_status',
        title: (
          <div>
            <Trans i18nKey={LOCALS.publish_status} /> /{' '}
            <Trans i18nKey={LOCALS.stock} />
          </div>
        ),
        render: (_, { publishStatus, stock }) => {
          return (
            <div>
              {findLabelByValue(publishStatus, PUBLISH_STATUS_OPTION_LIST)} /{' '}
              {stock}
            </div>
          );
        },
      },
      {
        dataIndex: 'stockPlace',
        key: 'stockPlace',
        title: <Trans i18nKey={LOCALS.stock_place} />,
        render: (stockPlace: PmsProductWithPriceType['stockPlace']) => {
          return findLabelByValue(stockPlace, STOCK_PLACE_OPTION_LIST);
        },
      },
    ];
    if (mode === 'list') {
      columns = [
        ...columns,
        {
          title: i18n.t(LOCALS.price_type),
          key: 'priceType',
          render: (product: PmsProductWithPriceType) => {
            const { priceType } = product;

            return (
              <Select
                className="w-full"
                value={priceType}
                defaultValue={CHECKOUT_OUT_PRODUCT_PRICE_TYPE.WITH_OUT_TAX}
                options={CHECKOUT_OUT_PRODUCT_PRICE_TYPE_OPTION_LIST}
                onChange={(value) => {
                  const newProduct = {
                    ...product,
                    priceType: value,
                  };
                  onChange?.(newProduct);
                }}
              ></Select>
            );
          },
        },
        {
          title: i18n.t(LOCALS.option),
          key: 'option',
          render: (product: PmsProductWithPriceType) => {
            return (
              <div>
                <Button
                  type="link"
                  onClick={() => {
                    window.open(`/pms/product-view/${product.id}`);
                  }}
                >
                  {i18n.t(LOCALS.details)}
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    onDelete?.(product);
                  }}
                >
                  {i18n.t(LOCALS.delete)}
                </Button>
              </div>
            );
          },
        },
      ];
    }
    return columns;
  }, [mode, onChange, onDelete, orderResult?.omsOrderItems]);

  return (
    <Table
      size="small"
      loading={loading}
      className="mt-4"
      bordered
      pagination={false}
      columns={getColumns}
      dataSource={productList}
      rowKey={'id'}
      rowSelection={
        mode === 'list'
          ? undefined
          : {
              type: 'radio',
              onChange: (
                _: React.Key[],
                selectedRows: PmsProductWithPriceType[]
              ) => {
                onChange?.(selectedRows[0]);
              },
            }
      }
    ></Table>
  );
};

export default ProductTable;
