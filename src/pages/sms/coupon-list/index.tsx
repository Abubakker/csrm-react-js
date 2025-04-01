import { Button } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import SmsApi, { SmsCoupon } from 'apis/sms';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import { findLabelByValue, SMS_COUPON_TYPE_OPTION_LIST } from 'commons/options';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { PageQuery } from 'types/base';
import formatTime from 'utils/formatTime';
import setQueryParameters from 'utils/setQueryParameters';

const CouponListPage = () => {
  const {
    loading,
    setLoading,
    total,
    setTotal,
    pageNum,
    pageSize,
    setPageSize,
    setPageNum,
    dataSource,
    setDataSource,
  } = usePagination<SmsCoupon>();

  const getDataSource = useCallback(
    async ({ pageNum, pageSize }: PageQuery) => {
      const data = {
        pageNum,
        pageSize,
      };

      setQueryParameters(data);

      try {
        setLoading(true);
        const { list, total } = await SmsApi.getCouponList(data);

        setDataSource(list);
        setTotal(total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [setDataSource, setLoading, setTotal]
  );

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    const pageNum = parsed.pageNum ? +parsed.pageNum : 1;
    const pageSize = parsed.pageSize ? +parsed.pageSize : 10;
    setPageNum(pageNum);
    setPageSize(pageSize);

    getDataSource({ pageNum, pageSize });
  }, [getDataSource, setPageNum, setPageSize]);

  const columns: ColumnsType<SmsCoupon> = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: '优惠券名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '优惠券 Code',
        dataIndex: 'code',
        key: 'code',
        width: 150,
      },
      {
        title: '优惠券类型',
        dataIndex: 'type',
        key: 'type',
        width: 150,
        render: (type: SmsCoupon['type']) => {
          return findLabelByValue(type, SMS_COUPON_TYPE_OPTION_LIST);
        },
      },
      {
        title: '优惠券面额',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount: SmsCoupon['amount']) => {
          return `￥${amount ? amount.toLocaleString() : '-'}`;
        },
      },
      {
        title: '使用门槛',
        dataIndex: 'minPoint',
        key: 'minPoint',
        render: (minPoint: SmsCoupon['minPoint']) => {
          return `￥${minPoint ? minPoint.toLocaleString() : '-'}`;
        },
      },
      {
        title: '使用期限',
        key: 'duration',
        render(smsCoupon: SmsCoupon) {
          const { startTime, endTime } = smsCoupon;

          return (
            <div>
              {formatTime(startTime)}
              <br />
              {formatTime(endTime)}
            </div>
          );
        },
      },
      {
        title: '备注',
        dataIndex: 'note',
        key: 'note',
        render(note: SmsCoupon['note']) {
          return <div className="whitespace-pre-line">{note}</div>;
        },
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        fixed: 'right',
        width: 220,
        render: ({ id }: SmsCoupon) => {
          return (
            <div>
              <Button
                type="link"
                onClick={() => {
                  window.location.href = `/sms/coupon-detail/${id}`;
                }}
              >
                <Trans i18nKey={LOCALS.view} />
              </Button>
            </div>
          );
        },
      },
    ];
  }, []);

  return (
    <div>
      <Table
        tableLayout="fixed"
        bordered
        pagination={{
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
    </div>
  );
};

export default CouponListPage;
