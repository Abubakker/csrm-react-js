import { useState, useEffect, useMemo } from 'react';
import { Button, Modal, message, Popconfirm, InputNumber } from 'antd';
import { financialManagementAccountList } from 'apis/fms';
import { omsStoreFinalPayment } from 'apis/oms';
import { FmsAccountManagement } from 'types/fms';
import { thousands } from 'utils/tools';
import { OmsOrderDetail } from 'types/oms';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import { Trans } from 'react-i18next';
import { sumBy } from 'lodash-es';
import { PAY_STATUS_MAP, SHOP_MAP } from 'commons/options';
import SimpleMemberSelect from './simple-member-select';

interface Props {
  open: boolean;
  onCancel: (b: boolean) => void;
  omsOrderDetail: OmsOrderDetail;
}

export interface CategoryType {
  [key: string]: FmsAccountManagement[];
}

const FinalSettlement = ({ open, onCancel, omsOrderDetail }: Props) => {
  const [accountList, setAccountList] = useState<FmsAccountManagement[]>([]);
  const { payAmountActualCurrency, orderItemList, payList } = omsOrderDetail;
  const [paymentList, setPaymentList] = useState<{ [key: string]: number }>({});
  // 添加选中的会员ID状态
  const [selectedMemberId, setSelectedMemberId] = useState<number>();

  useEffect(() => {
    if (
      ![SHOP_MAP.GINZA, SHOP_MAP.HONGKONG, SHOP_MAP.SINGAPORE].includes(
        omsOrderDetail.createdFrom
      )
    )
      return;

    financialManagementAccountList(omsOrderDetail.createdFrom)
      .then((res) => {
        setAccountList(res);
      })
      .finally(() => {});
  }, [omsOrderDetail.createdFrom]);

  // 已支付金额
  const paidAmount = useMemo(() => {
    const paidAmount = sumBy(
      payList?.filter((i) => i.payStatus === PAY_STATUS_MAP.CONFIRMED),
      (i) => i.payAmount
    );

    return paidAmount || 0;
  }, [payList]);

  // 总金额
  const totalAmount = useMemo(() => {
    return payAmountActualCurrency || 0;
  }, [payAmountActualCurrency]);

  const remainingMoney = useMemo(() => {
    return (
      totalAmount -
      paidAmount -
      sumBy(
        Object.keys(paymentList)
          .map((key) => {
            return paymentList[key];
          })
          .filter((i) => !!i)
      )
    );
  }, [paidAmount, paymentList, totalAmount]);

  const currency = useMemo(() => {
    if (orderItemList && orderItemList[0]) {
      return orderItemList[0].actualCurrency;
    }
    throw new Error('商品数据有问题');
  }, [orderItemList]);

  const onFinish = () => {
    const paymentListData: {
      payType: string;
      payAmount: number;
    }[] = [];
    Object.keys(paymentList).forEach((key) => {
      if (paymentList[key]) {
        paymentListData.push({
          payType: key,
          payAmount: paymentList[key],
        });
      }
    });

    omsStoreFinalPayment({
      orderId: omsOrderDetail.id,
      paymentList: paymentListData,
      memberId: selectedMemberId,
    })
      .then(() => {
        message.success(i18n.t(LOCALS.successful_operation));
        window.location.reload();
      })
      .catch((d) => {})
      .finally(() => {});
  };

  return (
    <Modal
      title={<Trans i18nKey={LOCALS.final_payment_settlement} />}
      width={600}
      open={open}
      onCancel={() => onCancel(false)}
      footer={[
        <Button onClick={() => onCancel(false)} key={'cancel'}>
          {i18n.t(LOCALS.cancel)}
        </Button>,
        <Popconfirm
          title={i18n.t(LOCALS.caution)}
          key={'ok'}
          description={
            <div className="w-[200px]">{i18n.t(LOCALS.confirm_submission)}</div>
          }
          onConfirm={() => onFinish()}
          okText={i18n.t(LOCALS.confirm)}
          cancelText={i18n.t(LOCALS.cancel)}
        >
          <Button
            type="primary"
            disabled={
              remainingMoney < 0 || remainingMoney === totalAmount - paidAmount
            }
          >
            {i18n.t(LOCALS.confirm)}
          </Button>
        </Popconfirm>,
      ]}
    >
      {!omsOrderDetail.memberId && (
        <>
          <h2 className="text-lg font-bold">{i18n.t(LOCALS.select_member)}</h2>
          <SimpleMemberSelect onChange={setSelectedMemberId} />
          <hr className="my-4 h-[1px] bg-gray-200" />
        </>
      )}

      <div className=" grid gap-2">
        {accountList.map((i) => {
          return (
            <div key={i.accountCode}>
              <InputNumber
                onChange={(value) => {
                  setPaymentList({
                    ...paymentList,
                    [i.accountCode]: value ? Number(value) : 0,
                  });
                }}
                addonBefore={<div className="w-56">{i.accountName}</div>}
                className="w-full"
              ></InputNumber>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid gap-1 text-lg">
        <div>
          {i18n.t('total_amount')}：
          <span>
            {currency} {thousands(totalAmount)}
          </span>
        </div>
        <div>
          {i18n.t('brOLzqUFVx')}：
          <span>
            {currency} {thousands(paidAmount)}
          </span>
        </div>
        <div className="text-red-500">
          {i18n.t('qeUzbiaUej')}：
          <span>
            {currency} {thousands(remainingMoney)}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default FinalSettlement;
