export type Menu = {
  id: number;
  // 父级节点 id，0 是一级菜单
  parentId: number;
  // 从 0 开始，0 是一级菜单
  level: number;
  name: string;
  icon: string;
  sort: number;
  title: string;
};
