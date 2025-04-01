import React from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Space,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {
  createQuotationForm,
  getQuotationForm,
  updateQuotationForm,
} from 'apis/oms';
import LOCALS from 'commons/locals';
import {
  CONSULTING_SOURCE_OPTION_LIST,
  CURRENCY_OPTION_LIST,
  INVENTORY_OPTION_LIST,
  QUOTATION_FORM_TYPE_OPTION_LIST,
  SOCIAL_MEDIA_OPTION_LIST,
} from 'commons/options';
import i18n from 'i18n';
import { useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { QuotationForm } from 'types/oms';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import ImageUploader from 'components/image-uploader';

type QuotationFormAddEditProps = {
  isEdit?: boolean;
};

type QuotationFormAddEditData = {
  category: string;
  color: string;
  material: string;
  stamp: string;
  type: string;
  staff: number;
  currency: string;
  inventory: number;
  recyclePrice: number;
  consignmentPrice: number;
  substitutePrice: number;
  dealPrice: number;
  username: string;
  email: string;
  phone: string;
  consultingSource: number;
  socialMedia: string;
  socialHandle: string;
  note: string;
};

const QuotationFormAddEdit = ({
  isEdit = false,
}: QuotationFormAddEditProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<QuotationFormAddEditData>();
  const [productPics, setProductPics] = useState<
    { url: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { staffSelectOptions } = useAppSelector(selectGlobalInfo);

  const disabled = useMemo(() => {
    // 查看
    if (id && !isEdit) return true;

    return false;
  }, [id, isEdit]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const res = await getQuotationForm(+id);
      const { data } = res;

      form.setFieldsValue({
        ...data,
      });
      if (data.productPics) {
        setProductPics(
          data.productPics.split(',').map((d) => ({ url: d, name: '0' }))
        );
      }
    })();
  }, [form, id]);

  const onFinish = () => {
    form.validateFields().then((res) => {
      setLoading(true);
      const quotationForm: QuotationForm = {
        ...res,
        productPics: productPics.join(','),
      };

      const fetcher = isEdit && id ? updateQuotationForm : createQuotationForm;

      if (isEdit && id) {
        quotationForm.id = +id;
      }

      fetcher(quotationForm)
        .then(() => {
          messageApi.success(i18n.t(LOCALS.successful_operation));

          setTimeout(() => {
            navigate('/rrs/quotation-form');
          }, 1000);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const onBack = () => {
    navigate('/rrs/quotation-form');
  };

  return (
    <div>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={disabled}
      >
        <Row
          gutter={[16, 0]}
          style={{ maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}
        >
          <Col span={24}>
            <Form.Item
              label={<Trans i18nKey={LOCALS.bag_style} />}
              name="category"
              rules={[{ required: true }]}
            >
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<Trans i18nKey={LOCALS.color} />}
              name="color"
              rules={[{ required: true }]}
            >
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<Trans i18nKey={LOCALS.material} />}
              name="material"
            >
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={<Trans i18nKey={LOCALS.stamp} />} name="stamp">
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<Trans i18nKey={LOCALS.type} />}
              name="type"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                {QUOTATION_FORM_TYPE_OPTION_LIST.map(({ value, label }) => {
                  return (
                    <Radio value={value} key={value}>
                      {label}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="currency"
              label={<Trans i18nKey={LOCALS.quotation_currency} />}
              rules={[{ required: true }]}
            >
              <Select
                options={CURRENCY_OPTION_LIST}
                placeholder={<Trans i18nKey={LOCALS.please_select} />}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="recyclePrice"
              label={
                <Trans
                  i18nKey={LOCALS.recycle_price}
                  rules={[{ required: true }]}
                />
              }
            >
              <InputNumber
                inputMode="numeric"
                max={1000000000}
                style={{ width: '100%' }}
                placeholder={i18n.t(LOCALS.please_enter) || ''}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="consignmentPrice"
              label={
                <Trans
                  i18nKey={LOCALS.consignment_price}
                  rules={[{ required: true }]}
                />
              }
            >
              <InputNumber
                inputMode="numeric"
                max={1000000000}
                style={{ width: '100%' }}
                placeholder={i18n.t(LOCALS.please_enter) || ''}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="substitutePrice"
              label={
                <Trans
                  i18nKey={LOCALS.substitute_price}
                  rules={[{ required: true }]}
                />
              }
            >
              <InputNumber
                inputMode="numeric"
                max={1000000000}
                style={{ width: '100%' }}
                placeholder={i18n.t(LOCALS.please_enter) || ''}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="dealPrice"
              label={
                <Trans
                  i18nKey={LOCALS.deal_price}
                  rules={[{ required: true }]}
                />
              }
            >
              <InputNumber
                inputMode="numeric"
                max={1000000000}
                style={{ width: '100%' }}
                placeholder={i18n.t(LOCALS.please_enter) || ''}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="inventory"
              label={<Trans i18nKey={LOCALS.inventory_info} />}
              rules={[{ required: true }]}
            >
              <Radio.Group>
                {INVENTORY_OPTION_LIST.map(({ value, label }) => {
                  return (
                    <Radio value={value} key={value}>
                      {label}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="username"
              label={<Trans i18nKey={LOCALS.customer_name} />}
              rules={[{ required: true }]}
            >
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="email"
              label={<Trans i18nKey={LOCALS.customer_email} />}
            >
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="phone"
              label={<Trans i18nKey={LOCALS.phone_number} />}
            >
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="socialMedia"
              label={<Trans i18nKey={LOCALS.social_media} />}
              rules={[{ required: true }]}
            >
              <Select
                placeholder={<Trans i18nKey={LOCALS.please_select} />}
                options={SOCIAL_MEDIA_OPTION_LIST}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="socialHandle"
              label={<Trans i18nKey={LOCALS.social_handle} />}
              rules={[{ required: true }]}
            >
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="consultingSource"
              label={<Trans i18nKey={LOCALS.consulting_source} />}
            >
              <Select
                placeholder={<Trans i18nKey={LOCALS.please_select} />}
                options={CONSULTING_SOURCE_OPTION_LIST}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={<Trans i18nKey={LOCALS.staff} />} name="staff">
              <Select
                showSearch
                placeholder={<Trans i18nKey={LOCALS.please_select} />}
                options={staffSelectOptions}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="note" label={<Trans i18nKey={LOCALS.note} />}>
              <TextArea
                placeholder={'可以填写商品缺失的配件，使用痕迹等任意信息'}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={<Trans i18nKey={LOCALS.product_pictures} />}>
              <div style={{ marginBottom: 6 }}>
                正面/背面/内里/金属件/刻印/使用痕迹/配件等
              </div>

              <ImageUploader onChange={setProductPics} imgList={productPics} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Space>
              <Button loading={loading} onClick={onBack} disabled={false}>
                <Trans i18nKey={LOCALS.back} />
              </Button>

              <Button type="primary" htmlType="submit" loading={loading}>
                <Trans i18nKey={LOCALS.submit} />
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default QuotationFormAddEdit;
