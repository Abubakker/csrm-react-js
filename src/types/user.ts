import { Menu } from './menu';
import { UmsResource } from './ums';

export type UserInfo = {
  userId: number;
  username: string;
  nickName: string;
  menus: Menu[];
  roles: string[];
  resources: UmsResource[];
  shop?: number;
};

export type UserLoginRequestDto = {
  username: string;
  password: string;
};

export type UserLoginResponseDto = {
  tokenHead: string;
  token: string;
};
