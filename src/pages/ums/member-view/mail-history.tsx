import { UmsMember, UmsMemberMail } from 'types/ums';
import styles from './index.module.scss';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { umsMemberMailSearch } from 'apis/ums';
import usePagination from 'commons/hooks/usePagination';
import { PageQuery } from 'types/base';
import Table, { ColumnsType } from 'antd/es/table';
import formatTime from 'utils/formatTime';
import showTotal from 'components/show-total';
import { Button, Modal } from 'antd';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';
import MobileList from 'components/descriptions-mobile-list';
import type { ColumnsProps } from 'components/descriptions-mobile-list';

const MemberMailHistory = ({ memberId }: { memberId: UmsMember['id'] }) => {
  const [content, setContent] = useState('');
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
  } = usePagination<UmsMemberMail>();

  const getDataSource = useCallback(
    async ({ pageNum, pageSize }: PageQuery) => {
      try {
        setLoading(true);
        const {
          data: { list, total },
        } = await umsMemberMailSearch({
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
        title: i18n.t(LOCALS.subject),
        key: 'subject',
        dataIndex: 'subject',
        width: 200,
      },
      {
        title: i18n.t(LOCALS.content),
        key: 'content',
        dataIndex: 'content',
        width: 100,
        render: (content: UmsMemberMail['content']) => {
          return (
            <Button
              type="link"
              onClick={() => {
                setContent(content);
              }}
            >
              {i18n.t(LOCALS.view)}
            </Button>
          );
        },
      },
      {
        title: i18n.t(LOCALS.send_time),
        dataIndex: 'sendTime',
        width: 200,
        key: 'sendTime',
        render: (sendTime: UmsMemberMail['sendTime']) => {
          return formatTime(sendTime);
        },
      },
    ];
  }, []);

  const columns: ColumnsType<UmsMemberMail> = useMemo(
    () => getColumns(),
    [getColumns]
  );

  const mobColumns: ColumnsProps<UmsMemberMail> = useMemo(
    () => getColumns(),
    [getColumns]
  );

  return (
    <div>
      <div className={styles.title}>{i18n.t(LOCALS.email_history)}</div>

      <Modal
        open={!!content}
        onCancel={() => {
          setContent('');
        }}
      >
        <p dangerouslySetInnerHTML={{ __html: content }}></p>
      </Modal>

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
          tableLayout="fixed"
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

export default MemberMailHistory;
