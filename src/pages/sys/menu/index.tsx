import { Button, Popconfirm, Switch } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { getMenuList, menuDelete, menuEdit } from 'apis/sys';
import LOCALS from 'commons/locals';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { SysMenu } from 'types/sys';
import MenuEditModal from './menu-edit-modal';
import i18n from 'i18n';
import getMenuBuildTree, { SysMenuKey } from 'utils/getMenuBuildTree';

const MenuList = () => {
  const [open, setOpen] = useState(0); // 0关闭 1普通编辑 2添加下级
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<SysMenuKey[]>([]);
  const [detail, setDetail] = useState<SysMenuKey>();

  const getDataSource = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getMenuList();
      const tree = getMenuBuildTree(list);
      setDataSource(tree);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [setDataSource, setLoading]);

  useEffect(() => {
    getDataSource();
  }, [getDataSource]);

  const columns: ColumnsType<SysMenuKey> = useMemo(() => {
    return [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: <Trans i18nKey={LOCALS.menu_name} />,
        key: 'title',
        dataIndex: 'title',
        width: 150,
      },
      {
        width: 100,
        title: <Trans i18nKey={LOCALS.menu_level} />,
        key: 'level',
        dataIndex: 'level',
        render: (level: SysMenuKey['level']) => (
          <>
            {i18n.t('level')}
            {level + 1}
          </>
        ),
      },
      {
        width: 150,
        title: <Trans i18nKey={LOCALS.front_end_name} />,
        key: 'name',
        dataIndex: 'name',
      },
      {
        width: 100,
        title: <Trans i18nKey={LOCALS.sort} />,
        key: 'sort',
        dataIndex: 'sort',
      },
      {
        width: 100,
        title: <Trans i18nKey={LOCALS.status} />,
        key: 'hidden',
        dataIndex: 'hidden',
        render: (
          hidden: SysMenu['hidden'],
          { children, key, ...record }: SysMenuKey
        ) => (
          <Switch
            checkedChildren={<Trans i18nKey={LOCALS.enable} />}
            unCheckedChildren={<Trans i18nKey={LOCALS.disable} />}
            value={Boolean(!hidden)}
            onChange={async () => {
              await menuEdit({ ...record, hidden: Number(!hidden) });
              getDataSource();
            }}
          />
        ),
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        width: 200,
        render: (record: SysMenuKey) => {
          return (
            <>
              {record.level === 0 && (
                <Button
                  type="link"
                  onClick={() => {
                    setOpen(2);
                    setDetail(record);
                  }}
                >
                  <Trans i18nKey={LOCALS.add_submenu} />
                </Button>
              )}
              <Button
                type="link"
                onClick={() => {
                  setOpen(1);
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
                  await menuDelete(record.id);
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
            setOpen(1);
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

      <MenuEditModal
        open={open}
        data={detail}
        dataSource={dataSource}
        onCancel={() => {
          setOpen(0);
        }}
        onLoad={() => getDataSource()}
      />
    </div>
  );
};

export default MenuList;
