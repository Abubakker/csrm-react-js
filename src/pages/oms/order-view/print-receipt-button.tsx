import { Button, Form, message, Modal, Radio, Space } from 'antd';
import i18n from 'i18n';
import { OmsOrderDetail } from 'types/oms';
import { CURRENCY_MAP } from 'commons/options';
import printOrderReceipt from 'utils/print-order-receipt';
import usePosPrinter from 'commons/hooks/use-pos-printer';
import { useToggle } from 'react-use';
import { useState } from 'react';

const PrintReceiptButton = ({
  omsOrderDetail,
  onPrintReceiptByBrowser,
}: {
  omsOrderDetail: OmsOrderDetail;
  onPrintReceiptByBrowser: () => void;
}) => {
  const { orderItemList } = omsOrderDetail;
  const [{ actualCurrency }] = orderItemList;
  const { posPrinterInfo } = usePosPrinter();
  const [open, toggleOpen] = useToggle(false);
  const [addSign, toggleAddSign] = useToggle(true);
  const [loading, setLoading] = useState(false);

  // 目前只有日本的商品，支持打印小票
  if (
    actualCurrency !== CURRENCY_MAP.JPY &&
    actualCurrency !== CURRENCY_MAP.HKD
  ) {
    return null;
  }

  return (
    <>
      <Space>
        <Button
          loading={loading}
          type="primary"
          onClick={async () => {
            if (actualCurrency === CURRENCY_MAP.JPY) {
              setLoading(true);
              printOrderReceipt({
                orderId: omsOrderDetail.id,
                addSign: false,
              })
                .catch(() => {
                  message.error('打印失败,请联系技术人员');
                })
                .finally(() => {
                  setLoading(false);
                });
            }

            if (actualCurrency === CURRENCY_MAP.HKD) {
              toggleOpen();
            }
          }}
        >
          {i18n.t('print_receipt')}
        </Button>

        <Button
          type="primary"
          onClick={async () => {
            onPrintReceiptByBrowser();
          }}
        >
          {i18n.t('NlBduEDffi')}
        </Button>
      </Space>

      <Modal
        okButtonProps={{
          loading: posPrinterInfo.status === 'connecting',
        }}
        title="小票打印"
        open={open}
        onCancel={toggleOpen}
        onOk={() => {
          setLoading(true);
          printOrderReceipt({ orderId: omsOrderDetail.id, addSign })
            .catch(() => {
              message.error('打印失败,请联系技术人员');
            })
            .finally(() => {
              setLoading(false);
            });

          toggleOpen();
        }}
      >
        <Form.Item label="追加签名栏">
          <Radio.Group
            value={addSign}
            onChange={(v) => {
              toggleAddSign(v.target.value);
            }}
          >
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
      </Modal>
    </>
  );
};

export default PrintReceiptButton;
