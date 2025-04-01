import { Button, Form, Input, InputNumber, Radio, Select, Switch } from 'antd';
import { CmsApi, CmsSubject, CmsSubjectCategory } from 'apis/cms';
import LOCALS from 'commons/locals';
import i18n from 'i18n';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { langOptionList } from '../subject-list';
import EditorV2 from 'components/Editor/v2/index';
import FormImageUpload from 'components/form-image-upload';

const options = [
  { label: i18n.t('yes'), value: 1 },
  { label: i18n.t('no'), value: 0 },
];

type FormCmsSubject = Omit<CmsSubject, 'albumPics'> & { albumPics: string[] };

const CmsSubjectDetailPage = () => {
  const [searchParams] = useSearchParams();
  const [subject, setSubject] = useState<FormCmsSubject>();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const [subjectCategoryList, setSubjectCategoryList] = useState<
    CmsSubjectCategory[]
  >([]);
  useEffect(() => {
    CmsApi.getSubjectCategory().then((res) => {
      setSubjectCategoryList(res);
    });
  }, []);

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) return;
    setLoading(true);
    CmsApi.getSubjectDetail(Number(id))
      .then(({ albumPics, categoryId, ...rest }) => {
        const t: FormCmsSubject = {
          ...rest,
          categoryId: Number(categoryId),
          albumPics: albumPics ? albumPics.split(',') : [],
        };
        setSubject(t);
        form.setFieldsValue({ ...t });
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
        onFinish={async ({ albumPics, ...rest }) => {
          form.validateFields().then(async (d) => {
            setLoading(true);
            const payload = {
              ...rest,
              albumPics: albumPics ? albumPics.join(',') : '',
            };
            if (subject) {
              await CmsApi.subjectEdit({
                id: subject.id,
                ...payload,
              });
              window.location.reload();
            } else {
              const { id } = await CmsApi.subjectEdit({ ...payload });
              window.location.href = `/cms/subject-detail?id=${id}`;
            }
          });
        }}
      >
        <Form.Item
          name="categoryId"
          label={i18n.t('topic_category')}
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
            options={subjectCategoryList.map(({ id: value, name: label }) => {
              return {
                value,
                label,
              };
            })}
          />
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
          <Input />
        </Form.Item>
        <Form.Item name="pic" label={i18n.t('cover')}>
          <FormImageUpload />
        </Form.Item>
        <Form.Item name="recommendStatus" label={i18n.t('recommended')}>
          <Radio.Group options={options}></Radio.Group>
        </Form.Item>
        <Form.Item name="albumPics" label={i18n.t('photo_album')}>
          <FormImageUpload maxCount={9} />
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
        <Form.Item name="description" label={i18n.t('description')}>
          <Input.TextArea rows={5}></Input.TextArea>
        </Form.Item>
        <Form.Item
          name="content"
          label={i18n.t('article_content')}
          // initialValue={''}
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

export default CmsSubjectDetailPage;
