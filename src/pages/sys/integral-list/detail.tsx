import {
  Button,
  Form,
  Input,
  Space,
  DatePicker,
  Descriptions,
  Divider,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { getIntegralDetail, getIntegralHistory } from 'apis/ums';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { PageQuery } from 'types/base';
import {
  UmsIntegralType,
  UmsIntegralHistoryPayload,
  UmsIntegralHistory,
  UmsIntegralLog,
} from 'types/ums';
import useIsMobile from 'commons/hooks/useIsMobile';
import i18n from 'i18n';
import { useParams } from 'react-router-dom';
import { useDescProps } from 'commons/hooks/useDescProps';
import { thousands } from 'utils/tools';
import classNames from 'classnames';
import EditModal from './edit-modal';
import showTotal from 'components/show-total';
import { INTEGRAL_OPTION_LIST, INTEGRAL_MAP } from 'commons/options';

const { RangePicker } = DatePicker;

const IntegralDetail = () => {
  const isMobile = useIsMobile();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<UmsIntegralHistoryPayload & { time: Dayjs[] }>();
  const [datasourceDetail, setDataSourceDetail] = useState<UmsIntegralType>();
  const {
    loading,
    setLoading,
    dataSource,
    setDataSource,
    pageNum,
    setPageNum,
    pageSize,
    setPageSize,
    total,
    setTotal,
  } = usePagination<UmsIntegralHistory>();
  const [open, setOpen] = useState(false);
  const [logList, setLogList] = useState<UmsIntegralLog[]>([]);

  const getDetail = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getIntegralDetail(Number(id));
      setDataSourceDetail(data);
      setLogList(data.logs);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [id, setLoading]);

  const getHistory = useCallback(
    async (payload: PageQuery & Omit<UmsIntegralHistoryPayload, 'id'>) => {
      setLoading(true);
      try {
        const { list, total } = await getIntegralHistory({
          ...payload,
          id: Number(id),
        });
        setDataSource(list);
        setTotal(total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [id, setDataSource, setLoading, setTotal]
  );

  useEffect(() => {
    getDetail();
    getHistory({
      pageNum: 1,
      pageSize: 10,
    });
  }, [getDetail, getHistory]);

  const onFinish = useCallback(async () => {
    const { time, keyword } = form.getFieldsValue();
    const payload: UmsIntegralHistoryPayload = {
      keyword: keyword || undefined,
      id: Number(id),
    };
    if (time && time.length) {
      payload.startDate = time[0].startOf('day').format();
      payload.endDate = time[1].endOf('day').format();
    }
    setPageNum(1);
    setPageSize(10);
    getHistory({ ...payload, pageNum: 1, pageSize: 10 });
  }, [form, getHistory, id, setPageNum, setPageSize]);

  const columns: ColumnsType<UmsIntegralHistory> = useMemo(() => {
    const orderInfo = {
      title: i18n.t('associated_sales_order'),
      key: 'orderId',
      dataIndex: 'orderId',
      width: '30%',
      render: (_: any, { orderId, orderSn }: UmsIntegralHistory) => (
        <a href={`/oms/order-view/${orderId}`}>{orderSn}</a>
      ),
    };
    const email = {
      title: i18n.t('email'),
      key: 'name',
      dataIndex: 'name',
      width: '30%',
      render: (_: any, { member }: UmsIntegralHistory) =>
        member && <a href={`/ums/member-view/${member.id}`}>{member.email}</a>,
    };
    const createTime = {
      title: i18n.t('collectionTime'),
      key: 'createTime',
      dataIndex: 'createTime',
      width: '30%',
      render: (record: UmsIntegralHistory['createTime']) =>
        dayjs(record).format('YYYY-MM-DD'),
    };
    if (datasourceDetail?.type === INTEGRAL_MAP.ORDER)
      return [email, orderInfo, createTime];
    return [email, createTime];
  }, [datasourceDetail?.type]);

  const LogColumns = useMemo(() => {
    return [
      {
        title: <Trans i18nKey={LOCALS.operator} />,
        dataIndex: 'name',
        key: 'name',
        render: (_: any, { admin }: UmsIntegralLog) => admin && admin.username,
      },
      {
        title: <Trans i18nKey={LOCALS.operation_time} />,
        dataIndex: 'createAt',
        key: 'createAt',
        render: (createAt: UmsIntegralLog['createTime']) =>
          createAt ? dayjs(createAt).format('YYYY-MM-DD HH:mm:ss') : '-',
      },
      {
        title: <Trans i18nKey={LOCALS.option} />,
        dataIndex: 'description',
        key: 'description',
      },
    ];
  }, []);

  return (
    <div>
      <div className="mb-6">
        <Descriptions
          extra={
            <Button type="primary" onClick={() => setOpen(true)}>
              {i18n.t('edit')}
            </Button>
          }
          bordered
          {...useDescProps({})}
        >
          <Descriptions.Item label={i18n.t('pointsName')}>
            {datasourceDetail?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={i18n.t('pointsType')}>
            {INTEGRAL_OPTION_LIST.find(
              (d) => d.value === datasourceDetail?.type
            )?.label || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={i18n.t('activityPeriod')}>
            {dayjs(datasourceDetail?.startAt).format('YYYY-MM-DD')}~
            {dayjs(datasourceDetail?.endAt).format('YYYY-MM-DD')}
          </Descriptions.Item>
          <Descriptions.Item label={i18n.t('pointsQuantity')}>
            {INTEGRAL_MAP.ORDER === datasourceDetail?.type
              ? `${datasourceDetail?.pointsRate} ${i18n.t('multiplier')}`
              : thousands(datasourceDetail?.points)}
          </Descriptions.Item>
          <Descriptions.Item label={i18n.t('status')}>
            {datasourceDetail?.status === 1
              ? i18n.t('enable')
              : i18n.t('disable')}
          </Descriptions.Item>
          <Descriptions.Item label={i18n.t('created_time')}>
            {dayjs(datasourceDetail?.createAt).format('YYYY-MM-DD') || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={i18n.t('note')}>
            {datasourceDetail?.directions || '-'}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div>
        <Form
          form={form}
          layout={isMobile ? 'vertical' : 'inline'}
          onFinish={onFinish}
        >
          <Form.Item
            name="keyword"
            label={<Trans i18nKey={LOCALS.keyword}></Trans>}
          >
            <Input.TextArea placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>

          <Form.Item
            name="time"
            label={<Trans i18nKey={LOCALS.collectionTime} />}
          >
            <RangePicker
              className={classNames('w-full', {
                isMobile: 'w-[220px]',
              })}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                <Trans i18nKey={LOCALS.search} />
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <Table
          bordered
          tableLayout="fixed"
          loading={loading}
          rowKey={'id'}
          style={{
            marginTop: 12,
          }}
          dataSource={dataSource}
          columns={columns}
          pagination={{
            showTotal,
            total,
            pageSize,
            current: pageNum,
            onChange: (page, pageSize) => {
              setPageNum(page);
              setPageSize(pageSize);
              getHistory({ pageNum: page, pageSize });
            },
          }}
        />
      </div>

      <Divider />
      <Table
        bordered
        tableLayout="fixed"
        loading={loading}
        rowKey={'id'}
        style={{
          marginTop: 12,
        }}
        dataSource={logList}
        columns={LogColumns}
        title={() => (
          <div className="font-bold">{i18n.t('operate_histories')}</div>
        )}
      />

      {open && (
        <EditModal
          open={open}
          onClose={() => setOpen(false)}
          data={datasourceDetail}
          onLoad={() => {
            getDetail();
          }}
        />
      )}
    </div>
  );
};

export default IntegralDetail;
