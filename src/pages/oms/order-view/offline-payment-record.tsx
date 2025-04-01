import { Trans } from 'react-i18next';
import { OmsOrderDetail, OmsOrderPayment } from 'types/oms';
import styles from './index.module.scss';
import LOCALS from 'commons/locals';
import { Button, Form, Input, Modal, Space, Table, message, Image } from 'antd';
import { OFFLINE_PAY_TYPE_LIST } from 'commons';
import { useCallback, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import {
  ORDER_STATUS_MAP,
  PAY_STATUS_MAP,
  findLabelByValue,
} from 'commons/options';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import formatTime from 'utils/formatTime';
import i18n from 'i18n';
import { omsOrderOfflinePayAccept, omsOrderOfflinePayReject } from 'apis/oms';

type OfflinePaymentRecordProps = {
  omsOrderDetail: OmsOrderDetail;
};

type OfflinePayConfirmType = 'confirm' | 'reject';

const OfflinePaymentRecord = ({
  omsOrderDetail: { payList, status, id },
}: OfflinePaymentRecordProps) => {
  const { payStatusOptions } = useAppSelector(selectGlobalInfo);
  const [offlinePayConfirmType, setOfflinePayConfirmType] =
    useState<OfflinePayConfirmType>('confirm');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalForm] = Form.useForm();

  const offlinePayList = payList
    ? payList.filter(({ payType }) => {
        return OFFLINE_PAY_TYPE_LIST.includes(payType);
      })
    : [];

  const onModalOk = useCallback(async () => {
    const data = await modalForm.validateFields();

    Modal.confirm({
      title: <Trans i18nKey={LOCALS.confirm_submit} />,
      onOk: async () => {
        if (offlinePayConfirmType === 'confirm') {
          await omsOrderOfflinePayAccept({
            orderId: id,
            ...data,
          });
        }

        if (offlinePayConfirmType === 'reject') {
          await omsOrderOfflinePayReject({
            orderId: id,
            ...data,
          });
        }

        message.success(i18n.t(LOCALS.successful_operation));
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
    });
  }, [id, modalForm, offlinePayConfirmType]);

  const columns: ColumnsType<OmsOrderPayment> = useMemo(() => {
    return [
      {
        title: <Trans i18nKey={LOCALS.payment_channel}></Trans>,
        dataIndex: 'payType',
        key: 'payType',
        width: 100,
      },
      {
        title: <Trans i18nKey={LOCALS.pay_amount}></Trans>,
        dataIndex: 'payAmount',
        key: 'payAmount',
        width: 140,
        render: (payAmount: OmsOrderPayment['payAmount']) => {
          return payAmount ? payAmount.toLocaleString() : '-';
        },
      },
      {
        title: <Trans i18nKey={LOCALS.currency}></Trans>,
        dataIndex: 'payCurrency',
        width: 100,
        key: 'payCurrency',
        render: (payCurrency: OmsOrderPayment['payCurrency']) => {
          return payCurrency || '-';
        },
      },
      {
        title: <Trans i18nKey={LOCALS.payment_status}></Trans>,
        width: 100,
        dataIndex: 'payStatus',
        key: 'payStatus',
        render: (payStatus: OmsOrderPayment['payStatus']) => {
          return payStatus
            ? findLabelByValue(+payStatus, payStatusOptions)
            : '-';
        },
      },
      {
        title: <Trans i18nKey={LOCALS.payment_time}></Trans>,
        width: 180,
        dataIndex: 'payTime',
        key: 'payTime',
        render: (payTime: OmsOrderPayment['payTime']) => {
          return formatTime(payTime);
        },
      },
      {
        title: <Trans i18nKey={LOCALS.payment_voucher}></Trans>,
        width: 150,
        dataIndex: 'memberTransferVoucher',
        key: 'memberTransferVoucher',
        render: (
          memberTransferVoucher: OmsOrderPayment['memberTransferVoucher']
        ) => {
          return memberTransferVoucher ? (
            <Image
              width={100}
              src={memberTransferVoucher}
              alt={memberTransferVoucher}
            />
          ) : (
            '-'
          );
        },
      },
      {
        title: <Trans i18nKey={LOCALS.payment_note}></Trans>,
        width: 100,
        dataIndex: 'memberTransferDesc',
        key: 'memberTransferDesc',
        render: (memberTransferDesc: OmsOrderPayment['memberTransferDesc']) => {
          return memberTransferDesc || '-';
        },
      },
      {
        title: <Trans i18nKey={LOCALS.confirmor}></Trans>,
        width: 100,
        dataIndex: 'confirmUser',
        key: 'confirmUser',
        render: (confirmUser: OmsOrderPayment['confirmUser']) => {
          return confirmUser || '-';
        },
      },
      {
        title: <Trans i18nKey={LOCALS.confirm_time}></Trans>,
        width: 180,
        dataIndex: 'confirmTime',
        key: 'confirmTime',
        render: (confirmTime: OmsOrderPayment['confirmTime']) => {
          return formatTime(confirmTime);
        },
      },
      {
        title: <Trans i18nKey={LOCALS.options}></Trans>,
        width: 180,
        key: 'options',
        render: ({ payStatus }: OmsOrderPayment) => {
          if (payStatus !== PAY_STATUS_MAP.PENDING_CONFIRM) return '-';
          if (status !== ORDER_STATUS_MAP.TO_BE_PAID) return '-';

          return (
            <Space>
              <Button
                onClick={() => {
                  setOfflinePayConfirmType('confirm');
                  setModalOpen(true);
                }}
              >
                <Trans i18nKey={LOCALS.confirm} />
              </Button>
              <Button
                onClick={() => {
                  setOfflinePayConfirmType('reject');
                  setModalOpen(true);
                }}
              >
                <Trans i18nKey={LOCALS.reject} />
              </Button>
            </Space>
          );
        },
      },
    ];
  }, [payStatusOptions, status]);

  if (!offlinePayList.length) {
    return null;
  }

  return (
    <div>
      <div className={styles.title}>
        <Trans i18nKey={LOCALS.offline_payment_record} />
      </div>

      <Table
        size="small"
        rowKey={'id'}
        tableLayout="fixed"
        pagination={false}
        columns={columns}
        dataSource={offlinePayList}
      ></Table>

      <Modal
        open={modalOpen}
        title={<Trans i18nKey={LOCALS.offline_payment_record_confirm} />}
        onCancel={() => {
          setModalOpen(false);
        }}
        onOk={onModalOk}
      >
        <Form form={modalForm}>
          <Form.Item
            label={<Trans i18nKey={LOCALS.remark} />}
            name="note"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OfflinePaymentRecord;
