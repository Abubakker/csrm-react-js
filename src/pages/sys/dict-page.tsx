import { Button, Drawer, Form, Input, message, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { sysDictApi } from 'apis/sys';
import usePagination from 'commons/hooks/usePagination';
import i18n from 'i18n';
import { useEffect, useMemo, useState } from 'react';
import { UnwrapPromise } from 'types/base';

type SysDict = UnwrapPromise<
  ReturnType<typeof sysDictApi.list>
>['list'][number];

const DictPage = () => {
  const {
    dataSource,
    setDataSource,
    pageNum,
    setPageNum,
    pageSize,
    setPageSize,
    total,
    setTotal,
  } = usePagination<SysDict>();

  useEffect(() => {
    sysDictApi.list({ pageNum, pageSize }).then((res) => {
      setDataSource(res.list);
      setTotal(res.total);
    });
  }, [pageNum, pageSize, setDataSource, setTotal]);

  const [form] = Form.useForm<SysDict>();
  const [open, setOpen] = useState(false);

  const columns: ColumnsType<SysDict> = useMemo(() => {
    return [
      {
        title: '字典ID',
        dataIndex: 'id',
        key: 'id',
        width: 100,
      },
      {
        title: '字典类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '字典值',
        dataIndex: 'valueList',
        key: 'valueList',
        width: 600,
        render: (valueList: SysDict['valueList']) => {
          return <div className="line-clamp-3">{valueList}</div>;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        render: (sysDict: SysDict) => {
          return (
            <div>
              <Button
                type="link"
                onClick={() => {
                  setOpen(true);
                  form.setFieldsValue({
                    ...sysDict,
                  });
                }}
              >
                编辑
              </Button>
            </div>
          );
        },
      },
    ];
  }, [form]);

  return (
    <div>
      <div className="mb-4">
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
            form.resetFields();
          }}
        >
          新增字典
        </Button>
      </div>
      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        pagination={{
          total,
          current: pageNum,
          pageSize,
          onChange: (page) => {
            setPageNum(page);
          },
          onShowSizeChange: (_, size) => {
            setPageSize(size);
          },
        }}
      />

      <Drawer
        title="新增字典"
        open={open}
        onClose={() => setOpen(false)}
        width={800}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          onFinish={async (data) => {
            if (data.id) {
              await sysDictApi.update(data);
            } else {
              await sysDictApi.add(data);
            }
            message.success(i18n.t('successful_operation'));
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }}
        >
          <Form.Item label="字典ID" name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="字典Key"
            name="type"
            required
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="字典值"
            name="valueList"
            required
            rules={[
              {
                required: true,
                validator: async (rule, value) => {
                  try {
                    const obj = JSON.parse(value);
                    if (!Array.isArray(obj)) throw new Error('error');
                  } catch (error) {
                    return Promise.reject(
                      '字典数据由于历史原因必须为 JSON 数组格式'
                    );
                  }
                },
              },
            ]}
          >
            <Input.TextArea rows={20} />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input />
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Button type="primary" onClick={() => form.submit()}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default DictPage;
