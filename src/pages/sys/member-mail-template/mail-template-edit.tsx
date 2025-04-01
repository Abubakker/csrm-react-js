import { Button, Drawer, Form, Input, Space } from 'antd';
import { umsMemberMailTemplateSaveOrUpdate } from 'apis/ums';
import SimpleRichEditor from 'components/simple-rich-editor';
import i18n from 'i18n';
import { useCallback } from 'react';
import { UmsMemberMailTemplate } from 'types/ums';

type Props = {
  open: boolean;
  mailTemplate: UmsMemberMailTemplate;
  onClose: () => void;
  onChange: (mailTemplate: UmsMemberMailTemplate) => void;
  onSuccess: () => void;
};

const MailTemplateEdit = ({
  open,
  mailTemplate,
  onClose,
  onChange,
  onSuccess,
}: Props) => {
  const handleSubmit = useCallback(() => {
    umsMemberMailTemplateSaveOrUpdate(mailTemplate).then((res) => {
      onSuccess();
    });
  }, [mailTemplate, onSuccess]);

  return (
    <Drawer
      title={i18n.t('email_template_Edit_Email_Template')}
      placement="right"
      closable={false}
      open={open}
      onClose={onClose}
      width={1200}
      footer={
        <Space className="flex justify-end">
          <Button onClick={onClose}>{i18n.t('cancel')}</Button>
          <Button onClick={handleSubmit} type="primary">
            {i18n.t('submit')}
          </Button>
        </Space>
      }
    >
      <Form labelCol={{ span: 3 }} labelWrap>
        <Form.Item label="KEY">
          <Input disabled value={mailTemplate.templateName}></Input>
        </Form.Item>
        <Form.Item label={i18n.t('email_template_Description')}>
          <Input
            value={mailTemplate.description}
            onChange={(e) => {
              onChange({
                ...mailTemplate,
                description: e.target.value,
              });
            }}
          ></Input>
        </Form.Item>
        <Form.Item label={i18n.t('email_template_English_Subject')}>
          <Input
            value={mailTemplate.enSubject}
            onChange={(e) => {
              onChange({
                ...mailTemplate,
                enSubject: e.target.value,
              });
            }}
          ></Input>
        </Form.Item>
        <Form.Item label={i18n.t('email_template_Japanese_Subject')}>
          <Input
            value={mailTemplate.jaSubject}
            onChange={(e) => {
              onChange({
                ...mailTemplate,
                jaSubject: e.target.value,
              });
            }}
          ></Input>
        </Form.Item>
        <Form.Item label={i18n.t('email_template_Simplified_Chinese_Subject')}>
          <Input
            value={mailTemplate.zhCnSubject}
            onChange={(e) => {
              onChange({
                ...mailTemplate,
                zhCnSubject: e.target.value,
              });
            }}
          ></Input>
        </Form.Item>
        <Form.Item label={i18n.t('email_template_Traditional_Chinese_Subject')}>
          <Input
            value={mailTemplate.zhTwSubject}
            onChange={(e) => {
              onChange({
                ...mailTemplate,
                zhTwSubject: e.target.value,
              });
            }}
          ></Input>
        </Form.Item>

        <Form.Item label={i18n.t('email_template_English_content')}>
          <SimpleRichEditor
            className="mt-[-8px]"
            rows={12}
            value={mailTemplate.enMailContent || ''}
            onChange={(value) => {
              onChange({
                ...mailTemplate,
                enMailContent: value,
              });
            }}
          ></SimpleRichEditor>
        </Form.Item>

        <Form.Item label={i18n.t('email_template_Japanese_content')}>
          <SimpleRichEditor
            className="mt-[-8px]"
            rows={12}
            value={mailTemplate.jaMailContent || ''}
            onChange={(value) => {
              onChange({
                ...mailTemplate,
                jaMailContent: value,
              });
            }}
          ></SimpleRichEditor>
        </Form.Item>

        <Form.Item label={i18n.t('email_template_Simplified_Chinese_content')}>
          <SimpleRichEditor
            className="mt-[-8px]"
            rows={12}
            value={mailTemplate.zhCnMailContent || ''}
            onChange={(value) => {
              onChange({
                ...mailTemplate,
                zhCnMailContent: value,
              });
            }}
          ></SimpleRichEditor>
        </Form.Item>

        <Form.Item label={i18n.t('email_template_Traditional_Chinese_content')}>
          <SimpleRichEditor
            className="mt-[-8px]"
            rows={12}
            value={mailTemplate.zhTwMailContent || ''}
            onChange={(value) => {
              onChange({
                ...mailTemplate,
                zhTwMailContent: value,
              });
            }}
          ></SimpleRichEditor>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default MailTemplateEdit;
