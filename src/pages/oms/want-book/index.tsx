import { Button, Form, Input, Select, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { wantBookList } from 'apis/oms';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import showTotal from 'components/show-total';
import dayjs from 'dayjs';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { PageQuery } from 'types/base';
import setQueryParameters from 'utils/setQueryParameters';
import { WantBookRecord, wantBookStatusList } from './common';
import WantBookEditDialog from './want-book-edit-dialog';
import i18n from '../../../i18n';

const WantBookPage = () => {
  const {
    loading,
    setLoading,
    dataSource,
    setDataSource,
    pageNum,
    setPageNum,
    pageSize,
    setPageSize,
    total,
    setTotal,
  } = usePagination<WantBookRecord>();

  const [wantBook, setWantBook] = useState<WantBookRecord>();

  const [form] = Form.useForm<{
    status?: number;
    productName?: string;
  }>();

  const onFinish = async () => {
    setPageNum(1);
    getDataSource({ pageNum: 1, pageSize });
  };

  const onReset = () => {
    form.resetFields();
    onFinish();
  };

  const getDataSource = useCallback(
    async ({ pageNum, pageSize }: PageQuery) => {
      const { productName, status } = form.getFieldsValue();
      const data = {
        pageNum,
        pageSize,
        productName,
        status,
      };

      setQueryParameters(data);

      try {
        setLoading(true);
        const {
          data: { records, total },
        } = await wantBookList(data);

        setDataSource(records);
        setTotal(total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [form, setDataSource, setLoading, setTotal],
  );

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    // @ts-ignore
    if (parsed.status) parsed.status = +parsed.status;

    form.setFieldsValue(parsed);

    const pageNum = parsed.pageNum ? +parsed.pageNum : 1;
    const pageSize = parsed.pageSize ? +parsed.pageSize : 10;
    setPageNum(pageNum);
    setPageSize(pageSize);

    getDataSource({ pageNum, pageSize });
  }, [form, getDataSource, setPageNum, setPageSize]);

  const columns: ColumnsType<WantBookRecord> = useMemo(() => {
    return [
      {
        title: <Trans i18nKey={LOCALS.product_name} />,
        dataIndex: 'productName',
        key: 'productName',
        width: 180,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 180,
      },
      {
        title: <Trans i18nKey={LOCALS.status}></Trans>,
        dataIndex: 'status',
        key: 'status',
        width: 180,
        render(status: number) {
          return wantBookStatusList[status];
        },
      },
      {
        title: <Trans i18nKey={LOCALS.remark}></Trans>,
        dataIndex: 'remarks',
        key: 'remarks',
        width: 180,
        render(remarks: string) {
          return remarks || '-';
        },
      },
      {
        title: <Trans i18nKey={LOCALS.created_time}></Trans>,
        dataIndex: 'createTime',
        key: 'createTime',
        width: 180,
        render(createTime: string) {
          return dayjs(createTime).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: <Trans i18nKey={LOCALS.updated_time} />,
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 180,
        render(updateTime?: string) {
          return updateTime
            ? dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss')
            : '-';
        },
      },
      {
        title: <Trans i18nKey={LOCALS.option}></Trans>,
        key: 'operate',
        width: 180,
        render(data: WantBookRecord) {
          return (
            <Button.Group>
              <Button
                onClick={() => {
                  setWantBook(data);
                }}
              >
                编辑
              </Button>
            </Button.Group>
          );
        },
      },
    ];
  }, []);

  return (
    <div>
      <WantBookEditDialog
        data={wantBook}
        open={!!wantBook}
        onClose={() => {
          setWantBook(undefined);
        }}
      />
      <Form form={form} layout="inline" onFinish={onFinish}>
        <Form.Item label={i18n.t('keyword')} name="productName">
          <Input />
        </Form.Item>
        <Form.Item label={i18n.t('status')} name="status" className="w-48">
          <Select
            options={wantBookStatusList.map((label, value) => ({
              label,
              value,
            }))}
          ></Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              <Trans i18nKey={LOCALS.search} />
            </Button>

            <Button htmlType="button" onClick={onReset}>
              <Trans i18nKey={LOCALS.reset} />
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Table
        bordered
        tableLayout="fixed"
        pagination={{
          showTotal,
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

export default WantBookPage;
