import Layout from "@/layout";
import * as components from "@/components/index";
import * as utils from "@/utils";
import * as layout from "@/layout/layoutInit";
import * as extraContent from "@/layout/components/ExtraContent";
import * as config from "@/config/index";
import initRouter from "@/router";
import initStore from "@/store";
import "@/entry/base"; // rabbit配置
import permission from "@/router/permission";

const defaultSetting = require("../settings");

const store = initStore();
console.log(store);
const router = initRouter(store);
console.log(router);
// 页面注册方法
const install = ({
  store: appStore = {},
  routes: appRoutes = [],
  setting: appSystemSetting = {},
  loadView,
  routeHandler = (routes) => routes,
}) => {
  store.dispatch("global/setDefaultSystemSetting", defaultSetting);
  store.dispatch("global/setAppSystemSetting", appSystemSetting);

  // 注册项目路由
  router.$addRoutes(appRoutes, true);

  // 注册项目store
  Object.keys(appStore).forEach(key => store.registerModule(key, appStore[key]));

  // permission
  permission({ router, store, loadView, routeHandler });

  return {
    router,
    store,
  };
};

export default {
  install,
  store,
  router,
  Layout,
  ...components,
  ...utils,
  ...layout,
  ...extraContent,
  ...config,
};

export {
  store,
  install,
  router,
};
