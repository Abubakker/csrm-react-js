import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { UserInfo } from 'types/user';

export interface UserInfoState extends UserInfo {
  isLoading: boolean;
}

// 默认保留菜单
const defaultMenus = [
  {
    id: 1000,
    parentId: 0,
    title: 'sop',
    level: 0,
    sort: 1000,
    name: 'sop',
    icon: '',
  },
];

const initialState: UserInfoState = {
  isLoading: true,
  userId: 0,
  username: '',
  nickName: '',
  menus: [...defaultMenus],
  roles: [],
  resources: [],
  shop: undefined,
};

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    initUserInfo: (state, action: PayloadAction<UserInfo>) => {
      const { userId, username, menus, roles, shop, resources, nickName } =
        action.payload;

      state.isLoading = false;
      state.userId = userId;
      state.username = username;
      state.nickName = nickName;
      state.menus = [...menus, ...state.menus];
      state.roles = roles;
      state.shop = shop;
      state.resources = resources || [];
    },
  },
});

export const { initUserInfo } = userInfoSlice.actions;

export const selectUserInfo = (state: RootState) => state.userInfo;

export default userInfoSlice.reducer;
