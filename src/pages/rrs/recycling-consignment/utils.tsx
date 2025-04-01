import React from 'react';
import styles from './index.module.scss';
import { Button } from 'antd';
import {
  OrderType,
  ShopMaping,
  consultingSource,
  ProductImageSort,
  OMS_RECYCLE_ORDER_STATUS_MAP,
  getRecycleOrderStatusText,
} from 'constants/RecyclingConsignment';
import type { ColumnsType, ColumnProps } from 'antd/es/table';
import { OmsRecycleOrderDetail } from 'types/oms';
import dayjs from 'dayjs';
import { thousands } from 'utils/tools';
import { NavigateFunction } from 'react-router-dom';
import { AlertOutlined } from '@ant-design/icons';
import ImageSliceShow from 'components/image-slice-show';
import RecycleOrderPriorityTag from './components/recycle-order-priority-tag';
import LOCALS from '../../../commons/locals';
import { Trans } from 'react-i18next';
import i18n from '../../../i18n';
import LinkButton from 'components/link-button';

interface Props {
  setRowData: (data: OmsRecycleOrderDetail) => void;
  setModalOption: (data: any) => void;
  navigate: NavigateFunction;
  setValuationModalOpen: (data: boolean) => void;
  setShiplableModalOpen: (data: boolean) => void;
  setGoodsReceivedModalOpen: (data: boolean) => void;
  setLogisticsDocumentModalOpen: (data: boolean) => void;
  setFinalValuationModalOpen: (data: boolean) => void;
  setUpdateFinalValuationModalOpen: (data: boolean) => void;
  setConfirmSettlementModalOpen: (data: boolean) => void;
  setConfirmReturnModalOpen: (data: boolean) => void;
  setPaymentVoucherModalOpen: (data: boolean) => void;
  setDeliverGoodsModalOpen: (data: boolean) => void;
  setCustomerAgreeValuationModalOpen: (data: boolean) => void;
  setPayInfoModalOpen: (data: boolean) => void;
  ProductShowData: (data: OmsRecycleOrderDetail) => React.ReactNode;
  getLoad: (page?: number, pageSize?: number) => void;
  status: string | number | undefined;
  viewUserInfoResource: boolean;
}

const getColumns = ({
  setRowData,
  setModalOption,
  navigate,
  setValuationModalOpen,
  setShiplableModalOpen,
  setGoodsReceivedModalOpen,
  setLogisticsDocumentModalOpen,
  setFinalValuationModalOpen,
  setUpdateFinalValuationModalOpen,
  setConfirmSettlementModalOpen,
  setConfirmReturnModalOpen,
  setPaymentVoucherModalOpen,
  setDeliverGoodsModalOpen,
  setCustomerAgreeValuationModalOpen,
  setPayInfoModalOpen,
  ProductShowData,
  getLoad,
  status,
  viewUserInfoResource,
}: Props): ColumnsType<OmsRecycleOrderDetail> => {
  // 头部
  const headCols: ColumnsType<OmsRecycleOrderDetail> = [
    {
      title: <Trans i18nKey={LOCALS.code} />,
      dataIndex: 'code',
      width: 150,
      render: (_, record: OmsRecycleOrderDetail) => {
        if (!record) return;
        return record.omsRecycleOrder?.code;
      },
    },
    {
      title: <Trans i18nKey={LOCALS.order_type} />,
      dataIndex: 'type',
      width: 120,
      render: (_, record) => {
        if (!record) return;
        let t = OrderType.find((d) => record.omsRecycleOrder?.type === d.value);
        if (t) {
          return t.label;
        }
      },
    },
    {
      title: i18n.t(LOCALS.priority),
      dataIndex: 'omsRecycleOrder',
      width: 120,
      render: (omsRecycleOrder: OmsRecycleOrderDetail['omsRecycleOrder']) => {
        if (!omsRecycleOrder) return;

        const { id, priority } = omsRecycleOrder;
        if (!id || !priority) return;

        return (
          <RecycleOrderPriorityTag
            id={id}
            priority={priority}
            onSuccess={() => {
              getLoad();
            }}
          />
        );
      },
    },
    {
      title: <Trans i18nKey={LOCALS.sHXnOEVSrC} />,
      dataIndex: 'submissionId',
      width: 150,
      render: (_, record: OmsRecycleOrderDetail) => {
        if (!record) return;
        return record.omsRecycleOrder?.submissionId;
      },
    },
  ];

  if (viewUserInfoResource) {
    headCols.push({
      title: <Trans i18nKey={LOCALS.member_info} />,
      dataIndex: 'name',
      width: 150,
      render: (_, record) => {
        if (!record) return;
        const { omsRecycleOrderItem, omsRecycleOrder } = record;
        if (omsRecycleOrderItem && omsRecycleOrder) {
          const { memberId } = omsRecycleOrderItem;
          const { email, phone } = omsRecycleOrder;
          return (
            <>
              <div>{memberId || '-'}</div>
              <div>{email || '-'}</div>
              <div>{phone && `+${phone}`}</div>
            </>
          );
        }
      },
    });
  }
  const storeCol: ColumnProps<OmsRecycleOrderDetail> = {
    title: <Trans i18nKey={LOCALS.shop_id} />,
    dataIndex: 'shopid',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      return ShopMaping[`${record.omsRecycleOrder?.storeId}`] || '-';
    },
  };
  
  const productLinkCol: ColumnProps<OmsRecycleOrderDetail> = {
    title: <Trans i18nKey={LOCALS.associated_product_id} />,
    width: 150,
    dataIndex: 'product_link',
    render: (_, record) => {
      if (!record) return;
      const productId = record.omsRecycleOrderItem?.productId;

      if (!productId) return '-';

      return (
        <LinkButton href={`/pms/product-edit/${productId}`}>
          {productId}
        </LinkButton>
      );
    },
  };

  const productImageCol: ColumnProps<OmsRecycleOrderDetail> = {
    title: <Trans i18nKey={LOCALS.product_pictures} />,
    dataIndex: 'image',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      try {
        const imgObj = JSON.parse(
          record?.omsRecycleOrderItem?.productPics || ''
        );
        if (imgObj) {
          let picList: string[] = [];
          // 处理图片顺序
          ProductImageSort.forEach((d) => {
            if (imgObj[d]) picList.push(imgObj[d]);
          });
          return <ImageSliceShow imgList={picList} endSliceNumber={1} />;
        }
      } catch (error) {
        return 'Error';
      }
    },
  };
  const productInfoCol: ColumnProps<OmsRecycleOrderDetail> = {
    title: <Trans i18nKey={LOCALS.product_info} />,
    dataIndex: 'productTitle',
    width: 250,
    ellipsis: true,
    render: (_, record) => {
      if (!record) return;
      if (!record?.omsRecycleOrderProduct) return;
      const data = ProductShowData(record);
      return data;
    },
  };
  const statusCol: ColumnProps<OmsRecycleOrderDetail> = {
    title: <Trans i18nKey={LOCALS.order_status} />,
    dataIndex: 'status',
    width: 150,
    align: 'center',
    render: (_, record) => {
      if (!record) return;
      // 状态为【3-待收货(2-客户同意初步报价)】
      const status = record?.omsRecycleOrder?.status || 0;
      // 包装材料:1.需要，0：不需要
      const stateWrapper = record?.omsRecycleOrderLogistics?.stateWrapper;
      /** 到店预约的状态没做 */
      return (
        <>
          <div>{getRecycleOrderStatusText(record.omsRecycleOrder)}</div>
          {status === 3 && stateWrapper === 1 && (
            <div className={styles.textCenter}>
              <AlertOutlined style={{ color: 'red' }} />
            </div>
          )}
        </>
      );
    },
  };
  const priceCol: ColumnProps<OmsRecycleOrderDetail> = {
    title: <Trans i18nKey={LOCALS.quoted_amount} />,
    dataIndex: 'price',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      if (record.omsRecycleOrderItem) {
        const {
          finalRecyclePrice = '',
          finalSalePrice = '',
          maxRecyclePrice = '',
          maxSalePrice = '',
          minRecyclePrice = '',
          minSalePrice = '',
        } = record.omsRecycleOrderItem;
        const currency = record?.omsRecycleOrder?.currency;
        const { type, status } = record?.omsRecycleOrder || {};
        const finalRecyclePriceEle = (
          <>
            <div>{i18n.t(LOCALS.recycling_confirmation_quote)}</div>
            <div>
              {finalRecyclePrice ? (
                <>
                  {currency}&nbsp;
                  {thousands(finalRecyclePrice)}
                </>
              ) : (
                '-'
              )}
            </div>
          </>
        );
        const finalSalePriceEle = (
          <>
            <div>{i18n.t(LOCALS.consignment_confirmation_quote)}</div>
            <div>
              {finalSalePrice ? (
                <>
                  {currency}&nbsp;
                  {thousands(finalSalePrice)}
                </>
              ) : (
                '-'
              )}
            </div>
          </>
        );
        // 交易完成
        if (status === 9) {
          return (
            <>
              {type === 2 && finalRecyclePriceEle}
              {type === 1 && finalSalePriceEle}
            </>
          );
        }
        // 最终
        if (finalRecyclePrice || finalSalePrice) {
          return (
            <div>
              {finalRecyclePriceEle}
              {finalSalePriceEle}
            </div>
          );
        }
        // 初步
        return (
          <div>
            <div>{i18n.t(LOCALS.instant_sale)}</div>
            {minRecyclePrice || maxRecyclePrice ? (
              <div>
                {currency}&nbsp;
                {thousands(minRecyclePrice)}~{thousands(maxRecyclePrice)}
              </div>
            ) : (
              '-'
            )}
            <div>{i18n.t(LOCALS.consignment_preliminary_valuation)}</div>
            {minSalePrice || maxSalePrice ? (
              <div>
                {currency}&nbsp;
                {thousands(minSalePrice)}~{thousands(maxSalePrice)}
              </div>
            ) : (
              '-'
            )}
          </div>
        );
      }
    },
  };
  const createTimeCol: ColumnProps<OmsRecycleOrderDetail> = {
    title: i18n.t(LOCALS.created_time),
    dataIndex: 'createTime',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      const time = record?.omsRecycleOrder?.createTime;
      return (
        <div>
          <div>{time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'}</div>
        </div>
      );
    },
  };
  // 提交估值时间
  const firstValuationTime: ColumnProps<OmsRecycleOrderDetail> = {
    title: <Trans i18nKey={LOCALS.initial_appraisal_submission_time} />,
    dataIndex: 'firstValuationTime',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      const time = record?.omsRecycleOrder?.firstValuationTime;
      return (
        <div>
          <div>{time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'}</div>
        </div>
      );
    },
  };
  // 同意估值时间
  const agreeFirstValuationTime: ColumnProps<OmsRecycleOrderDetail> = {
    title: <Trans i18nKey={LOCALS.agreed_initial_appraisal_time} />,
    dataIndex: 'agreeFirstValuationTime',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      const time = record?.omsRecycleOrderItem?.agreeFirstValuationTime;
      return (
        <div>
          <div>{time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'}</div>
        </div>
      );
    },
  };
  // 合同成立时间
  const contractCreateTime: ColumnProps<OmsRecycleOrderDetail> = {
    title: <Trans i18nKey={LOCALS.contract_establishment_time} />,
    dataIndex: 'contractCreateTime',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      const time = record?.omsRecycleOrder?.contractCreateTime;
      return (
        <div>
          <div>{time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'}</div>
        </div>
      );
    },
  };
  // 报价时间
  const finalValuationTime: ColumnProps<OmsRecycleOrderDetail> = {
    title: <Trans i18nKey={LOCALS.quotation_time} />,
    dataIndex: 'finalValuationTime',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      const time = record?.omsRecycleOrderItem?.finalValuationTime;
      return (
        <div>
          <div>{time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'}</div>
        </div>
      );
    },
  };
  // 担当
  const postStoreCol: ColumnProps<OmsRecycleOrderDetail> = {
    title: i18n.t(LOCALS.shop_id),
    dataIndex: 'shopid',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      return ShopMaping[`${record.omsRecycleOrder?.storeId}`] || '-';
    },
  };
  // 待打款金额
  const financialPaymentAmount: ColumnProps<OmsRecycleOrderDetail> = {
    title: i18n.t(LOCALS.pending_payment_amount),
    dataIndex: 'financialPaymentAmount',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      // 1-寄卖，2-回收
      const { type, currency } = record.omsRecycleOrder || {};
      const { finalRecyclePrice, finalSalePrice } =
        record.omsRecycleOrderItem || {};
      if (type === 1) {
        return `${currency} ${thousands(finalSalePrice)}`;
      } else if (type === 2) {
        return `${currency} ${thousands(finalRecyclePrice)}`;
      }
      return '-';
    },
  };
  // 确认结算时间
  const financialPaymentTime: ColumnProps<OmsRecycleOrderDetail> = {
    title: i18n.t(LOCALS.confirmation_settlement_time),
    dataIndex: 'contractCreateTime',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      const time = record?.omsRecycleOrder?.contractCreateTime;
      return (
        <div>
          <div>{time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'}</div>
        </div>
      );
    },
  };
  // 取消原因
  const cancelRemark: ColumnProps<OmsRecycleOrderDetail> = {
    title: i18n.t(LOCALS.cancellation_reason),
    dataIndex: 'cancelRemark',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      return (
        <div>
          <div>{record?.omsRecycleOrder?.cancelRemark}</div>
        </div>
      );
    },
  };
  // 退货时间
  const returnTime: ColumnProps<OmsRecycleOrderDetail> = {
    title: i18n.t(LOCALS.cancellation_time),
    dataIndex: 'returnTime',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      const data = record?.omsRecycleOrderLogList?.find(
        (d) => d.afterStatus === 8
      );
      if (data) {
        const { createTime } = data;
        return (
          <div>
            <div>
              {createTime ? dayjs(createTime).format('YYYY-MM-DD HH:mm') : '-'}
            </div>
          </div>
        );
      }
    },
  };
  // 完成时间
  const completeTime: ColumnProps<OmsRecycleOrderDetail> = {
    title: i18n.t(LOCALS.completion_time),
    dataIndex: 'completeTime',
    width: 150,
    render: (_, record) => {
      if (!record) return;
      const time = record?.omsRecycleOrder?.completeTime;
      return (
        <div>
          <div>{time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'}</div>
        </div>
      );
    },
  };
  const optionCol: ColumnProps<OmsRecycleOrderDetail> = {
    title: <Trans i18nKey={LOCALS.option} />,
    dataIndex: 'option',
    width: 150,
    fixed: 'right',
    render: (_, record) => {
      if (!record) return;
      const orderStatus = record?.omsRecycleOrder?.status;
      const stateWrapper = record?.omsRecycleOrderLogistics?.stateWrapper;
      const shippingDocument =
        record?.omsRecycleOrderLogistics?.shippingDocument;
      const cancelType = record?.omsRecycleOrder?.cancelType;
      const appointmentId = record.omsRecycleOrder?.appointmentId;
      const isSaleToRecycle = record.omsRecycleOrder?.isSaleToRecycle;
      const createdFrom = consultingSource.findIndex(
        (d) => d.value === record.omsRecycleOrder?.createdFrom
      );
      const stateWrapperShippingDocument: string[] = JSON.parse(
        record?.omsRecycleOrderLogistics?.stateWrapperShippingDocument || '[]'
      );

      return (
        <div>
          {/* 详情 */}
          <div>
            <Button
              type="link"
              size="small"
              onClick={() => {
                navigate(
                  `/rrs/recycling-consignment-detail/${record?.omsRecycleOrder?.id}`
                );
              }}
            >
              <Trans i18nKey={LOCALS.details} />
            </Button>
          </div>
          {/* 初步估值 状态为【1-待初步估值】才有该按钮 */}
          {(orderStatus === OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_FIRST_VALUATION ||
            orderStatus === OMS_RECYCLE_ORDER_STATUS_MAP.VALUATION_EXPIRED) && (
            <div>
              <Button
                size="small"
                onClick={() => {
                  setRowData(record);
                  setValuationModalOpen(true);
                }}
              >
                {orderStatus ===
                  OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_FIRST_VALUATION &&
                  i18n.t(LOCALS.initial_appraisal_o)}
                {orderStatus ===
                  OMS_RECYCLE_ORDER_STATUS_MAP.VALUATION_EXPIRED &&
                  i18n.t(LOCALS.re_evaluate)}
              </Button>
            </div>
          )}
          {/* 2-客户同意初步报价 */}
          {orderStatus ===
            OMS_RECYCLE_ORDER_STATUS_MAP.HAS_BEEN_FIRST_VALUATION &&
            createdFrom > -1 && (
              <Button
                size="small"
                onClick={() => {
                  setRowData(record);
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
              {record?.omsRecycleOrder?.storeId === 2 && !appointmentId && (
                <div>
                  <Button
                    size="small"
                    onClick={() => {
                      setRowData(record);
                      setShiplableModalOpen(true);
                    }}
                  >
                    {record?.omsRecycleOrderLogistics?.shippingLabel
                      ? '查看Shiplable'
                      : i18n.t(LOCALS.upload_shiplable)}
                  </Button>
                </div>
              )}
              {/* 确认收货：上传了邮寄凭证 */}
              {(shippingDocument || appointmentId) && (
                <div>
                  <Button
                    size="small"
                    onClick={() => {
                      setRowData(record);
                      setGoodsReceivedModalOpen(true);
                    }}
                  >
                    {i18n.t(LOCALS.confirm_receipt)}
                  </Button>
                </div>
              )}
              {/* 包装材料:1.需要，0：不需要 */}
              {stateWrapper === 1 && (
                <div>
                  <Button
                    size="small"
                    onClick={() => {
                      setRowData(record);
                      setLogisticsDocumentModalOpen(true);
                    }}
                  >
                    {stateWrapperShippingDocument.length
                      ? '查看包装材料凭证'
                      : i18n.t(LOCALS.upload_packing_slip)}
                  </Button>
                </div>
              )}
            </>
          )}
          {/* 状态为【4-待最终报价】 */}
          {orderStatus === 4 && (
            <div>
              <Button
                size="small"
                onClick={() => {
                  setRowData(record);
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
                    setRowData(record);
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
                    setModalOption({
                      UpdateFinalValuation: {
                        status: orderStatus,
                      },
                    });
                    setRowData(record);
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
                    setRowData(record);
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
            <div>
              <Button
                size="small"
                onClick={() => {
                  setRowData(record);
                  setModalOption({
                    PaymentVoucher: {
                      type: 'create',
                    },
                  });
                  setPaymentVoucherModalOpen(true);
                }}
              >
                {i18n.t(LOCALS.upload_payment_proof)}
              </Button>
              {createdFrom > -1 && (
                <Button
                  size="small"
                  onClick={() => {
                    setRowData(record);
                    setPayInfoModalOpen(true);
                  }}
                >
                  填写打款信息
                </Button>
              )}
            </div>
          )}
          {/* 8-待退货 */}
          {orderStatus === 8 && (
            <div>
              <Button
                size="small"
                onClick={() => {
                  setRowData(record);
                  setConfirmReturnModalOpen(true);
                }}
              >
                {i18n.t(LOCALS.confirm_return)}
              </Button>
            </div>
          )}
          {/* 13-表示已打款，但是还没确认收款 */}
          {orderStatus === 13 && (
            <div>
              <Button
                size="small"
                onClick={() => {
                  setRowData(record);
                  setModalOption({
                    PaymentVoucher: {
                      type: 'update',
                    },
                  });
                  setPaymentVoucherModalOpen(true);
                }}
              >
                重新上传凭证
              </Button>
            </div>
          )}
        </div>
      );
    },
  };
  // 多个的集合 图片 商品 状态
  const image_info_status_Cols: ColumnsType<OmsRecycleOrderDetail> = [
    productLinkCol,
    productImageCol,
    productInfoCol,
    statusCol,
  ];
  // 多个的集合 头部 店铺 图片 商品 状态 价格
  const head_store_image_info_status_price_Cols: ColumnsType<OmsRecycleOrderDetail> =
    [...headCols, storeCol, ...image_info_status_Cols, priceCol];
  // 不同状态不同单元格
  if (Number(status) === 1) {
    // 待初步估值 = 订单编号、订单类型、会员信息、商品图片、商品名称、订单状态、报价金额、创建时间、操作
    return [
      ...headCols,
      productLinkCol,
      productImageCol,
      productInfoCol,
      statusCol,
      priceCol,
      createTimeCol,
      optionCol,
    ];
  } else if (Number(status) === 2 || Number(status) === 3) {
    // 待收货 = 订单编号、订单类型、会员信息、跟进门店、商品图片、商品名称、订单状态、报价金额、提交估值时间、操作、
    return [
      ...head_store_image_info_status_price_Cols,
      firstValuationTime,
      optionCol,
    ];
  } else if (Number(status) === 4) {
    // 待最终报价 = 订单编号、订单类型、会员信息、跟进门店、商品图片、商品名称、订单状态、报价金额、同意估值时间、操作
    return [
      ...head_store_image_info_status_price_Cols,
      agreeFirstValuationTime,
      optionCol,
    ];
  } else if (Number(status) === 5) {
    // 待客户确认 = 订单编号、订单类型、会员信息、跟进门店、商品图片、商品名称、订单状态、报价金额、报价时间、操作
    return [
      ...head_store_image_info_status_price_Cols,
      finalValuationTime,
      optionCol,
    ];
  } else if (Number(status) === 6) {
    // 寄卖中 订单编号、订单类型、会员信息、跟进门店、商品图片、商品名称、订单状态、报价金额、合同成立时间、操作
    return [
      ...head_store_image_info_status_price_Cols,
      contractCreateTime,
      optionCol,
    ];
  } else if (Number(status) === 7) {
    // 待打款 订单编号、订单类型、会员信息、担当人、商品图片、商品名称、订单状态、待打款金额、确认结算时间、操作
    return [
      ...headCols,
      postStoreCol,
      ...image_info_status_Cols,
      financialPaymentAmount,
      financialPaymentTime,
      optionCol,
    ];
  } else if (Number(status) === 8) {
    // 待退货 订单编号、订单类型、会员信息、跟进门店、商品图片、商品名称、订单状态、退货原因、订单取消时间、操作
    return [
      ...headCols,
      postStoreCol,
      ...image_info_status_Cols,
      cancelRemark,
      returnTime,
      optionCol,
    ];
  } else if (Number(status) === 9) {
    // 交易完成 订单编号、订单类型、会员信息、跟进门店、商品图片、商品名称、订单状态、结算金额、完成时间、操作
    return [
      ...headCols,
      postStoreCol,
      ...image_info_status_Cols,
      financialPaymentAmount,
      completeTime,
      optionCol,
    ];
  } else {
    // 全部订单 订单编号、订单类型、会员信息、跟进门店、商品图片、商品名称、订单状态、报价金额、创建时间、操作
    return [
      ...headCols,
      postStoreCol,
      ...image_info_status_Cols,
      priceCol,
      createTimeCol,
      optionCol,
    ];
  }
};

export { getColumns };
