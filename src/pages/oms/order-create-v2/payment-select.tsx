import { InputNumber, Input, Select, message } from 'antd';
import { OrderGenerateForMemberDto, StoreConfirmOrder } from 'types/oms';
import { isNumber } from 'lodash-es';
import {
  CURRENCY_MAP,
  CURRENCY_OPTION_LIST,
  ORDER_STATUS_MAP,
  findLabelByValue,
} from 'commons/options';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';
import { useMemo } from 'react';

type Props = {
  setPayload: (
    data: Partial<
      Pick<
        OrderGenerateForMemberDto,
        'useIntegration' | 'promotionAmount' | 'couponCode' | 'orderStatus'
      >
    >
  ) => void;
  confirmOrderInfo?: StoreConfirmOrder;
  currency?: string;
  useIntegration: number;
} & Pick<
  OrderGenerateForMemberDto,
  'orderStatus' | 'receiveAddressId' | 'memberId' | 'productIdList'
>;

const PaymentSelect = ({
  setPayload,
  confirmOrderInfo,
  currency,
  orderStatus,
  useIntegration,
  receiveAddressId,
  memberId,
  productIdList,
}: Props) => {
  const couponAmount = useMemo(() => {
    return confirmOrderInfo?.omsOrder.couponAmount;
  }, [confirmOrderInfo?.omsOrder.couponAmount]);

  const usePointSuffix = useMemo(() => {
    if (confirmOrderInfo) {
      const { omsOrderItems } = confirmOrderInfo;
      const [{ actualCurrency, actualCurrencyRate }] = omsOrderItems;

      if (actualCurrency && actualCurrency !== CURRENCY_MAP.JPY) {
        return `${i18n.t(LOCALS.jpy)} 折算 ${actualCurrency} ${Math.floor(
          useIntegration * actualCurrencyRate
        ).toLocaleString()}`;
      }
    }

    return i18n.t(LOCALS.jpy);
  }, [confirmOrderInfo, useIntegration]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <InputNumber
          size="large"
          disabled={!confirmOrderInfo || !memberId}
          suffix={usePointSuffix}
          placeholder={i18n.t(LOCALS.points) || '请输入使用积分'}
          onBlur={(e) => {
            const useIntegration = Number(e.target.value);
            if (isNumber(useIntegration) && !isNaN(useIntegration)) {
              setPayload({
                useIntegration,
              });
            }
          }}
          className="w-full"
        />
        <InputNumber
          size="large"
          disabled={!confirmOrderInfo}
          suffix={
            <span>
              {currency && (
                <span>{findLabelByValue(currency, CURRENCY_OPTION_LIST)}</span>
              )}
            </span>
          }
          placeholder={i18n.t(LOCALS.discount_amounts) || '请输入优惠金额'}
          onBlur={(e) => {
            const promotionAmount = Number(e.target.value);
            if (isNumber(promotionAmount) && !isNaN(promotionAmount)) {
              setPayload({
                promotionAmount,
              });
            }
          }}
          className="w-full"
        />
        <Input
          size="large"
          disabled={!confirmOrderInfo}
          placeholder={i18n.t(LOCALS.coupon) || '请输入优惠券'}
          suffix={
            couponAmount &&
            `- ${confirmOrderInfo?.omsOrder.couponAmount} ${i18n.t('jpy')}`
          }
          onBlur={(e) => {
            const couponCode = e.target.value;
            setPayload({
              couponCode,
            });
          }}
          className="w-full"
        />
        <Select
          value={orderStatus}
          size="large"
          placeholder={i18n.t(LOCALS.jVFAzYMWJd)}
          disabled={!productIdList.length}
          onChange={(e) => {
            if (
              memberId &&
              !receiveAddressId &&
              e === ORDER_STATUS_MAP.TO_BE_PAID
            ) {
              message.warning(i18n.t('please_select_a_shipping_address'));
            }

            setPayload({
              orderStatus: e,
            });
          }}
        >
          <Select.Option value={ORDER_STATUS_MAP.TO_BE_PAID}>
            {i18n.t(LOCALS.JSRDwAEqdy)}
          </Select.Option>
          <Select.Option value={ORDER_STATUS_MAP.TO_BE_DELIVERED}>
            {i18n.t(LOCALS.GqRqjCEQxK)}
          </Select.Option>
          <Select.Option value={ORDER_STATUS_MAP.COMPLETED}>
            {i18n.t(LOCALS.pqepZTOsNb)}
          </Select.Option>
        </Select>
      </div>
    </div>
  );
};

export default PaymentSelect;
