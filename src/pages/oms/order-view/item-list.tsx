import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { OmsOrderDetail, OmsOrderItem } from 'types/oms';
import styles from './index.module.scss';
import LOCALS from 'commons/locals';
import { Trans } from 'react-i18next';
import LinkButton from 'components/link-button';
import {
  CHECKOUT_OUT_PRODUCT_PRICE_TYPE,
  CHECKOUT_OUT_PRODUCT_PRICE_TYPE_OPTION_LIST,
  findLabelByValue,
  PMS_PRODUCT_STOCK_STATUS_OPTION_LIST,
} from 'commons/options';
import { getProductUpdateInfoNew } from 'apis/pms';
import { ProductUpdateInfoNewType } from 'types/pms';
import i18n from 'i18n';

type OrderItemListProps = {
  omsOrderDetail: OmsOrderDetail;
};

const OrderItemList = ({
  omsOrderDetail: { orderItemList },
}: OrderItemListProps) => {
  const [productList, setProductList] = useState<ProductUpdateInfoNewType[]>(
    []
  );

  useEffect(() => {
    const productIdList = orderItemList.map((i) => i.productId);
    if (!productIdList.length) return;

    Promise.all(
      productIdList.map((productId) => {
        return getProductUpdateInfoNew(productId);
      })
    ).then((i) => {
      setProductList(i);
    });
  }, [orderItemList]);

  const columns: ColumnsType<OmsOrderItem> = useMemo(() => {
    return [
      {
        title: <Trans i18nKey={LOCALS.sales_product_id} />,
        dataIndex: 'productId',
        key: 'productId',
        width: 70,
      },
      {
        title: <Trans i18nKey={LOCALS.product_sn} />,
        dataIndex: 'productSnDes',
        key: 'productSnDes',
        width: 100,
        render: (
          productSnDes: OmsOrderItem['productSnDes'],
          omsOrderItem: OmsOrderItem
        ) => {
          return (
            <LinkButton href={`/pms/product-view/${omsOrderItem.productId}`}>
              {productSnDes}
            </LinkButton>
          );
        },
      },
      {
        title: <Trans i18nKey={LOCALS.product_pictures} />,
        dataIndex: 'productPic',
        key: 'productPic',
        width: 100,
        render: (productPic: OmsOrderItem['productPic']) => {
          return productPic ? (
            <img width={64} src={productPic} alt={productPic} />
          ) : (
            '-'
          );
        },
      },
      {
        title: <Trans i18nKey={LOCALS.product_name} />,
        dataIndex: 'productName',
        key: 'productName',
        width: 150,
      },
      {
        title: <Trans i18nKey={LOCALS.price} />,
        dataIndex: 'realAmountCurrency',
        key: 'realAmountCurrency',
        width: 150,
        render: (
          realAmountCurrency: OmsOrderItem['realAmountCurrency'],
          { actualCurrency }: OmsOrderItem
        ) => {
          return `${actualCurrency} ${realAmountCurrency?.toLocaleString()}`;
        },
      },
      {
        title: <Trans i18nKey={LOCALS.price_type} />,
        dataIndex: 'isTaxFree',
        key: 'isTaxFree',
        width: 150,
        render: (isTaxFree: OmsOrderItem['isTaxFree']) => {
          return findLabelByValue(
            isTaxFree
              ? CHECKOUT_OUT_PRODUCT_PRICE_TYPE.WITH_OUT_TAX
              : CHECKOUT_OUT_PRODUCT_PRICE_TYPE.WITH_TAX,
            CHECKOUT_OUT_PRODUCT_PRICE_TYPE_OPTION_LIST
          );
        },
      },
      {
        title: <Trans i18nKey={LOCALS.tax_amount} />,
        key: 'tax_amount',
        width: 150,
        render: ({ actualCurrency, taxAmount }: OmsOrderItem) => {
          if (actualCurrency)
            return `${actualCurrency} ${taxAmount?.toLocaleString()}`;

          return '-';
        },
      },
      {
        title: i18n.t(LOCALS.uMihwkqqts),
        dataIndex: 'productId',
        key: 'stockStatus',
        width: 150,
        render(productId: OmsOrderItem['productId']) {
          const target = productList.find((i) => i.id === productId);
          if (!target) return <div>-</div>;

          return (
            <div>
              {findLabelByValue(
                target.stockStatus,
                PMS_PRODUCT_STOCK_STATUS_OPTION_LIST
              )}
            </div>
          );
        },
      },
    ];
  }, [productList]);

  return (
    <div className="mb-3">
      <div className={styles.title}>
        <Trans i18nKey={LOCALS.product_info} />
      </div>
      <Table
        size="small"
        bordered
        tableLayout="fixed"
        pagination={false}
        rowKey={'id'}
        dataSource={orderItemList}
        columns={columns}
      ></Table>
    </div>
  );
};

export default OrderItemList;
