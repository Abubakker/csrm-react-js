import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Spin,
  Table,
  message,
} from 'antd';
import MemberSelect from './member-select';
import ProductSelect from './product-select';
import PaymentSelect from './payment-select';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  OmsOrder,
  OrderGenerateForMemberDto,
  StoreConfirmOrder,
} from 'types/oms';
import { omsGenerateConfirmOrder, omsGenerateForMember } from 'apis/oms';
import { useToggle } from 'react-use';
import StepItem from 'components/step-item';
import { Link } from 'react-router-dom';
import Paragraph from 'antd/lib/typography/Paragraph';
import PORTAL_ORIGIN from 'utils/getPortalOrigin';
import {
  CURRENCY_MAP,
  CURRENCY_OPTION_LIST,
  findLabelByValue,
  ORDER_STATUS_MAP,
  SHOP_MAP,
  STOCK_PLACE_MAP,
} from 'commons/options';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';
import { Trans } from 'react-i18next';
import CreatedSelect from './created-select';
import useIsMobile from 'commons/hooks/useIsMobile';
import { PmsProduct } from 'types/pms';

const MultiplePaySet = ({
  payAmountActualCurrency,
  currency,
  onFinish,
}: {
  payAmountActualCurrency: number;
  currency: string;
  onFinish: (list: number[]) => void;
}) => {
  const [amounts, setAmounts] = useState<number[]>([0]); // 初始化一笔支付金额

  const handleAddAmount = () => {
    setAmounts([...amounts, 0]); // 添加一个输入框，初始化为0
  };

  const handleRemoveAmount = (index: number) => {
    setAmounts(amounts.filter((_, i) => i !== index)); // 删除指定索引的输入框
  };

  return (
    <div>
      <Form
        layout="horizontal"
        labelCol={{ span: 8 }}
        initialValues={{
          count: amounts.length,
        }}
        onFinish={() => {
          onFinish(amounts); // 提交时传递所有输入的金额
        }}
      >
        {amounts.map((amount, index) => (
          <Form.Item
            key={index}
            label={i18n.t('add_multi_amount', { count: index + 1 })}
            required
            rules={[{ required: true }]}
          >
            <InputNumber
              size="large"
              className="w-full"
              onChange={(value) => {
                const newAmounts = [...amounts];
                if (typeof value === 'number') {
                  newAmounts[index] = value;
                } else {
                  newAmounts[index] = 0;
                }
                setAmounts(newAmounts);
              }}
              suffix={findLabelByValue(currency, CURRENCY_OPTION_LIST)}
            />
            <Button type="link" onClick={() => handleRemoveAmount(index)}>
              {i18n.t(LOCALS.delete)}
            </Button>
          </Form.Item>
        ))}

        <div className="flex justify-end">
          {i18n.t(LOCALS.remaining_amount)}:{' '}
          {(
            payAmountActualCurrency - amounts.reduce((sum, e) => sum + e, 0)
          ).toLocaleString()}
        </div>

        <Button type="dashed" onClick={handleAddAmount}>
          {i18n.t('add_pay_amount')}
        </Button>

        <div className="flex justify-end">
          <Button onClick={() => setAmounts([])} className="mr-2">
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

type PayloadState = Omit<
  OrderGenerateForMemberDto,
  'productIdList' | 'taxFreeProductIdList'
> & {
  receiveAddressCountry?: string;
  productList: (PmsProduct & {
    isTaxFree: number; // 是否免税 1:是 0:否
  })[];
};

const OrderCreateV2 = () => {
  const [omsOrderCreatePayload, setOmsOrderCreatePayload] =
    useState<PayloadState>({
      memberId: undefined,
      productList: [],
      useIntegration: 0,
      promotionAmount: 0,
      couponCode: '',
      createdFrom: SHOP_MAP.WEBSITE,
      orderStatus: undefined,
      note: undefined,
      isKeepProduct: false,
      receiveAddressId: undefined,
      receiveAddressCountry: '',
    });
  const [confirmOrderInfo, setConfirmOrderInfo] = useState<StoreConfirmOrder>();
  const [resultLoading, toggleResultLoading] = useToggle(false);
  const [modelOpen, toggleModelOpen] = useToggle(false);
  const [saveLoading, toggleSaveLoading] = useToggle(false);
  const [orderData, setOrderData] =
    useState<Pick<OmsOrder, 'id' | 'orderSn'>>();
  const [multiPayOpen, toggleMultiPayOpen] = useToggle(false);
  const isMobile = useIsMobile();

  // 币种
  const currency = useMemo(() => {
    if (
      confirmOrderInfo?.omsOrderItems.length &&
      confirmOrderInfo?.omsOrderItems[0].actualCurrency
    ) {
      return confirmOrderInfo?.omsOrderItems[0].actualCurrency;
    }

    return CURRENCY_MAP.JPY;
  }, [confirmOrderInfo]);

  useEffect(() => {
    if (!omsOrderCreatePayload.productList.length) return;

    toggleResultLoading();
    omsGenerateConfirmOrder({
      ...omsOrderCreatePayload,
      productIdList: omsOrderCreatePayload.productList.map((i) => i.id),
      taxFreeProductIdList: omsOrderCreatePayload.productList
        .filter((i) => i.isTaxFree === 1)
        .map((i) => i.id),
    })
      .then((data) => {
        setConfirmOrderInfo(data);
      })
      .catch(() => {
        setConfirmOrderInfo(undefined);
      })
      .finally(() => toggleResultLoading());
  }, [toggleResultLoading, omsOrderCreatePayload]);

  const setPayload = useCallback((payload: Partial<PayloadState>) => {
    setOmsOrderCreatePayload((obj) => {
      return { ...obj, ...payload };
    });
  }, []);

  useEffect(() => {
    if (omsOrderCreatePayload.receiveAddressCountry) {
      setOmsOrderCreatePayload(({ productList, ...rest }) => {
        const newProductList = productList.map((item) => {
          return {
            ...item,
            isTaxFree:
              item.stockPlace === STOCK_PLACE_MAP.JAPAN &&
              omsOrderCreatePayload.receiveAddressCountry !== 'JPN'
                ? 1
                : 0,
          };
        });

        return {
          ...rest,
          productList: newProductList,
        };
      });
    }
  }, [omsOrderCreatePayload.receiveAddressCountry]);

  // 创建订单
  const handleCreateOrder = useCallback(() => {
    const {
      productList,
      createdFrom,
      receiveAddressId,
      orderStatus,
      memberId,
    } = omsOrderCreatePayload;

    // 只在有会员且是待支付订单时验证收货地址
    if (
      memberId &&
      !receiveAddressId &&
      orderStatus === ORDER_STATUS_MAP.TO_BE_PAID
    ) {
      message.warning(i18n.t('please_select_a_shipping_address'));
      return;
    }

    if (productList?.length === 0) {
      message.warning(`${i18n.t('select_items')}`);
      return;
    }

    if (createdFrom === undefined) {
      message.warning(i18n.t('enter_order_source'));
      return;
    }

    toggleSaveLoading();
    omsGenerateForMember({
      ...omsOrderCreatePayload,
      productIdList: omsOrderCreatePayload.productList.map((i) => i.id),
      taxFreeProductIdList: omsOrderCreatePayload.productList
        .filter((i) => i.isTaxFree === 1)
        .map((i) => i.id),
    })
      .then((data) => {
        setOrderData(data.omsOrder);
      })
      .catch(() => {})
      .finally(() => {
        toggleSaveLoading();
      });
  }, [omsOrderCreatePayload, toggleSaveLoading]);

  const autoPaySetting = useCallback(
    (list: number[]) => {
      if (list.length < 2 || list.length > 30) {
        message.warning({
          content: '支付笔数建议范围2~30之间',
        });
        return;
      }

      if (confirmOrderInfo) {
        if (
          confirmOrderInfo.omsOrder.payAmountActualCurrency !==
          list.reduce((sum, e) => sum + e, 0)
        ) {
          message.warning({
            content:
              '金额校验不符合,总支付金额为:' +
              confirmOrderInfo.omsOrder.payAmountActualCurrency,
          });
          return;
        }
      }

      setPayload({
        multiplePaySet: list.map((amount, index) => {
          return {
            sortId: index + 1,
            needPayAmount: amount,
            currency,
          };
        }),
      });
      toggleMultiPayOpen();
    },
    [confirmOrderInfo, currency, setPayload, toggleMultiPayOpen]
  );

  return (
    <div className="-m-2 md:-m-4">
      <StepItem
        index={1}
        title={i18n.t(LOCALS.member_details) || '会员选择'}
        isCompleted={!!omsOrderCreatePayload.memberId}
        tips={i18n.t(LOCALS.PSmonSgnjX) || ''}
      >
        <MemberSelect setPayload={setPayload} />
      </StepItem>

      <div className="w-full h-3 bg-gray-100" />

      <StepItem
        index={2}
        title={i18n.t(LOCALS.product_selection) || '商品选择'}
        isCompleted={!!omsOrderCreatePayload.productList.length}
      >
        <ProductSelect
          confirmOrderInfo={confirmOrderInfo}
          setPayload={setPayload}
          receiveAddressCountry={omsOrderCreatePayload.receiveAddressCountry}
          productList={omsOrderCreatePayload.productList}
        />
      </StepItem>

      <div className="w-full h-3 bg-gray-100"></div>

      <StepItem
        index={3}
        title={i18n.t(LOCALS.payment_settings) || '支付设置'}
        isCompleted={false}
      >
        <PaymentSelect
          memberId={omsOrderCreatePayload.memberId}
          setPayload={setPayload}
          confirmOrderInfo={confirmOrderInfo}
          currency={currency}
          orderStatus={omsOrderCreatePayload.orderStatus}
          receiveAddressId={omsOrderCreatePayload.receiveAddressId}
          useIntegration={omsOrderCreatePayload.useIntegration}
          productIdList={omsOrderCreatePayload.productList.map((i) => i.id)}
        />
      </StepItem>

      <div className="w-full h-3 bg-gray-100"></div>

      <StepItem index={4} title={i18n.t('order_source')} isCompleted={false}>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 p-4">
          <CreatedSelect
            setPayload={setPayload}
            createdFrom={omsOrderCreatePayload.createdFrom}
          />
          <Select
            className="w-full"
            value={omsOrderCreatePayload.isKeepProduct}
            onChange={(e) => {
              setPayload({
                isKeepProduct: e,
              });
            }}
            size="large"
            options={[
              { value: false, label: <Trans i18nKey={LOCALS.DgHjGCYKJD}></Trans>},
              { value: true, label: <Trans i18nKey={LOCALS.OFQcWePEsI}></Trans> },
            ]}
          ></Select>
        </div>

        <div className="px-4 mb-4">
          <Input.TextArea
            value={omsOrderCreatePayload.note}
            onChange={(e) => {
              setPayload({ note: e.target.value });
            }}
            size="large"
            rows={5}
            placeholder={i18n.t(LOCALS.please_enter_remark) || ''}
            maxLength={250}
          ></Input.TextArea>
        </div>
      </StepItem>

      <div className="p-4 pt-0">
        {omsOrderCreatePayload.multiplePaySet && (
          <Table
            size="small"
            className="mb-4"
            pagination={false}
            rowKey="sortId"
            dataSource={omsOrderCreatePayload.multiplePaySet}
            columns={[
              {
                title: <Trans i18nKey={LOCALS.sortId} />,
                dataIndex: 'sortId',
              },
              {
                title: <Trans i18nKey={LOCALS.pay_amount} />,
                dataIndex: 'needPayAmount',
                render(needPayAmount: number) {
                  return (
                    <span>
                      {needPayAmount.toLocaleString()}（
                      {findLabelByValue(currency, CURRENCY_OPTION_LIST)}）
                    </span>
                  );
                },
              },
            ]}
          ></Table>
        )}

        <div className="text-right mb-4">
          {confirmOrderInfo && (
            <Spin spinning={resultLoading}>
              <div className="mb-2 text-base">
                <span className="font-bold">
                  <Trans i18nKey={LOCALS.freight} />：
                </span>
                <span>
                  {findLabelByValue(currency, CURRENCY_OPTION_LIST)}
                  {confirmOrderInfo.omsOrder &&
                  confirmOrderInfo.omsOrder.freightAmountActualCurrency
                    ? `${
                        confirmOrderInfo.omsOrder.freightAmountActualCurrency.toLocaleString() ||
                        0
                      }`
                    : 0}
                </span>
              </div>
              <div className="mb-2 text-base">
                <span className="font-bold">
                  <Trans i18nKey={LOCALS.pay_amount} />：
                </span>
                <span>
                  {findLabelByValue(currency, CURRENCY_OPTION_LIST)}
                  {` ${confirmOrderInfo.omsOrder.payAmountActualCurrency.toLocaleString()}`}
                </span>
              </div>
              <div className="mb-2 text-base">
                <span className="font-bold">
                  {i18n.t(LOCALS.convert_to_jpy) || '折算日币'}：
                </span>
                <span>
                  {findLabelByValue('JPY', CURRENCY_OPTION_LIST)}
                  {` ${confirmOrderInfo.omsOrder.payAmount.toLocaleString()}`}
                </span>
              </div>
            </Spin>
          )}
        </div>

        <div className="flex justify-center">
          <Modal
            title={i18n.t(LOCALS.MultiplePayList) || '设置多笔支付'}
            open={multiPayOpen}
            onCancel={toggleMultiPayOpen}
            footer={null}
            width={isMobile ? '100%' : '60%'}
          >
            {confirmOrderInfo && (
              <MultiplePaySet
                payAmountActualCurrency={
                  confirmOrderInfo.omsOrder.payAmountActualCurrency
                }
                currency={currency}
                onFinish={(list) => {
                  autoPaySetting(list);
                }}
              />
            )}
          </Modal>

          <Modal
            title={
              orderData ? (
                <Trans i18nKey={LOCALS.successful_operation} />
              ) : (
                <Trans i18nKey={LOCALS.confirm_submit} />
              )
            }
            open={modelOpen}
            onOk={handleCreateOrder}
            onCancel={() => {
              if (orderData) {
                window.location.reload();
              } else {
                toggleModelOpen();
              }
            }}
            confirmLoading={saveLoading}
            okButtonProps={{ disabled: !!orderData }}
          >
            {orderData ? (
              <>
                <div>
                  <Link to={`/oms/order-view/${orderData.id}`} target="_blank">
                    {i18n.t(LOCALS.to_order_details) || '跳转订单详情页'}
                  </Link>
                </div>
                <Paragraph copyable={{ tooltips: false }}>
                  {`${PORTAL_ORIGIN}/order?orderId=${orderData.id}`}
                </Paragraph>
              </>
            ) : (
              <></>
            )}
          </Modal>
          <Button
            disabled={
              !confirmOrderInfo ||
              omsOrderCreatePayload.orderStatus !== ORDER_STATUS_MAP.TO_BE_PAID
            }
            className="mr-2"
            onClick={toggleMultiPayOpen}
          >
            {i18n.t(LOCALS.MultiplePayList) || '设置多笔支付'}
          </Button>
          <Button
            onClick={() => {
              const {
                productList,
                createdFrom,
                receiveAddressId,
                orderStatus,
                memberId,
              } = omsOrderCreatePayload;

              if (
                memberId &&
                !receiveAddressId &&
                orderStatus === ORDER_STATUS_MAP.TO_BE_PAID
              ) {
                message.warning(i18n.t('please_select_a_shipping_address'));
                return;
              }

              if (productList?.length === 0) {
                message.warning(i18n.t('select_items'));
                return;
              }

              if (createdFrom === undefined) {
                message.warning(i18n.t('enter_order_source'));
                return;
              }

              toggleModelOpen(true);
            }}
            type="primary"
            disabled={
              !omsOrderCreatePayload.productList.length ||
              omsOrderCreatePayload.orderStatus === undefined ||
              !!(
                omsOrderCreatePayload.memberId &&
                omsOrderCreatePayload.orderStatus ===
                  ORDER_STATUS_MAP.TO_BE_PAID &&
                !omsOrderCreatePayload.receiveAddressId
              )
            }
          >
            {i18n.t(LOCALS.create_order) || '创建订单'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderCreateV2;
