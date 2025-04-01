import { Trans } from 'react-i18next';
import LOCALS from 'commons/locals';
import styles from './index.module.scss';
import { getUmsMemberMailList } from 'apis/ums';
import { useEffect, useState } from 'react';
import { UmsMemberMail } from 'types/ums';
import i18n from 'i18n';
import { Button, Modal, Table } from 'antd';
import formatTime from 'utils/formatTime';

const OrderEmailHistory = ({ orderId }: { orderId: number }) => {
  const [pageNum] = useState(1);
  const [pageSize] = useState(100);
  const [data, setData] = useState<UmsMemberMail[]>([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    getUmsMemberMailList({ orderId, pageNum, pageSize }).then((res) => {
      setData(res.list);
    });
  }, [orderId, pageNum, pageSize]);

  const columns = [
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

  if (data.length === 0) return null;

  return (
    <div className="mb-3">
      <div className={styles.title}>
        <Trans i18nKey={LOCALS.email_history} />
      </div>

      <Modal
        open={!!content}
        onCancel={() => {
          setContent('');
        }}
      >
        <p dangerouslySetInnerHTML={{ __html: content }}></p>
      </Modal>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
};

export default OrderEmailHistory;
