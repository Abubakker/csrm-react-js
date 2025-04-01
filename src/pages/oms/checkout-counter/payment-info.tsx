import { useState, useCallback, useEffect, useMemo } from 'react';
import { PmsProductWithPriceType } from 'types/pms';
import {
  Button,
  Form,
  notification,
  Row,
  Col,
  Radio,
  message,
  Spin,
  Input,
  Modal,
  InputNumber,
} from 'antd';
import { financialManagementAccountList } from 'apis/fms';
import { omsCreateCheckoutCounter, omsStoreConfirmOrder } from 'apis/oms';
import { FmsAccountManagement } from 'types/fms';
import {
  StoreConfirmOrder,
  StoreCreateOrderDto,
  StoreConfirmOrderDto,
} from 'types/oms';
import {
  CURRENCY_OPTION_LIST,
  CURRENCY_MAP,
  SG_SHOP_LIST,
  SHOP_MAP,
} from 'commons/options';
import PaymentInput from './payment-input';
import { useToggle } from 'react-use';
import { usePayloadContext } from 'pages/oms/checkout-counter/utils/payload-context';
import { ActionType } from 'pages/oms/checkout-counter/utils/payload-reducer';
import { useAppSelector } from 'store/hooks';
import { selectUserInfo } from 'store/slices/userInfoSlice';
import LOCALS from '../../../commons/locals';
import i18n from 'i18next';
import { debounce, groupBy, sumBy } from 'lodash-es';
import printOrderReceipt from 'utils/print-order-receipt';
import { posPrinterSetting } from 'utils/connect-to-pos-printer';
import BarcodeScanner from 'components/barcode-scanner';
import { ScanOutlined } from '@ant-design/icons';
import { storeScannerBeepAudioSuccess } from 'commons';
import CouponDescriptionDialog from './coupon-description-dialog';

type Props = {
  className?: string;
  productList: PmsProductWithPriceType[];
  orderResult?: StoreConfirmOrder;
  setOrderResult: (orderResult: StoreConfirmOrder | undefined) => void;
};

export interface CategoryType {
  [key: string]: FmsAccountManagement[];
}

const PaymentInfo = ({ productList, orderResult, setOrderResult }: Props) => {
  const [form] = Form.useForm<{
    priceList?: {
      payType: string;
      payAmount?: number | null;
    }[];
  }>();
  const [, contextHolder] = notification.useNotification();
  const formValuesPriceList = Form.useWatch((values) => values.priceList, form);
  const [saveLoading, toggleSaveLoading] = useToggle(false);
  const [createOrderSuccess, toggleCreateOrderSuccess] = useToggle(false);
  const [accountList, setAccountList] = useState<FmsAccountManagement[]>([]);
  const [totalCountLoading, toggleTotalCountLoading] = useToggle(false);
  const { dispatch, state } = usePayloadContext();
  const [printReceiptLoading, togglePrintReceiptLoading] = useToggle(false);

  const {
    useIntegration,
    payMode,
    promotionAmount,
    couponCode,
    createdFrom,
    totalIntegration,
  } = state;
  const { shop = SHOP_MAP.GINZA } = useAppSelector(selectUserInfo);
  const [couponCodeScannerOpen, toggleCouponCodeScannerOpen] = useToggle(false);

  const resetPaymentForm = useCallback(
    (accountList: FmsAccountManagement[]) => {
      if (accountList && accountList.length) {
        form.setFieldValue(
          'priceList',
          accountList.slice(0, 3).map(({ accountCode }) => {
            return {
              payType: accountCode,
            };
          })
        );
      }
    },
    [form]
  );

  useEffect(() => {
    if (!createdFrom) return;
    financialManagementAccountList(createdFrom)
      .then((res) => {
        setAccountList(res);
        resetPaymentForm(res);
      })
      .finally(() => {});
  }, [createdFrom, resetPaymentForm]);

  // 币种
  const currency = useMemo(() => {
    if (createdFrom) {
      return CURRENCY_OPTION_LIST[createdFrom - 1].value;
    }
    return CURRENCY_MAP.JPY;
  }, [createdFrom]);

  // 接口获取合计金额
  const debounceGetTotalCount = useMemo(() => {
    return debounce((payload: StoreConfirmOrderDto) => {
      toggleTotalCountLoading(true);
      omsStoreConfirmOrder(payload)
        .then((d) => {
          toggleTotalCountLoading(false);
          setOrderResult(d);
        })
        .catch(() => {})
        .finally(() => {});
    }, 300);
  }, [setOrderResult, toggleTotalCountLoading]);
  const getTotalCount = useCallback(
    (payload: StoreConfirmOrderDto) => {
      debounceGetTotalCount(payload);
    },
    [debounceGetTotalCount]
  );

  // 需要支付的金额
  const amountNeedToPay = useMemo(() => {
    return orderResult?.omsOrder.payAmountActualCurrency || 0;
  }, [orderResult]);

  // 已收款的金额
  const receivedAmount = useMemo(() => {
    if (!formValuesPriceList) return 0;
    return sumBy(formValuesPriceList, (i) => i.payAmount || 0);
  }, [formValuesPriceList]);

  // 找零金额
  const changeAmount = useMemo(() => {
    if (!formValuesPriceList) return 0;

    return receivedAmount - amountNeedToPay;
  }, [formValuesPriceList, receivedAmount, amountNeedToPay]);

  // 计算总价格
  useEffect(() => {
    if (state.productList.length) {
      // 产地判断
      const stockPlace = state.productList[0].stockPlace || '';

      // 新加披 特殊处理
      if (SG_SHOP_LIST.includes(stockPlace)) {
        if (
          !state.productList.every((d) =>
            SG_SHOP_LIST.includes(d.stockPlace || '')
          )
        ) {
          message.warning({
            content: i18n.t(LOCALS.stock_place_warning_2),
            key: 'stockPlace',
          });
          return;
        }
      } else {
        if (!state.productList.every((d) => d.stockPlace === stockPlace)) {
          message.warning({
            content: i18n.t(LOCALS.stock_place_warning_2),
            key: 'stockPlace',
          });
          return;
        }
      }

      getTotalCount({
        useIntegration,
        promotionAmount,
        productList: state.productList,
        couponCode,
        memberId: state.memberId,
      });
    } else {
      setOrderResult(undefined);
    }
  }, [
    useIntegration,
    promotionAmount,
    state.productList,
    getTotalCount,
    couponCode,
    shop,
    state.memberId,
    setOrderResult,
  ]);

  // 确认收款
  const onConfirm = useCallback(() => {
    const t = form.getFieldsValue();
    if (!t.priceList) return;

    const paymentList = t.priceList.filter(
      ({ payAmount }) => payAmount && payAmount > 0
    ) as {
      payType: string;
      payAmount: number;
    }[];
    const payload: StoreCreateOrderDto = {
      ...state,
      paymentList,
    };
    // 验证字段
    const { staffName, productList, payMode } = state;
    if (!staffName) {
      message.warning(i18n.t(LOCALS.select_representative));
      return;
    }
    if (productList.length === 0) {
      message.warning(i18n.t(LOCALS.select_items));
      return;
    }

    // 验证商品币种一致
    if (
      !productList.every(
        (product) => product.currency === productList[0].currency
      )
    ) {
      message.warning(i18n.t(LOCALS.stock_place_warning_2));
      return;
    }

    if (payMode === 0 && changeAmount < 0) {
      message.warning('非定金订单必须全额支付');
      return;
    }

    toggleSaveLoading(true);
    omsCreateCheckoutCounter(payload)
      .then(async (d) => {
        message.success('创建成功！');
        toggleSaveLoading(false);
        toggleCreateOrderSuccess(true);
        if (d.omsOrder.id) {
          try {
            togglePrintReceiptLoading(true);
            await printOrderReceipt({
              orderId: d.omsOrder.id,
              count: Number(posPrinterSetting.checkoutCount.get()) || 2,
              addSign: true,
            });
          } catch (error) {
            message.error('打印失败,请联系技术人员');
          } finally {
            togglePrintReceiptLoading(false);
          }
        }

        Modal.success({
          title: i18n.t('successful_operation'),
          content: (
            <div>
              <a
                href={`/oms/order-view/${d.omsOrder.id}`}
                target="_blank"
                rel="noreferrer"
              >
                {i18n.t(LOCALS.to_order_details) || '跳转订单详情页'}
              </a>
            </div>
          ),
          onOk() {
            window.location.reload();
          },
          onCancel() {
            window.location.reload();
          },
        });
      })
      .catch((d) => {})
      .finally(() => {
        toggleSaveLoading(false);
      });
  }, [
    form,
    state,
    changeAmount,
    toggleSaveLoading,
    toggleCreateOrderSuccess,
    togglePrintReceiptLoading,
  ]);

  const isProductListSameCurrency = useMemo(() => {
    return Object.keys(groupBy(productList, (i) => i.currency)).length === 1;
  }, [productList]);

  const handleBarcodeScannerSuccess = useMemo(() => {
    return debounce((e) => {
      const newCouponCode = e.trim();
      if (newCouponCode) {
        storeScannerBeepAudioSuccess
          .play()
          .catch((err) =>
            console.log('Autoplay requires user interaction:', err)
          );

        dispatch({
          type: ActionType.UPDATE_BATCH,
          payload: {
            couponCode: newCouponCode,
          },
        });

        toggleCouponCodeScannerOpen();
      }
    }, 300);
  }, [dispatch, toggleCouponCodeScannerOpen]);

  const couponDescription = useMemo(() => {
    if (!orderResult?.smsCouponHistory) return null;
    const { i18nDescription } = orderResult.smsCouponHistory;
    if (!i18nDescription) return null;
    return i18nDescription[i18n.language.replace('_', '-')] || null;
  }, [orderResult?.smsCouponHistory]);

  console.log(couponDescription);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mt-4 w-full grid gap-4 grid-cols-2">
        <div className="grid gap-4">
          <InputNumber
            className="w-full"
            addonBefore={
              <div className="w-56">{i18n.t(LOCALS.points_deduction)}</div>
            }
            placeholder=""
            value={useIntegration}
            max={totalIntegration || 0}
            suffix="JPY"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            onChange={(e) => {
              if (e !== null) {
                dispatch({
                  type: ActionType.UPDATE_BATCH,
                  payload: {
                    useIntegration: e,
                  },
                });
              }
            }}
          />

          <InputNumber
            addonBefore={
              <div className="w-56">{i18n.t(LOCALS.discount_amounts)}</div>
            }
            max={orderResult?.omsOrder.payAmountActualCurrency || 0}
            value={promotionAmount}
            className="w-full"
            suffix={currency}
            placeholder=""
            onChange={(e) => {
              dispatch({
                type: ActionType.UPDATE_BATCH,
                payload: {
                  promotionAmount: e || 0,
                },
              });
            }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
          />

          <Modal
            destroyOnClose
            open={couponCodeScannerOpen}
            onCancel={toggleCouponCodeScannerOpen}
            onOk={toggleCouponCodeScannerOpen}
          >
            <BarcodeScanner
              onScanSuccess={handleBarcodeScannerSuccess}
            ></BarcodeScanner>
          </Modal>

          <Input
            value={couponCode}
            addonBefore={
              <div className="w-56 flex gap-4 items-center justify-center">
                {i18n.t('coupon')}
                <Button
                  onClick={toggleCouponCodeScannerOpen}
                  icon={<ScanOutlined />}
                  size="small"
                ></Button>
              </div>
            }
            onChange={(e) => {
              dispatch({
                type: ActionType.UPDATE_BATCH,
                payload: {
                  couponCode: e.target.value.trim(),
                },
              });
            }}
          />
        </div>

        <div className="form">
          <Form
            form={form}
            initialValues={{ priceList: [] }}
            onFinish={async (value) => {}}
          >
            <Form.List name="priceList">
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      required={false}
                      key={field.key}
                      className="mb-4"
                    >
                      <Row justify={'center'}>
                        <Col span={24}>
                          <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            noStyle
                          >
                            <PaymentInput accountList={accountList} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        </div>

        {/* 优惠明细 */}
        {contextHolder}
      </div>

      {/* 合计金额 */}
      <div className="w-1/2">
        <div className="flex justify-between items-center mb-5">
          <div>
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              value={payMode}
              onChange={(e) => {
                dispatch({
                  type: ActionType.UPDATE_BATCH,
                  payload: {
                    payMode: e.target.value,
                  },
                });
              }}
            >
              <Radio value={0}>{i18n.t(LOCALS.non_deposit)}</Radio>
              <Radio value={1}>{i18n.t(LOCALS.deposit)}</Radio>
            </Radio.Group>
          </div>
          <Spin spinning={totalCountLoading}>
            <div className="text-base w-64">
              <div className="flex justify-between mb-2">
                <div>{i18n.t(LOCALS.total_amount)}</div>
                <div>
                  <span>{`${currency} ${(
                    orderResult?.omsOrder.totalAmountActualCurrency || 0
                  ).toLocaleString()}`}</span>
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <span>{i18n.t(LOCALS.PVkdenXCwb)}</span>
                <span>{`${currency} ${receivedAmount.toLocaleString()}`}</span>
              </div>
              {orderResult?.smsCouponHistory && (
                <div className="flex justify-between mb-2">
                  <span className="flex items-center gap-1">
                    {i18n.t(LOCALS.coupon)}
                    <CouponDescriptionDialog
                      title={couponDescription?.title || i18n.t(LOCALS.coupon)}
                      description={couponDescription?.description || ''}
                    />
                  </span>
                  <span>
                    {`${
                      CURRENCY_MAP.JPY
                    } -${orderResult.omsOrder.couponAmount.toLocaleString(
                      'en-US'
                    )}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{i18n.t(LOCALS.AYTHzloOiY)}</span>
                <span>{`${currency} ${changeAmount.toLocaleString()}`}</span>
              </div>
            </div>
          </Spin>
        </div>

        <div className="mb-4">
          <Input.TextArea
            value={state.note}
            onChange={(e) => {
              dispatch({
                type: ActionType.UPDATE_BATCH,
                payload: { note: e.target.value },
              });
            }}
            placeholder={i18n.t(LOCALS.please_enter_remark) || ''}
            rows={4}
            maxLength={250}
          ></Input.TextArea>
        </div>
        <div>
          <Button
            className="w-full"
            type="primary"
            onClick={onConfirm}
            loading={saveLoading || printReceiptLoading}
            disabled={
              !isProductListSameCurrency ||
              totalCountLoading ||
              !productList.length ||
              !orderResult ||
              createOrderSuccess ||
              (payMode === 0 && changeAmount < 0)
            }
          >
            {i18n.t(LOCALS.confirm)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
