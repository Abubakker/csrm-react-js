import { OmsOrderMultiplePay, OmsOrderDetail } from 'types/oms';
import {
  omsOrderCompleteMultiplePay,
  setOmsOrderMultiplePayList,
} from 'apis/oms';
import LOCALS from 'commons/locals';
import { Trans } from 'react-i18next';
import i18n from 'i18n';
import { useCallback, useEffect, useMemo } from 'react';
import {
  Button,
  message,
  InputNumber,
  Table,
  Form,
  Modal,
  Tag,
  Input,
} from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CURRENCY_MAP,
  CURRENCY_OPTION_LIST,
  findLabelByValue,
  ORDER_STATUS_MAP,
  SHOP_MAP,
} from 'commons/options';
import { ColumnType } from 'antd/es/table';
import styles from './index.module.scss';
import { useToggle } from 'react-use';
import useIsMobile from '../../../commons/hooks/useIsMobile';

const MultiplePaySet = ({
  payAmountActualCurrency,
  dataSource,
  setDataSource,
  currency,
  onFinish,
}: {
  payAmountActualCurrency: number | null;
  dataSource: OmsOrderMultiplePay[];
  setDataSource: (value: OmsOrderMultiplePay[]) => void;
  currency: string;
  onFinish: () => void;
}) => {
  const handleAddAmount = () => {
    const obj: OmsOrderMultiplePay = {
      sortId: dataSource.length + 1,
      needPayAmount: 0,
      currency,
    };
    setDataSource([...dataSource, obj]);
  };

  return (
    <div>
      <Form
        layout="horizontal"
        labelCol={{ span: 4 }}
        initialValues={{
          count: dataSource.length,
        }}
        onFinish={() => {
          onFinish();
        }}
      >
        {dataSource.map(({ needPayAmount, omsOrderPayId, sortId }, index) => (
          <Form.Item
            key={index}
            label={i18n.t('add_multi_amount', { count: index + 1 })}
            required
            rules={[{ required: true }]}
          >
            <InputNumber
              size="large"
              className="w-full"
              value={needPayAmount}
              onChange={(value) => {
                setDataSource(
                  dataSource.map((item, i) => {
                    if (i === index) {
                      if (typeof value === 'number') {
                        item.needPayAmount = value;
                      }
                    }
                    return item;
                  })
                );
              }}
              disabled={!!omsOrderPayId}
              suffix={findLabelByValue(currency, CURRENCY_OPTION_LIST)}
            />
            {!omsOrderPayId && (
              <Button
                type="link"
                onClick={() => {
                  setDataSource(
                    dataSource.filter((item) => item.sortId !== sortId)
                  );
                }}
              >
                {i18n.t(LOCALS.delete)}
              </Button>
            )}
          </Form.Item>
        ))}

        <div className="flex justify-end">
          {i18n.t(LOCALS.remaining_amount)}:{' '}
          {(
            (payAmountActualCurrency || 0) -
            dataSource.reduce((sum, e) => sum + e.needPayAmount, 0)
          ).toLocaleString()}
        </div>

        <Button type="dashed" onClick={handleAddAmount}>
          {i18n.t('add_pay_amount')}
        </Button>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setDataSource(dataSource.filter((item) => item.omsOrderPayId));
            }}
            className="mr-2"
          >
            {i18n.t(LOCALS.reset) || '清空'}
          </Button>
          <Button type="primary" htmlType="submit">
            {i18n.t(LOCALS.submit) || '生成'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

const OmsOrderMultiplePayList = ({
  data,
  omsOrderDetail,
}: {
  data: OmsOrderMultiplePay[];
  omsOrderDetail: OmsOrderDetail;
}) => {
  const isMobile = useIsMobile();
  const [form] = Form.useForm<{ note?: string }>();
  const [multiPayOpen, toggleMultiPayOpen] = useToggle(false);
  const { id } = useParams<{ id: string }>();
  const [dataSource, setDataSource] = useState(data);
  const [confirmReceiptOpen, toggleConfirmReceiptOpen] = useToggle(false);

  useEffect(() => {
    data && setDataSource(data);
  }, [data]);

  const currency = useMemo(() => {
    return omsOrderDetail.orderItemList[0].actualCurrency || CURRENCY_MAP.JPY;
  }, [omsOrderDetail.orderItemList]);
  const [selectedRow, setSelectedRow] = useState<
    OmsOrderMultiplePay & { id?: string } // TODO: 这里的 id 其实应该在 OmsOrderMultiplePay 里一定存在的
  >();

  const columns: ColumnType<OmsOrderMultiplePay>[] = [
    {
      title: <Trans i18nKey={LOCALS.sortId} />,
      dataIndex: 'sortId',
      key: 'sortId',
      width: 80,
    },
    {
      title: <Trans i18nKey={LOCALS['pay_amount']} />,
      dataIndex: 'needPayAmount',
      key: 'needPayAmount',
      width: 200,
      render: (needPayAmount: number, { currency }) => {
        return needPayAmount?.toLocaleString() + ` ${currency}`;
      },
    },
    {
      title: <Trans i18nKey={LOCALS.payment_status} />,
      dataIndex: 'omsOrderPayId',
      key: 'omsOrderPayId',
      width: 200,
      render: (omsOrderPayId: string) => {
        return omsOrderPayId ? (
          <Tag color="success">{i18n.t(LOCALS.FOGRMrNbMM)}</Tag>
        ) : (
          <Tag color="default">{i18n.t(LOCALS.DXlRCJJEKv)}</Tag>
        );
      },
    },
    {
      title: <Trans i18nKey={LOCALS.option} />,
      key: 'option',
      dataIndex: 'omsOrderPayId',
      width: 200,
      render: (
        omsOrderPayId: OmsOrderMultiplePay['omsOrderPayId'],
        omsOrderMultiplePay: OmsOrderMultiplePay,
        index: number
      ) => {
        if (omsOrderDetail.status !== ORDER_STATUS_MAP.TO_BE_PAID) {
          return <div>-</div>;
        }

        if (omsOrderPayId) {
          return <div>-</div>;
        }

        // 我要通过 sortId 找到第一个未支付的记录
        const firstUnpaidIndex = dataSource.findIndex(
          (item) => !item.omsOrderPayId
        );

        if (firstUnpaidIndex === index) {
          return (
            <Button
              disabled={!!omsOrderMultiplePay.omsOrderPayId}
              type="link"
              onClick={() => {
                setSelectedRow(omsOrderMultiplePay);
                toggleConfirmReceiptOpen();
              }}
            >
              {i18n.t(LOCALS.GbYAnWwRFt)}
            </Button>
          );
        }

        return <div>-</div>;
      },
    },
  ];

  const formHandler = useCallback(
    async (list: OmsOrderMultiplePay[]) => {
      await setOmsOrderMultiplePayList(
        parseInt(id || ''),
        list.filter((item) => !item.omsOrderPayId)
      );

      message.success('Success!');

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    [id]
  );

  const autoPaySetting = useCallback(
    (list: OmsOrderMultiplePay[]) => {
      if (!list) {
        return;
      }

      if (list.length > 30 || list.length < 2) {
        message.warning({
          content: '支付笔数建议范围2~30之间',
        });
        return;
      }

      // 计算还剩余多少需要多比支付
      let paymentMoney = 0; // 已经支付的钱
      for (const row of data) {
        if (row.omsOrderPayId && row.needPayAmount) {
          paymentMoney = paymentMoney + row.needPayAmount;
        }
      }

      if (omsOrderDetail.payAmountActualCurrency === null) return;
      if (
        list
          .filter((item) => item.omsOrderPayId == null)
          .reduce((sum, e) => sum + e.needPayAmount, 0) !==
        omsOrderDetail.payAmountActualCurrency - paymentMoney
      ) {
        message.warning({
          content:
            '金额校验不符合,总剩余支付金额为:' +
            (omsOrderDetail.payAmountActualCurrency - paymentMoney),
        });
        return;
      }
      setDataSource(list);

      formHandler(list);
      toggleMultiPayOpen();
    },
    [
      omsOrderDetail.payAmountActualCurrency,
      formHandler,
      toggleMultiPayOpen,
      data,
    ]
  );

  // 店铺订单，没有多笔支付功能
  if (
    [SHOP_MAP.GINZA, SHOP_MAP.HONGKONG, SHOP_MAP.SINGAPORE].includes(
      omsOrderDetail.createdFrom
    )
  ) {
    return null;
  }

  return (
    <div className="mb-3">
      {(omsOrderDetail.status === ORDER_STATUS_MAP.TO_BE_PAID ||
        !!dataSource.length) && (
        <div className={styles.title}>
          <Trans i18nKey={LOCALS.MultiplePayList} />
        </div>
      )}

      {omsOrderDetail.status === ORDER_STATUS_MAP.TO_BE_PAID && (
        <Form
          layout="inline"
          onFinish={(data) => {
            autoPaySetting(data);
          }}
        >
          <Form.Item>
            <Button className="mr-2" onClick={toggleMultiPayOpen}>
              <Trans i18nKey={LOCALS.set_up} />
            </Button>
          </Form.Item>
        </Form>
      )}

      {(omsOrderDetail.status === ORDER_STATUS_MAP.TO_BE_PAID ||
        !!dataSource.length) && (
        <Table
          size="small"
          bordered
          rowKey={'sortId'}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      )}

      <Modal
        title={i18n.t(LOCALS.MultiplePayList) || '设置多笔支付'}
        open={multiPayOpen}
        onCancel={toggleMultiPayOpen}
        footer={null}
        width={isMobile ? '100%' : '60%'}
      >
        {data && (
          <MultiplePaySet
            payAmountActualCurrency={omsOrderDetail.payAmountActualCurrency}
            dataSource={dataSource}
            setDataSource={setDataSource}
            currency={currency}
            onFinish={() => {
              autoPaySetting(
                dataSource.map((item, index) => {
                  return {
                    sortId: index + 1,
                    needPayAmount: item.needPayAmount,
                    omsOrderPayId: item.omsOrderPayId,
                    currency,
                  };
                })
              );
            }}
          />
        )}
      </Modal>

      <Modal
        title={i18n.t(LOCALS.GbYAnWwRFt) || '确认收款'}
        open={confirmReceiptOpen}
        onCancel={toggleConfirmReceiptOpen}
        onOk={async () => {
          const data = await form.validateFields();
          if (selectedRow && selectedRow.id) {
            await omsOrderCompleteMultiplePay({
              orderId: omsOrderDetail.id,
              multiplePaySetId: selectedRow.id,
              note: data.note,
            });
            message.success(i18n.t(LOCALS.successful_operation));
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        }}
      >
        <Form form={form}>
          <Form.Item
            name="note"
            required
            label={i18n.t(LOCALS.note)}
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default OmsOrderMultiplePayList;
