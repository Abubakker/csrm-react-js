import { Button, Form, Image, Input, Select, Space, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { CmsApi, CmsHelp, CmsHelpCategory } from 'apis/cms';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import { LANGUAGE_OPTION_LIST } from 'commons/options';
import i18n from 'i18n';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { PageQuery } from 'types/base';
import formatTime from 'utils/formatTime';
import setQueryParameters from 'utils/setQueryParameters';

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

const CmsArticleListPage = () => {
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
  } = usePagination<CmsHelp>();

  const [helpCategoryList, setHelpCategoryList] = useState<CmsHelpCategory[]>(
    []
  );
  useEffect(() => {
    CmsApi.getHelpCategory().then((res) => {
      setHelpCategoryList(res);
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
        const { list, total } = await CmsApi.getHelpList(data);

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

  const columns: ColumnsType<CmsHelp> = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: i18n.t('article_category'),
        dataIndex: 'categoryId',
        key: 'categoryId',
        render(categoryId: string) {
          return (
            helpCategoryList.find((i) => i.id === Number(categoryId))?.name ||
            '-'
          );
        },
      },
      {
        title: i18n.t('path'),
        dataIndex: 'path',
        key: 'path',
        render(path?: string) {
          return path || '-';
        },
      },
      {
        title: i18n.t('cover'),
        dataIndex: 'icon',
        key: 'icon',
        render(icon?: string) {
          if (!icon) return '-';
          return <Image src={icon} className="w-24" />;
        },
      },
      {
        title: i18n.t('sort'),
        dataIndex: 'sort',
        key: 'sort',
        render(sort?: number) {
          return sort || '-';
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
        title: i18n.t('article_publish_status'),
        dataIndex: 'showStatus',
        key: 'showStatus',
        render: (showStatus: 0 | 1 | null, { id }: CmsHelp) => {
          return (
            <Switch
              checked={showStatus === 1}
              onChange={async (checked) => {
                if (checked) {
                  await CmsApi.helpPublish(id);
                } else {
                  await CmsApi.helpUnPublish(id);
                }

                getDataSource({ pageNum, pageSize });
              }}
            ></Switch>
          );
        },
      },
      {
        title: i18n.t('created_time'),
        dataIndex: 'createTime',
        key: 'createTime',
        render(createTime: string) {
          return formatTime(createTime);
        },
      },
      {
        title: i18n.t('updated_time'),
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        render(modifyTime?: string) {
          return formatTime(modifyTime);
        },
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        fixed: 'right',
        width: 220,
        render: ({ id }: CmsHelp) => {
          return (
            <div>
              <Button
                type="link"
                onClick={() => {
                  window.location.href = `/cms/article-detail?id=${id}`;
                }}
              >
                <Trans i18nKey={LOCALS.edit} />
              </Button>

              <Button
                type="link"
                danger
                onClick={async () => {
                  await CmsApi.helpDelete(id);
                  onFinish();
                }}
              >
                <Trans i18nKey={LOCALS.delete} />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [getDataSource, helpCategoryList, onFinish, pageNum, pageSize]);

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
          label={i18n.t('article_category')}
          initialValue={[]}
          className="w-60"
        >
          <Select
            mode="multiple"
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
                window.location.href = '/cms/article-detail';
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
    </div>
  );
};

export default CmsArticleListPage;
