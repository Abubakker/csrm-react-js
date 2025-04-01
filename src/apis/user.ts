import { AxiosError } from 'axios';
import request, { ginzaxiaomaApiRequest } from '.';
import { BaseRes } from 'types/base';
import {
  UserInfo,
  UserLoginRequestDto,
  UserLoginResponseDto,
} from 'types/user';

export const getUserInfo = () => {
  return ginzaxiaomaApiRequest
    .get<UserInfo>('/admin/sso/current')
    .catch((err: AxiosError) => {
      if (err.response?.status === 401) {
        window.location.href = '/login';
      }
    });
};

export function userLogin(data: UserLoginRequestDto) {
  return request.post<BaseRes<UserLoginResponseDto>>('/sys/user/login', data);
}
