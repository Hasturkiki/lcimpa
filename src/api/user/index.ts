import request from '@/utils/request';
import {UserForm, UserQuery} from './types';

export default {
  /**
   * 登录成功后获取用户信息
   */
  getUserInfo: () => request({
    url: '/user/me',
    method: 'GET'
  }),

  /**
   * 获取用户分页列表
   *
   * @param queryParams
   */
  listUserPages: (queryParams: UserQuery) => request({
    url: '/user/getUserListVoByPage',
    method: 'GET',
    params: queryParams
  }),

  /**
   * 获取主播历史数据列表
   */
  listUpHistory: () => request({
    url: '/user/getUpHistory',
    method: 'GET'
  }),

  /**
   * 获取企业历史数据列表
   */
  listCompanyHistory: () => request({
    url: '/user/getCompanyHistory',
    method: 'GET'
  }),

  /**
   * 获取用户表单详情
   *
   * @param userId
   */
  getUserForm: (userId: number) => request({
    url: '/user/' + userId,
    method: 'GET'
  }),

  /**
   * 添加用户
   *
   * @param username
   * @param type
   * @param telephone
   * @param email
   * @param isEnabled
   */
  addUser: (username: string, type: number, telephone: string, email: string, isEnabled: boolean) => request({
    url: '/user/AdminAddUser',
    method: 'POST',
    params: {
      username: username,
      type: type,
      telephone: telephone || '',
      email: email || '',
      isEnabled: isEnabled
    }
  }),

  /**
   * 修改用户
   *
   * @param data
   */
  updateUser: (data: UserForm) => request({
    url: '/user/updateUser',
    method: 'PUT',
    data: data
  }),

  /**
   * 启用用户
   *
   * @param id
   */
  enableUserById: (id: number) => request({
    url: '/user/enable',
    method: 'PUT',
    params: {id: id}
  }),

  /**
   * 禁用用户
   *
   * @param id
   */
  disableUserById: (id: number) => request({
    url: '/user/disable',
    method: 'PUT',
    params: {id: id}
  }),

  /**
   * 修改用户密码
   *
   * @param id
   * @param password
   */
  updateUserPassword: (id: number, password: string) => request({
    url: '/user/updatePassword',
    method: 'PUT',
    params: {
      id: id,
      password: password
    }
  }),

  /**
   * 删除用户
   *
   * @param ids
   */
  deleteUsers: (ids: string) => request({
    url: '/user/' + ids,
    method: 'DELETE'
  })
}
