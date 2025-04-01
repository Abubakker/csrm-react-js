import { UmsMember, UmsMemberPointHistory } from 'types/ums';
import styles from './index.module.scss';
import LOCALS from 'commons/locals';
import { Trans } from 'react-i18next';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  message,
} from 'antd';
import usePagination from 'commons/hooks/usePagination';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageQuery } from 'types/base';
import { umsMemberPointHistorySearch, umsMemberPointUpdate } from 'apis/ums';
import { ColumnsType } from 'antd/es/table';
import showTotal from 'components/show-total';
import formatTime from 'utils/formatTime';
import LinkButton from 'components/link-button';
import i18n from 'i18n';
import {
  MEMBER_UPDATE_POINT_TYPE_MAP,
  MEMBER_UPDATE_POINT_TYPE_OPTION_LIST,
} from 'commons/options';
import MobileList from 'components/descriptions-mobile-list';
import type { ColumnsProps } from 'components/descriptions-mobile-list';
import useResource from 'commons/hooks/useResource';

type MemberPointHistoryProps = {
  memberId: UmsMember['id'];
};

const MemberPointHistory = ({ memberId }: MemberPointHistoryProps) => {
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
  } = usePagination<UmsMemberPointHistory>();

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const memberChangePointResource = useResource('member-change-point');

  const onOk = useCallback(async () => {
    const data = await form.validateFields();

    Modal.confirm({
      title: <Trans i18nKey={LOCALS.confirm_submit} />,
      onOk: async () => {
        await umsMemberPointUpdate({
          memberId,
          ...data,
        });

        message.success(i18n.t(LOCALS.successful_operation));
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
    });
  }, [form, memberId]);

  const getDataSource = useCallback(
    async ({ pageNum, pageSize }: PageQuery) => {
      try {
        setLoading(true);
        const {
          data: { list, total },
        } = await umsMemberPointHistorySearch({
          memberId,
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
        title: <Trans i18nKey={LOCALS.order_sn}></Trans>,
        dataIndex: 'orderSn',
        key: 'orderSn',
        render: (
          orderSn: UmsMemberPointHistory['orderSn'],
          { orderId }: UmsMemberPointHistory
        ) => {
          if (!orderId || !orderSn) return '-';
          return (
            <LinkButton href={`/oms/order-view/${orderId}`}>
              {orderSn}
            </LinkButton>
          );
        },
      },
      {
        title: <Trans i18nKey={LOCALS.change_amount}></Trans>,
        dataIndex: 'changeCount',
        key: 'changeCount',
      },
      {
        title: <Trans i18nKey={LOCALS.operator}></Trans>,
        dataIndex: 'operateMan',
        key: 'operateMan',
      },
      {
        title: <Trans i18nKey={LOCALS.note}></Trans>,
        dataIndex: 'operateNote',
        key: 'operateNote',
      },
      {
        title: <Trans i18nKey={LOCALS.created_time}></Trans>,
        dataIndex: 'createTime',
        key: 'createTime',
        render: (createTime: UmsMemberPointHistory['createTime']) => {
          return formatTime(createTime);
        },
      },
    ];
  }, []);

  const columns: ColumnsType<UmsMemberPointHistory> = useMemo(
    () => getColumns(),
    [getColumns]
  );

  const mobColumns: ColumnsProps<UmsMemberPointHistory> = useMemo(
    () => getColumns(),
    [getColumns]
  );

  return (
    <div>
      <Modal
        title={<Trans i18nKey={LOCALS.modify_points} />}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={onOk}
      >
        <Form form={form} labelCol={{ style: { width: 125 } }}>
          <Form.Item
            name="point"
            label={<Trans i18nKey={LOCALS.change_amount} />}
            initialValue={0}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="type"
            hidden
            label={<Trans i18nKey={LOCALS.type} />}
            initialValue={MEMBER_UPDATE_POINT_TYPE_MAP.SYSTEM}
            rules={[{ required: true }]}
          >
            <Select options={MEMBER_UPDATE_POINT_TYPE_OPTION_LIST} />
          </Form.Item>

          <Form.Item
            name="operateNote"
            label={<Trans i18nKey={LOCALS.remark} />}
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>
        </Form>
      </Modal>
      <div
        className={styles.title}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Trans i18nKey={LOCALS.point_history} />
        {memberChangePointResource && (
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trans i18nKey={LOCALS.modify_points} />
          </Button>
        )}
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

export default MemberPointHistory;
