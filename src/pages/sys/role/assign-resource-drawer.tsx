import { Drawer, message, Tree, Button } from 'antd';
import i18n from 'i18n';
import { useCallback, useEffect, useState } from 'react';
import {
  SysRole,
  SysRoleResources,
  SysRoleResourcesCategoryList,
} from 'types/sys';
import {
  getRoleResources,
  getRoleResourceRelations,
  updateRoleResourceRelations,
} from 'apis/sys';

interface Props {
  open: boolean;
  onClose: () => void;
  data?: SysRole;
}

const AssignResourceDrawer = ({ open, onClose, data }: Props) => {
  const [roleResourcesCategoryList, setRoleResourcesCategoryList] = useState<
    SysRoleResourcesCategoryList[]
  >([]);

  const [selected, setSeleceed] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const getResourcesCategoryList = useCallback(async () => {
    try {
      const list = await getRoleResources();
      // 重写key的逻辑
      const temp = list.map((d) => {
        return {
          ...d,
          children: d.children.map((dd) => ({
            ...dd,
            key: `${d.id}-${dd.id}`,
          })),
          key: `${d.id}`,
        };
      });
      setRoleResourcesCategoryList(temp);
      setExpandedKeys(temp.map((d) => d.key));
    } catch (err) {
    } finally {
    }
  }, []);

  const getRelations = useCallback(async () => {
    if (!data?.id || !open) return;
    let selectedList: string[] = [];
    const list = await getRoleResourceRelations(data?.id);
    let selectResources: (SysRoleResources & { key: string })[] = [];
    roleResourcesCategoryList.forEach((d) => {
      selectResources = selectResources.concat(d.children);
    });
    list.forEach((d) => {
      const f = selectResources.find((dd) => dd.id === Number(d.resourceId));
      if (f) selectedList.push(f.key);
    });
    setSeleceed(selectedList);
  }, [data?.id, open, roleResourcesCategoryList]);

  useEffect(() => {
    getResourcesCategoryList();
  }, [getResourcesCategoryList]);

  useEffect(() => {
    if (roleResourcesCategoryList.length > 0) getRelations();
  }, [getRelations, roleResourcesCategoryList.length]);

  const onSave = useCallback(async () => {
    if (!data?.id) return;
    const resources: string[] = [];
    let selectResources: (SysRoleResources & { key: string })[] = [];
    roleResourcesCategoryList.forEach((d) => {
      selectResources = selectResources.concat(d.children);
    });
    selected.forEach((d) => {
      const f = selectResources.find((dd) => dd.key === d);
      if (f) resources.push(`${f.id}`);
    });
    const dto = {
      roleId: `${data?.id}`,
      resources,
    };
    setLoading(true);
    await updateRoleResourceRelations(dto);
    setLoading(false);
    message.success(i18n.t('successful_operation'));
    onClose();
  }, [data, onClose, roleResourcesCategoryList, selected]);

  return (
    <Drawer
      title={i18n.t('assign_menu')}
      width={'50%'}
      onClose={onClose}
      open={open}
      zIndex={1001}
    >
      <Tree
        checkable
        treeData={roleResourcesCategoryList}
        fieldNames={{ title: 'name', key: 'key', children: 'children' }}
        checkedKeys={selected}
        onCheck={(e) => {
          setSeleceed(e as string[]);
        }}
        expandedKeys={expandedKeys}
        onExpand={(e) => {
          setExpandedKeys(e as string[]);
        }}
        showLine
      />

      <Button
        type="primary"
        onClick={() => onSave()}
        className="mt-6"
        loading={loading}
      >
        {i18n.t('save')}
      </Button>
    </Drawer>
  );
};

export default AssignResourceDrawer;
