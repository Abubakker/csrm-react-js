import { SysMenu } from 'types/sys';

export type SysMenuKey = Omit<SysMenu, 'children'> & {
  key: number;
  children?: SysMenuKey[];
};

function getMenuBuildTree(SysMenus: SysMenu[]): SysMenuKey[] {
  const itemMap = new Map<number, SysMenuKey>();

  // 将所有元素存入 Map，以便快速查找
  SysMenus.forEach((item) => {
    itemMap.set(item.id, { ...item, key: item.id, children: [] });
  });

  const tree: SysMenuKey[] = [];

  SysMenus.forEach((item) => {
    const currentItem = itemMap.get(item.id)!;
    if (Number(item.parentId) === 0) {
      // 根节点直接加入树
      tree.push({ ...currentItem, key: currentItem.id });
    } else {
      // 找到父节点并将当前节点加入父节点的 children 数组
      const parent = itemMap.get(Number(item.parentId));
      if (parent) {
        parent.children!.push({ ...currentItem, key: currentItem.id });
      }
    }
  });

  // 排序函数：根据 sort 字段倒序排序
  const sortItems = (items: SysMenuKey[]) => {
    items.sort((a, b) => b.sort - a.sort);
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        sortItems(item.children);
      } else {
        // 如果 children 为空，删除该字段
        delete item.children;
      }
    });
  };

  // 对树进行排序
  sortItems(tree);

  return tree;
}

export default getMenuBuildTree;
