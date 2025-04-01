import {
  Form,
  Input,
  Select,
  Switch,
  DatePicker,
  message,
  Modal,
  InputNumber,
} from 'antd';
import { getIntegralEdit } from 'apis/ums';
import LOCALS from 'commons/locals';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { UmsIntegralType, UmsIntegralEditPayload } from 'types/ums';
import i18n from 'i18n';
import { INTEGRAL_OPTION_LIST, INTEGRAL_MAP } from 'commons/options';

interface Props {
  open: boolean;
  onClose: () => void;
  data?: UmsIntegralType;
  onLoad?: () => void;
}

const { RangePicker } = DatePicker;

type IntegralFormType = { time: Dayjs[] } & Pick<
  UmsIntegralType,
  'name' | 'type' | 'points' | 'startAt' | 'endAt' | 'status' | 'directions'
>;

const IntegralEditModal = ({ open, onClose, data, onLoad }: Props) => {
  const [form] = Form.useForm<IntegralFormType>();
  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    setLoading(true);
    form.validateFields().then(async (values) => {
      const { time, status, ...rest } = values;
      const payload: UmsIntegralEditPayload = {
        ...rest,
        status: Number(status),
      };
      if (time && time.length) {
        payload.startAt = time[0].startOf('day').format();
        payload.endAt = time[1].endOf('day').format();
      }
      try {
        await getIntegralEdit(payload);
        message.success(i18n.t('successful_operation'));
        onClose();
        onLoad?.();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (data) {
      const { startAt, endAt, ...rest } = data;
      form.setFieldsValue({ ...rest, time: [dayjs(startAt), dayjs(endAt)] });
    }
  }, [data, form]);

  const type = Form.useWatch('type', form);
  const InputNumberProps = useMemo(() => {
    let props = {
      className: 'w-full',
      precision: 0,
      max: 99999999,
      addonAfter: '',
      min: 1,
    };
    if (type === INTEGRAL_MAP.ORDER) {
      props = {
        className: 'w-full',
        precision: 2,
        max: 9.99,
        addonAfter: i18n.t('multiplier'),
        min: 0.01,
      };
    }
    return props;
  }, [type]);

  return (
    <Modal
      open={open}
      title={i18n.t(LOCALS.pointsMarketing)}
      onCancel={() => onClose()}
      onOk={onFinish}
      destroyOnClose
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          status: true,
          time: [dayjs(), dayjs().add(30, 'day')],
        }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label={i18n.t('pointsName')}
          name="name"
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input maxLength={50} />
        </Form.Item>
        <Form.Item
          label={i18n.t('pointsType')}
          name="type"
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            options={INTEGRAL_OPTION_LIST}
            onChange={() => form.setFieldValue('points', null)}
            disabled={!!data?.id}
          />
        </Form.Item>
        <Form.Item
          label={i18n.t('pointsQuantity')}
          name={type === INTEGRAL_MAP.REGISTRATION ? 'points' : 'pointsRate'}
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber {...InputNumberProps} />
        </Form.Item>
        <Form.Item
          label={i18n.t('activityPeriod')}
          name="time"
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <RangePicker className={'w-full'} />
        </Form.Item>
        <Form.Item label={i18n.t('status')} name="status" required>
          <Switch
            checkedChildren={i18n.t('enable')}
            unCheckedChildren={i18n.t('disable')}
          />
        </Form.Item>
        <Form.Item label={i18n.t('note')} name="directions">
          <Input.TextArea maxLength={500} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IntegralEditModal;
