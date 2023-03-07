import {defineStore} from 'pinia';

import {getToken, setToken, removeToken} from '@/utils/auth';
import {loginApi, logoutApi} from '@/api/auth';
import userApi from '@/api/user';
import {resetRouter} from '@/router';
import {store} from '@/store';
import {LoginData} from '@/api/auth/types';
import {ref} from 'vue';
import {UserInfo} from '@/api/user/types';

export const useUserStore = defineStore('user', () => {
  // state
  const token = ref<string>(getToken() || '');
  const username = ref<string>('');
  const isEnabled = ref<boolean>(false);
  const type = ref<number>(-1);
  const avatar = 'index.ico'

  // actions

  // 登录
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then(response => {
          const {accessToken} = response.data;
          token.value = accessToken;
          setToken(accessToken);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 获取管理员登录信息
  function getInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      userApi.getUserInfo()
        .then(({data}) => {
          if (!data) {
            return reject('Verification failed, please Login again.');
          }
          if (data.type === null || data.type !== 0) {
            reject('getUserInfo: roles must be a non-null array!');
          }
          username.value = data.username
          isEnabled.value = data.isEnabled
          type.value = data.type
          resolve(data)
        })
        .catch(error => {
          reject(error)
        });
    });
  }

  // 登出
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          resetRouter();
          resetToken();
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 重置
  function resetToken() {
    removeToken();
    token.value = ''
    username.value = ''
    isEnabled.value = false
    type.value = -1
  }

  return {
    token,
    username,
    isEnabled,
    type,
    avatar,
    login,
    getInfo,
    logout,
    resetToken
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
