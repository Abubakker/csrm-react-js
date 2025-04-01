import React, { useState } from 'react';
import { Button, ColorPicker, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { DownOutlined } from '@ant-design/icons';

interface TagFormProps {
  initialValues: {
    name: string;
    description: string;
    color: string;
  };
  handleSubmit: (name: string, description: string, color: string) => void;
  isLoading: boolean;
  handleCancel: () => void;
  isUpdate: boolean;
  form: any;
  handleInputChange: (event: { name: string; value: string }) => void;
}
const TagForm: React.FC<TagFormProps> = ({
  initialValues,
  handleSubmit,
  isLoading,
  handleCancel,
  isUpdate = false,
  form,
  handleInputChange,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const onSubmit = () => {
    handleSubmit(
      initialValues.name,
      initialValues.description,
      initialValues.color
    );
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      onFinishFailed={() => {}}
    >
      <div className="flex items-center gap-3 justify-between">
        <Form.Item
          label={t('title')}
          className="mb-4 font-medium w-[calc(100%-82px)]"
          rules={[{ required: true, message: `${t('tag_title_req_msg')}` }]}
        >
          <Input
            className="rounded-[10px] p-3 h-[42px]"
            value={initialValues?.name}
            onChange={(e) =>
              handleInputChange({ name: 'name', value: e.target.value })
            }
            placeholder={`${t('enter_tag_title')}`}
          />
        </Form.Item>
        <div>
          <div className="h-5"></div>

          <ColorPicker
            open={open}
            value={initialValues?.color}
            onChange={(value) =>
              handleInputChange({ name: 'color', value: `#${value.toHex()}` })
            }
            onOpenChange={setOpen}
            className="h-[42px] p-3 rounded-[10px] border border-[#DADDEB]"
            showText={() => (
              <DownOutlined
                rotate={open ? 180 : 0}
                style={{
                  color: 'rgba(0, 0, 0, 0.25)',
                }}
              />
            )}
          />
        </div>
      </div>

      <Form.Item label={t('description')} className="mb-4 font-medium">
        <Input
          className="rounded-[10px] p-3 h-[42px]"
          defaultValue={initialValues?.description}
          value={initialValues?.description}
          onChange={(e) =>
            handleInputChange({ name: 'description', value: e.target.value })
          }
          placeholder={`${t('enter_tag_details')}`}
        />
      </Form.Item>

      <Form.Item className="mb-0">
        <div className="flex items-center justify-end gap-4">
          <Button
            className="rounded-[10px] py-3 px-6 h-[42px] leading-[0px]"
            onClick={handleCancel}
          >
            {t('integration_modal_cancel_btn')}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="rounded-[10px] py-3 px-6 h-[42px] leading-[0px]"
            disabled={isLoading}
          >
            {isUpdate ? t('save') : t('create_btn')}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default TagForm;
