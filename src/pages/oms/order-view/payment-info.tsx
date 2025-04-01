import { OmsOrderDetail } from 'types/oms';
import { Trans } from 'react-i18next';
import LOCALS from 'commons/locals';
import { Button, Descriptions, Form, InputNumber, Modal } from 'antd';
import styles from './index.module.scss';
import { useToggle } from 'react-use';
import { updateOmsOrderDetail } from 'apis/oms';

type OmsOrderPaymentInfoProps = {
  omsOrderDetail: OmsOrderDetail;
};

const OmsOrderPaymentInfo = ({
  omsOrderDetail: {
    totalAmount,
    payAmount,
    integrationAmount,
    promotionAmount,
    promotionAmountActualCurrency,
    couponAmount,
    totalAmountActualCurrency,
    payAmountActualCurrency,
    freightAmountActualCurrency,
    orderItemList: [{ actualCurrency }],
    b2bPrice,
    id,
  },
}: OmsOrderPaymentInfoProps) => {
  const [open, toggleOpen] = useToggle(false);

  return (
    <div className="mb-3">
      <Modal
        open={open}
        onCancel={toggleOpen}
        footer={null}
        destroyOnClose
        title={<Trans i18nKey={LOCALS.edit} />}
      >
        <Form
          onFinish={async ({ b2bPrice }: { b2bPrice: number }) => {
            await updateOmsOrderDetail(id, { b2bPrice });
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }}
        >
          <Form.Item
            name="b2bPrice"
            label="B2B価格"
            initialValue={b2bPrice}
            rules={[{ required: true }]}
          >
            <InputNumber
              addonBefore={actualCurrency}
              className="w-full"
              min={0}
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button.Group className="flex gap-2 justify-end">
              <Button onClick={toggleOpen}>
                <Trans i18nKey={LOCALS.cancel} />
              </Button>
              <Button type="primary" htmlType="submit">
                OK
              </Button>
            </Button.Group>
          </Form.Item>
        </Form>
      </Modal>
      <div className={styles.title}>
        <Trans i18nKey={LOCALS.payment_info} />
      </div>
      <Descriptions bordered size="small">
        <Descriptions.Item
          label={<Trans i18nKey={LOCALS.order_total_amount} />}
        >
          {actualCurrency && totalAmountActualCurrency !== null
            ? `${actualCurrency} ${totalAmountActualCurrency.toLocaleString()}`
            : `JPY ${totalAmount.toLocaleString()}`}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.amount_to_be_paid} />}>
          {actualCurrency && payAmountActualCurrency !== null
            ? `${actualCurrency} ${payAmountActualCurrency.toLocaleString()}`
            : `JPY ${payAmount.toLocaleString()}`}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.points_deduction} />}>
          -JPY {integrationAmount.toLocaleString()}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.coupon} />}>
          -JPY {couponAmount}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.discount_amounts} />}>
          {actualCurrency &&
          promotionAmountActualCurrency !== null &&
          promotionAmountActualCurrency !== undefined
            ? `${actualCurrency} ${promotionAmountActualCurrency.toLocaleString()}`
            : `-JPY ${promotionAmount.toLocaleString()}`}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.freight} />}>
          {actualCurrency} {freightAmountActualCurrency}
        </Descriptions.Item>
        <Descriptions.Item label={'B2B価格'}>
          {actualCurrency} {b2bPrice ? b2bPrice.toLocaleString('en-US') : '-'}
          <Button type="link" onClick={toggleOpen}>
            <Trans i18nKey={LOCALS.edit} />
          </Button>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default OmsOrderPaymentInfo;
