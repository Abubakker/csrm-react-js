import { Drawer, Button, Popconfirm } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import i18n from 'i18n';
import { SysRoleResourcesCategory } from 'types/sys';
import { getResourceCategoryList, resourceCategoryDelete } from 'apis/sys';
import { Trans } from 'react-i18next';
import LOCALS from 'commons/locals';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import ResourceClassificationEditModal from './resource-classification-edit-modal';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ResourceClassificationDrawer = ({ open, onClose }: Props) => {
  const [categoryList, setCategoryList] = useState<SysRoleResourcesCategory[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [detail, setDetail] = useState<SysRoleResourcesCategory>();

  const getClassificationList = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getResourceCategoryList();
      setCategoryList(list);
      setLoading(false);
    } catch (err) {
    } finally {
    }
  }, []);

  useEffect(() => {
    getClassificationList();
  }, [getClassificationList]);

  const columns: ColumnsType<SysRoleResourcesCategory> = useMemo(() => {
    return [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: <Trans i18nKey={LOCALS.name} />,
        key: 'name',
        dataIndex: 'name',
        width: 150,
      },
      {
        width: 100,
        title: <Trans i18nKey={LOCALS.created_time} />,
        key: 'createdTime',
        dataIndex: 'createdTime',
        render: (createdTime: SysRoleResourcesCategory['createTime']) =>
          dayjs(createdTime).format('YYYY-MM-DD HH:mm'),
      },
      {
        title: <Trans i18nKey={LOCALS.sort} />,
        key: 'sort',
        dataIndex: 'sort',
        width: 150,
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        width: 200,
        render: (record: SysRoleResourcesCategory) => {
          return (
            <>
              <Button
                type="link"
                onClick={() => {
                  setOpenEdit(true);
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
                  await resourceCategoryDelete(record.id);
                  getClassificationList();
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
  }, [getClassificationList]);

  return (
    <Drawer
      title={i18n.t('resource_classification')}
      width={'80%'}
      onClose={onClose}
      open={open}
      zIndex={1001}
    >
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setOpenEdit(true);
            setDetail(undefined);
          }}
        >
          <Trans i18nKey={LOCALS.add} />
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
        dataSource={categoryList}
        columns={columns}
      />

      <ResourceClassificationEditModal
        open={openEdit}
        data={detail}
        onCancel={() => {
          setOpenEdit(false);
          getClassificationList();
        }}
      />
    </Drawer>
  );
};

export default ResourceClassificationDrawer;
