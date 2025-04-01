import { OmsOrderDetail, OmsOrderOperateHistory } from 'types/oms';
import styles from './index.module.scss';
import LOCALS from 'commons/locals';
import { Trans } from 'react-i18next';
import { useMemo } from 'react';
import { ColumnsType } from 'antd/es/table';
import formatTime from 'utils/formatTime';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { findLabelByValue } from 'commons/options';
import { useDescProps } from 'commons/hooks/useDescProps';
import { Table, Descriptions } from 'antd';

type OrderOperateNotesProps = {
  omsOrderDetail: OmsOrderDetail;
};

const OrderOperateHistories = ({
  omsOrderDetail: { historyList },
}: OrderOperateNotesProps) => {
  const { orderStatusOptions } = useAppSelector(selectGlobalInfo);

  const columns: ColumnsType<OmsOrderOperateHistory> = useMemo(() => {
    return [
      {
        title: <Trans i18nKey={LOCALS.operator} />,
        dataIndex: 'operateMan',
        key: 'operateMan',
      },
      {
        title: <Trans i18nKey={LOCALS.created_time} />,
        dataIndex: 'createTime',
        key: 'createTime',
        render: (createTime: OmsOrderOperateHistory['createTime']) => {
          return formatTime(createTime);
        },
      },
      {
        title: <Trans i18nKey={LOCALS.order_status} />,
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        render: (orderStatus: OmsOrderOperateHistory['orderStatus']) => {
          return findLabelByValue(orderStatus, orderStatusOptions);
        },
      },
      {
        title: <Trans i18nKey={LOCALS.note} />,
        dataIndex: 'note',
        key: 'note',
        render(note: OmsOrderOperateHistory['note']) {
          return <div className="whitespace-pre-line">{note}</div>;
        },
      },
    ];
  }, [orderStatusOptions]);

  const isMobile = false;
  const descProps = useDescProps({});

  if (historyList?.length === 0) return null;
  return (
    <div className="mb-3">
      {isMobile ? (
        <>
          <Descriptions
            title={<Trans i18nKey={LOCALS.operate_histories} />}
          ></Descriptions>
          {historyList &&
            historyList.map((d) => (
              <div className="mb-2" key={d.id}>
                <Descriptions bordered {...descProps}>
                  <Descriptions.Item
                    label={<Trans i18nKey={LOCALS.operator} />}
                  >
                    {d.operateMan}
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={<Trans i18nKey={LOCALS.created_time} />}
                  >
                    {formatTime(d.createTime)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<Trans i18nKey={LOCALS.order_status} />}
                  >
                    {findLabelByValue(d.orderStatus, orderStatusOptions)}
                  </Descriptions.Item>
                  <Descriptions.Item label={<Trans i18nKey={LOCALS.note} />}>
                    {d.note}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ))}
        </>
      ) : (
        <>
          <div className={styles.title}>
            <Trans i18nKey={LOCALS.operate_histories} />
          </div>

          <Table
            bordered
            size="small"
            tableLayout="fixed"
            rowKey={'id'}
            pagination={false}
            columns={columns}
            dataSource={historyList || []}
          />
        </>
      )}
    </div>
  );
};

export default OrderOperateHistories;
