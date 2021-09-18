import { getToken, setToken, isEmptyObject, getAppId } from "@monkey.do/monkey";
import { EventBus } from "@/utils";
import * as utils from "@/utils";
import { initRoute } from "../settings";

// TODO: setRoutes, setGlobalData再其它地方处理
function fetchSystemSetting(store) {
  return new Promise((resolve, reject) => {
    const { remoteSystemSetting } = store.state.global;
    if (isEmptyObject(remoteSystemSetting)) {
      store.dispatch("global/fetchSystemSetting", { appId: getAppId() }).then(() => {
        resolve();
      });
    }
    resolve();
  });
}

function setSystemSettingByQuery(path, query, store) {
  if (path === initRoute || path === "/index") {
    const { token, sso } = query;
    if (token) setToken(token);
    if (sso && sso === "1") store.dispatch("global/setSystemSetting", { showHeader: false, showSidebarHeader: false });
    if (sso && sso === "0") store.dispatch("global/setSystemSetting", { showHeader: true, showSidebarHeader: true });
  }
}

function setUserInfo({ store }) {
  return new Promise((resolve, reject) => {
    store.dispatch('GetInfo').then((res) => {
      EventBus.emit("data.userInfo.back", res);
      resolve(res);
    });
  });
}

function setRoutes({ store, router, loadView, routeHandler }) {
  return store.dispatch('permission/GenerateRoutes', loadView).then(accessRoutes => {
    // 根据roles权限生成可访问的路由表
    const allRoutes = routeHandler(accessRoutes);
    router.$addRoutes(allRoutes); // 动态添加可访问路由表
    EventBus.emit("data.routes.back", allRoutes);
    return allRoutes;
  });
}

function setGlobalData(store) {
  // 获取字典数据
  store.dispatch("global/fetchDictionaryOption").catch(err => console.error(err));
  // 获取菜单下的按钮
  store.dispatch("global/fetchAuthButton").catch(err => console.error(err));
}

export default ({
  router,
  store,
  loadView,
  routeHandler,
}) => {
  const { systemSetting } = store.state.global;
  const whiteList = systemSetting.whiteList;

  router.beforeEach(async function(to, from, next) {
    if (systemSetting.isAuthorization) {
      const isFirstLogin = localStorage.getItem("isFirstLogin");
      if (isFirstLogin === "true") {
        await fetchSystemSetting(store);
      }

      setSystemSettingByQuery(to.path, to.query, store);

      const storageToken = getToken();

      if (storageToken) {
        if (to.path === '/login') {
          next({ path: '/' });
        } else {
          if (!store.getters.currentUserInfo.id) {
            const res = await setUserInfo({ store, router, routeHandler, loadView });
            if (res.statusCode !== 600) return;
            const routes = await setRoutes({ store, router, loadView, routeHandler });
            setGlobalData(store);

            // replaceTo: 解决页面刷新时路由基础信息丢失，导致router.beforeEach会走两次 TODO:未解决
            const replaceTo = routes.filter((item) => item.path === to.path)[0];
            next({ ...to, ...replaceTo, replace: true }); // hack方法 确保addRoutes已完成
          } else {
            next();
          }
        }
      } else {
        if (whiteList.indexOf(to.path) !== -1) {
          // 在免登录白名单，直接进入
          next();
        } else {
          next(`/login`); // 否则全部重定向到登录页
        }
      }
    } else {
      // 设置document.title, 保存配置到settings store
      utils.setDocumentTitle(systemSetting.documentTitle);
      store.commit("settings/SET_SYSTEM_SETTING", systemSetting);
      if (to.path === '/login') {
        next("/");
      } else {
        next();
      }
    }
  });
};
