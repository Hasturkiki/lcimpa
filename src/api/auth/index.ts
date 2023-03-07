import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LoginData, TokenResult } from './types';

/**
 * 管理员登录
 */
export function loginApi(data: LoginData): AxiosPromise<TokenResult> {
  return request({
    url: '/adminLogin',
    method: 'POST',
    params: data
  });
}

/**
 * 登出
 */
export function logoutApi() {
  return request({
    url: '/user/logout',
    method: 'Delete'
  });
}
