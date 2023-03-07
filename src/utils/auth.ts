import Cookies from 'js-cookie';

const TokenKey = 'lcimp-token';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
