import { OmsOrderDetail, OmsOrderPayment } from 'types/oms';
import styles from './index.module.scss';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import Table, { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import LOCALS from 'commons/locals';
import { Trans } from 'react-i18next';
import formatTime from 'utils/formatTime';
import { findLabelByValue } from 'commons/options';
import { CRYPTO_PAY_TYPE_LIST } from 'commons';
import i18n from 'i18next';
import { Button, Modal } from 'antd';
import { getTripleaPaymentDetail } from 'apis/oms';
import CopyButton from 'components/copy-button';
import JSONViewer from 'components/simple-json-viewer';

type Props = {
  omsOrderDetail: OmsOrderDetail;
};

const CryptoPaymentRecord = ({ omsOrderDetail: { payList } }: Props) => {
  const { payStatusOptions } = useAppSelector(selectGlobalInfo);
  const cryptoPayList = payList
    ? payList.filter(({ payType }) => {
        return [...CRYPTO_PAY_TYPE_LIST].includes(payType);
      })
    : [];

  const getCryptoAmount = (extJsonNew: OmsOrderPayment['extJsonNew']) => {
    if (!extJsonNew) {
      return '-';
    }

    try {
      const obj = JSON.parse(extJsonNew);
      const crypto_currency = obj?.notifyCallbackRes?.crypto_currency;
      const crypto_amount = obj?.notifyCallbackRes?.crypto_amount;

      if (!crypto_currency || !crypto_amount) {
        return '-';
      }

      return `${crypto_currency} ${crypto_amount}`;
    } catch (err) {}
  };

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalData, setDetailModalData] = useState<any>();

  const columns: ColumnsType<OmsOrderPayment> = useMemo(() => {
    return [
      {
        title: <Trans i18nKey={LOCALS.payment_channel}></Trans>,
        dataIndex: 'payType',
        key: 'payType',
        width: 130,
      },
      {
        title: <Trans i18nKey={LOCALS.pay_amount}></Trans>,
        key: 'payAmount',
        width: 100,
        render: ({ payAmount, payCurrency }: OmsOrderPayment) => {
          return `${payCurrency} ${payAmount}`;
        },
      },
      {
        title: <Trans i18nKey={LOCALS.payment_status}></Trans>,
        dataIndex: 'payStatus',
        key: 'payStatus',
        width: 90,
        render: (payStatus: OmsOrderPayment['payStatus']) => {
          return payStatus
            ? findLabelByValue(+payStatus, payStatusOptions)
            : '-';
        },
      },
      {
        title: i18n.t(LOCALS.third_party_transaction_id),
        dataIndex: 'tradeNo',
        key: 'tradeNo',
        width: 130,
        render: (tradeNo: OmsOrderPayment['tradeNo']) => {
          return tradeNo;
        },
      },
      {
        title: i18n.t(LOCALS.payment_link),
        dataIndex: 'extJsonNew',
        key: 'hostedUrl',
        width: 130,
        render: (extJsonNew: OmsOrderPayment['extJsonNew']) => {
          if (!extJsonNew) {
            return '-';
          }

          try {
            const obj = JSON.parse(extJsonNew);
            return (
              <CopyButton
                copyText={obj.createPaymentRes.hosted_url}
              ></CopyButton>
            );
          } catch (err) {}
        },
      },
      {
        title: i18n.t(LOCALS.cryptocurrency_amount),
        dataIndex: 'extJsonNew',
        key: 'cryptoAmount',
        width: 130,
        render: (extJsonNew: OmsOrderPayment['extJsonNew']) => {
          return getCryptoAmount(extJsonNew);
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
      {
        title: <Trans i18nKey={LOCALS.option}></Trans>,
        key: 'operation',
        width: 130,
        render: ({ tradeNo }: OmsOrderPayment) => {
          return (
            <div>
              <Button
                type="link"
                onClick={() => {
                  tradeNo &&
                    getTripleaPaymentDetail(tradeNo).then((res) => {
                      setDetailModalData(res);
                      setDetailModalOpen(true);
                    });
                }}
              >
                <Trans i18nKey={LOCALS.view}></Trans>
              </Button>
            </div>
          );
        },
      },
    ];
  }, [payStatusOptions]);

  if (!cryptoPayList.length) {
    return null;
  }

  return (
    <div>
      <div className={styles.title}>
        {i18n.t(LOCALS.cryptocurrency_payment_records)}
      </div>
      <Table
        rowKey={'id'}
        tableLayout="fixed"
        pagination={false}
        columns={columns}
        dataSource={cryptoPayList}
      />

      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        width="800px"
      >
        <JSONViewer data={detailModalData}></JSONViewer>
      </Modal>
    </div>
  );
};

export default CryptoPaymentRecord;
