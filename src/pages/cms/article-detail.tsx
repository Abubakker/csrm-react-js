import { Button, Form, Input, InputNumber, Radio, Select, Switch } from 'antd';
import { CmsApi, CmsHelp, CmsHelpCategory } from 'apis/cms';
import LOCALS from 'commons/locals';
import i18n from 'i18n';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { langOptionList } from './article-list';
import EditorV2 from 'components/Editor/v2/index';
import FormImageUpload from 'components/form-image-upload';

const options = [
  { label: i18n.t('yes'), value: 1 },
  { label: i18n.t('no'), value: 0 },
];

const CmsArticleDetailPage = () => {
  const [searchParams] = useSearchParams();
  const [article, setArticle] = useState<CmsHelp>();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const [helpCategoryList, setHelpCategoryList] = useState<CmsHelpCategory[]>(
    []
  );
  useEffect(() => {
    CmsApi.getHelpCategory().then((res) => {
      setHelpCategoryList(res);
    });
  }, []);

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) return;
    setLoading(true);
    CmsApi.getHelpDetail(Number(id))
      .then((res) => {
        setArticle(res);
        form.setFieldsValue(res);
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
        onFinish={async (data) => {
          form.validateFields().then(async () => {
            setLoading(true);
            if (article) {
              await CmsApi.helpUpdate({
                id: article.id,
                ...data,
              });

              window.location.reload();
            } else {
              const { id } = await CmsApi.helpCreate({ ...data });
              window.location.href = `/cms/article-detail?id=${id}`;
            }
          });
        }}
      >
        <Form.Item
          name="categoryId"
          label={i18n.t('article_category')}
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder={i18n.t(LOCALS.please_select) || ''}
            style={{ minWidth: 120 }}
            options={helpCategoryList.map(({ id: value, name: label }) => {
              return {
                value,
                label,
              };
            })}
          />
        </Form.Item>
        <Form.Item
          name="path"
          label={i18n.t('path')}
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="title"
          label={i18n.t('title')}
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea maxLength={90} showCount />
        </Form.Item>
        <Form.Item name="icon" label={i18n.t('cover')}>
          <FormImageUpload />
        </Form.Item>
        <Form.Item
          name="language"
          label={i18n.t('language')}
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
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
        <Form.Item name="sort" label={i18n.t('sort')}>
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item name="recommendStatus" label={i18n.t('recommended')}>
          <Radio.Group options={options}></Radio.Group>
        </Form.Item>
        <Form.Item
          name="showStatus"
          label={i18n.t('article_publish_status')}
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
        <Form.Item name="description" label={i18n.t('description')}>
          <Input.TextArea rows={5} maxLength={250} showCount></Input.TextArea>
        </Form.Item>

        <Form.Item
          name="content"
          label={i18n.t('article_content')}
          initialValue={''}
        >
          <EditorV2 />
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

export default CmsArticleDetailPage;
