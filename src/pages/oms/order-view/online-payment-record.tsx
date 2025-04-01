import { OmsOrderDetail, OmsOrderPayment } from 'types/oms';
import styles from './index.module.scss';
import LOCALS from 'commons/locals';
import { Trans } from 'react-i18next';
import Table, { ColumnsType } from 'antd/es/table';
import { CRYPTO_PAY_TYPE_LIST, OFFLINE_PAY_TYPE_LIST } from 'commons';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { findLabelByValue, SHOP_MAP } from 'commons/options';
import formatTime from 'utils/formatTime';
import { useDescProps } from 'commons/hooks/useDescProps';
import { Descriptions } from 'antd';
import { financialManagementAccountList } from 'apis/fms';
import { FmsAccountManagement } from 'types/fms';

type OnlinePaymentRecordProps = {
  omsOrderDetail: OmsOrderDetail;
};

const OnlinePaymentRecord = ({
  omsOrderDetail: { payList, createdFrom },
}: OnlinePaymentRecordProps) => {
  const isMobile = false;
  const [paymentAccountList, setPaymentAccountList] = useState<
    FmsAccountManagement[]
  >([]);

  useEffect(() => {
    if (![SHOP_MAP.GINZA].includes(createdFrom)) return;

    financialManagementAccountList(createdFrom).then((res) => {
      setPaymentAccountList(res);
    });
  }, [createdFrom]);

  const { payStatusOptions } = useAppSelector(selectGlobalInfo);

  const columns: ColumnsType<OmsOrderPayment> = useMemo(() => {
    return [
      {
        title: <Trans i18nKey={LOCALS.payment_channel}></Trans>,
        dataIndex: 'payType',
        key: 'payType',
        width: 100,
        render(payType: OmsOrderPayment['payType']) {
          return (
            paymentAccountList.find((i) => i.accountCode === payType)
              ?.accountName || payType
          );
        },
      },
      {
        title: <Trans i18nKey={LOCALS.pay_amount}></Trans>,
        dataIndex: 'payAmount',
        key: 'payAmount',
        width: 100,
        render: (payAmount: OmsOrderPayment['payAmount']) => {
          return (payAmount || '').toLocaleString();
        },
      },
      {
        title: <Trans i18nKey={LOCALS.currency}></Trans>,
        dataIndex: 'payCurrency',
        key: 'payCurrency',
        width: 80,
        render: (payCurrency: OmsOrderPayment['payCurrency']) => {
          return payCurrency || '-';
        },
      },
      {
        title: <Trans i18nKey={LOCALS.payment_status}></Trans>,
        dataIndex: 'payStatus',
        key: 'payStatus',
        width: 130,
        render: (payStatus: OmsOrderPayment['payStatus']) => {
          return payStatus
            ? findLabelByValue(+payStatus, payStatusOptions)
            : '-';
        },
      },
      {
        title: <Trans i18nKey={LOCALS.created_time}></Trans>,
        dataIndex: 'createTime',
        key: 'createTime',
        width: 130,
        render: (createTime: OmsOrderPayment['createTime']) => {
          return formatTime(createTime);
        },
      },
      {
        title: <Trans i18nKey={LOCALS.payment_time}></Trans>,
        dataIndex: 'payTime',
        key: 'payTime',
        width: 130,
        render: (payTime: OmsOrderPayment['payTime']) => {
          return formatTime(payTime);
        },
      },
    ];
  }, [payStatusOptions, paymentAccountList]);

  const onlinePayList = payList
    ? payList.filter(({ payType }) => {
        return ![...OFFLINE_PAY_TYPE_LIST, ...CRYPTO_PAY_TYPE_LIST].includes(
          payType
        );
      })
    : [];

  const descProps = useDescProps({});

  if (!onlinePayList.length) {
    return null;
  }

  return (
    <div className="mb-3">
      {isMobile ? (
        <>
          <Descriptions
            title={<Trans i18nKey={LOCALS.online_payment_record} />}
          ></Descriptions>
          {onlinePayList.map((d) => (
            <div className="mb-2" key={d.id}>
              <Descriptions bordered {...descProps}>
                <Descriptions.Item
                  label={<Trans i18nKey={LOCALS.payment_channel} />}
                >
                  {paymentAccountList.find((i) => i.accountCode === d.payType)
                    ?.accountName || d.payType}
                </Descriptions.Item>

                <Descriptions.Item
                  label={<Trans i18nKey={LOCALS.pay_amount} />}
                >
                  {(d.payAmount || '').toLocaleString()}
                </Descriptions.Item>

                <Descriptions.Item label={<Trans i18nKey={LOCALS.currency} />}>
                  {d.payCurrency}
                </Descriptions.Item>

                <Descriptions.Item
                  label={<Trans i18nKey={LOCALS.payment_status} />}
                >
                  {d.payStatus
                    ? findLabelByValue(d.payStatus, payStatusOptions)
                    : '-'}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<Trans i18nKey={LOCALS.payment_time} />}
                >
                  {formatTime(d.payTime)}
                </Descriptions.Item>
              </Descriptions>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className={styles.title}>
            <Trans i18nKey={LOCALS.online_payment_record} />
          </div>
          <Table
            bordered
            size="small"
            rowKey={'id'}
            tableLayout="fixed"
            pagination={false}
            columns={columns}
            dataSource={onlinePayList}
          />
        </>
      )}
    </div>
  );
};

export default OnlinePaymentRecord;
