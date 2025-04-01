import { Button, Form, Input, Space, Switch, DatePicker, message } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { getIntegralList, getIntegralEdit } from 'apis/ums';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import {
  UmsIntegralType,
  UmsIntegralPayload,
  UmsIntegralEditPayload,
} from 'types/ums';
import useIsMobile from 'commons/hooks/useIsMobile';
import i18n from 'i18n';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import EditModal from './edit-modal';
import { INTEGRAL_MAP } from 'commons/options';
import { thousands } from 'utils/tools';

const { RangePicker } = DatePicker;

const IntegralList = () => {
  const [form] = Form.useForm<UmsIntegralPayload & { time: Dayjs[] }>();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { loading, setLoading, dataSource, setDataSource } =
    usePagination<UmsIntegralType>();
  const [open, setOpen] = useState(false);

  const getDataSource = useCallback(
    async (payload?: UmsIntegralPayload) => {
      try {
        setLoading(true);
        const data = await getIntegralList({
          ...payload,
        });
        setDataSource(data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [setDataSource, setLoading]
  );

  useEffect(() => {
    getDataSource();
  }, [getDataSource]);

  const updateStatus = useCallback(
    async (payload: UmsIntegralEditPayload) => {
      try {
        await getIntegralEdit(payload);
        message.success(i18n.t('successful_operation'));
        getDataSource();
      } catch (err) {}
    },
    [getDataSource]
  );

  const columns: ColumnsType<UmsIntegralType> = useMemo(() => {
    return [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: i18n.t('pointsName'),
        key: 'name',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: i18n.t('pointsQuantity'),
        key: 'points',
        dataIndex: 'points',
        render: (_: any, { points, pointsRate, type }: UmsIntegralType) =>
          type === INTEGRAL_MAP.REGISTRATION
            ? thousands(points)
            : `${pointsRate} ${i18n.t('multiplier')}`,
      },
      {
        title: i18n.t('activityPeriod'),
        key: 'at',
        dataIndex: 'at',
        render: (_: any, { endAt, startAt }: UmsIntegralType) =>
          `${dayjs(startAt).format('YYYY-MM-DD')}~${dayjs(endAt).format(
            'YYYY-MM-DD'
          )}`,
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        render: (
          status: UmsIntegralType['status'],
          record: UmsIntegralType
        ) => (
          <Switch
            checked={Boolean(status)}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            onChange={(e) => {
              updateStatus({ ...record, status: Number(e) });
            }}
          />
        ),
      },
      {
        title: '创建时间',
        key: 'createAt',
        dataIndex: 'createAt',
        render: (record: UmsIntegralType['createAt']) =>
          dayjs(record).format('YYYY-MM-DD'),
      },
      {
        title: '操作',
        key: 'opt',
        dataIndex: 'opt',
        render: (_, { id }: UmsIntegralType) => (
          <Button
            type="link"
            onClick={() => navigate(`/sms/integral-detail/${id}`)}
          >
            详情
          </Button>
        ),
      },
    ];
  }, [navigate, updateStatus]);

  const onFinish = async () => {
    const { time, name } = form.getFieldsValue();
    const payload: UmsIntegralPayload = { name };
    if (time && time.length) {
      payload.startDate = time[0].startOf('day').format();
      payload.endDate = time[1].endOf('day').format();
    }
    getDataSource(payload);
  };

  return (
    <div>
      <div>
        <Form
          form={form}
          layout={isMobile ? 'vertical' : 'inline'}
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label={<Trans i18nKey={LOCALS.keyword}></Trans>}
          >
            <Input.TextArea placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>

          <Form.Item
            name="time"
            label={<Trans i18nKey={LOCALS.created_time} />}
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
              <Button
                htmlType="button"
                onClick={() => {
                  form.resetFields();
                  onFinish();
                }}
              >
                <Trans i18nKey={LOCALS.reset} />
              </Button>
              <Button onClick={() => setOpen(true)}>
                <Trans i18nKey={LOCALS.add} />
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <Table
        bordered
        tableLayout="fixed"
        pagination={false}
        loading={loading}
        rowKey={'id'}
        style={{
          marginTop: 12,
        }}
        dataSource={dataSource}
        columns={columns}
      />

      {open && (
        <EditModal
          open={open}
          onClose={() => setOpen(false)}
          onLoad={() => getDataSource()}
        />
      )}
    </div>
  );
};

export default IntegralList;
