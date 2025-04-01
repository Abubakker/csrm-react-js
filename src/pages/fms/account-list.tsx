import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Table,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import {
  financialManagementAddOrUpdateAccount,
  financialManagementAccountList,
} from 'apis/fms';
import {
  FMS_ACCOUNT_MODE_MAP,
  FMS_ACCOUNT_STATUS_MAP,
  FMS_ACCOUNT_STATUS_OPTION_LIST,
  SYS_USER_SHOP_OPTION_LIST,
  findLabelByValue,
} from 'commons/options';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToggle } from 'react-use';
import { useAppSelector } from 'store/hooks';
import { selectUserInfo } from 'store/slices/userInfoSlice';
import { FmsAccountManagement } from 'types/fms';

const FmsAccountList = () => {
  const [open, toggleOpen] = useToggle(false);
  const [form] = useForm<
    Omit<FmsAccountManagement, 'isCash'> & {
      isCash: boolean;
    }
  >();
  const { shop, isLoading } = useAppSelector(selectUserInfo);
  const [accountList, setAccountList] = useState<FmsAccountManagement[]>([]);
  const [loading, toggleLoading] = useToggle(false);
  const [loadingAccountList, toggleLoadingAccountList] = useToggle(false);

  const fetchAccountList = useCallback(() => {
    toggleLoadingAccountList();
    financialManagementAccountList(shop)
      .then((res) => {
        setAccountList(res);
      })
      .finally(() => {
        toggleLoadingAccountList();
      });
  }, [shop, toggleLoadingAccountList]);

  const handleOk = useCallback(async () => {
    try {
      toggleLoading();
      const res = await form.validateFields();
      await financialManagementAddOrUpdateAccount({
        ...res,
        isCash: res.isCash ? 1 : 0,
      });
      toggleOpen();
      fetchAccountList();
    } catch (err) {
    } finally {
      toggleLoading();
    }
  }, [fetchAccountList, form, toggleLoading, toggleOpen]);

  useEffect(() => {
    if (isLoading) return;

    fetchAccountList();
  }, [fetchAccountList, isLoading, shop]);

  const columns: ColumnsType<FmsAccountManagement> = useMemo(() => {
    return [
      {
        title: '编码',
        dataIndex: 'accountCode',
        key: 'accountCode',
      },
      {
        title: '名称',
        dataIndex: 'accountName',
        key: 'accountName',
      },
      {
        title: '描述',
        dataIndex: 'accountDescribe',
        key: 'accountDescribe',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
      },
      {
        title: '现金',
        dataIndex: 'isCash',
        key: 'isCash',
        render: (isCash: FmsAccountManagement['isCash']) => {
          if (isCash) return '现金';

          return '非现金';
        },
      },
      {
        title: '启用状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: FmsAccountManagement['status']) => {
          return findLabelByValue(status, FMS_ACCOUNT_STATUS_OPTION_LIST);
        },
      },
      {
        title: '操作',
        key: 'option',
        render: (fmsAccount: FmsAccountManagement) => {
          return (
            <div>
              <Button
                type="link"
                onClick={() => {
                  toggleOpen();
                  form.setFieldsValue({
                    ...fmsAccount,
                    isCash: !!fmsAccount.isCash,
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
  }, [form, toggleOpen]);

  return (
    <div>
      <Modal
        open={open}
        onCancel={toggleOpen}
        onOk={handleOk}
        title="新建账户"
        confirmLoading={loading}
        destroyOnClose
      >
        <Form
          preserve={false}
          form={form}
          labelCol={{ span: 4 }}
          initialValues={{
            status: FMS_ACCOUNT_STATUS_MAP.ON,
            storeId: shop,
            mode: FMS_ACCOUNT_MODE_MAP.PROD,
            isCash: false,
            sort: 1,
            deleteStatus: 0,
          }}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="deleteStatus" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="accountName"
            label="名称"
            required
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="accountCode"
            label="编码"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="isCash" label="现金">
            <Switch></Switch>
          </Form.Item>

          <Form.Item name="sort" label="排序">
            <InputNumber />
          </Form.Item>

          <Form.Item name="accountDescribe" label="描述">
            <Input />
          </Form.Item>

          <Form.Item name="status" label="状态">
            <Select options={FMS_ACCOUNT_STATUS_OPTION_LIST}></Select>
          </Form.Item>

          <Form.Item name="storeId" label="所属店铺">
            <Select
              options={SYS_USER_SHOP_OPTION_LIST}
              disabled={!!shop}
            ></Select>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        loading={loadingAccountList}
        pagination={false}
        columns={columns}
        rowKey={'id'}
        dataSource={accountList}
      ></Table>
      <Button className="mt-2" type="primary" onClick={toggleOpen}>
        添加
      </Button>
    </div>
  );
};

export default FmsAccountList;
