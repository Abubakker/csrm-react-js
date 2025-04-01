import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getProductStockStatusHistory } from 'apis/pms';
import LOCALS from 'commons/locals';
import {
  findLabelByValue,
  PMS_PRODUCT_STOCK_STATUS_OPTION_LIST,
} from 'commons/options';
import i18n from 'i18n';
import { useEffect, useMemo, useState } from 'react';
import { UnwrapPromise } from 'types/base';
import formatTime from 'utils/formatTime';

type StockStatusHistory = UnwrapPromise<
  ReturnType<typeof getProductStockStatusHistory>
>[number];

const ProductStockStatusHistory = ({ productId }: { productId: number }) => {
  const [history, setHistory] = useState<StockStatusHistory[]>([]);

  useEffect(() => {
    if (!productId) {
      setHistory([]);
    } else {
      getProductStockStatusHistory(productId).then((res) => {
        setHistory(res);
      });
    }
  }, [productId]);

  const columns: ColumnsType<StockStatusHistory> = useMemo(() => {
    return [
      {
        title: i18n.t(LOCALS.mhIsJOVuUc),
        key: 'previousStockStatus',
        dataIndex: 'previousStockStatus',
        render(previousStockStatus: StockStatusHistory['previousStockStatus']) {
          return findLabelByValue(
            previousStockStatus,
            PMS_PRODUCT_STOCK_STATUS_OPTION_LIST
          );
        },
      },
      {
        title: i18n.t(LOCALS.JlnzqcVRbm),
        key: 'currentStockStatus',
        dataIndex: 'currentStockStatus',
        render(currentStockStatus: StockStatusHistory['currentStockStatus']) {
          return findLabelByValue(
            currentStockStatus,
            PMS_PRODUCT_STOCK_STATUS_OPTION_LIST
          );
        },
      },
      {
        title: i18n.t(LOCALS.operation_time),
        key: 'transactionTime',
        dataIndex: 'transactionTime',
        render(transactionTime: StockStatusHistory['transactionTime']) {
          return formatTime(transactionTime);
        },
      },
      {
        title: i18n.t(LOCALS.remark),
        key: 'note',
        dataIndex: 'note',
        render(note: StockStatusHistory['note']) {
          return <div className="whitespace-pre-line">{note}</div>;
        },
      },
      {
        title: i18n.t(LOCALS.operator),
        key: 'createdBy',
        dataIndex: 'createdBy',
      },
    ];
  }, []);

  return (
    <div>
      <Table
        bordered
        rowKey={'id'}
        style={{
          marginTop: 12,
        }}
        scroll={{ x: 'max-content' }}
        dataSource={history}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

export default ProductStockStatusHistory;
