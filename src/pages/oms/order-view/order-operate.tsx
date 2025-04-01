import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  message,
} from 'antd';
import {
  cancelOrderByAdmin,
  omsOrderAddOperationNote,
  omsOrderDeliverUpdate,
  omsOrderFinish,
  omsOrderInvalid,
  omsOrderReceiverInfoUpdate,
} from 'apis/oms';
import LOCALS from 'commons/locals';
import {
  DELIVERY_METHOD_MAP,
  DELIVERY_METHOD_OPTION_LIST,
  ORDER_STATUS_MAP,
  OrderDeliveryTypeMap,
  PAY_STATUS_MAP,
  SHOP_MAP,
} from 'commons/options';
import i18n from 'i18n';
import { useState, useCallback, useEffect } from 'react';
import { Trans } from 'react-i18next';
import { OmsOrder, OmsOrderDetail, ReceiptDto } from 'types/oms';
import styles from './index.module.scss';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { useNavigate } from 'react-router-dom';
import copyToClipboard from 'utils/copyToClipboard';
import { getOrderDetailPageUrl } from 'utils/getPortalOrigin';
import FinalSettlement from './final-settlement';
import { useToggle } from 'react-use';
import { MallCity } from 'types/home';
import { getCityListByCountryCode } from 'apis/home';
import PrintReceiptButton from './print-receipt-button';
import { sumBy } from 'lodash-es';
import { financialManagementAccountList } from 'apis/fms';
import PrintRyoshushoButton from './print-ryoshusho-button';
import { getProductUpdateInfoNew, printReceiptProductName } from 'apis/pms';
import { getMemberById } from 'apis/ums';

type OrderOperateProps = {
  omsOrderDetail: OmsOrderDetail;
};

const OrderInvalidButton = ({ id }: { id: OmsOrder['id'] }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  return (
    <>
      <Modal
        title={i18n.t('invalid_order')}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={async () => {
          form.validateFields().then(async ({ note, autoPublish }) => {
            await omsOrderInvalid(id, note, autoPublish);
            window.location.reload();
          });
        }}
      >
        <p className="text-red-500 text-base">
          {i18n.t('confirm_invalid_order_change')}
        </p>
        <p className="text-red-500 text-base">
          {i18n.t('invalid_order_points_adjustment')}
        </p>
        <div>
          <Form form={form}>
            <Form.Item
              name="note"
              rules={[
                {
                  required: true,
                  message: <Trans i18nKey={LOCALS.please_enter} />,
                },
              ]}
            >
              <Input.TextArea
                placeholder={i18n.t('cancellation_reason') || ''}
              />
            </Form.Item>
          </Form>
        </div>
        <div>
          <Form form={form}>
            <Form.Item name="autoPublish" label={i18n.t('auto_publish')}>
              <Switch />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Button
        danger
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        {i18n.t(LOCALS.invalid_order)}
      </Button>
    </>
  );
};

const OrderOperate = ({ omsOrderDetail }: OrderOperateProps) => {
  const {
    id,
    status,
    // 收货人信息
    receiverName,
    receiverPhone,
    receiverPostCode,
    receiverProvince,
    receiverCity,
    receiverDetailAddress,
    orderType,
    createdFrom,
    // 邮寄信息
    deliveryCompany,
    deliverySn,
    deliveryType,
  } = omsOrderDetail;
  const { countryOptions } = useAppSelector(selectGlobalInfo);
  const navigate = useNavigate();
  const [
    modifyRecipientInformationModalOpen,
    setModifyRecipientInformationModalOpen,
  ] = useState(false);
  const [
    modifyMailingInformationModalOpen,
    setModifyMailingInformationModalOpen,
  ] = useState(false);
  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [completeOrderModalOpen, setCompleteOrderModalOpen] = useState(false);
  const [closeOrderModalOpen, setCloseOrderModalOpen] = useState(false);

  const [recipientInformationForm] = Form.useForm();
  const [mailingInformationForm] = Form.useForm();
  const [remarkForm] = Form.useForm();
  const [shipForm] = Form.useForm();
  const [completeOrderForm] = Form.useForm();
  const [closeOrderForm] = Form.useForm();

  const [finalSettlementModalOpen, toggleFinalSettlementModalOpen] =
    useToggle(false);

  const onModifyRecipientInformationOk = useCallback(() => {
    Modal.confirm({
      title: <Trans i18nKey={LOCALS.confirm_submit} />,
      onOk: async () => {
        const data = recipientInformationForm.getFieldsValue();

        await omsOrderReceiverInfoUpdate({
          orderId: id,
          status,
          ...data,
        });

        message.success(i18n.t(LOCALS.successful_operation));
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
    });
  }, [id, recipientInformationForm, status]);

  const onModifyMailingInformationOk = useCallback(() => {
    Modal.confirm({
      title: <Trans i18nKey={LOCALS.confirm_submit} />,
      onOk: async () => {
        const data = mailingInformationForm.getFieldsValue();

        await omsOrderDeliverUpdate([
          {
            orderId: id,
            ...data,
          },
        ]);

        message.success(i18n.t(LOCALS.successful_operation));
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
    });
  }, [id, mailingInformationForm]);

  const onRemarkOk = useCallback(async () => {
    const data = await remarkForm.validateFields();

    Modal.confirm({
      title: <Trans i18nKey={LOCALS.confirm_submit} />,
      onOk: async () => {
        await omsOrderAddOperationNote({
          id,
          status,
          ...data,
        });

        message.success(i18n.t(LOCALS.successful_operation));
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
    });
  }, [id, remarkForm, status]);

  const onShipOk = useCallback(async () => {
    const data = await shipForm.validateFields();
    Modal.confirm({
      title: <Trans i18nKey={LOCALS.confirm_submit} />,
      onOk: async () => {
        await omsOrderDeliverUpdate([
          {
            orderId: id,
            ...data,
          },
        ]);

        message.success(i18n.t(LOCALS.successful_operation));
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
    });
  }, [id, shipForm]);

  const onCompleteOrderOk = useCallback(async () => {
    const data = await completeOrderForm.validateFields();

    Modal.confirm({
      title: <Trans i18nKey={LOCALS.confirm_submit} />,
      onOk: async () => {
        await omsOrderFinish({
          orderId: id,
          ...data,
        });

        message.success(i18n.t(LOCALS.successful_operation));
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
    });
  }, [completeOrderForm, id]);

  const onCloseOrderOk = useCallback(async () => {
    const data = await closeOrderForm.validateFields();

    Modal.confirm({
      title: <Trans i18nKey={LOCALS.confirm_submit} />,
      onOk: async () => {
        await cancelOrderByAdmin({ id, ...data });
        message.success(i18n.t(LOCALS.successful_operation));
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
    });
  }, [closeOrderForm, id]);

  // 通过浏览器打印小票,在连接不上打印机下的兜底方案
  const onPrintReceiptByBrowser = useCallback(async () => {
    const [productNameMap, productInfo, paymentAccountList, memberDetail] =
      await Promise.all([
        printReceiptProductName(
          omsOrderDetail.orderItemList.map((i) => i.productId)
        ),
        getProductUpdateInfoNew(omsOrderDetail.orderItemList[0].productId),
        financialManagementAccountList(omsOrderDetail.createdFrom),
        omsOrderDetail.memberId ? getMemberById(omsOrderDetail.memberId) : null,
      ]);

    // TODO: 有点 hack 的方法，需要优化
    paymentAccountList.push({
      id: '99999',
      accountCode: 'CRYPTO_CURRENCY_TRIPLE_A',
      accountName: '暗号通貨',
      accountDescribe: 'Crypto Currency',
      status: 0,
      storeId: 1,
      deleteStatus: 0,
      sort: 0,
      isCash: 0,
    });

    const cumulativePoints = memberDetail?.data?.integration || 0;

    const omsOrderItems = omsOrderDetail.orderItemList.map(
      ({
        productSn,
        productBrand,
        realAmountCurrency,
        taxAmount,
        productPrice,
        i18n,
        isTaxFree,
        productId,
        productPriceActualCurrency,
      }) => ({
        productSn,
        productBrand,
        productName: productNameMap[productId].join('\n'),
        realAmountCurrency,
        taxAmount,
        productPrice,
        isTaxFree,
        productId,
        productPriceActualCurrency,
      })
    );

    const receivedAmount = (() => {
      if (omsOrderDetail.payList && omsOrderDetail.payList.length) {
        return sumBy(
          omsOrderDetail.payList.filter(
            (i) => i.payStatus === PAY_STATUS_MAP.CONFIRMED
          ),
          (i) => i.payAmount
        );
      }

      return omsOrderDetail.payAmountActualCurrency || 0;
    })();

    const payList = omsOrderDetail.payList
      ?.filter((i) => i.payStatus === PAY_STATUS_MAP.CONFIRMED)
      .map((i) => ({
        name:
          paymentAccountList.find((d) => d.accountCode === i.payType)
            ?.accountName || i.payType,
        amount: i.payAmount,
      }));

    const body: ReceiptDto = {
      id: omsOrderDetail.id,
      createdFrom: omsOrderDetail.createdFrom,
      staffName: omsOrderDetail.staffName,
      orderSn: omsOrderDetail.orderSn,
      integration: omsOrderDetail.integration,
      useIntegration: omsOrderDetail.integrationAmount,
      promotionAmount: omsOrderDetail.promotionAmountActualCurrency || 0,
      createTime: omsOrderDetail.createTime,
      totalAmountActualCurrency: omsOrderDetail.totalAmountActualCurrency,
      payAmountActualCurrency: omsOrderDetail.payAmountActualCurrency,
      omsOrderItems,
      couponAmount: omsOrderDetail.couponAmount,
      totalTaxAmount: omsOrderDetail.totalTaxAmount,
      receivedAmount,
      changeAmount:
        receivedAmount - (omsOrderDetail.payAmountActualCurrency || 0),
      payList,
      paymentTime: omsOrderDetail.paymentTime,
      memberId: omsOrderDetail.memberId,
      stockPlace: productInfo.stockPlace,
      cumulativePoints,
    };
    const encode = encodeURIComponent(JSON.stringify(body));
    window.open(`/prints/receipt?body=${encode}`);
  }, [omsOrderDetail]);

  const receiverProvinceValue = Form.useWatch(
    'receiverProvince',
    recipientInformationForm
  );
  const [cityList, setCityList] = useState<MallCity[]>([]);
  useEffect(() => {
    if (!receiverProvinceValue) return;
    getCityListByCountryCode(receiverProvinceValue).then((res) => {
      if (!res.data) return;

      const { cityList } = res.data;

      if (cityList) setCityList(cityList);
    });
  }, [receiverProvinceValue]);

  return (
    <div className="mb-3">
      <div className={styles.title}>
        <Trans i18nKey={LOCALS.order_operation} />
      </div>
      <div>
        <Space className="flex flex-wrap">
          <Button
            onClick={() => {
              navigate(-1);
            }}
          >
            <Trans i18nKey={LOCALS.back} />
          </Button>

          {/* 修改邮寄信息按钮 */}
          {[ORDER_STATUS_MAP.DELIVERED].includes(status) && (
            <Button
              onClick={() => {
                setModifyMailingInformationModalOpen(true);
              }}
            >
              <Trans i18nKey={LOCALS.modify_mailing_information} />
            </Button>
          )}

          {/* 修改收件人信息按钮 */}
          {[
            ORDER_STATUS_MAP.TO_BE_PAID,
            ORDER_STATUS_MAP.TO_BE_DELIVERED,
          ].includes(status) && (
            <Button
              onClick={() => {
                setModifyRecipientInformationModalOpen(true);
              }}
            >
              <Trans i18nKey={LOCALS.modify_recipient_information} />
            </Button>
          )}

          {/* 发货按钮 */}
          {[ORDER_STATUS_MAP.TO_BE_DELIVERED].includes(status) && (
            <Button
              onClick={() => {
                setShipModalOpen(true);
              }}
            >
              <Trans i18nKey={LOCALS.ship} />
            </Button>
          )}

          {/* 订单完成按钮 */}
          {[ORDER_STATUS_MAP.DELIVERED].includes(status) && (
            <Button
              onClick={() => {
                setCompleteOrderModalOpen(true);
              }}
            >
              <Trans i18nKey={LOCALS.complete_order} />
            </Button>
          )}

          {/* 修改免税价格按钮 */}
          {/* {[ORDER_STATUS_MAP.TO_BE_PAID].includes(status) &&
            isJapanOrder &&
            !!createdFrom &&
            ![SHOP_MAP.GINZA, SHOP_MAP.HONGKONG, SHOP_MAP.SINGAPORE].includes(
              createdFrom
            ) && (
              <Popconfirm
                title="确定修改为免税价格？"
                onConfirm={() => {
                  orderTaxFree(id).then(() => {
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  });
                }}
              >
                <Button>修改为免税价格</Button>
              </Popconfirm>
            )} */}

          {/* 订单备注按钮 */}
          <Button
            onClick={() => {
              setRemarkModalOpen(true);
            }}
          >
            <Trans i18nKey={LOCALS.remark} />
          </Button>

          {/* 结算尾款 */}
          {ORDER_STATUS_MAP.TO_BE_PAID === status && orderType === 2 && (
            <Button
              danger
              onClick={() => {
                toggleFinalSettlementModalOpen(true);
              }}
            >
              <Trans i18nKey={LOCALS.final_payment_settlement} />
            </Button>
          )}

          {/* 关闭订单按钮 */}
          {[
            ORDER_STATUS_MAP.TO_BE_PAID,
            ORDER_STATUS_MAP.TO_BE_DELIVERED,
            ORDER_STATUS_MAP.DELIVERED,
          ].includes(status) && (
            <Button
              danger
              type="primary"
              onClick={() => {
                setCloseOrderModalOpen(true);
              }}
            >
              <Trans i18nKey={LOCALS.close_order} />
            </Button>
          )}

          {([
            ORDER_STATUS_MAP.TO_BE_DELIVERED,
            ORDER_STATUS_MAP.DELIVERED,
            ORDER_STATUS_MAP.COMPLETED,
          ].includes(status) ||
            (ORDER_STATUS_MAP.TO_BE_PAID === status && orderType === 2)) && ( // 支付了部分的定金订单也能打印小票
            <>
              <PrintReceiptButton
                omsOrderDetail={omsOrderDetail}
                onPrintReceiptByBrowser={onPrintReceiptByBrowser}
              />
            </>
          )}

          {status === ORDER_STATUS_MAP.COMPLETED && (
            <PrintRyoshushoButton omsOrderDetail={omsOrderDetail} />
          )}

          {status === ORDER_STATUS_MAP.COMPLETED && (
            <OrderInvalidButton id={id} />
          )}

          {![SHOP_MAP.GINZA, SHOP_MAP.HONGKONG, SHOP_MAP.SINGAPORE].includes(
            createdFrom
          ) &&
            status === ORDER_STATUS_MAP.TO_BE_PAID && (
              <Button
                type="primary"
                onClick={() => {
                  copyToClipboard(getOrderDetailPageUrl(id));
                  message.success(i18n.t(LOCALS.kTFIViDbSC));
                }}
              >
                {<Trans i18nKey={LOCALS.vDnOozVzna} />}
              </Button>
            )}
        </Space>
      </div>

      <Modal
        title={<Trans i18nKey={LOCALS.modify_recipient_information} />}
        open={modifyMailingInformationModalOpen}
        onOk={onModifyMailingInformationOk}
        onCancel={() => {
          setModifyMailingInformationModalOpen(false);
          mailingInformationForm.resetFields();
        }}
        width={600}
      >
        <Form
          labelCol={{ span: 6 }}
          form={mailingInformationForm}
          initialValues={{
            deliveryCompany,
            deliverySn,
          }}
        >
          <Form.Item
            name="deliveryCompany"
            label={<Trans i18nKey={LOCALS.delivery_method} />}
            rules={[{ required: true }]}
          >
            <Select
              placeholder={i18n.t(LOCALS.please_enter) || ''}
              options={DELIVERY_METHOD_OPTION_LIST}
            ></Select>
          </Form.Item>

          <Form.Item
            name="deliverySn"
            label={<Trans i18nKey={LOCALS.shipment_number} />}
            rules={[{ required: true }]}
          >
            <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Trans i18nKey={LOCALS.modify_recipient_information} />}
        open={modifyRecipientInformationModalOpen}
        onOk={onModifyRecipientInformationOk}
        onCancel={() => {
          setModifyRecipientInformationModalOpen(false);
          recipientInformationForm.resetFields();
        }}
        width={700}
      >
        <Form
          labelCol={{ span: 6 }}
          form={recipientInformationForm}
          initialValues={{
            receiverName,
            receiverPhone,
            receiverPostCode,
            receiverProvince,
            receiverCity,
            receiverDetailAddress,
          }}
        >
          <Form.Item
            name="receiverName"
            label={<Trans i18nKey={LOCALS.name} />}
            rules={[{ required: true }]}
          >
            <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>

          <Form.Item
            name="receiverProvince"
            label={<Trans i18nKey={LOCALS.country_region} />}
            rules={[{ required: true }]}
          >
            <Select
              onChange={() => {
                recipientInformationForm.setFieldValue('receiverCity', '');
              }}
              options={countryOptions}
              showSearch
              filterOption={(input: string, option?: any) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="receiverCity"
            label={<Trans i18nKey={LOCALS.state_province_city} />}
          >
            <Select
              allowClear
              options={cityList.map((i) => {
                return {
                  value: i.code,
                  label: i.name,
                };
              })}
              showSearch
              filterOption={(input: string, option?: any) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="receiverDetailAddress"
            label={<Trans i18nKey={LOCALS.detail_address} />}
            rules={[{ required: true }]}
          >
            <Input.TextArea
              rows={4}
              placeholder={i18n.t(LOCALS.please_enter) || ''}
            />
          </Form.Item>

          <Form.Item
            name="receiverPhone"
            label={<Trans i18nKey={LOCALS.phone_number} />}
            rules={[{ required: true }]}
          >
            <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>

          <Form.Item
            name="receiverPostCode"
            label={<Trans i18nKey={LOCALS.zip_code} />}
            rules={[{ required: true }]}
          >
            <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={shipModalOpen}
        title={<Trans i18nKey={LOCALS.ship} />}
        onCancel={() => {
          setShipModalOpen(false);
          shipForm.resetFields();
        }}
        onOk={onShipOk}
        width={500}
      >
        <Form
          form={shipForm}
          labelCol={{ span: 8 }}
          initialValues={{
            deliveryCompany:
              deliveryType === OrderDeliveryTypeMap.PICKUP
                ? DELIVERY_METHOD_MAP.Self_pick_up
                : '',
          }}
        >
          <Form.Item
            label={<Trans i18nKey={LOCALS.delivery_method} />}
            name="deliveryCompany"
            rules={[{ required: true }]}
          >
            <Select
              disabled={deliveryType === OrderDeliveryTypeMap.PICKUP}
              options={DELIVERY_METHOD_OPTION_LIST}
              placeholder={i18n.t(LOCALS.please_select)}
            ></Select>
          </Form.Item>
          <Form.Item
            label={<Trans i18nKey={LOCALS.shipment_number} />}
            name="deliverySn"
            rules={[{ required: deliveryType !== OrderDeliveryTypeMap.PICKUP }]}
          >
            <Input
              disabled={deliveryType === OrderDeliveryTypeMap.PICKUP}
              placeholder={i18n.t(LOCALS.please_enter) || ''}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={completeOrderModalOpen}
        title={<Trans i18nKey={LOCALS.complete_order} />}
        onCancel={() => {
          setCompleteOrderModalOpen(false);
        }}
        onOk={onCompleteOrderOk}
      >
        <Form form={completeOrderForm} labelCol={{ span: 6 }}>
          <Form.Item
            name="isPointsGiven"
            label={<Trans i18nKey={LOCALS.points_earned} />}
            initialValue={true}
          >
            <Radio.Group>
              <Radio value={true}>
                <Trans i18nKey={LOCALS.yes} />
              </Radio>
              <Radio value={false}>
                <Trans i18nKey={LOCALS.no} />
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            rules={[{ required: true }]}
            name="note"
            label={<Trans i18nKey={LOCALS.remark} />}
          >
            <Input.TextArea placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={remarkModalOpen}
        title={<Trans i18nKey={LOCALS.operation_remark} />}
        onCancel={() => {
          setRemarkModalOpen(false);
          remarkForm.resetFields();
        }}
        onOk={onRemarkOk}
      >
        <Form form={remarkForm}>
          <Form.Item
            name="note"
            label={<Trans i18nKey={LOCALS.remark} />}
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={closeOrderModalOpen}
        title={<Trans i18nKey={LOCALS.close_order} />}
        onCancel={() => {
          setCloseOrderModalOpen(false);
          closeOrderForm.resetFields();
        }}
        onOk={onCloseOrderOk}
      >
        {[
          ORDER_STATUS_MAP.TO_BE_DELIVERED,
          ORDER_STATUS_MAP.DELIVERED,
        ].includes(status) && (
          <div style={{ color: 'red', marginBottom: 6 }}>
            <Trans i18nKey={LOCALS.bzsNZmtrmS} />
          </div>
        )}

        <Form form={closeOrderForm}>
          <Form.Item
            name="note"
            label={<Trans i18nKey={LOCALS.remark} />}
            // rules={[{ required: true }]}
          >
            <Input.TextArea
              placeholder={i18n.t(LOCALS.please_enter_remark) || ''}
            />
          </Form.Item>
        </Form>
      </Modal>

      {finalSettlementModalOpen && (
        <FinalSettlement
          open={finalSettlementModalOpen}
          onCancel={(b) => toggleFinalSettlementModalOpen(b)}
          omsOrderDetail={omsOrderDetail}
        />
      )}
    </div>
  );
};

export default OrderOperate;
