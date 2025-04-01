import { Button, Form, Select, Space } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import SmsApi, { SmsCoupon, SmsCouponHistory } from 'apis/sms';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import {
  findLabelByValue,
  SMS_COUPON_HISTORY_STATUS_OPTION_LIST,
  SMS_COUPON_TYPE_OPTION_LIST,
} from 'commons/options';
import i18n from 'i18n';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { PageQuery } from 'types/base';
import formatTime from 'utils/formatTime';
import setQueryParameters from 'utils/setQueryParameters';

const CouponHistoryListPage = () => {
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
  } = usePagination<SmsCouponHistory>();

  const [smsCouponList, setsmsCouponList] = useState<SmsCoupon[]>([]);
  useEffect(() => {
    SmsApi.getCouponList({ pageNum: 1, pageSize: 100 }).then((res) => {
      setsmsCouponList(res.list);
    });
  }, []);

  const [form] = Form.useForm<{
    couponId?: number;
    useStatus?: number;
  }>();

  const getDataSource = useCallback(
    async ({ pageNum, pageSize }: PageQuery) => {
      const { couponId, useStatus } = form.getFieldsValue();
      const data = {
        pageNum,
        pageSize,
        couponId,
        useStatus,
      };
      setQueryParameters(data);

      try {
        setLoading(true);
        const { list, total } = await SmsApi.getCouponHistoryList(data);

        setDataSource(list);
        setTotal(total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [form, setDataSource, setLoading, setTotal]
  );

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    if (parsed.couponId)
      // @ts-ignore
      parsed.couponId = +parsed.couponId;

    if (parsed.useStatus)
      // @ts-ignore
      parsed.useStatus = +parsed.useStatus;

    form.setFieldsValue(parsed);

    const pageNum = parsed.pageNum ? +parsed.pageNum : 1;
    const pageSize = parsed.pageSize ? +parsed.pageSize : 10;
    setPageNum(pageNum);
    setPageSize(pageSize);

    getDataSource({ pageNum, pageSize });
  }, [form, getDataSource, setPageNum, setPageSize]);

  const columns: ColumnsType<SmsCouponHistory> = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '领取会员',
        dataIndex: 'umsMember',
        key: 'member',
        render(umsMember: SmsCouponHistory['umsMember']) {
          if (!umsMember) return '-';

          const { firstName, lastName, email, id } = umsMember;
          return (
            <a href={`/ums/member-view/${id}`}>
              {firstName && lastName ? `${firstName} ${lastName}` : email}
            </a>
          );
        },
      },
      {
        title: '关联订单',
        key: 'order',
        render(smsCouponHistory: SmsCouponHistory) {
          const { orderId, orderSn } = smsCouponHistory;
          if (!orderSn || !orderId) return '-';
          return <a href={`/oms/order-view/${orderId}`}>{orderSn}</a>;
        },
      },
      {
        title: '当前状态',
        dataIndex: 'useStatus',
        key: 'useStatus',
        render(useStatus: SmsCouponHistory['useStatus']) {
          return findLabelByValue(
            useStatus,
            SMS_COUPON_HISTORY_STATUS_OPTION_LIST
          );
        },
      },
      {
        title: '优惠券名称',
        key: 'name',
        render(smsCouponHistory: SmsCouponHistory) {
          return (
            <a href={`/sms/coupon-detail?id=${smsCouponHistory.smsCoupon.id}`}>
              {smsCouponHistory.smsCoupon.name}
            </a>
          );
        },
      },
      {
        title: '优惠券 Code',
        dataIndex: 'couponCode',
        key: 'couponCode',
      },
      {
        title: '优惠券类型',
        dataIndex: 'smsCoupon',
        key: 'type',
        width: 150,
        render: (smsCoupon: SmsCouponHistory['smsCoupon']) => {
          return findLabelByValue(smsCoupon.type, SMS_COUPON_TYPE_OPTION_LIST);
        },
      },
      {
        title: '优惠券面额',
        dataIndex: 'smsCoupon',
        key: 'amount',
        render: (smsCoupon: SmsCouponHistory['smsCoupon']) => {
          return `￥${
            smsCoupon.amount ? smsCoupon.amount.toLocaleString() : '-'
          }`;
        },
      },
      {
        title: '使用门槛',
        dataIndex: 'smsCoupon',
        key: 'minPoint',
        render: (smsCoupon: SmsCouponHistory['smsCoupon']) => {
          return `￥${smsCoupon.minPoint ? smsCoupon.minPoint.toLocaleString() : '-'}`;
        },
      },
      {
        title: '使用期限',
        dataIndex: 'smsCoupon',
        key: 'duration',
        render(smsCoupon: SmsCouponHistory['smsCoupon']) {
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
        title: '领取时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render(createTime: SmsCouponHistory['createTime']) {
          return formatTime(createTime);
        },
      },
      {
        title: '使用时间',
        dataIndex: 'useTime',
        key: 'useTime',
        render(useTime: SmsCouponHistory['useTime']) {
          return formatTime(useTime);
        },
      },
    ];
  }, []);

  const onFinish = useCallback(async () => {
    setPageNum(1);
    getDataSource({ pageNum: 1, pageSize });
  }, [getDataSource, pageSize, setPageNum]);

  const onReset = useCallback(() => {
    form.resetFields();
    onFinish();
  }, [form, onFinish]);

  return (
    <div>
      <Form form={form} onFinish={onFinish} layout="inline">
        <Form.Item name="couponId" label="优惠券">
          <Select
            placeholder={i18n.t(LOCALS.please_select) || ''}
            style={{ minWidth: 360 }}
            options={smsCouponList.map(({ id, name }) => {
              return {
                value: id,
                label: name,
              };
            })}
          />
        </Form.Item>

        <Form.Item name="useStatus" label="使用状态">
          <Select
            placeholder={i18n.t(LOCALS.please_select) || ''}
            style={{ minWidth: 180 }}
            options={SMS_COUPON_HISTORY_STATUS_OPTION_LIST.map(
              ({ value, label }) => {
                return {
                  value,
                  label,
                };
              }
            )}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              <Trans i18nKey={LOCALS.search} />
            </Button>

            <Button htmlType="button" onClick={onReset}>
              <Trans i18nKey={LOCALS.reset} />
            </Button>
          </Space>
        </Form.Item>
      </Form>
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

export default CouponHistoryListPage;
