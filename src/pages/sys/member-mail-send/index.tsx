import { Button, Form, Input, Select, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import {
  getMailTemplateList,
  getMemberList,
  umsMemberSendCustomMail,
} from 'apis/ums';
import SimpleRichEditor from 'components/simple-rich-editor';
import { useCallback, useEffect, useState } from 'react';
import { UmsMember, UmsMemberMailTemplate } from 'types/ums';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';
import { Trans } from 'react-i18next';

const filterOption = (
  input: string,
  option?: { label: string; value: number }
) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

type Props = {
  memberId?: UmsMember['id'];
};

const MemberMailSend = ({ memberId }: Props) => {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const [memberList, setMemberList] = useState<UmsMember[]>([]);
  const [mailTemplateList, setMailTemplateList] = useState<
    UmsMemberMailTemplate[]
  >([]);

  const templateValue = Form.useWatch('template', form);
  const templateLangValue = Form.useWatch('templateLang', form);

  useEffect(() => {
    if (!templateValue || !templateLangValue) return;
    const currentMailTemplate = mailTemplateList.find(
      (i) => i.id === templateValue
    );
    if (!currentMailTemplate) return;

    switch (templateLangValue) {
      case 'en': {
        form.setFieldValue('subject', currentMailTemplate.enSubject);
        form.setFieldValue('mailContent', currentMailTemplate.enMailContent);
        break;
      }

      case 'ja': {
        form.setFieldValue('subject', currentMailTemplate.jaSubject);
        form.setFieldValue('mailContent', currentMailTemplate.jaMailContent);
        break;
      }

      case 'zh_CN': {
        form.setFieldValue('subject', currentMailTemplate.zhCnSubject);
        form.setFieldValue('mailContent', currentMailTemplate.zhCnMailContent);
        break;
      }
      case 'zh_TW': {
        form.setFieldValue('subject', currentMailTemplate.zhTwSubject);
        form.setFieldValue('mailContent', currentMailTemplate.zhTwMailContent);
        break;
      }

      default: {
        break;
      }
    }
  }, [templateValue, templateLangValue, mailTemplateList, form]);

  useEffect(() => {
    getMailTemplateList({ pageNum: 1, pageSize: 100 }).then((res) => {
      setMailTemplateList(res.data.list);
    });
  }, []);

  useEffect(() => {
    if (memberId) {
      form.setFieldValue('memberId', memberId);
    }
  }, [form, memberId]);

  const handleSearch = useCallback((keyword: string) => {
    getMemberList({
      pageNum: 1,
      pageSize: 100,
      keyword,
    }).then((res) => {
      setMemberList(res.data.list);
    });
  }, []);

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={async () => {
          try {
            setLoading(true);
            let { mailContent, ...data } = await form.validateFields();
            mailContent = mailContent.replace(/\n/g, '<br/>');
            await umsMemberSendCustomMail({ ...data, mailContent });
            message.success(i18n.t('successful_operation'));
          } catch (err) {
          } finally {
            setLoading(false);
          }
        }}
      >
        <Form.Item
          hidden={!!memberId}
          label={<Trans i18nKey={LOCALS.send_email_Recipient} />}
          name="memberId"
          rules={[{ required: true }]}
        >
          {memberId ? (
            <Input></Input>
          ) : (
            <Select
              showSearch
              filterOption={false}
              defaultActiveFirstOption={false}
              onSearch={handleSearch}
              options={memberList.map(({ id, email, showName }) => {
                return {
                  value: id,
                  label: `${showName} ${email}`,
                };
              })}
            />
          )}
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label={i18n.t(LOCALS.send_email_Select_Template)} name="template">
            <Select
              filterOption={filterOption}
              showSearch
              options={mailTemplateList.map(
                ({ id, jaSubject, zhCnSubject, enSubject }) => ({
                  value: id,
                  label:
                    (i18n.language === 'zh_CN'
                      ? zhCnSubject
                      : i18n.language === 'ja'
                      ? jaSubject
                      : enSubject) || '',
                })
              )}
            ></Select>
          </Form.Item>
          <Form.Item label={i18n.t(LOCALS.send_email_Select_Language)} name="templateLang">
            <Select
              disabled={!templateValue}
              options={[
                {
                  value: 'en',
                  label: i18n.t(LOCALS.english),
                },
                {
                  value: 'ja',
                  label: i18n.t(LOCALS.japanese),
                },
                {
                  value: 'zh_CN',
                  label: i18n.t(LOCALS.chinese),
                },
                {
                  value: 'zh_TW',
                  label: i18n.t(LOCALS.traditional_chinese),
                },
              ]}
            ></Select>
          </Form.Item>
        </div>
        <Form.Item
          label={i18n.t(LOCALS.send_email_Subject)}
          name="subject"
          rules={[{ required: true }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label={i18n.t(LOCALS.send_email_Body)}
          name="mailContent"
          rules={[{ required: true }]}
        >
          <SimpleRichEditor rows={15} />
        </Form.Item>

        <div className="flex justify-end">
          <Button htmlType="submit" type="primary" loading={loading}>
            {i18n.t(LOCALS.submit)}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default MemberMailSend;
