import { Button, Form, Input, Modal, Select, Space, message } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import {
  getSysUserList,
  sysUserRegister,
  sysUserUpdate,
  getRoleList,
  getAdminRoles,
  updateAdminRoles,
} from 'apis/sys';
import useIsMobile from 'commons/hooks/useIsMobile';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import { SYS_USER_SHOP_OPTION_LIST, findLabelByValue } from 'commons/options';
import i18n from 'i18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { PageQuery } from 'types/base';
import { SysRole, SysUser } from 'types/sys';
import formatTime from 'utils/formatTime';
import _ from 'lodash';

const AdminList = () => {
  const [form] = Form.useForm();
  const [addEditForm] = Form.useForm();
  const [adminRoleForm] = Form.useForm();
  const [editSysUser, setEditSysUser] = useState<SysUser>();
  const isMobile = useIsMobile();
  const [type, setType] = useState<'add' | 'edit'>('add');
  const [open, setOpen] = useState(false);
  const [openRole, setOpenRole] = useState(false);
  const [roleData, setRoleData] = useState<SysRole[]>([]);

  const {
    loading,
    setLoading,
    pageNum,
    setPageNum,
    pageSize,
    setPageSize,
    total,
    setTotal,
    dataSource,
    setDataSource,
  } = usePagination<SysUser>();

  const getDataSource = useCallback(
    async ({ pageNum, pageSize }: PageQuery) => {
      const data = form.getFieldsValue();

      try {
        setLoading(true);
        const {
          data: { list, total },
        } = await getSysUserList({
          ...data,
          pageNum,
          pageSize,
        });

        setDataSource(list);
        setTotal(total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [form, setDataSource, setLoading, setTotal]
  );

  const getRoleDataSource = useCallback(async () => {
    try {
      const list = await getRoleList();
      setRoleData(list);
    } catch (err) {
    } finally {
    }
  }, []);

  useEffect(() => {
    getDataSource({ pageNum: 1, pageSize: 10 });
    getRoleDataSource();
  }, [getDataSource, getRoleDataSource]);

  const onFinish = async () => {
    setPageNum(1);
    getDataSource({ pageNum: 1, pageSize });
  };

  const onReset = () => {
    form.resetFields();
    onFinish();
  };

  const onAdd = () => {
    setType('add');
    setOpen(true);
  };

  const onEdit = useCallback(
    (sysUser: SysUser) => {
      setType('edit');
      setOpen(true);
      setEditSysUser(sysUser);
      addEditForm.setFieldsValue({
        username: sysUser.username,
        nickName: sysUser.nickName,
        email: sysUser.email,
        shop: sysUser.shop,
        note: sysUser.note,
      });
    },
    [addEditForm]
  );

  const onAddEdit = useCallback(async () => {
    const data = await addEditForm.validateFields();

    Modal.confirm({
      title: <Trans i18nKey={LOCALS.confirm_submit} />,
      onOk: async () => {
        if (type === 'add') {
          await sysUserRegister({
            ...data,
          });
        }

        if (type === 'edit' && editSysUser?.id) {
          await sysUserUpdate({
            id: editSysUser.id,
            ...data,
          });
        }

        message.success(i18n.t(LOCALS.successful_operation));
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
    });
  }, [addEditForm, editSysUser?.id, type]);

  const getAdminRolesList = useCallback(
    async (id: number) => {
      if (roleData.length === 0) return;
      try {
        const list = await getAdminRoles(id);
        let roles: string[] = list.map((d) => d.roleId).map(String);
        // 排除禁用的
        const disabledRoles = roleData
          .filter((d) => !d.status)
          .map((d) => d.id)
          .map(String);
        const result = _.difference(roles, disabledRoles);
        adminRoleForm.setFieldsValue({
          adminId: id,
          roles: result,
        });
      } catch (err) {
      } finally {
      }
    },
    [adminRoleForm, roleData]
  );

  const columns: ColumnsType<SysUser> = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: <Trans i18nKey={LOCALS.account} />,
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: <Trans i18nKey={LOCALS.name} />,
        dataIndex: 'nickName',
        key: 'nickName',
      },
      {
        title: <Trans i18nKey={LOCALS.email} />,
        dataIndex: 'email',
        key: 'email',
        render: (email: SysUser['email']) => {
          return email || '-';
        },
      },
      {
        title: <Trans i18nKey={LOCALS.shop} />,
        dataIndex: 'shop',
        key: 'shop',
        render: (shop: SysUser['shop']) => {
          return findLabelByValue(shop, SYS_USER_SHOP_OPTION_LIST);
        },
      },
      {
        title: <Trans i18nKey={LOCALS.created_time} />,
        dataIndex: 'createTime',
        key: 'createTime',
        render: (createdTime: SysUser['createTime']) => {
          return formatTime(createdTime);
        },
      },
      {
        title: <Trans i18nKey={LOCALS.last_login_time} />,
        dataIndex: 'loginTime',
        key: 'loginTime',
        render: (loginTime: SysUser['loginTime']) => {
          return formatTime(loginTime);
        },
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        render: (sysUser: SysUser) => {
          return (
            <Space>
              <Button
                type="link"
                onClick={() => {
                  onEdit(sysUser);
                }}
              >
                <Trans i18nKey={LOCALS.edit}></Trans>
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setOpenRole(true);
                  getAdminRolesList(sysUser.id);
                }}
              >
                <Trans i18nKey={LOCALS.assign_role}></Trans>
              </Button>
            </Space>
          );
        },
      },
    ];
  }, [getAdminRolesList, onEdit]);

  const onRoleFinish = useCallback(() => {
    adminRoleForm.validateFields().then(async (val) => {
      await updateAdminRoles({
        ...val,
      });
      message.success(i18n.t('successful_operation'));
      setOpenRole(false);
      getDataSource({ pageNum, pageSize });
    });
  }, [adminRoleForm, getDataSource, pageNum, pageSize]);

  return (
    <div>
      <Modal
        width="600px"
        open={open}
        title={<Trans i18nKey={type === 'add' ? LOCALS.add : LOCALS.edit} />}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={onAddEdit}
      >
        <Form form={addEditForm} labelCol={{ span: 6 }}>
          <Form.Item
            label={<Trans i18nKey={LOCALS.account} />}
            name="username"
            rules={[
              {
                required: true,
                message: <Trans i18nKey={LOCALS.required_field} />,
              },
            ]}
          >
            <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>

          <Form.Item
            label={<Trans i18nKey={LOCALS.name} />}
            name="nickName"
            rules={[
              {
                required: true,
                message: <Trans i18nKey={LOCALS.required_field} />,
              },
            ]}
          >
            <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>

          <Form.Item
            label={<Trans i18nKey={LOCALS.password} />}
            name="password"
            rules={
              type === 'add'
                ? [
                    {
                      required: true,
                      message: <Trans i18nKey={LOCALS.required_field} />,
                    },
                  ]
                : []
            }
          >
            <Input.Password placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>

          <Form.Item label={<Trans i18nKey={LOCALS.email} />} name="email">
            <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>

          <Form.Item name="shop" label={<Trans i18nKey={LOCALS.shop} />}>
            <Select
              allowClear
              options={SYS_USER_SHOP_OPTION_LIST}
              placeholder={<Trans i18nKey={LOCALS.please_select} />}
            />
          </Form.Item>
          <Form.Item label={<Trans i18nKey={LOCALS.note} />} name="note">
            <Input.TextArea placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>
        </Form>
      </Modal>
      <Form
        form={form}
        onFinish={onFinish}
        layout={isMobile ? 'vertical' : 'inline'}
      >
        <Form.Item name="keyword" label={<Trans i18nKey={LOCALS.keyword} />}>
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
            <Button onClick={onAdd}>
              <Trans i18nKey={LOCALS.add} />
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
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

      <Modal
        open={openRole}
        title={i18n.t(LOCALS.assign_role)}
        onCancel={() => setOpenRole(false)}
        onOk={onRoleFinish}
        destroyOnClose
        confirmLoading={loading}
      >
        <Form
          form={adminRoleForm}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item name="adminId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label={i18n.t('role_name')}
            name="roles"
            required
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select mode="multiple">
              {roleData.map((d) => (
                <Select.Option key={d.id} disabled={!d.status}>
                  {d.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminList;
