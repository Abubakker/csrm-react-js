import { Tabs, TabsProps, Tag } from 'antd';
import { getOrderList } from 'apis/oms';
import usePagination from 'commons/hooks/usePagination';
import {
  ORDER_STATUS_ANTD_TAG_COLOR_MAP,
  findLabelByValue,
} from 'commons/options';
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { PageQuery } from 'types/base';
import { OmsOrder } from 'types/oms';
import formatTime from 'utils/formatTime';
import { InfiniteScroll } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import img404 from 'assets/images/img-404.png';
import i18n from '../../i18n';
import LOCALS from '../../commons/locals';
import { Trans } from 'react-i18next';

const OrderListMobile = () => {
  // 初始化未支付和订金订单
  const [selectedStatus, setSelectedStatus] = useState('0,7');
  const { orderStatusOptions } = useAppSelector(selectGlobalInfo);
  const [isChanging, setIsChanging] = useState(false);
  const navigate = useNavigate();

  const {
    setLoading,
    pageNum,
    setPageNum,
    pageSize,
    total,
    setTotal,
    dataSource,
    setDataSource,
  } = usePagination<OmsOrder>();

  const getDataSource = useCallback(
    async ({
      pageNum,
      pageSize,
      selectedStatus,
    }: PageQuery & {
      selectedStatus?: string;
    }) => {
      try {
        setLoading(true);
        const {
          data: { list, total },
        } = await getOrderList({
          pageNum,
          pageSize,
          status: selectedStatus === 'all' ? null : selectedStatus,
        });

        if (selectedStatus === '1') {
          list.sort((a, b) => {
            if (!a.paymentTime || !b.paymentTime) return 0;
            return (
              new Date(b.paymentTime).getTime() -
              new Date(a.paymentTime).getTime()
            );
          });
        }

        setDataSource((dataSource) => {
          return [...dataSource, ...list];
        });
        setTotal(total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [setDataSource, setLoading, setTotal]
  );

  useEffect(() => {
    getDataSource({ pageNum: 1, pageSize: 10, selectedStatus: '0,7' });
  }, [getDataSource]);

  const items: TabsProps['items'] = [
    {
      key: '0,7',
      label: <Trans i18nKey={LOCALS.pending_payment}></Trans>,
    },
    {
      key: '1',
      label: <Trans i18nKey={LOCALS.payment_processed}></Trans>,
    },
    {
      key: 'all',
      label: <Trans i18nKey={LOCALS.all_orders}></Trans>,
    },
  ];

  const onChange = useCallback(
    async (key: string) => {
      setSelectedStatus(key);
      setPageNum(1);
      setDataSource([]);
      setIsChanging(true);
      await getDataSource({
        pageNum: 1,
        pageSize: 10,
        selectedStatus: key,
      });
      setIsChanging(false);
    },
    [getDataSource, setDataSource, setPageNum]
  );

  return (
    <div>
      <Tabs
        activeKey={selectedStatus}
        centered
        items={items}
        onChange={onChange}
      />

      <p className="mb-4 text-base">
        {i18n.t(LOCALS.order_total) || '订单合计'}：
        <span className="text-red-500">{total}</span>
      </p>

      {dataSource.map(
        ({ id, orderItemList, status, orderSn, createTime, payAmount }) => {
          const [firstOrderItem] = orderItemList;
          const { productPic, productId, productName, productSnDes } =
            firstOrderItem;

          return (
            <div
              key={id}
              className="mb-4 border-b border-gray-300 pb-2 last-of-type:mb-0"
            >
              <div key={productId} className="mb-2 last-of-type:mb-0">
                <div className="mb-1 flex items-center justify-between">
                  <span>{productName}</span>
                  <span className="text-gray-500 text-xs">
                    {i18n.t(LOCALS.product_sn) || '商品编号'}：{productSnDes}
                  </span>
                </div>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    navigate(`/oms/order-view/${id}`);
                  }}
                >
                  <img
                    src={productPic || img404}
                    className="w-24"
                    alt={productName}
                  />
                  <div className="text-xs ml-4">
                    <div className="mb-1">
                      {i18n.t(LOCALS.order_status) || '订单状态'}：
                      <Tag color={ORDER_STATUS_ANTD_TAG_COLOR_MAP[status]}>
                        {findLabelByValue(status, orderStatusOptions)}
                      </Tag>
                    </div>
                    <div className="mb-1">
                      {i18n.t(LOCALS.order_sn) || '订单编号'}：{orderSn}
                    </div>
                    <div className="mb-1">
                      {i18n.t(LOCALS.submission_time) || '提交时间'}：
                      {formatTime(createTime)}
                    </div>
                    <div>
                      {' '}
                      {i18n.t(LOCALS.pay_amount) || '商品售价'}：￥
                      {payAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      )}

      <InfiniteScroll
        loadMore={() => {
          setPageNum(pageNum + 1);
          return getDataSource({
            pageNum: pageNum + 1,
            pageSize,
            selectedStatus,
          });
        }}
        hasMore={!isChanging && dataSource.length < total}
      />
    </div>
  );
};

export default OrderListMobile;
