import { Steps } from 'antd';
import LOCALS from 'commons/locals';
import { ORDER_STATUS_MAP } from 'commons/options';
import { Trans } from 'react-i18next';
import { OmsOrder } from 'types/oms';
import useIsMobile from 'commons/hooks/useIsMobile';

type OrderStepProps = {
  status: OmsOrder['status'];
};

const stepCurrentMap = {
  [ORDER_STATUS_MAP.TO_BE_PAID]: 1,
  [ORDER_STATUS_MAP.TO_BE_DELIVERED]: 2,
  [ORDER_STATUS_MAP.DELIVERED]: 3,
  [ORDER_STATUS_MAP.COMPLETED]: 4,
  [ORDER_STATUS_MAP.CANCLED]: 1,
  [ORDER_STATUS_MAP.INVALID_ORDER]: 1,
  [ORDER_STATUS_MAP.REFUND_ORDER]: 1,
};

const OrderStep = ({ status }: OrderStepProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return (
    <Steps
      current={stepCurrentMap[status] || 1}
      labelPlacement="vertical"
      items={[
        {
          title: <Trans i18nKey={LOCALS.order_submitted} />,
        },
        {
          title: <Trans i18nKey={LOCALS.order_paid} />,
        },
        {
          title: <Trans i18nKey={LOCALS.platform_delivery} />,
        },
        {
          title: <Trans i18nKey={LOCALS.completed} />,
        },
      ]}
    />
  );
};

export default OrderStep;
