import React, { useState, ReactNode } from 'react';
import ValuationModal from './valuation-modal';
import ShiplableModal from './shiplable-modal';
import GoodsReceivedModal from './goods-received-modal';
import FinalValuationModal from './final-valuation-modal';
import LogisticsDocumentModal from './logistics-document-modal';
import UpdateFinalValuationModal from './update-final-valuation-modal';
import ConfirmSettlementModal from './confirm-settlement-modal';
import ConfirmReturnModal from './confirm-return-modal';
import PaymentVoucherModal from './payment-voucher-modal';
import CancelOrderModal from './cancel-order-modal';
import DeliverGoodsModal from './deliver-goods-modal';
import CustomerAgreeValuationModal from './customer-agree-valuation-modal';
import PayInfoModal from './pay-info-modal';
import CompleteModal from './complete-modal';
import ConsignmentToRecyclingModal from './consignment-to-recycling-modal';
import { OmsRecycleOrderDetail } from 'types/oms';
import i18n from '../../../../i18n';
import LOCALS from '../../../../commons/locals';

interface Props {
  getLoad: () => void;
  dataSource: OmsRecycleOrderDetail;
  modalOption?: any;
}

/**
 * 回收寄卖列表和详情都会用到Modal
 * 列表和详情会重复使用到
 */
const useMoreModal = ({ getLoad, dataSource, modalOption }: Props) => {
  /** 估值Modal */
  const [valuationModalOpen, setValuationModalOpen] = useState(false);
  /** 上传shiplable */
  const [shiplableModalOpen, setShiplableModalOpen] = useState(false);
  /** 确认收货 */
  const [goodsReceivedModalOpen, setGoodsReceivedModalOpen] = useState(false);
  /** 最终报价 */
  const [finalValuationModalOpen, setFinalValuationModalOpen] = useState(false);
  /** 上传物流凭证 */
  const [logisticsDocumentModalOpen, setLogisticsDocumentModalOpen] =
    useState(false);
  /** 修改报价 */
  const [updateFinalValuationModalOpen, setUpdateFinalValuationModalOpen] =
    useState(false);
  /** 确认结算 */
  const [confirmSettlementModalOpen, setConfirmSettlementModalOpen] =
    useState(false);
  /** 确认退货 */
  const [confirmReturnModalOpen, setConfirmReturnModalOpen] = useState(false);
  /** 确认退货 */
  const [paymentVoucherModalOpen, setPaymentVoucherModalOpen] = useState(false);
  /** 取消订单 */
  const [cancelOrderModalOpen, setCancelOrderModalOpen] = useState(false);
  /** 意向订单-选择发货 */
  const [deliverGoodsModalOpen, setDeliverGoodsModalOpen] = useState(false);
  /** 意向订单-同意最终估值 */
  const [customerAgreeValuationModalOpen, setCustomerAgreeValuationModalOpen] =
    useState(false);
  /** 意向订单-收款信息 */
  const [payInfoModalOpen, setPayInfoModalOpen] = useState(false);
  /** 一键完成 */
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  /** 寄卖转回收 */
  const [consignmentToRecyclingModalOpen, setConsignmentToRecyclingModalOpen] =
    useState(false);

  /* 提交初步估值 */
  const valuationModalElement = (): ReactNode => {
    return (
      valuationModalOpen && (
        <ValuationModal
          mode="firstValuation"
          title={i18n.t(LOCALS.submit_preliminary_valuation)}
          data={dataSource}
          open={valuationModalOpen}
          onClose={() => setValuationModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /* 上传shiplable */
  const shiplableModalElement = (): ReactNode => {
    return (
      shiplableModalOpen && (
        <ShiplableModal
          data={dataSource}
          open={shiplableModalOpen}
          onClose={() => setShiplableModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /* 确认收货 */
  const goodsReceivedModalElement = (): ReactNode => {
    return (
      goodsReceivedModalOpen && (
        <GoodsReceivedModal
          data={dataSource}
          open={goodsReceivedModalOpen}
          onClose={() => setGoodsReceivedModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /* 最终报价 */
  const finalValuationModalElement = (): ReactNode => {
    return (
      finalValuationModalOpen && (
        <FinalValuationModal
          data={dataSource}
          open={finalValuationModalOpen}
          onClose={() => setFinalValuationModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /** 上传物流凭证 */
  const logisticsDocumentModalElement = (): ReactNode => {
    return (
      logisticsDocumentModalOpen && (
        <LogisticsDocumentModal
          data={dataSource}
          open={logisticsDocumentModalOpen}
          onClose={() => setLogisticsDocumentModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /** 修改报价 */
  const updateFinalValuationModalElement = (): ReactNode => {
    return (
      updateFinalValuationModalOpen && (
        <UpdateFinalValuationModal
          modalOption={modalOption.UpdateFinalValuation}
          data={dataSource}
          open={updateFinalValuationModalOpen}
          onClose={() => setUpdateFinalValuationModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /** 确认结算 */
  const confirmSettlementModalElement = (): ReactNode => {
    return (
      confirmSettlementModalOpen && (
        <ConfirmSettlementModal
          data={dataSource}
          open={confirmSettlementModalOpen}
          onClose={() => setConfirmSettlementModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /** 打款信息 */
  const createPaymentVoucherModalElement = (): ReactNode => {
    return (
      paymentVoucherModalOpen && (
        <PaymentVoucherModal
          modalOption={modalOption.PaymentVoucher}
          data={dataSource}
          open={paymentVoucherModalOpen}
          onClose={() => setPaymentVoucherModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /** 确认退款 */
  const confirmReturnModalElement = (): ReactNode => {
    return (
      confirmReturnModalOpen && (
        <ConfirmReturnModal
          data={dataSource}
          open={confirmReturnModalOpen}
          onClose={() => setConfirmReturnModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /** 取消订单 */
  const cancelOrderModalElement = (): ReactNode => {
    return (
      cancelOrderModalOpen && (
        <CancelOrderModal
          data={dataSource}
          open={cancelOrderModalOpen}
          onClose={() => setCancelOrderModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /** 意向订单-选择发货 */
  const deliverGoodsModalElement = (): ReactNode => {
    return (
      deliverGoodsModalOpen && (
        <DeliverGoodsModal
          data={dataSource}
          open={deliverGoodsModalOpen}
          onClose={() => setDeliverGoodsModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /** 意向订单-同意最终估值 */
  const customerAgreeValuationModalElement = (): ReactNode => {
    return (
      customerAgreeValuationModalOpen && (
        <CustomerAgreeValuationModal
          data={dataSource}
          open={customerAgreeValuationModalOpen}
          onClose={() => setCustomerAgreeValuationModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /** 意向订单-收款信息 */
  const payInfoModalElement = (): ReactNode => {
    return (
      payInfoModalOpen && (
        <PayInfoModal
          data={dataSource}
          open={payInfoModalOpen}
          onClose={() => setPayInfoModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /** 一键完成 */
  const completeModalElement = (): ReactNode => {
    return (
      completeModalOpen && (
        <CompleteModal
          data={dataSource}
          open={completeModalOpen}
          onClose={() => setCompleteModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  /** 寄卖转回收 */
  const consignmentToRecyclingModalElement = (): ReactNode => {
    return (
      consignmentToRecyclingModalOpen && (
        <ConsignmentToRecyclingModal
          data={dataSource}
          open={consignmentToRecyclingModalOpen}
          onClose={() => setConsignmentToRecyclingModalOpen(false)}
          reload={() => {
            getLoad();
          }}
        />
      )
    );
  };

  return {
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
    setCustomerAgreeValuationModalOpen,
    customerAgreeValuationModalElement,
    setPayInfoModalOpen,
    payInfoModalElement,
    setDeliverGoodsModalOpen: (d: any) => {
      setDeliverGoodsModalOpen(d);
    },
    completeModalElement,
    setCompleteModalOpen,
    consignmentToRecyclingModalElement,
    setConsignmentToRecyclingModalOpen,
  };
};

export default useMoreModal;
