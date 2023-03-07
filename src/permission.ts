import { RouteRecordRaw } from 'vue-router';
import { useUserStoreHook } from '@/store/modules/user';
import { usePermissionStoreHook } from '@/store/modules/permission';

import router from '@/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false });

const permissionStore = usePermissionStoreHook();

/**
 * 无权限的白名单路径
 * @type {string[]}
 */
const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
  // 启动进度条
  NProgress.start()

  const userStore = useUserStoreHook();
  if (userStore.token) {
    // 登录成功，跳转到首页
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      const hasGetUserInfo = userStore.type;
      if (hasGetUserInfo !== -1) {
        if (to.matched.length === 0) {
          from.name ? next({ name: from.name as any }) : next('/401');
        } else {
          next();
        }
      } else {
        try {
          await userStore.getInfo()
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const { roles } = ["ROOT"];
          const accessRoutes: RouteRecordRaw[] =
            await permissionStore.generateRoutes(roles);
          accessRoutes.forEach((route: any) => {
            router.addRoute(route);
          });
          next({ ...to, replace: true });
        } catch (error) {
          // 移除 token 并跳转登录页
          await userStore.resetToken();
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    // 若路径在白名单内则可以直接访问
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
