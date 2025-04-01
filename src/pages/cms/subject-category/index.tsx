import {
  Button,
  Form,
  Input,
  Space,
  Switch,
  Table,
  Image,
  Popconfirm,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { CmsApi, CmsSubjectCategory } from 'apis/cms';
import LOCALS from 'commons/locals';
import i18n from 'i18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import CmsSbujectCategoryEditModal from './edit-modal';

const CmsSubjectCategoryPage = () => {
  const [form] = Form.useForm<{
    keyword?: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectData, setSelectData] = useState<CmsSubjectCategory>();
  const [helpCategoryList, setHelpCategoryList] = useState<
    CmsSubjectCategory[]
  >([]);

  const getList = useCallback((dto?: { name?: string }) => {
    setLoading(true);
    CmsApi.getSubjectCategory(dto)
      .then((res) => {
        setHelpCategoryList(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onFinish = useCallback(async () => {
    const { keyword } = form.getFieldsValue();
    getList({ name: keyword });
  }, [form, getList]);

  useEffect(() => getList(), [getList]);

  const columns: ColumnsType<CmsSubjectCategory> = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '10%',
      },
      {
        title: i18n.t('title'),
        dataIndex: 'name',
        key: 'name',
        width: '30%',
      },
      {
        title: i18n.t('category_icon'),
        dataIndex: 'icon',
        key: 'icon',
        width: '20%',
        render(icon?: string) {
          if (!icon) return '-';
          return <Image src={icon} alt="" height={100} />;
        },
      },
      {
        title: i18n.t('article_publish_status'),
        dataIndex: 'showStatus',
        key: 'showStatus',
        width: '10%',
        render(showStatus, data: CmsSubjectCategory) {
          return (
            <Switch
              checked={showStatus === 1}
              onChange={async () => {
                setLoading(true);
                await CmsApi.getSubjectCategoryEdit({
                  ...data,
                  showStatus: showStatus ? 0 : 1,
                });
                getList();
              }}
            />
          );
        },
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        fixed: 'right',
        width: '10%',
        render: (data: CmsSubjectCategory) => {
          return (
            <div>
              <Button
                type="link"
                onClick={() => {
                  setSelectData(data);
                  setOpen(true);
                }}
              >
                <Trans i18nKey={LOCALS.edit} />
              </Button>

              <Popconfirm
                title={i18n.t('delete')}
                description={
                  <div className="w-[150px]">
                    {i18n.t('are_you_sure_to_delete')}
                  </div>
                }
                onConfirm={async () => {
                  await CmsApi.subjectCategoryDelete(data.id);
                  getList();
                }}
              >
                <Button type="link" danger>
                  <Trans i18nKey={LOCALS.delete} />
                </Button>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }, [getList]);

  const onReset = useCallback(() => {
    form.resetFields();
    onFinish();
  }, [form, onFinish]);

  return (
    <div>
      <div>
        <Form form={form} onFinish={onFinish} layout="inline">
          <Form.Item
            name="keyword"
            label={<Trans i18nKey={LOCALS.keyword} />}
            initialValue=""
          >
            <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                <Trans i18nKey={LOCALS.search} />
              </Button>

              <Button htmlType="button" onClick={onReset}>
                <Trans i18nKey={LOCALS.reset} />
              </Button>
              <Button
                onClick={() => {
                  setSelectData(undefined);
                  setOpen(true);
                }}
              >
                <Trans i18nKey={LOCALS.add} />
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <Table
        tableLayout="fixed"
        bordered
        loading={loading}
        rowKey={'id'}
        style={{
          marginTop: 12,
        }}
        dataSource={helpCategoryList}
        columns={columns}
      />

      {open && (
        <CmsSbujectCategoryEditModal
          open={open}
          onClose={() => setOpen(false)}
          data={selectData}
          onLoad={getList}
        />
      )}
    </div>
  );
};

export default CmsSubjectCategoryPage;
