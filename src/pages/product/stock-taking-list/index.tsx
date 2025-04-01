import { Form, Input, Button, Modal, Select, Table, Popconfirm } from 'antd';
import {
  createStockTaking,
  deleteStockTaking,
  downloadStockTakingCsv,
  getStockTakingList,
  PmsProductStockTaking,
} from 'apis/pms';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import { STOCK_PLACE_OPTION_LIST } from 'commons/options';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const StockTakingList = () => {
  const [searchForm] = Form.useForm<{ keyword?: string }>();
  const [createForm] = Form.useForm();
  const i18n = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useState<{
    keyword?: string;
  }>({});

  const {
    loading,
    dataSource,
    pageNum,
    pageSize,
    total,
    setLoading,
    setDataSource,
    setPageNum,
    setPageSize,
    setTotal,
  } = usePagination<PmsProductStockTaking>();

  useEffect(() => {
    setLoading(true);
    getStockTakingList({
      pageNum,
      pageSize,
      keyword: searchParams.keyword,
    })
      .then((res) => {
        setDataSource(res.list);
        setTotal(res.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pageNum, pageSize, searchParams, setDataSource, setLoading, setTotal]);

  return (
    <div>
      <Form
        form={searchForm}
        layout="inline"
        onFinish={() => setPageNum(1)}
        onValuesChange={(_, values) => {
          setPageNum(1);
          setSearchParams(values);
        }}
      >
        <Form.Item label={i18n.t(LOCALS.keyword)} name="keyword">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button onClick={() => setModalOpen(true)}>
            {i18n.t(LOCALS.add)}
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title={i18n.t(LOCALS.add)}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => {
          createForm.validateFields().then((values) => {
            createStockTaking(values).then(() => {
              window.location.reload();
            });
          });
        }}
      >
        <Form form={createForm} labelCol={{ span: 4 }}>
          <Form.Item
            label={i18n.t(LOCALS.stock_place)}
            name="stockPlaces"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              options={STOCK_PLACE_OPTION_LIST}
              onChange={(value: string[]) => {
                const options = STOCK_PLACE_OPTION_LIST.filter((option) =>
                  value.includes(option.value)
                );
                const label = options
                  .map((option) => i18n.t(option.labelKey))
                  .join(',');

                createForm.setFieldValue(
                  'name',
                  `${dayjs().format('YYYY-MM-DD')} ${label}`
                );
              }}
            />
          </Form.Item>

          <Form.Item
            label={i18n.t(LOCALS.title)}
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={i18n.t(LOCALS.note)} name="note">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        loading={loading}
        rowKey="id"
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: i18n.t(LOCALS.title), dataIndex: 'name' },
          {
            title: i18n.t(LOCALS.stock_place),
            dataIndex: 'stockPlace',
            render: (value) =>
              value
                .split(',')
                .map((v: string) =>
                  i18n.t(
                    STOCK_PLACE_OPTION_LIST.find((option) => option.value === v)
                      ?.labelKey || ''
                  )
                )
                .join(','),
          },
          {
            title: i18n.t(LOCALS.created_time),
            dataIndex: 'createTime',
            render: (value) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            title: i18n.t(LOCALS.created_by),
            dataIndex: 'operateMan',
            render: (value) => value || '-',
          },
          {
            title: i18n.t(LOCALS.note),
            dataIndex: 'note',
            render: (value) => value || '-',
          },
          {
            title: i18n.t(LOCALS.option),
            render: (_, record) => (
              <div>
                <Link to={`/pms/stock-taking/${record.id}`}>
                  {i18n.t(LOCALS.pWpTmJiNfE)}
                </Link>
                <Button
                  type="link"
                  onClick={() => {
                    downloadStockTakingCsv(record.id);
                  }}
                >
                  {i18n.t(LOCALS.download_excel)}
                </Button>
                <Popconfirm
                  title={i18n.t(LOCALS.delete)}
                  description={
                    <div className="w-[150px]">
                      {i18n.t(LOCALS.are_you_sure_to_delete)}
                    </div>
                  }
                  onConfirm={async () => {
                    await deleteStockTaking(record.id);
                    window.location.reload();
                  }}
                >
                  <Button danger type="link">
                    {i18n.t(LOCALS.delete)}
                  </Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
        dataSource={dataSource}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            setPageNum(pageNum);
            setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
};

export default StockTakingList;
