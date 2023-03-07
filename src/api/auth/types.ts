/**
 * 登录数据类型
 */
export interface LoginData {
  username: string;
  password: string;
}

/**
 * Token响应类型
 */
export interface TokenResult {
  accessToken: string;
  refreshToken: string;
  expires: number;
}
