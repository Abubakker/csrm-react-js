import { Form, Modal, Select } from 'antd';
import { changeOrderPriority } from 'apis/oms';
import {
  OMS_RECYCLE_ORDER_PRIORITY_OPTION_LIST,
  findLabelByValue,
} from 'commons/options';
import { useState } from 'react';
import { OmsRecycleOrder } from 'types/oms';

const RecycleOrderPriorityTag = ({
  id,
  priority,
  onSuccess,
}: Pick<OmsRecycleOrder, 'id' | 'priority'> & {
  onSuccess: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<Pick<OmsRecycleOrder, 'priority'>>();

  if (!id || !priority) return null;

  return (
    <>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          const data = form.getFieldsValue();
          setOpen(false);
          changeOrderPriority({ id, ...data }).then(() => {
            onSuccess();
          });
        }}
        title="修改回收订单优先级"
      >
        <Form
          form={form}
          initialValues={{
            priority,
          }}
        >
          <Form.Item name="priority">
            <Select
              className="w-full"
              options={OMS_RECYCLE_ORDER_PRIORITY_OPTION_LIST}
            ></Select>
          </Form.Item>
        </Form>
      </Modal>
      <div
        onClick={() => {
          setOpen(true);
        }}
      >
        {findLabelByValue(priority, OMS_RECYCLE_ORDER_PRIORITY_OPTION_LIST)}
      </div>
    </>
  );
};

export default RecycleOrderPriorityTag;
