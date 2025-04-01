import { Drawer, message, Tree, Button } from 'antd';
import i18n from 'i18n';
import { useCallback, useEffect, useState } from 'react';
import getMenuBuildTree, { SysMenuKey } from 'utils/getMenuBuildTree';
import { SysRole } from 'types/sys';
import {
  getMenuList,
  getRoleMenuRelations,
  updateRoleMenuRelations,
} from 'apis/sys';
import _ from 'lodash';

interface Props {
  open: boolean;
  onClose: () => void;
  data?: SysRole;
}

const AssignMenuDrawer = ({ open, onClose, data }: Props) => {
  const [menuData, setMenuData] = useState<SysMenuKey[]>([]);
  const [selectedMenu, setSeleceedMenu] = useState<number[]>([]); // 仅保留了子项
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);

  const getMenu = useCallback(async () => {
    try {
      const list = await getMenuList();
      const tree = getMenuBuildTree(list);
      setExpandedKeys(tree.map((d) => d.id));
      setMenuData(tree);
    } catch (err) {
    } finally {
    }
  }, [setMenuData]);

  const getRelations = useCallback(async () => {
    if (!data?.id || !open) return;
    const list = await getRoleMenuRelations(data?.id);
    const selected = list.map((d) => Number(d.menuId));
    // 排除父级key是为了： 当子节点 key 都传入，父节点也自动选中。
    // 返回一个新数组，保留第一个数组中不在第二个数组中的元素。
    const menuIds = _.difference(
      selected,
      menuData.map((d) => d.id)
    );
    setSeleceedMenu(menuIds);
  }, [data?.id, menuData, open]);

  useEffect(() => {
    getMenu();
  }, [getMenu]);

  useEffect(() => {
    if (menuData.length > 0) getRelations();
  }, [getRelations, menuData.length]);

  const onSave = useCallback(async () => {
    if (!data?.id) return;
    const menuIds: number[] = [...selectedMenu];
    menuData.forEach((d) => {
      d.children?.forEach((dd) => {
        const t = selectedMenu.find((ddd) => ddd === dd.id);
        if (t) {
          menuIds.push(d.id);
        }
      });
    });
    const dto = {
      roleId: data?.id,
      menuIds: _.uniq(menuIds),
    };
    setLoading(true);
    await updateRoleMenuRelations(dto);
    setLoading(false);
    message.success(i18n.t('successful_operation'));
    onClose();
  }, [data?.id, menuData, onClose, selectedMenu]);

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
        treeData={menuData}
        fieldNames={{ title: 'title', key: 'id', children: 'children' }}
        checkedKeys={selectedMenu}
        onCheck={(e) => {
          setSeleceedMenu(e as number[]);
        }}
        expandedKeys={expandedKeys}
        onExpand={(e) => {
          setExpandedKeys(e as number[]);
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

export default AssignMenuDrawer;
