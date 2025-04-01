import { useCallback, useRef, useMemo, useState } from 'react';
import styles from './index.module.scss';
import { useParams } from 'react-router-dom';
import { Button, Space, Card, Descriptions, Steps, Spin, Table } from 'antd';
import {
  CustomerInfoDefault,
  UserProductInfoDefault,
  ValuationInfoDefault,
  ProductInfoDefault,
  LogisticsInfoDefault,
  ReturnGoodsDefault,
  ContractDefault,
  CollectionDefault,
  OMS_RECYCLE_ORDER_STATUS_MAP,
  ShopMaping,
  consultingSource,
} from 'constants/RecyclingConsignment';
import useHandleDetailData from './useHandleDetailData';
import useMoreModal from 'pages/rrs/recycling-consignment/modal-components';
import { SelectOption } from 'types/base';
import LinkButton from 'components/link-button';
import ImageSliceShow from 'components/image-slice-show';
import type { DescriptionsProps } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import getStoreTimezone from 'utils/getStoreTimezone';
import { StoreStatusOption } from 'constants/appointment-management';
import { OMS_RECYCLE_ORDER_CONTRACT_TYPE_MAP, SHOP_MAP } from 'commons/options';
import ModifyLogistics from './modify-logistics';
import useResource from 'commons/hooks/useResource';
import MemberMailSend from 'pages/sys/member-mail-send';
import RecycleOrderPriorityTag from '../recycling-consignment/components/recycle-order-priority-tag';
import ModifyValuation from './modify-valuation';
import LayoutFloatButton from 'components/layout-float-button';
import ModifyPayment from './modify-payment';
import ModifyOperation from './modify-operation';
import LOCALS from '../../../commons/locals';
import { Trans } from 'react-i18next';
import i18n from '../../../i18n';
import { useToggle } from 'react-use';
import Dempyou from './dempyou-modal';
import { OmsRecycleOrderDetail } from 'types/oms';
import {
  getDempyouProduct,
  getDempyouOrderInfo,
  getDempyouToPrint,
} from 'utils/getDempyouParam';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { getProductLabel } from 'utils/getProductLabel';

dayjs.extend(utc);
dayjs.extend(timezone);

const DescProps = {
  labelStyle: { width: '13%' },
  contentStyle: { width: '20%' },
  bordered: true,
  column: 3,
};

const RecyclingConsignmentDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  /** Modal参数 */
  const modalOptionRef = useRef<any>({});
  const viewUserInfoResource = useResource(
    'recycling-consignment-view-user-info'
  );
  const {
    staffSelectOptions,
    countryOptions,
    productCategoryCascaderOptions,
    colorSelectOptions,
    rankSelectOptions,
    stampSelectOptions,
    materialCascaderOptionsMap,
    hardwareSelectOptions,
    accessorySelectOptions,
  } = useAppSelector(selectGlobalInfo);

  const [modifyLogisticsOpen, setModifyLogisticsOpen] = useState(false);
  const [modifyPaymentOpen, setModifyPaymentOpen] = useState(false);
  const [modifyOperationOpen, setModifyOperationOpen] = useState(false);

  /** 详情相关数据 */
  const {
    loading,
    dataSource,
    currentStep,
    baseInfo,
    customerInfo,
    userProductInfo,
    productInfo,
    valuationInfo,
    logisticsInfo,
    returnGoodsInfo,
    collectionInfo,
    logList,
    contractList,
    getDetail,
  } = useHandleDetailData({ id });
  /** 弹窗相关数据 */
  const {
    valuationModalElement,
    setValuationModalOpen,
    shiplableModalElement,
    setShiplableModalOpen,
    goodsReceivedModalElement,
    setGoodsReceivedModalOpen,
    finalValuationModalElement,
    setFinalValuationModalOpen,
    logisticsDocumentModalElement,
    setLogisticsDocumentModalOpen,
    updateFinalValuationModalElement,
    setUpdateFinalValuationModalOpen,
    confirmSettlementModalElement,
    setConfirmSettlementModalOpen,
    confirmReturnModalElement,
    setConfirmReturnModalOpen,
    createPaymentVoucherModalElement,
    setPaymentVoucherModalOpen,
    cancelOrderModalElement,
    setCancelOrderModalOpen,
    deliverGoodsModalElement,
    setDeliverGoodsModalOpen,
    setCustomerAgreeValuationModalOpen,
    customerAgreeValuationModalElement,
    setPayInfoModalOpen,
    payInfoModalElement,
    completeModalElement,
    setCompleteModalOpen,
    consignmentToRecyclingModalElement,
    setConsignmentToRecyclingModalOpen,
  } = useMoreModal({
    dataSource,
    modalOption: modalOptionRef.current,
    getLoad: getDetail,
  });

  const storeId = dataSource.omsRecycleOrder?.storeId;
  const contractLang = storeId === SHOP_MAP.GINZA ? 'ja' : 'en';

  const [dempyouModalOpen, toggleDempyouModalOpen] = useToggle(false);

  /** 操作按钮 */
  const renderOption = useCallback(() => {
    if (!dataSource) return;
    const orderStatus = dataSource?.omsRecycleOrder?.status || 0;
    const stateWrapper = dataSource?.omsRecycleOrderLogistics?.stateWrapper;
    const shippingDocument =
      dataSource?.omsRecycleOrderLogistics?.shippingDocument;
    const cancelType = dataSource?.omsRecycleOrder?.cancelType;
    const appointmentId = dataSource.omsRecycleOrder?.appointmentId;
    const isSaleToRecycle = dataSource.omsRecycleOrder?.isSaleToRecycle;
    const createdFrom = consultingSource.findIndex(
      (d) => d.value === dataSource.omsRecycleOrder?.createdFrom
    );
    const stateWrapperShippingDocument: string[] = JSON.parse(
      dataSource?.omsRecycleOrderLogistics?.stateWrapperShippingDocument || '[]'
    );

    return (
      <Space>
        {/* 初步估值 状态为【1-待初步估值】才有该按钮 */}
        {(orderStatus === OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_FIRST_VALUATION ||
          orderStatus === OMS_RECYCLE_ORDER_STATUS_MAP.VALUATION_EXPIRED) && (
          <Button
            size="small"
            onClick={() => {
              setValuationModalOpen(true);
            }}
          >
            {orderStatus ===
              OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_FIRST_VALUATION &&
              i18n.t(LOCALS.initial_appraisal_o)}
            {orderStatus === OMS_RECYCLE_ORDER_STATUS_MAP.VALUATION_EXPIRED &&
              i18n.t(LOCALS.re_evaluate)}
          </Button>
        )}
        {/* 2-客户同意初步报价 */}
        {orderStatus ===
          OMS_RECYCLE_ORDER_STATUS_MAP.HAS_BEEN_FIRST_VALUATION &&
          createdFrom > -1 && (
            <Button
              size="small"
              onClick={() => {
                setDeliverGoodsModalOpen(true);
              }}
            >
              选择发货
            </Button>
          )}
        {/* 状态为【3-待收货(2-客户同意初步报价)】 */}
        {[3].includes(orderStatus as number) && (
          <>
            {/* 上传shiplable：只有香港能上传 shippinglabel */}
            {dataSource?.omsRecycleOrder?.storeId === 2 && (
              <Button
                size="small"
                onClick={() => {
                  setShiplableModalOpen(true);
                }}
              >
                {dataSource?.omsRecycleOrderLogistics?.shippingLabel
                  ? '查看Shiplable'
                  : i18n.t(LOCALS.upload_shiplable)}
              </Button>
            )}
            {/* 确认收货：上传了邮寄凭证 */}
            {(shippingDocument || appointmentId) && (
              <Button
                size="small"
                onClick={() => {
                  setGoodsReceivedModalOpen(true);
                }}
              >
                <Trans i18nKey={LOCALS.confirm_receipt} />
              </Button>
            )}
            {/* 包装材料:1.需要，0：不需要 */}
            {stateWrapper === 1 && (
              <Button
                size="small"
                onClick={() => {
                  setLogisticsDocumentModalOpen(true);
                }}
              >
                {stateWrapperShippingDocument.length
                  ? i18n.t(LOCALS.view_packaging_materials_certificate)
                  : i18n.t(LOCALS.upload_packing_slip)}
              </Button>
            )}
          </>
        )}
        {/* 状态为【4-待最终报价】 */}
        {orderStatus === 4 && (
          <div>
            <Button
              size="small"
              onClick={() => {
                setFinalValuationModalOpen(true);
              }}
            >
              {i18n.t(LOCALS.final_quote)}
            </Button>
          </div>
        )}
        {/* 5-待客户确认 */}
        {orderStatus ===
          OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_AGREE_FINAL_VALUATION &&
          createdFrom > -1 && (
            <div>
              <Button
                size="small"
                onClick={() => {
                  setCustomerAgreeValuationModalOpen(true);
                }}
              >
                同意最终报价
              </Button>
            </div>
          )}
        {/* 5-待客户确认，6-寄卖中 
            【8-待退货 + 5用户拒绝最终报价】= 用户拒绝最终报价
            */}
        {(orderStatus === 8 && cancelType === 5) ||
        [6].includes(orderStatus as number) ? (
          <>
            <div>
              <Button
                size="small"
                onClick={() => {
                  modalOptionRef.current = {
                    UpdateFinalValuation: {
                      status: orderStatus,
                    },
                  };
                  setUpdateFinalValuationModalOpen(true);
                }}
              >
                {i18n.t(LOCALS.modify_quote)}
              </Button>
            </div>
          </>
        ) : null}

        {(orderStatus === OMS_RECYCLE_ORDER_STATUS_MAP.ON_SALE ||
          (!!isSaleToRecycle &&
            [
              OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_FINAL_VALUATION,
              OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_AGREE_FINAL_VALUATION,
            ].includes(orderStatus as number))) && (
          <>
            <div>
              <Button
                size="small"
                onClick={() => {
                  setConfirmSettlementModalOpen(true);
                }}
              >
                {i18n.t(LOCALS.confirm_settlement)}
              </Button>
            </div>
          </>
        )}

        {/* 7-待打款 */}
        {orderStatus === 7 && (
          <>
            <Button
              size="small"
              onClick={() => {
                setPaymentVoucherModalOpen(true);
                modalOptionRef.current = {
                  PaymentVoucher: {
                    type: 'create',
                  },
                };
              }}
            >
              {i18n.t(LOCALS.upload_payment_proof)}
            </Button>
            {createdFrom > -1 && (
              <Button
                size="small"
                onClick={() => {
                  setPayInfoModalOpen(true);
                }}
              >
                填写打款信息
              </Button>
            )}
          </>
        )}
        {/* 8-待退货 */}
        {orderStatus === 8 && (
          <Button
            size="small"
            onClick={() => {
              setConfirmReturnModalOpen(true);
            }}
          >
            {i18n.t(LOCALS.confirm_return)}
          </Button>
        )}
        {/* 取消订单-寄卖中之前的都有取消订单 */}
        {[1, 2, 3, 4, 5, 6].includes(orderStatus as number) && (
          <Button size="small" onClick={() => setCancelOrderModalOpen(true)}>
            {i18n.t(LOCALS.cancel_order)}
          </Button>
        )}
        {/* 13-表示已打款，但是还没确认收款 */}
        {orderStatus === 13 && (
          <Button
            size="small"
            onClick={() => {
              modalOptionRef.current = {
                PaymentVoucher: {
                  type: 'update',
                },
              };
              setPaymentVoucherModalOpen(true);
            }}
          >
            重新上传凭证
          </Button>
        )}
        {[
          OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_FIRST_VALUATION,
          OMS_RECYCLE_ORDER_STATUS_MAP.HAS_BEEN_FIRST_VALUATION,
          OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_GOODS_RECEIVED,
          OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_FINAL_VALUATION,
          OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_AGREE_FINAL_VALUATION,
          OMS_RECYCLE_ORDER_STATUS_MAP.VALUATION_EXPIRED,
        ].includes(orderStatus) && (
          <Button
            size="small"
            onClick={() => {
              setCompleteModalOpen(true);
            }}
          >
            {i18n.t('one_click_completion')}
          </Button>
        )}
        {
          <Button size="small" onClick={toggleDempyouModalOpen}>
            {i18n.t('yYqvdvcMFh')}
          </Button>
        }
        {OMS_RECYCLE_ORDER_STATUS_MAP.ON_SALE === orderStatus && (
          <Button
            size="small"
            onClick={() => setConsignmentToRecyclingModalOpen(true)}
          >
            {i18n.t('consignment_to_recycling')}
          </Button>
        )}
      </Space>
    );
  }, [
    dataSource,
    toggleDempyouModalOpen,
    setValuationModalOpen,
    setDeliverGoodsModalOpen,
    setShiplableModalOpen,
    setGoodsReceivedModalOpen,
    setLogisticsDocumentModalOpen,
    setFinalValuationModalOpen,
    setCustomerAgreeValuationModalOpen,
    setUpdateFinalValuationModalOpen,
    setConfirmSettlementModalOpen,
    setPaymentVoucherModalOpen,
    setPayInfoModalOpen,
    setConfirmReturnModalOpen,
    setCancelOrderModalOpen,
    setCompleteModalOpen,
    setConsignmentToRecyclingModalOpen,
  ]);

  /* 基础信息 */
  const baseInfoEle = useMemo(() => {
    if (baseInfo) {
      let items: DescriptionsProps['items'] = [
        {
          key: 'code',
          label: <Trans i18nKey={LOCALS.code} />,
          children: baseInfo.code,
        },
        {
          key: 'type',
          label: <Trans i18nKey={LOCALS.order_type} />,
          children: baseInfo.type,
        },
        {
          key: 'status',
          label: <Trans i18nKey={LOCALS.order_status} />,
          children: baseInfo.status,
        },
        {
          label: <Trans i18nKey={LOCALS.created_time} />,
          key: 'createTime',
          children: baseInfo.createTime,
        },
        {
          label: <Trans i18nKey={LOCALS.intention_confirmation_time} />,
          key: 'intentionTime',
          children: baseInfo.intentionTime,
        },
        {
          label: <Trans i18nKey={LOCALS.contract_confirmation_time} />,
          key: 'contractTime',
          children: baseInfo.contractTime,
        },
        {
          label:
            dataSource?.omsRecycleOrder?.phaseType === 5
              ? i18n.t(LOCALS.cancel_order_time)
              : i18n.t(LOCALS.transaction_completed_time),
          key: 'tradingTime',
          children: baseInfo.tradingTime,
        },
        {
          label: i18n.t(LOCALS.associated_sales_order),
          key: 'relatedSalesOrder',
          children: baseInfo.orderId ? (
            <LinkButton href={`/oms/order-view/${baseInfo.orderId}`}>
              {baseInfo.relatedSalesOrder}
            </LinkButton>
          ) : (
            '-'
          ),
        },
        {
          label: i18n.t(LOCALS.associated_product_id),
          key: 'associatedProductId',
          children: baseInfo.associatedProductId ? (
            <LinkButton
              href={`/pms/product-edit/${baseInfo.associatedProductId}`}
            >
              {baseInfo.associatedProductId}
            </LinkButton>
          ) : (
            '-'
          ),
        },
        {
          label: i18n.t(LOCALS.channel),
          key: 'channel',
          children: baseInfo.channel,
        },
        {
          label: i18n.t(LOCALS.created_by),
          key: 'createBy',
          children: baseInfo.createId ? (
            <LinkButton href={`/ums/member-view/${baseInfo.createId}`}>
              {baseInfo.createBy}
            </LinkButton>
          ) : (
            baseInfo.createBy
          ),
        },
        {
          label: i18n.t(LOCALS.shop_id),
          key: 'postStore',
          children: baseInfo.store,
        },
        {
          label: i18n.t(LOCALS.priority),
          key: 'priority',
          children: (
            <RecycleOrderPriorityTag
              id={dataSource?.omsRecycleOrder?.id}
              priority={dataSource?.omsRecycleOrder?.priority}
              onSuccess={() => {
                getDetail();
              }}
            />
          ),
        },
        {
          label: i18n.t(LOCALS.staff),
          key: 'postStore',
          children: baseInfo.store,
        },
      ];

      if (!viewUserInfoResource) {
        items = items.filter((i) => i.key !== 'createBy');
      }

      return (
        <div className={styles.info}>
          <Descriptions
            title={i18n.t(LOCALS.basic_info)}
            {...DescProps}
            items={items}
          />
        </div>
      );
    }
  }, [
    baseInfo,
    dataSource?.omsRecycleOrder?.id,
    dataSource?.omsRecycleOrder?.phaseType,
    dataSource?.omsRecycleOrder?.priority,
    getDetail,
    viewUserInfoResource,
  ]);

  /* 客户信息 */
  const customerInfoEle = useMemo(() => {
    if (customerInfo) {
      const items: DescriptionsProps['items'] = CustomerInfoDefault.map(
        ({ label, field }: { label: string; field: any }, i) => {
          return {
            key: field,
            label: label,
            children: (
              <>
                {field === 'memberId' ? (
                  <LinkButton
                    href={
                      customerInfo.memberId
                        ? `/ums/member-view/${customerInfo.memberId}`
                        : '#'
                    }
                  >
                    {customerInfo[field] || '-'}
                  </LinkButton>
                ) : (
                  customerInfo[field] || '-'
                )}
              </>
            ),
          };
        }
      );
      return (
        <div className={styles.info}>
          <Descriptions
            title={i18n.t(LOCALS.customer_info)}
            {...DescProps}
            items={items}
          />
        </div>
      );
    }
  }, [customerInfo]);

  /* 用户提交商品信息 */
  const userProductInfoEle = useMemo(() => {
    if (userProductInfo) {
      const items: DescriptionsProps['items'] = UserProductInfoDefault.map(
        ({ label, field }: { label: string; field: any }, i) => {
          const t = userProductInfo[field];
          return {
            key: field,
            label: label,
            children: (
              <>
                {field === 'picList' || field === 'storeReceiptPicsList' ? (
                  <ImageSliceShow imgList={t || []} />
                ) : (
                  <>{t || '-'}</>
                )}
              </>
            ),
          };
        }
      );
      return (
        <div className={styles.info}>
          <Descriptions
            title={i18n.t(LOCALS.user_submitted_product_info)}
            {...DescProps}
            items={items}
          />
        </div>
      );
    }
  }, [userProductInfo]);

  /* 商品实际信息 */
  const productInfoEle = useMemo(() => {
    if (productInfo) {
      const items: DescriptionsProps['items'] = ProductInfoDefault.map(
        ({
          label,
          field,
          span = 1,
        }: {
          label: string;
          field: any;
          span?: number;
        }) => {
          const t = productInfo[field];
          return {
            key: field,
            label: label,
            span,
            children: (
              <>
                {['picList', 'info'].includes(field) ? (
                  <>
                    {field === 'picList' && (
                      <ImageSliceShow imgList={t || []} />
                    )}
                    {field === 'info' && (
                      <div className={styles.items}>
                        {t &&
                          t.map((d: SelectOption, i: number) => (
                            <div className={styles.itemWarp} key={d.value || i}>
                              <div className={styles.name}>{d.label}：</div>
                              <div
                                className={styles.value}
                                style={{ whiteSpace: 'pre-wrap' }}
                              >
                                {d.value}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                ) : (
                  <> {t || '-'}</>
                )}
              </>
            ),
          };
        }
      );
      return (
        <div className={styles.info}>
          <Descriptions
            title={i18n.t(LOCALS.genuine_product_info)}
            {...DescProps}
            items={items}
          />
        </div>
      );
    }
  }, [productInfo]);

  /* 估值信息 */
  const valuationInfoEle = useMemo(() => {
    if (valuationInfo) {
      const items: DescriptionsProps['items'] = ValuationInfoDefault.map(
        ({ label, field }: { label: string; field: any }, i) => ({
          key: field,
          label: label,
          children: <>{valuationInfo[field] || '-'}</>,
        })
      );
      return (
        <div className={styles.info}>
          <Descriptions
            title={
              <div className="flex items-center justify-between">
                <span>
                  {i18n.t(LOCALS.valuation_information)}{' '}
                  {valuationInfo['currency'] || 'JPY'}
                </span>
                <ModifyValuation
                  currency={valuationInfo['currency']}
                  data={dataSource}
                  onSuccess={() => {
                    getDetail();
                  }}
                />
              </div>
            }
            {...DescProps}
            items={items}
          />
        </div>
      );
    }
  }, [dataSource, getDetail, valuationInfo]);

  // 预约信息
  const appointmentStoreInfoEle = useMemo(() => {
    const { omsAppointmentStoreRecord } = dataSource;

    if (!omsAppointmentStoreRecord) return null;

    const { storeId, status, code, beginTime, endTime } =
      omsAppointmentStoreRecord;

    if (!storeId || !beginTime || !endTime) {
      return null;
    }

    const statusText = StoreStatusOption.find((i) => i.value === status)?.label;

    return (
      <div className={styles.info}>
        <Descriptions
          title={i18n.t(LOCALS.appointment_information)}
          {...DescProps}
          items={[
            {
              key: 1,
              label: i18n.t(LOCALS.shop),
              children: <div>{storeId && ShopMaping[storeId]}</div>,
            },
            {
              key: 2,
              label: i18n.t(LOCALS.appointment_time_slot),
              children: (
                <div>
                  {dayjs(beginTime)
                    .tz(getStoreTimezone(storeId))
                    .format('YYYY-MM-DD')}{' '}
                  {dayjs(beginTime)
                    .tz(getStoreTimezone(storeId))
                    .format('HH:mm')}
                  -
                  {dayjs(endTime).tz(getStoreTimezone(storeId)).format('HH:mm')}
                </div>
              ),
            },
            {
              key: 3,
              label: i18n.t(LOCALS.status),
              children: <div>{statusText}</div>,
            },
            {
              key: 4,
              label: i18n.t(LOCALS.appointment_number),
              children: <div>{code}</div>,
            },
          ]}
        />
      </div>
    );
  }, [dataSource]);

  /* 物流信息 */
  const logisticsInfoEle = useMemo(() => {
    // RecycleOrderStatus > 2 &&
    if (logisticsInfo) {
      const items: DescriptionsProps['items'] = LogisticsInfoDefault.map(
        ({ label, field }: { label: string; field: any }, i) => {
          const t = logisticsInfo[field];
          if (
            ['mailingInfoPhoto', 'cargoInfoPhoto', 'receivingPhoto'].includes(
              field
            )
          ) {
            return {
              key: field,
              label: label,
              children: <ImageSliceShow imgList={t || []} />,
            };
          }
          return {
            key: field,
            label: label,
            children: <>{t || '-'}</>,
          };
        }
      );
      return (
        <div className={styles.info}>
          <Descriptions
            title={
              <div className="flex items-center justify-between">
                <span>
                  {i18n.t(LOCALS.logistics_information)}
                  {dataSource?.omsRecycleOrderLogistics?.stateWrapper === 1 && (
                    <span className={styles.tips}>
                      *{i18n.t(LOCALS.packaging_materials_required)}
                    </span>
                  )}
                </span>
                <Button
                  type="primary"
                  onClick={() => {
                    setModifyLogisticsOpen(true);
                  }}
                >
                  {i18n.t(LOCALS.modify_logistics_information)}
                </Button>
              </div>
            }
            {...DescProps}
            items={items}
          />
        </div>
      );
    }
  }, [logisticsInfo, dataSource]);

  /* 退货信息 */
  const returnGoodsInfoEle = useMemo(() => {
    // RecycleOrderStatus > 4 &&
    if (returnGoodsInfo) {
      const items: DescriptionsProps['items'] = ReturnGoodsDefault.map(
        ({ label, field }: { label: string; field: any }, i) => {
          const t = returnGoodsInfo[field];
          if (field === 'returnVoucher') {
            return {
              key: field,
              label: label,
              children: <ImageSliceShow imgList={t || []} />,
            };
          }
          return {
            key: field,
            label: label,
            children: <> {t || '-'}</>,
          };
        }
      );
      return (
        <div className={styles.info}>
          <Descriptions
            title={i18n.t(LOCALS.return_information)}
            {...DescProps}
            items={items}
          />
        </div>
      );
    }
  }, [returnGoodsInfo]);

  /* 收款信息 */
  const collectionInfoEle = useMemo(() => {
    // RecycleOrderStatus > 5 &&
    if (collectionInfo) {
      const items: DescriptionsProps['items'] = (
        viewUserInfoResource
          ? CollectionDefault
          : CollectionDefault.filter((i) => i.field !== 'financialPaymentInfo')
      ).map(
        ({
          label,
          field,
          span = 1,
        }: {
          label: string;
          field: any;
          span?: number;
        }) => {
          const t = collectionInfo[field];
          if (field === 'financialPaymentVoucher') {
            return {
              key: field,
              label: label,
              span,
              children: <ImageSliceShow imgList={t || []} />,
            };
          }
          if (field === 'financialPaymentInfo') {
            return {
              key: field,
              label: label,
              span,
              children: (
                <div className={styles.items}>
                  {t &&
                    t.map((d: any, i: number) => (
                      <div className={styles.itemWarp} key={i}>
                        <div className={styles.name} style={{ width: 150 }}>
                          {d.label}：
                        </div>
                        <div className={styles.value}>{d.value}</div>
                      </div>
                    ))}
                </div>
              ),
            };
          }
          return {
            key: field,
            label: label,
            span,
            children: <>{t || '-'}</>,
          };
        }
      );
      return (
        <div className={styles.info}>
          <Descriptions
            title={
              <div className="flex items-center justify-between">
                <span>{i18n.t(LOCALS.payment_information)}</span>
                <Button
                  type="primary"
                  onClick={() => {
                    setModifyPaymentOpen(true);
                  }}
                >
                  {i18n.t(LOCALS.update_payment_information)}
                </Button>
              </div>
            }
            {...DescProps}
            items={items}
          />
        </div>
      );
    }
  }, [collectionInfo, viewUserInfoResource]);

  const forwardReceipt = useCallback(
    async (data: OmsRecycleOrderDetail) => {
      const label = getProductLabel(
        {
          productCategoryCascaderOptions,
          colorSelectOptions,
          rankSelectOptions,
          stampSelectOptions,
          materialCascaderOptionsMap,
          hardwareSelectOptions,
          accessorySelectOptions,
        },
        {
          attrAccessory: data.omsRecycleOrderProduct?.accessory,
          attrColor: data.omsRecycleOrderProduct?.attrColor,
          attrHardware: data.omsRecycleOrderProduct?.attrHardware,
          attrMaterial: data.omsRecycleOrderProduct?.attrMaterial,
          attrSize: data.omsRecycleOrderProduct?.attrSize,
          attrStamp: data.omsRecycleOrderProduct?.attrStamp,
          productCategoryId: data.omsRecycleOrderProduct?.productCategoryId,
        }
      );
      // 「商品名　尺寸　素材　色　刻印　金具」
      const name = `${label.productCategorySelectLabelList} ${label.materialSelectLabelList} ${label.colorSelectLabelList} ${label.stampSelectLabel} ${label.hardwareSelectLabel}`;
      const prod = getDempyouProduct(data, { name });
      const order = await getDempyouOrderInfo(data, {
        staffSelectOptions,
        countryOptions,
      });
      if (prod && order) {
        getDempyouToPrint({
          productList: [prod],
          printParam: order,
        });
      }
    },
    [
      accessorySelectOptions,
      colorSelectOptions,
      countryOptions,
      hardwareSelectOptions,
      materialCascaderOptionsMap,
      productCategoryCascaderOptions,
      rankSelectOptions,
      staffSelectOptions,
      stampSelectOptions,
    ]
  );
  /* 合同信息 */
  const contractListEle = useMemo(() => {
    // RecycleOrderStatus > 5 &&
    if (contractList && contractList[0]) {
      const d = contractList[0];
      const items: DescriptionsProps['items'] = ContractDefault.map(
        ({ label, field }: { label: string; field: any }) => {
          const contractEle = (
            <Space>
              <span>{i18n.t(LOCALS.contract)}</span>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  window.open(
                    `/prints/contract/${dataSource.omsRecycleOrder?.id}/OckQ3AOXjufGMA1jzb08HAEBYUeF?pwd=OckQ3AOXjufGMA1jzb08HAEBYUeF&lang=${contractLang}&type=${OMS_RECYCLE_ORDER_CONTRACT_TYPE_MAP.SHOP_USER}`
                  );
                }}
              >
                {i18n.t(LOCALS.customer_version)}
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  window.open(
                    `/prints/contract/${dataSource.omsRecycleOrder?.id}/OckQ3AOXjufGMA1jzb08HAEBYUeF?pwd=OckQ3AOXjufGMA1jzb08HAEBYUeF&lang=${contractLang}&type=${OMS_RECYCLE_ORDER_CONTRACT_TYPE_MAP.SHOP_ADMIN}`
                  );
                }}
              >
                {i18n.t(LOCALS.store_version)}
              </Button>
            </Space>
          );
          const receiptEle = (
            <Space>
              <span>{i18n.t(LOCALS.receipt)}</span>
              <Button
                type="link"
                size="small"
                onClick={() => forwardReceipt(dataSource)}
              >
                {i18n.t(LOCALS.customer_version)}/{i18n.t(LOCALS.store_version)}
              </Button>
            </Space>
          );
          return {
            key: field,
            label: label,
            children: (
              <>
                {/*  0-未确认，1-寄卖，2-回收 */}
                {field === 'url' ? (
                  <>
                    {dataSource.omsRecycleOrder?.type === 1 ? (
                      <>
                        {contractEle}
                        {receiptEle}
                      </>
                    ) : (
                      <>{receiptEle}</>
                    )}
                  </>
                ) : (
                  d[field]
                )}
              </>
            ),
          };
        }
      );
      return (
        <div className={styles.info}>
          <Descriptions
            title={i18n.t(LOCALS.contract_information)}
            {...DescProps}
            items={items}
          />
        </div>
      );
    }
  }, [contractLang, contractList, dataSource, forwardReceipt]);

  /* 操作记录 */
  const logListEle = useMemo(
    () => (
      <div className={styles.info}>
        <Descriptions
          title={
            <div className="flex items-center justify-between">
              <span>{i18n.t(LOCALS.operation_log)}</span>
              <Button
                type="primary"
                onClick={() => {
                  setModifyOperationOpen(true);
                }}
              >
                {i18n.t(LOCALS.modification_operation_record)}
              </Button>
            </div>
          }
          {...DescProps}
        ></Descriptions>
        <Table
          dataSource={logList}
          columns={[
            {
              title: i18n.t(LOCALS.operation_time),
              dataIndex: 'time',
              key: 'time',
              width: '25%',
            },
            {
              title: i18n.t(LOCALS.operator),
              dataIndex: 'personnel',
              key: 'personnel',
              width: '25%',
            },
            {
              title: i18n.t(LOCALS.operation_content),
              dataIndex: 'remark',
              key: 'remark',
              width: '50%',
              render: (text) => (
                <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
              ),
            },
            // {
            //   title: '状态变更',
            //   dataIndex: 'statusChage',
            //   key: 'statusChage',
            //   width: 250,
            // },
          ]}
          rowKey={'id'}
          scroll={{ y: 400 }}
        />
      </div>
    ),
    [logList]
  );

  /** 步骤条显示 */
  const stepsEle = useMemo(() => {
    const step0 = {
      title: i18n.t(LOCALS.inquiry_order_progress),
    };
    const step1 = {
      title: i18n.t(LOCALS.intentional_order_progress),
    };
    const step2 = {
      title: i18n.t(LOCALS.contract_order_progress),
    };
    const step3_1 = {
      title: i18n.t(LOCALS.transaction_completed),
    };
    const step3_2 = {
      title: i18n.t(LOCALS.cancelled),
    };
    let items: any = [step0, step1, step2, step3_1];
    // 1-咨询取消，2-意向取消，3-合同取消
    const orderCancelType = dataSource.omsRecycleOrder?.orderCancelType;
    if (orderCancelType) {
      if (orderCancelType === 1) items = [step0, step3_2];
      if (orderCancelType === 2) items = [step0, step1, step3_2];
      if (orderCancelType === 3) items = [step0, step1, step2, step3_2];
    }
    return <Steps current={currentStep} items={items} />;
  }, [dataSource, currentStep]);

  return (
    <div className={styles.RecyclingConsignmentDetail}>
      <Spin spinning={loading}>
        {stepsEle}
        <div className={styles.option}>
          <Card title={i18n.t(LOCALS.option)}>{renderOption()}</Card>
        </div>
        {/* 基础信息 */}
        {baseInfoEle}
        {/* 客户信息 */}
        {viewUserInfoResource && customerInfoEle}
        {/* 用户提交商品信息 */}
        {userProductInfoEle}
        {/* 商品实际信息 */}
        {productInfoEle}
        {/* 估值信息 */}
        {valuationInfoEle}
        {/* 预约信息 */}
        {appointmentStoreInfoEle}
        {/* 物流信息 */}
        {logisticsInfoEle}
        {/* 退货信息 */}
        {returnGoodsInfoEle}
        {/* 收款信息 */}
        {collectionInfoEle}
        {/* 合同信息 */}
        {contractListEle}
        {/* 操作记录 */}
        {logListEle}
        <div>
          <h3 className="text-[16px] font-semibold">
            {i18n.t(LOCALS.send_email)}
          </h3>
          <MemberMailSend memberId={dataSource.omsRecycleOrder?.memberId} />
        </div>
        <LayoutFloatButton />
      </Spin>

      {/* -------下面是Modal弹窗-------- */}

      {/* 提交初步估值 */}
      {valuationModalElement()}

      {/* 上传shiplable */}
      {shiplableModalElement()}

      {/* 确认收货 */}
      {goodsReceivedModalElement()}

      {/* 最终报价 */}
      {finalValuationModalElement()}

      {/* 上传物流凭证 */}
      {logisticsDocumentModalElement()}

      {/* 修改报价 */}
      {updateFinalValuationModalElement()}

      {/* 确认结算 */}
      {confirmSettlementModalElement()}

      {/* 确认退货 */}
      {confirmReturnModalElement()}

      {/* 打款信息 */}
      {createPaymentVoucherModalElement()}

      {/* 取消订单 */}
      {cancelOrderModalElement()}

      {/* 意向订单-选择发货 */}
      {deliverGoodsModalElement()}

      {/* 意向订单-同意最终报价 */}
      {customerAgreeValuationModalElement()}

      {/* 意向订单-付款信息 */}
      {payInfoModalElement()}

      {/* 一键完成 */}
      {completeModalElement()}

      {/* 寄卖转回收 */}
      {consignmentToRecyclingModalElement()}

      <Dempyou
        open={dempyouModalOpen}
        onCancel={() => toggleDempyouModalOpen(false)}
        dataSource={dataSource}
        productInfo={productInfo}
      />

      {modifyLogisticsOpen && (
        <ModifyLogistics
          open={modifyLogisticsOpen}
          onCancel={() => {
            setModifyLogisticsOpen(false);
          }}
          onSuccess={() => {
            setModifyLogisticsOpen(false);
            getDetail();
          }}
          data={dataSource}
        />
      )}

      <ModifyPayment
        open={modifyPaymentOpen}
        onCancel={() => {
          setModifyPaymentOpen(false);
        }}
        onSuccess={() => {
          setModifyPaymentOpen(false);
          getDetail();
        }}
        dataSource={dataSource}
      />

      <ModifyOperation
        open={modifyOperationOpen}
        onCancel={() => {
          setModifyOperationOpen(false);
        }}
        onSuccess={() => {
          setModifyOperationOpen(false);
          getDetail();
        }}
        dataSource={dataSource}
      />
    </div>
  );
};

export default RecyclingConsignmentDetail;
