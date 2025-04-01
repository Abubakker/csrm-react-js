import { Form, Input, Modal, message } from 'antd';
import { modifyOmsOperation } from 'apis/oms';

import { OmsRecycleOrderDetail } from 'types/oms';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';

type Props = {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  dataSource: OmsRecycleOrderDetail;
};

const ModifyOperation = ({ open, onCancel, onSuccess, dataSource }: Props) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      title= {i18n.t(LOCALS.modification_operation_record)}
      width={600}
      onCancel={onCancel}
      onOk={async () => {
        const data = form.getFieldsValue();
        await modifyOmsOperation(data);
        message.success('修改成功');
        onSuccess();
      }}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        initialValues={{
          id: dataSource.omsRecycleOrder?.id,
        }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label={i18n.t(LOCALS.operation_content)}
          name="shopRemark"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModifyOperation;
