import { LoadingOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Spin } from 'antd';
import classNames from 'classnames';
import usePosPrinter from 'commons/hooks/use-pos-printer';
import { useEffect } from 'react';
import { useToggle } from 'react-use';
import { posPrinterSetting } from 'utils/connect-to-pos-printer';

const PosPrinterSettingModal = ({
  open,
  onCancel,
}: {
  open: boolean;
  onCancel: () => void;
}) => {
  const [form] = Form.useForm<{
    host: string;
    checkoutCount: string;
    communicationType: string;
    printerList: string;
  }>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        host: posPrinterSetting.host.get(),
        checkoutCount: posPrinterSetting.checkoutCount.get(),
        communicationType: posPrinterSetting.communicationType.get(),
        printerList: JSON.stringify(
          posPrinterSetting.printerList.get(),
          null,
          2
        ),
      });
    }
  }, [form, open]);

  return (
    <Modal
      open={open}
      width={800}
      title="レシートプリンターの設定"
      onCancel={onCancel}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>キャンセル</Button>
          <Button
            type="primary"
            onClick={() => {
              form
                .validateFields()
                .then((data) => {
                  posPrinterSetting.host.set(data.host);
                  const printer = posPrinterSetting.printerList
                    .get()
                    .find((item) => item.value === data.host);
                  if (printer) posPrinterSetting.port.set(printer.port);
                  posPrinterSetting.checkoutCount.set(data.checkoutCount);
                  posPrinterSetting.printerList.set(data.printerList);
                  posPrinterSetting.communicationType.set(
                    data.communicationType
                  );
                  window.location.reload();
                })
                .catch((err) => {});
            }}
          >
            Ok
          </Button>
        </div>
      }
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="host" label="プリンター" rules={[{ required: true }]}>
          <Select options={posPrinterSetting.printerList.get()}></Select>
        </Form.Item>
        <Form.Item
          name="checkoutCount"
          label="枚数"
          rules={[{ required: true }]}
        >
          <Input></Input>
        </Form.Item>

        <Form.Item name="communicationType" label="通信方式">
          <Select
            options={[
              { label: 'socket', value: 'socket' },
              { label: 'http', value: 'http' },
            ]}
          ></Select>
        </Form.Item>

        <Form.Item name="printerList" label="プリンターリスト">
          <Input.TextArea rows={10}></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const PosPrinterInfo = () => {
  const { posPrinterInfo } = usePosPrinter();
  const [open, toggleOpen] = useToggle(false);

  if (posPrinterInfo.status === 'connecting') {
    return (
      <Spin indicator={<LoadingOutlined spin />}>
        <PrinterOutlined style={{ fontSize: '20px' }} />
      </Spin>
    );
  }

  return (
    <div className="cursor-pointer">
      <PosPrinterSettingModal open={open} onCancel={toggleOpen} />
      <PrinterOutlined
        onClick={toggleOpen}
        style={{ fontSize: '20px' }}
        className={classNames(
          posPrinterInfo.status === 'connecte_success'
            ? 'text-green-500'
            : posPrinterInfo.status === 'connecte_failed'
            ? 'text-red-500'
            : ''
        )}
      />
    </div>
  );
};

export default PosPrinterInfo;
