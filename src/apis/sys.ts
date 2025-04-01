import { BaseRes, PageQuery } from 'types/base';
import {
  SeoConfig,
  SysDict,
  SysUser,
  SysRole,
  SysMenu,
  SysRoleResourcesCategoryList,
  SysRoleResourceRelations,
  SysAdminRole,
  SysRoleResourcesCategory,
  SysRoleResources,
} from 'types/sys';
import request, { ginzaxiaomaApiRequest } from '.';

export const getSysUserSimpleList = () => {
  return request.get<BaseRes<SysUser[]>>('sys/user/simpleList');
};

type GetSysUserListDto = {
  keyword?: string;
} & PageQuery;

export const getSysUserList = (data: GetSysUserListDto) => {
  return request.get<BaseRes<{ list: SysUser[]; total: number }>>(
    '/sys/user/list',
    { params: data }
  );
};

type SysUserRegisterDto = {
  username: SysUser['username'];
  nickName: SysUser['nickName'];
  password: SysUser['password'];
  email: SysUser['email'];
  note: SysUser['note'];
  shop: SysUser['shop'];
};

export const sysUserRegister = (data: SysUserRegisterDto) => {
  return request.post('/sys/user/register', data);
};

export const sysUserUpdate = (
  data: SysUserRegisterDto & {
    id: SysUser['id'];
  }
) => {
  return request.post(`/sys/user/update/${data.id}`, data);
};

export const getSysDictList = () => {
  return request.get<
    BaseRes<{
      records: SysDict[];
    }>
  >('sys/dict/list', {
    params: {
      pageNum: 1,
      pageSize: 9999,
    },
  });
};

export const getSeoConfigs = () => {
  return request.get<BaseRes<SeoConfig[]>>('sys/config/listSeoPage');
};

export const updateSeoConfigs = (
  id: number,
  data: Pick<SeoConfig, 'title' | 'keywords' | 'description'>
) => {
  return request.post<BaseRes<string>>(`sys/config/updateSeoPage/${id}`, data);
};

export const getRoleList = () => {
  return ginzaxiaomaApiRequest.get<SysRole[]>('admin/role/list');
};

export const roleEdit = (data: SysRole) => {
  return ginzaxiaomaApiRequest.post('admin/role/edit', data);
};

export const roleDelete = (id: SysRole['id']) => {
  return ginzaxiaomaApiRequest.delete(`admin/role/delete/${id}`);
};

export const getMenuList = () => {
  return ginzaxiaomaApiRequest.get<SysMenu[]>('admin/menu/list');
};

export const menuEdit = (data: SysMenu) => {
  return ginzaxiaomaApiRequest.post('admin/menu/edit', data);
};

export const menuDelete = (id: SysMenu['id']) => {
  return ginzaxiaomaApiRequest.delete(`admin/menu/delete/${id}`);
};

export const getRoleMenuRelations = (id: SysRole['id']) => {
  return ginzaxiaomaApiRequest.get<
    {
      menuId: string;
      id: number;
      roleId: number;
    }[]
  >(`admin/role/relations/${id}`);
};

export const updateRoleMenuRelations = (dto: {
  roleId: number;
  menuIds: number[];
}) => {
  return ginzaxiaomaApiRequest.post(
    `admin/role/update-role-menu-relations`,
    dto
  );
};

export const getRoleResources = () => {
  return ginzaxiaomaApiRequest.get<SysRoleResourcesCategoryList[]>(
    `admin/role/role-resources`
  );
};

export const getRoleResourceRelations = (id: SysRole['id']) => {
  return ginzaxiaomaApiRequest.get<SysRoleResourceRelations[]>(
    `admin/role/role-resource-relations/${id}`
  );
};

export const updateRoleResourceRelations = (dto: {
  roleId: string;
  resources: string[];
}) => {
  return ginzaxiaomaApiRequest.post(
    `admin/role/update-role-resource-relations`,
    dto
  );
};

export const getAdminRoles = (id: number) => {
  return ginzaxiaomaApiRequest.get<SysAdminRole[]>(
    `admin/role/admin-roles/${id}`
  );
};

export const updateAdminRoles = (dto: { adminId: number; roles: number[] }) => {
  return ginzaxiaomaApiRequest.post(
    `admin/role/update-admin-role-relations`,
    dto
  );
};

export const getResourceCategoryList = () => {
  return ginzaxiaomaApiRequest.get<SysRoleResourcesCategory[]>(
    `admin/role/resource-category-list`
  );
};

export const resourceCategoryDelete = (id: SysMenu['id']) => {
  return ginzaxiaomaApiRequest.delete(
    `admin/role/resource-category-delete/${id}`
  );
};

export const resourceCategoryEdit = (dto: SysRoleResourcesCategory) => {
  return ginzaxiaomaApiRequest.post(`admin/role/edit-resource-category`, dto);
};

export const getResourceList = (dto: {
  keyword?: string;
  categoryIdList?: string;
  pageNum: number;
  pageSize: number;
}) => {
  return ginzaxiaomaApiRequest.get<{
    list: SysRoleResources[];
    total: number;
  }>(`admin/role/resource-list`, {
    params: dto,
  });
};

export const resourceEdit = (data: SysRoleResources) => {
  return ginzaxiaomaApiRequest.post('admin/role/resource-edit', data);
};

export const resourceDelete = (id: SysRoleResources['id']) => {
  return ginzaxiaomaApiRequest.delete(`admin/role/resource-delete/${id}`);
};

export const sysDictApi = {
  list: (dto: { pageNum: number; pageSize: number }) => {
    return ginzaxiaomaApiRequest.post<{
      list: {
        id: string;
        type: string;
        valueList: string;
        status: number;
        remark: string;
      }[];
      total: number;
    }>('/admin/sys-dict/list', dto);
  },
  add: (dto: { type: string; valueList: string; remark?: string }) => {
    return ginzaxiaomaApiRequest.post('/admin/sys-dict/add', dto);
  },
  update: (dto: {
    id: string;
    type: string;
    valueList: string;
    remark?: string;
  }) => {
    return ginzaxiaomaApiRequest.put(`/admin/sys-dict/`, dto);
  },
};
