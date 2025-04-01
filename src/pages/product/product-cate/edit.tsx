import React, { useState, useEffect, useCallback } from 'react';
import {
  Form,
  Input,
  Modal,
  Radio,
  Upload,
  InputNumber,
  Select,
  message,
} from 'antd';
import { ProductCateType, ProductCateListPayload } from 'types/pms';
import {
  getProductCateList,
  getProductCate,
  getProductCateCreate,
  getProductCateUpdate,
} from 'apis/pms';
import { PlusOutlined } from '@ant-design/icons';
import { s3UploadUrl } from 'apis/cms';
import { getLocalStorageToken } from 'commons';
import type { UploadFile } from 'antd/es/upload/interface';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import { Trans } from 'react-i18next';

interface Props {
  onOk: () => void;
  onCancel: () => void;
  open: boolean;
  payload: ProductCateListPayload;
  editData?: ProductCateListPayload;
}

const options = [
  { label: i18n.t('yes'), value: 1 },
  { label: i18n.t('no'), value: 0 },
];

const ProductCate = ({ onOk, onCancel, open, payload, editData }: Props) => {
  const [form] = Form.useForm();
  const [cateList, setCateList] = useState<ProductCateType[]>([]);
  // const [cateData, setCateData] = useState<ProductCateType>();
  // const [cateParentData, setCateParentData] = useState<ProductCateType>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const getList = useCallback(() => {
    getProductCateList({ id: payload.prevId, pageSize: 100 }).then(
      ({ data }) => {
        setCateList(data.list);
      }
    );
  }, [payload.prevId]);

  // 节点内容
  const getCate = useCallback(
    (id: number, callback: (data: ProductCateType) => void) => {
      getProductCate(id || 0).then(({ data }) => {
        if (data) {
          callback(data);
        }
      });
    },
    []
  );

  // 编辑 加载当前 节点内容
  useEffect(() => {
    if (editData?.id) {
      getCate(editData?.id || 0, (data) => {
        // setCateData(data);
        form.setFieldsValue({ ...data });
        if (data.icon) {
          setFileList([
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: data.icon,
            },
          ]);
        }
      });
    }
  }, [editData, form, getCate]);

  // 创建 当前 节点内容
  useEffect(() => {
    getList();
    // 查询父级节点
    getCate(payload.prevId || 0, (data) => {
      // setCateParentData(data);
      form.setFieldValue('prevNname', data.name);
    });
  }, [getList, getCate, form, payload.prevId]);

  const onFinish = () => {
    form.validateFields().then((values: ProductCateType) => {
      let icon = '';
      if (fileList.length) {
        icon = fileList[0].url || fileList[0].response.data.url;
      }
      const { enabled, ...rest } = values;
      const t = { ...rest, icon, enabled: Boolean(enabled) };
      if (editData?.id) {
        update(t);
      } else {
        create(t);
      }
    });
  };

  const create = (data: ProductCateType) => {
    getProductCateCreate(data).then(() => {
      message.success(i18n.t('successful_operation'));
      onOk();
    });
  };

  const update = (data: ProductCateType) => {
    getProductCateUpdate(data).then(() => {
      message.success(i18n.t('successful_operation'));
      onOk();
    });
  };

  return (
    <div>
      <Modal
        onOk={onFinish}
        onCancel={onCancel}
        open={open}
        title={editData?.id ? i18n.t('edit') : i18n.t('add')}
        width={880}
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          initialValues={{
            navStatus: 0,
            showStatus: 0,
          }}
          labelWrap
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="prevNname"
            className="w-full"
            label={<Trans i18nKey={LOCALS.category_ancestor} />}
            hidden={!payload.prevId}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="parentId"
            className="w-full"
            label={<Trans i18nKey={LOCALS.category_parent} />}
            rules={[
              { required: true, message: i18n.t('please_enter') as string },
            ]}
          >
            <Select placeholder={i18n.t('please_select')}>
              <Select.Option key={0} value={0}>
                {i18n.t('no_superior_classification')}
              </Select.Option>
              {cateList.map((d) => (
                <Select.Option key={d.id} value={d.id}>
                  {d.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            className="w-full"
            label={<Trans i18nKey={LOCALS.category_name_En} />}
            rules={[
              { required: true, message: i18n.t('please_enter') as string },
            ]}
          >
            <Input placeholder={i18n.t('please_enter') as string}></Input>
          </Form.Item>
          <Form.Item
            name="nameJa"
            className="w-full"
            label={<Trans i18nKey={LOCALS.category_name_Ja} />}
          >
            <Input placeholder={i18n.t('please_enter') as string}></Input>
          </Form.Item>
          <Form.Item
            name="nameZh"
            className="w-full"
            label={<Trans i18nKey={LOCALS.category_name_Cn} />}
          >
            <Input placeholder={i18n.t('please_enter') as string}></Input>
          </Form.Item>
          <Form.Item
            name="nameTw"
            className="w-full"
            label={<Trans i18nKey={LOCALS.category_name_Tw} />}
          >
            <Input placeholder={i18n.t('please_enter') as string}></Input>
          </Form.Item>
          <Form.Item
            name="value"
            className="w-full"
            label={<Trans i18nKey={LOCALS.category_value} />}
            rules={[
              { required: true, message: i18n.t('please_enter') as string },
            ]}
          >
            <Input placeholder={i18n.t('please_enter') as string}></Input>
          </Form.Item>
          <Form.Item
            name="sort"
            className="w-full"
            label={<Trans i18nKey={LOCALS.sort} />}
          >
            <InputNumber
              placeholder={i18n.t('please_enter') as string}
              className="w-full"
            ></InputNumber>
          </Form.Item>
          <Form.Item
            name="navStatus"
            className="w-full"
            label={<Trans i18nKey={LOCALS.category_nav_status} />}
          >
            <Radio.Group options={options} />
          </Form.Item>
          <Form.Item
            name="showStatus"
            className="w-full"
            label={<Trans i18nKey={LOCALS.category_filter_status} />}
          >
            <Radio.Group options={options} />
          </Form.Item>
          <Form.Item
            name="enabled"
            className="w-full"
            label={<Trans i18nKey={LOCALS.category_enable} />}
          >
            <Radio.Group options={options} />
          </Form.Item>
          <Form.Item
            name="icon"
            className="w-full"
            label={<Trans i18nKey={LOCALS.category_icon} />}
          >
            <Upload
              data={{
                loginToken: getLocalStorageToken(),
              }}
              accept="image/*"
              listType="picture-card"
              action={s3UploadUrl}
              fileList={fileList}
              onChange={(e) => {
                const { file } = e;
                setFileList([file]);
              }}
            >
              <p className="ant-upload-drag-icon">
                <PlusOutlined />
                <div className="mt-[8px]">Upload</div>
              </p>
            </Upload>
          </Form.Item>
          <Form.Item name="title" className="w-full" label="title">
            <Input placeholder={i18n.t('please_enter') as string}></Input>
          </Form.Item>
          <Form.Item
            name="description"
            className="w-full"
            label={<Trans i18nKey={LOCALS.classification_description} />}
          >
            <Input.TextArea
              placeholder={i18n.t('please_enter') as string}
            ></Input.TextArea>
          </Form.Item>
          <Form.Item
            name="extConfig"
            className="w-full"
            label={<Trans i18nKey={LOCALS.extension_configuration_json} />}
          >
            <Input placeholder={i18n.t('please_enter') as string}></Input>
          </Form.Item>
          <Form.Item
            name="size"
            className="w-full"
            label={<Trans i18nKey={LOCALS.size_En} />}
          >
            <Input placeholder={i18n.t('please_enter') as string}></Input>
          </Form.Item>
          <Form.Item
            name="sizeJa"
            className="w-full"
            label={<Trans i18nKey={LOCALS.size_Ja} />}
          >
            <Input placeholder={i18n.t('please_enter') as string}></Input>
          </Form.Item>
          <Form.Item
            name="sizeZh"
            className="w-full"
            label={<Trans i18nKey={LOCALS.size_Cn} />}
          >
            <Input placeholder={i18n.t('please_enter') as string}></Input>
          </Form.Item>
          <Form.Item
            name="sizeTw"
            className="w-full"
            label={<Trans i18nKey={LOCALS.size_Tw} />}
          >
            <Input placeholder={i18n.t('please_enter') as string}></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductCate;
