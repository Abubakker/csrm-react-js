import { Form, message, Modal, Select, Spin } from 'antd';
import LOCALS from 'commons/locals';
import { useCallback, useEffect, useMemo, useState } from 'react';
import i18n from 'i18n';
import { CmsApi, CmsSubject } from 'apis/cms';
import { debounce } from 'lodash-es';

interface Props {
  open: boolean;
  onClose: () => void;
  onLoad?: () => void;
  data?: CmsSubject;
}

const CopyProductModal = ({ open, onClose, onLoad, data }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [subjectList, setSubjectList] = useState<CmsSubject[]>([]);

  const debouncedSubjectList = useMemo(() => {
    return debounce(async (keyword: string) => {
      const { list } = await CmsApi.getSubjectList({
        keyword,
        pageNum: 1,
        pageSize: 10,
      });
      setSubjectList(list);
    }, 300);
  }, []);

  const handleSearch = useCallback(
    (keyword: string) => {
      debouncedSubjectList(keyword);
    },
    [debouncedSubjectList]
  );

  useEffect(() => {
    handleSearch('');
  }, [handleSearch]);

  const getDetail = async (id: number) => {
    const t = await CmsApi.getSubjectDetail(id);
    return t;
  };

  const onFinish = async () => {
    setLoading(true);
    form.validateFields().then(async ({ id }) => {
      const newDetail = await getDetail(Number(data?.id));
      const oldDetail = await getDetail(id);
      CmsApi.subjectEdit({
        ...newDetail,
        cmsSubjectProductRelations: oldDetail.cmsSubjectProductRelations.map(
          (d) => ({ id: d.id, subjectId: d.subjectId, productId: d.productId })
        ),
      })
        .then(() => {
          message.success(i18n.t(LOCALS.successful_operation));
          onLoad?.();
          onClose();
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  return (
    <Modal
      open={open}
      title={i18n.t('copy_product_to')}
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
      >
        <Form.Item name="id" label={i18n.t('title')} className="py-10">
          <Select
            className="w-full"
            filterOption={false}
            notFoundContent={loading ? <Spin size="small" /> : null}
            onSearch={handleSearch}
            showSearch
            value={null}
            options={subjectList.map((i) => {
              return {
                value: i.id,
                label: `${i.title} - ${i.language}`,
              };
            })}
          ></Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CopyProductModal;
