import { Button, Popconfirm, Switch } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { getRoleList, roleDelete, roleEdit } from 'apis/sys';
import LOCALS from 'commons/locals';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { SysRole } from 'types/sys';
import RoleEditModal from './role-edit-modal';
import AssignMenuDrawer from './assign-menu-drawer';
import AssignResourceDrawer from './assign-resource-drawer';
import dayjs from 'dayjs';
import i18n from 'i18n';

const RoleList = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<SysRole[]>([]);
  const [detail, setDetail] = useState<SysRole>();
  const [openAssignMenu, setOpenAssignMenu] = useState(false);
  const [openAssignResource, setOpenAssignResource] = useState(false);

  const getDataSource = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getRoleList();
      setDataSource(list);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [setDataSource, setLoading]);

  useEffect(() => {
    getDataSource();
  }, [getDataSource]);

  const columns: ColumnsType<SysRole> = useMemo(() => {
    return [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        width: 60,
      },
      {
        title: <Trans i18nKey={LOCALS.role_name} />,
        key: 'name',
        dataIndex: 'name',
        width: 150,
      },
      {
        width: 200,
        title: <Trans i18nKey={LOCALS.description} />,
        key: 'description',
        dataIndex: 'description',
      },
      {
        width: 200,
        title: <Trans i18nKey={LOCALS.status} />,
        key: 'status',
        dataIndex: 'status',
        render: (status: SysRole['status'], record: SysRole) => (
          <Switch
            checkedChildren={<Trans i18nKey={LOCALS.enable} />}
            unCheckedChildren={<Trans i18nKey={LOCALS.disable} />}
            value={Boolean(status)}
            onChange={async () => {
              await roleEdit({ ...record, status: Number(!status) });
              getDataSource();
            }}
          />
        ),
      },
      {
        width: 150,
        title: <Trans i18nKey={LOCALS.created_time} />,
        key: 'createTime',
        dataIndex: 'createTime',
        render: (createTime: SysRole['createTime']) =>
          dayjs(createTime).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        width: 200,
        render: (record: SysRole) => {
          return (
            <>
              <Button
                type="link"
                onClick={() => {
                  setOpenAssignMenu(true);
                  setDetail(record);
                }}
              >
                <Trans i18nKey={LOCALS.assign_menu} />
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setOpenAssignResource(true);
                  setDetail(record);
                }}
              >
                <Trans i18nKey={LOCALS.assign_resource} />
              </Button>
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
                  await roleDelete(record.id);
                  getDataSource();
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
  }, [getDataSource]);

  return (
    <div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setOpen(true);
            setDetail(undefined);
          }}
        >
          {i18n.t('add')}
        </Button>
      </div>
      <Table
        bordered
        tableLayout="fixed"
        pagination={false}
        loading={loading}
        rowKey={'id'}
        style={{
          marginTop: 12,
        }}
        scroll={{ x: 'max-context', y: '70vh' }}
        dataSource={dataSource}
        columns={columns}
      />

      <RoleEditModal
        open={open}
        data={detail}
        onCancel={() => {
          setOpen(false);
        }}
        onLoad={() => getDataSource()}
      />

      <AssignMenuDrawer
        open={openAssignMenu}
        onClose={() => {
          setOpenAssignMenu(false);
          getDataSource();
        }}
        data={detail}
      />

      <AssignResourceDrawer
        open={openAssignResource}
        onClose={() => {
          setOpenAssignResource(false);
          getDataSource();
        }}
        data={detail}
      />
    </div>
  );
};

export default RoleList;
