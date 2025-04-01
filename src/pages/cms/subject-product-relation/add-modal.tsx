import { Form, Input, message, Modal, Button, Table } from 'antd';
import LOCALS from 'commons/locals';
import { useCallback, useEffect, useMemo, useState } from 'react';
import i18n from 'i18n';
import { CmsApi, CmsSubject } from 'apis/cms';
import { PmsProduct } from 'types/pms';
import { getProductList } from 'apis/pms';
import { ColumnsType } from 'antd/es/table';

interface Props {
  open: boolean;
  onClose: () => void;
  data?: CmsSubject;
  onLoad?: () => void;
}

const CmsSubjectProductAddModal = ({ open, onClose, data, onLoad }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [productOptionList, setProductOptionList] = useState<PmsProduct[]>([]);
  const [selectedRows, setSelectedRows] = useState<PmsProduct[]>([]);
  const onFinish = async () => {
    setLoading(true);
    const list =
      selectedRows.map((d) => ({
        subjectId: data?.id as number,
        productId: d.id,
      })) || [];
    const oldList =
      data?.cmsSubjectProductRelations.map((d) => ({
        id: d.id,
        subjectId: d.subjectId,
        productId: d.productId,
      })) || [];
    const cmsSubjectProductRelations = list.concat(oldList);
    CmsApi.subjectEdit({
      ...data,
      cmsSubjectProductRelations,
    })
      .then(() => {
        message.success(i18n.t(LOCALS.successful_operation));
        onLoad?.();
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ ...data, showStatus: Boolean(data.showStatus) });
    }
  }, [data, form]);

  const handleSearchProduct = useCallback((keyword: string) => {
    keyword = keyword.trim();
    if (!keyword) {
      setProductOptionList([]);
      return;
    }

    setLoading(true);
    getProductList({
      keyword,
      pageNum: 1,
      pageSize: 10,
      transformPriceToJpyFlag: 0,
    })
      .then((data) => {
        setProductOptionList(data.data.list);
      })
      .catch()
      .finally(() => setLoading(false));
  }, []);

  const columns: ColumnsType<PmsProduct> = useMemo(() => {
    return [
      {
        title: i18n.t('product_sn'),
        dataIndex: 'productSn',
        key: 'productSn',
      },
      {
        title: i18n.t('product_name_1'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: i18n.t('list_remark'),
        dataIndex: 'note',
        key: 'note',
      },
    ];
  }, []);

  return (
    <Modal
      open={open}
      title={i18n.t('add')}
      onCancel={() => onClose()}
      onOk={onFinish}
      destroyOnClose
      confirmLoading={loading}
      width={'60%'}
    >
      <Form
        form={form}
        layout="inline"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onFinish={({ keyword }) => {
          handleSearchProduct(keyword);
        }}
      >
        <Form.Item name="keyword">
          <Input
            maxLength={20}
            className="w-[200px]"
            placeholder={i18n.t('please_enter') || ''}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {i18n.t('search')}
          </Button>
        </Form.Item>
      </Form>

      <Table
        tableLayout="fixed"
        bordered
        rowSelection={{
          selectedRowKeys: selectedRows.map((d) => d.id) as React.Key[],
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        loading={loading}
        rowKey={'id'}
        style={{
          marginTop: 12,
        }}
        dataSource={productOptionList}
        columns={columns}
      />
    </Modal>
  );
};

export default CmsSubjectProductAddModal;
