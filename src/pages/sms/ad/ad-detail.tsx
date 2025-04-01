import {
  Button,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  DatePicker,
} from 'antd';
import SmsApi, { Advertise } from 'apis/sms';
import LOCALS from 'commons/locals';
import i18n from 'i18n';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { langOptionList, typeOptionList } from './ad-list';
import 'react-quill/dist/quill.snow.css';
import FormImageUpload from 'components/form-image-upload';
import dayjs, { Dayjs } from 'dayjs';
const { RangePicker } = DatePicker;

type FormAdvertise = Advertise & { time: [Dayjs, Dayjs] };

const ADDetailPage = () => {
  const [searchParams] = useSearchParams();
  const [detail, setDetail] = useState<Advertise>();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) return;
    setLoading(true);
    SmsApi.getAdDetail(Number(id))
      .then((data) => {
        const { endTime, startTime, ...rest } = data;
        const t: FormAdvertise = {
          ...rest,
          endTime,
          startTime,
          time: [dayjs(startTime), dayjs(endTime)],
        };
        setDetail(data);
        form.setFieldsValue(t);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [form, searchParams]);

  return (
    <div className="max-w-4xl flex justify-center mx-auto">
      <Form
        layout="vertical"
        form={form}
        className="w-full"
        onFinish={async ({ time, ...rest }) => {
          form.validateFields().then(async (d) => {
            setLoading(true);
            const payload = {
              ...rest,
              startTime: dayjs(time[0]),
              endTime: dayjs(time[1]),
            };
            if (detail) {
              await SmsApi.AdEditService({
                id: detail.id,
                ...payload,
              });
              window.location.reload();
            } else {
              const { id } = await SmsApi.AdEditService({ ...payload });
              window.location.href = `/sms/ad-detail?id=${id}`;
            }
          });
        }}
        initialValues={{
          type: 0,
          language: 'all',
        }}
      >
        <Form.Item
          name="name"
          label={i18n.t('ad_name')}
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="type" label={i18n.t('ad_placement')}>
          <Select
            placeholder={i18n.t(LOCALS.please_select) || ''}
            style={{ minWidth: 120 }}
            options={typeOptionList}
          />
        </Form.Item>
        <Form.Item
          name="time"
          label={`${i18n.t('start_time')}/${i18n.t('end_time')}`}
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            className="w-full"
          />
        </Form.Item>
        <Form.Item
          name="status"
          label={i18n.t('online_offline')}
          getValueProps={(value) => {
            return {
              value: !!value,
            };
          }}
          normalize={(value) => {
            return value ? 1 : 0;
          }}
        >
          <Switch />
        </Form.Item>
        <Form.Item name="language" label={i18n.t('language')}>
          <Radio.Group>
            {langOptionList.map(({ value, label }) => {
              return (
                <Radio key={value} value={value}>
                  {label}
                </Radio>
              );
            })}
          </Radio.Group>
        </Form.Item>
        <Form.Item name="pic" label={i18n.t('ad_image')}>
          <FormImageUpload />
        </Form.Item>
        <Form.Item name="sort" label={i18n.t('sort')}>
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item
          name="url"
          label={i18n.t('ad_link')}
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item name="note" label={i18n.t('remark')}>
          <Input.TextArea rows={5}></Input.TextArea>
        </Form.Item>
        <Form.Item className="mt-20 flex justify-center">
          <Button type="primary" htmlType="submit" loading={loading}>
            {i18n.t('confirm')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ADDetailPage;
