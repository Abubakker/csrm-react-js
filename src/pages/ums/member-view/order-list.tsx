import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getOrderList } from 'apis/oms';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import { useCallback, useEffect, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { PageQuery } from 'types/base';
import { OmsOrder } from 'types/oms';
import { UmsMember } from 'types/ums';
import styles from './index.module.scss';
import formatTime from 'utils/formatTime';
import {
  ORDER_CREATED_FROM_OPTION_LIST,
  ORDER_STATUS_ANTD_TAG_COLOR_MAP,
  findLabelByValue,
} from 'commons/options';
import showTotal from 'components/show-total';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { useAppSelector } from 'store/hooks';
import LinkButton from 'components/link-button';
import MobileList from 'components/descriptions-mobile-list';
import type { ColumnsProps } from 'components/descriptions-mobile-list';

type MemberOrderListProps = {
  memberId: UmsMember['id'];
};

const MemberOrderList = ({ memberId }: MemberOrderListProps) => {
  const isMobile = false;
  const {
    loading,
    setLoading,
    pageNum,
    setPageNum,
    pageSize,
    setPageSize,
    total,
    setTotal,
    dataSource,
    setDataSource,
  } = usePagination<OmsOrder>();

  const { orderStatusOptions } = useAppSelector(selectGlobalInfo);

  const getDataSource = useCallback(
    async ({ pageNum, pageSize }: PageQuery) => {
      try {
        setLoading(true);
        const {
          data: { list, total },
        } = await getOrderList({
          memberId: `${memberId}`,
          pageNum,
          pageSize,
        });

        setDataSource(list);
        setTotal(total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [memberId, setDataSource, setLoading, setTotal]
  );

  useEffect(() => {
    getDataSource({ pageNum: 1, pageSize: 10 });
  }, [getDataSource]);

  const getColumns = useCallback(() => {
    return [
      {
        title: <Trans i18nKey={LOCALS.dwawuQNUEi}></Trans>,
        dataIndex: 'id',
        key: 'id',
        render: (id: number) => {
          return <LinkButton href={`/oms/order-view/${id}`}>{id}</LinkButton>;
        },
      },
      {
        title: <Trans i18nKey={LOCALS.sales_product_id}></Trans>,
        dataIndex: 'orderItemList',
        key: 'order-id-list',
        width: 100,
        render: (orderItemList: OmsOrder['orderItemList']) => {
          return (
            <div>
              {orderItemList.map(({ productId }) => {
                const href = `/pms/product-view/${productId}`;
                return (
                  <div key={productId}>
                    <a href={href}>{productId}</a>
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        title: <Trans i18nKey={LOCALS.created_time}></Trans>,
        dataIndex: 'createTime',
        key: 'createTime',
        render: (createTime: OmsOrder['createTime']) => {
          return formatTime(createTime);
        },
      },
      {
        title: <Trans i18nKey={LOCALS.pay_amount}></Trans>,
        dataIndex: 'payAmount',
        key: 'payAmount',
        render: (
          payAmount: OmsOrder['payAmount'],
          {
            orderItemList: [{ actualCurrency }],
            payAmountActualCurrency,
          }: OmsOrder
        ) => {
          if (actualCurrency && payAmountActualCurrency !== null) {
            return `${actualCurrency} ${payAmountActualCurrency.toLocaleString()}`;
          }

          return `JPY ${payAmount.toLocaleString()}`;
        },
      },
      {
        title: <Trans i18nKey={LOCALS.created_from}></Trans>,
        dataIndex: 'createdFrom',
        key: 'createdFrom',
        render: (createdFrom: OmsOrder['createdFrom']) => {
          return findLabelByValue(createdFrom, ORDER_CREATED_FROM_OPTION_LIST);
        },
      },

      {
        title: <Trans i18nKey={LOCALS.order_status}></Trans>,
        dataIndex: 'status',
        key: 'status',
        render: (status: OmsOrder['status']) => {
          return (
            <Tag color={ORDER_STATUS_ANTD_TAG_COLOR_MAP[status]}>
              {findLabelByValue(status, orderStatusOptions)}
            </Tag>
          );
        },
      },
    ];
  }, [orderStatusOptions]);

  const columns: ColumnsType<OmsOrder> = useMemo(
    () => getColumns(),
    [getColumns]
  );

  const mobColumns: ColumnsProps<OmsOrder> = useMemo(
    () => getColumns(),
    [getColumns]
  );

  return (
    <div>
      <div className={styles.title}>
        <Trans i18nKey={LOCALS.order_list} />
      </div>

      {isMobile ? (
        <MobileList
          columns={mobColumns}
          dataSource={dataSource}
          loading={loading}
          pagination={{
            simple: true,
            total,
            pageSize,
            current: pageNum,
            onChange: (page, pageSize) => {
              setPageNum(page);
              setPageSize(pageSize);
              getDataSource({ pageNum: page, pageSize });
            },
          }}
        />
      ) : (
        <Table
          size="small"
          bordered
          pagination={{
            showTotal,
            total,
            pageSize,
            current: pageNum,
            onChange: (page, pageSize) => {
              setPageNum(page);
              setPageSize(pageSize);
              getDataSource({ pageNum: page, pageSize });
            },
          }}
          loading={loading}
          rowKey={'id'}
          style={{
            marginTop: 12,
          }}
          dataSource={dataSource}
          columns={columns}
        />
      )}
    </div>
  );
};

export default MemberOrderList;
