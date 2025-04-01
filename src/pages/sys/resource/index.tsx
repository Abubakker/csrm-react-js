import { Button, Popconfirm, Form, Input, Select, Space } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import {
  getResourceCategoryList,
  getResourceList,
  resourceDelete,
} from 'apis/sys';
import LOCALS from 'commons/locals';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { SysRoleResources, SysRoleResourcesCategory } from 'types/sys';
import ResourceEditModal from './resource-edit-modal';
import i18n from 'i18n';
import ResourceClassificationDrawer from './resource-classification-drawer';
import usePagination from 'commons/hooks/usePagination';
import { PageQuery } from 'types/base';
import queryString from 'query-string';
import setQueryParameters from 'utils/setQueryParameters';
import dayjs from 'dayjs';

const ResourceList = () => {
  const [form] = Form.useForm<{
    keyword?: string;
    categoryIdList?: string[];
  }>();
  const [open, setOpen] = useState(false);
  const [openClassification, setOpenClassification] = useState(false);
  const [detail, setDetail] = useState<SysRoleResources>();
  const [categoryList, setCategoryList] = useState<SysRoleResourcesCategory[]>(
    []
  );

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
  } = usePagination<SysRoleResources>();

  const getDataSource = useCallback(
    async ({ pageNum, pageSize }: PageQuery) => {
      const { keyword, categoryIdList } = form.getFieldsValue();
      const data = {
        pageNum,
        pageSize,
        keyword,
        categoryIdList: categoryIdList && categoryIdList.join(','),
      };

      setQueryParameters(data);

      try {
        setLoading(true);
        const { list, total } = await getResourceList(data);

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

    form.setFieldsValue(parsed);

    const pageNum = parsed.pageNum ? +parsed.pageNum : 1;
    const pageSize = parsed.pageSize ? +parsed.pageSize : 10;
    setPageNum(pageNum);
    setPageSize(pageSize);

    getDataSource({ pageNum, pageSize });
  }, [form, getDataSource, setPageNum, setPageSize]);

  const getClassificationList = useCallback(async () => {
    try {
      const list = await getResourceCategoryList();
      setCategoryList(list);
    } catch (err) {
    } finally {
    }
  }, []);

  useEffect(() => {
    getClassificationList();
  }, [getClassificationList]);

  const columns: ColumnsType<SysRoleResources> = useMemo(() => {
    return [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        width: 60,
      },
      {
        title: <Trans i18nKey={LOCALS.resource_name} />,
        key: 'name',
        dataIndex: 'name',
        width: 150,
      },
      {
        width: 150,
        title: <Trans i18nKey={LOCALS.resource_path} />,
        key: 'url',
        dataIndex: 'url',
      },
      {
        width: 120,
        title: <Trans i18nKey={LOCALS.resource_classification} />,
        key: 'categoryId',
        dataIndex: 'categoryId',
        render: (categoryId: SysRoleResources['categoryId']) =>
          categoryList.find((d) => d.id === categoryId)?.name || '',
      },
      {
        width: 150,
        title: <Trans i18nKey={LOCALS.description} />,
        key: 'description',
        dataIndex: 'description',
      },
      {
        width: 120,
        title: <Trans i18nKey={LOCALS.created_time} />,
        key: 'createTime',
        dataIndex: 'createTime',
        render: (createTime: SysRoleResources['createTime']) =>
          dayjs(createTime).format('YYYY-MM-DD HH-mm'),
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        width: 120,
        render: (record: SysRoleResources) => {
          return (
            <>
              <Button
                type="link"
                onClick={() => {
                  setOpen(true);
                  setDetail(record);
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
                  await resourceDelete(record.id);
                  getDataSource({ pageNum, pageSize });
                }}
              >
                <Button type="link">
                  <Trans i18nKey={LOCALS.delete} />
                </Button>
              </Popconfirm>
            </>
          );
        },
      },
    ];
  }, [categoryList, getDataSource, pageNum, pageSize]);

  const onFinish = async () => {
    setPageNum(1);
    getDataSource({ pageNum: 1, pageSize });
  };

  return (
    <div>
      <div>
        <Form form={form} onFinish={onFinish} layout={'inline'}>
          <Form.Item name="keyword" label={<Trans i18nKey={LOCALS.keyword} />}>
            <Input
              placeholder={`${i18n.t(LOCALS.resource_name)} \\ ${i18n.t(
                LOCALS.resource_path
              )}`}
            />
          </Form.Item>

          <Form.Item
            name="categoryIdList"
            className="w-[240px]"
            label={<Trans i18nKey={LOCALS.resource_classification} />}
          >
            <Select
              className="w-full"
              placeholder={i18n.t(LOCALS.resource_classification) || ''}
              mode="multiple"
              allowClear
            >
              {categoryList.map((d) => (
                <Select.Option key={d.id} value={d.id}>
                  {d.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                <Trans i18nKey={LOCALS.search} />
              </Button>

              <Button
                htmlType="button"
                onClick={() => {
                  form.resetFields();
                  getDataSource({ pageNum: 1, pageSize });
                }}
              >
                <Trans i18nKey={LOCALS.reset} />
              </Button>
              <Button
                onClick={() => {
                  setOpen(true);
                  setDetail(undefined);
                }}
              >
                <Trans i18nKey={LOCALS.add} />
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => setOpenClassification(true)}>
          <Trans i18nKey={LOCALS.resource_classification} />
        </Button>
      </div>
      <Table
        bordered
        tableLayout="fixed"
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
        scroll={{ x: 'max-context', y: '70vh' }}
        dataSource={dataSource}
        columns={columns}
      />

      <ResourceEditModal
        open={open}
        data={detail}
        onCancel={() => {
          setOpen(false);
          getDataSource({ pageNum, pageSize });
        }}
        categoryList={categoryList}
      />

      <ResourceClassificationDrawer
        open={openClassification}
        onClose={() => {
          setOpenClassification(false);
          getDataSource({ pageNum, pageSize });
        }}
      />
    </div>
  );
};

export default ResourceList;
