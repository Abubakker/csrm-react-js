import { OmsOrderDetail } from 'types/oms';
import styles from './index.module.scss';
import { Trans } from 'react-i18next';
import LOCALS from 'commons/locals';
import { umsMemberPointHistorySearch } from 'apis/ums';
import { useEffect, useMemo, useState } from 'react';
import { UmsMemberPointHistory } from 'types/ums';
import formatTime from 'utils/formatTime';
import Table, { ColumnsType } from 'antd/es/table';
import { useDescProps } from 'commons/hooks/useDescProps';
import { Descriptions } from 'antd';

type OrderPointHistoriesProps = {
  orderId: OmsOrderDetail['id'];
};

const OrderPointHistories = ({ orderId }: OrderPointHistoriesProps) => {
  const isMobile = false;

  const [pointHistoryList, setPointHistoryList] = useState<
    UmsMemberPointHistory[]
  >([]);

  useEffect(() => {
    umsMemberPointHistorySearch({ pageNum: 1, pageSize: 100, orderId }).then(
      (res) => {
        setPointHistoryList(res.data.list);
      }
    );
  }, [orderId]);

  const columns: ColumnsType<UmsMemberPointHistory> = useMemo(() => {
    return [
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

  const descProps = useDescProps({});

  if (pointHistoryList.length === 0) return null;

  return (
    <div className="mb-3">
      {isMobile ? (
        <>
          <div>
            <Descriptions
              title={<Trans i18nKey={LOCALS.point_history} />}
            ></Descriptions>
            {pointHistoryList.map((d) => (
              <div className="mb-2" key={d.id}>
                <Descriptions bordered {...descProps}>
                  <Descriptions.Item
                    label={<Trans i18nKey={LOCALS.change_amount} />}
                  >
                    {d.changeCount}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<Trans i18nKey={LOCALS.operator} />}
                  >
                    {d.operateMan}
                  </Descriptions.Item>
                  <Descriptions.Item label={<Trans i18nKey={LOCALS.note} />}>
                    {d.operateNote}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<Trans i18nKey={LOCALS.created_time} />}
                  >
                    {formatTime(d.createTime)}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={styles.title}>
            <Trans i18nKey={LOCALS.point_history} />
          </div>
          <Table
            size="small"
            bordered
            pagination={false}
            rowKey={'id'}
            style={{
              marginTop: 12,
            }}
            dataSource={pointHistoryList}
            columns={columns}
          />
        </>
      )}
    </div>
  );
};

export default OrderPointHistories;
