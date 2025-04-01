import {
  Button,
  Form,
  Image,
  Input,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { CmsApi, CmsSubject, CmsSubjectCategory } from 'apis/cms';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import { LANGUAGE_OPTION_LIST } from 'commons/options';
import i18n from 'i18n';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { PageQuery } from 'types/base';
import setQueryParameters from 'utils/setQueryParameters';
import { useNavigate } from 'react-router-dom';
import CopyProductModal from './copy-product';

export const langOptionList = [
  {
    value: 'all',
    label: 'ALL',
  },
  ...LANGUAGE_OPTION_LIST,
  {
    value: 'zh_TW',
    label: '繁体中文',
  },
];

const CmsSubjectListPage = () => {
  const navigate = useNavigate();
  const {
    loading,
    setLoading,
    total,
    setTotal,
    pageNum,
    pageSize,
    setPageSize,
    setPageNum,
    dataSource,
    setDataSource,
  } = usePagination<CmsSubject>();

  const [subjectCategoryList, setSubjectCategoryList] = useState<
    CmsSubjectCategory[]
  >([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectData, setSelectData] = useState<CmsSubject>();

  useEffect(() => {
    CmsApi.getSubjectCategory().then((res) => {
      setSubjectCategoryList(res);
    });
  }, []);

  const [form] = Form.useForm<{
    keyword?: string;
    langList?: string[];
    categoryIdList?: string[];
  }>();

  const getDataSource = useCallback(
    async ({ pageNum, pageSize }: PageQuery) => {
      const { keyword, categoryIdList, langList } = form.getFieldsValue();
      const data = {
        pageNum,
        pageSize,
        keyword,
        categoryIdList: categoryIdList && categoryIdList.join(','),
        langList: langList && langList.join(','),
      };

      setQueryParameters(data);

      try {
        setLoading(true);
        const { list, total } = await CmsApi.getSubjectList(data);

        setDataSource(list);
        setTotal(total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [form, setDataSource, setLoading, setTotal]
  );

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);

    if (parsed.categoryIdList) {
      parsed.categoryIdList = parsed.categoryIdList // @ts-ignore
        .split(',') // @ts-ignore
        .map((i) => Number(i));
    }
    if (parsed.langList)
      // @ts-ignore
      parsed.langList = parsed.langList.split(',');

    form.setFieldsValue(parsed);

    const pageNum = parsed.pageNum ? +parsed.pageNum : 1;
    const pageSize = parsed.pageSize ? +parsed.pageSize : 10;
    setPageNum(pageNum);
    setPageSize(pageSize);

    getDataSource({ pageNum, pageSize });
  }, [form, getDataSource, setPageNum, setPageSize]);

  const onFinish = useCallback(async () => {
    setPageNum(1);
    getDataSource({ pageNum: 1, pageSize });
  }, [getDataSource, pageSize, setPageNum]);

  const onReset = useCallback(() => {
    form.resetFields();
    onFinish();
  }, [form, onFinish]);

  const columns: ColumnsType<CmsSubject> = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: i18n.t('topic_category'),
        dataIndex: 'categoryId',
        key: 'categoryId',
        render(categoryId: string) {
          return (
            subjectCategoryList.find((i) => i.id === Number(categoryId))
              ?.name || '-'
          );
        },
      },
      {
        title: i18n.t('title'),
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: i18n.t('language'),
        dataIndex: 'language',
        key: 'language',
        render: (language: string) => {
          return langOptionList.find((i) => i.value === language)?.label || '-';
        },
      },
      {
        title: i18n.t('cover'),
        dataIndex: 'pic',
        key: 'pic',
        render(pic?: string) {
          if (!pic) return '-';

          return <Image src={pic} className="w-24" />;
        },
      },
      {
        title: i18n.t('article_publish_status'),
        dataIndex: 'showStatus',
        key: 'showStatus',
        render: (showStatus: 0 | 1 | null, record: CmsSubject) => {
          return (
            <Switch
              checked={showStatus === 1}
              onChange={async (checked) => {
                await CmsApi.subjectEdit({
                  ...record,
                  showStatus: checked ? 1 : 0,
                });
                getDataSource({ pageNum, pageSize });
              }}
            ></Switch>
          );
        },
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        fixed: 'right',
        width: 220,
        render: (record: CmsSubject) => {
          const id = record.id;
          return (
            <div>
              <Button
                type="link"
                onClick={() => {
                  window.location.href = `/cms/subject-detail?id=${id}`;
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
                  await CmsApi.subjectDelete(id);
                  onFinish();
                }}
              >
                <Button type="link" danger>
                  <Trans i18nKey={LOCALS.delete} />
                </Button>
              </Popconfirm>

              <Button
                type="link"
                onClick={() => {
                  navigate(`/cms/subject-product-relation/${id}`);
                }}
              >
                {i18n.t('product_list')}
              </Button>

              <Button
                type="link"
                onClick={() => {
                  setOpen(true);
                  setSelectData(record);
                }}
              >
                {i18n.t('copy_product_to')}
              </Button>
            </div>
          );
        },
      },
    ];
  }, [
    getDataSource,
    subjectCategoryList,
    navigate,
    onFinish,
    pageNum,
    pageSize,
  ]);

  return (
    <div>
      <Form form={form} onFinish={onFinish} layout="inline">
        <Form.Item
          name="keyword"
          label={<Trans i18nKey={LOCALS.keyword} />}
          initialValue=""
        >
          <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
        </Form.Item>

        <Form.Item
          name="categoryIdList"
          label={i18n.t('topic_category')}
          initialValue={[]}
          className="w-60"
        >
          <Select
            mode="multiple"
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

        <Form.Item name="langList" label={i18n.t('language')} initialValue={[]}>
          <Select
            mode="multiple"
            placeholder={i18n.t(LOCALS.please_select) || ''}
            style={{ minWidth: 120 }}
            options={langOptionList.map(({ value, label }) => {
              return {
                value,
                label,
              };
            })}
          />
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
                window.location.href = '/cms/subject-detail';
              }}
            >
              <Trans i18nKey={LOCALS.add} />
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        tableLayout="fixed"
        bordered
        pagination={{
          total,
          pageSize,
          current: pageNum,
          onChange: (page, pageSize) => {
            setPageNum(page);
            setPageSize(pageSize);
            getDataSource({ pageNum: page, pageSize });
          },
        }}
        loading={loading}
        rowKey={'id'}
        style={{
          marginTop: 12,
        }}
        dataSource={dataSource}
        columns={columns}
      />

      <CopyProductModal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onLoad={() => {
          getDataSource({ pageNum, pageSize });
        }}
        data={selectData}
      />
    </div>
  );
};

export default CmsSubjectListPage;
