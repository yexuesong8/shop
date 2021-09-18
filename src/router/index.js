import Vue from "vue";
import VueRouter from 'vue-router';

let router = null;
let store = null;
let storedRoutes = [];

Vue.use(VueRouter);

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

import Redirect from "@/views/redirect";
import Login from "@/views/login/index";
import Error1 from "@/views/error/401";
import Error4 from "@/views/error/404";
import Profile from "@/views/system/user/profile/index";
import PageDemo from "@/views/page-demo";
import MapDemo from "@/views/map-demo";
import ThemeDemo from "@/views/theme-demo";
import EditTable from "@/views/edit-table";
import ExcelImportDemo from "@/views/excel-import-demo";
import Modules from "@/views/modules";

const systemDefaultRoutes = [
  {
    path: '/redirect/:path(.*)',
    component: Redirect,
    hidden: true,
  },
  {
    path: '/login',
    component: Login,
    hidden: true,
    meta: { noLayout: true },
  },
  {
    path: '/404',
    component: Error4,
    hidden: true,
    meta: { noLayout: true },
  },
  {
    path: '/401',
    component: Error1,
    hidden: true,
    meta: { noLayout: true },
  },
  {
    path: '/user/profile',
    component: Profile,
    name: 'Profile',
    hidden: true,
    meta: { title: '个人中心', icon: 'user' },
  },
  {
    path: "/page/demo",
    component: PageDemo,
    meta: { title: 'Page Demo', icon: 'home', noCache: true },
    parentId: "0",
    hidden: true,
  },
  {
    path: "/edit/table",
    component: EditTable,
    meta: { title: 'EditTable', icon: 'home', noCache: true },
    parentId: "0",
    hidden: true,
  },
  {
    path: "/map/demo",
    component: MapDemo,
    meta: { title: 'MapDemo', icon: 'home', noCache: true },
    parentId: "0",
    hidden: true,
  },
  {
    path: "/theme/demo",
    component: ThemeDemo,
    meta: { title: 'MapDemo', icon: 'home', noCache: true },
    parentId: "0",
    hidden: true,
  },
  {
    path: "/excel/import/demo",
    component: ExcelImportDemo,
    meta: { title: 'ExcelImportDemo', icon: 'home', noCache: true },
    parentId: "0",
    hidden: true,
  },
  {
    path: "/rabbit/module",
    component: Modules,
  },
];

// TODO: rabbit通过菜单配置的页面需要再store/permission配置
export let constantRoutes = [...systemDefaultRoutes];

export const routeOptions = {
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
};

// 路由替换
const replaceRoute = (constantRoutes = [], newRoutes = []) => {
  const newConstantRoutes = [];
  const routeSet = new Set();

  newRoutes.forEach(route => {
    routeSet.add(route.path);
  });

  constantRoutes.forEach((route) => {
    if (!routeSet.has(route.path)) {
      newConstantRoutes.push(route);
    }
  });

  return newConstantRoutes;
};

// 将菜单多层级数据处理为单级路由，与store/permission下方法作用一致
function flatMenusToRoutes(menus) {
  const routes = [];
  const fn = (menus) => {
    menus.forEach(menu => {
      if (menu.path) routes.push(menu);
      if (menu.children && menu.children.length) fn(menu.children);
    });
  };
  fn(menus);
  return routes;
}

const initRouter = (vueStore) => {
  store = vueStore;

  store.dispatch("permission/setConstantRoutes", constantRoutes);

  router = new VueRouter({
    ...routeOptions,
    routes: constantRoutes,
  });

  // https://github.com/vuejs/vue-router/issues/2886
  // https://github.com/PanJiaChen/vue-element-admin/issues/416
  /**
   * @param {array} newRoutes 新增的路由，多层级的菜单数据格式
   * @param {boolean} isConstant 是否为常用路由，在切换用户过后不进行重置
   * @param {boolean} addToMenu 是否添加到菜单中
   */
  router.$addRoutes = (newRoutes, isConstant, addToMenu = true) => {
    const flatRoutes = flatMenusToRoutes(newRoutes);
    // 将重复得路由，从constant路由中剔除，留下在flatRoutes不存在的路由
    const replacedRoutes = replaceRoute(constantRoutes, flatRoutes);

    // 重置路由规则
    router.matcher = new VueRouter({
      ...routeOptions,
      routes: replacedRoutes,
    }).matcher;

    const allRoutes = replacedRoutes.concat(flatRoutes);

    storedRoutes = replaceRoute(storedRoutes, allRoutes).concat(allRoutes);

    router.addRoutes(flatRoutes); // 添加路由

    if (isConstant) {
      // 初始化路由时，将项目的路由添加到常用路由中，并替换
      // 解决切换账号，重置路由后出现项目路由被清空的问题
      constantRoutes = allRoutes;
    }

    if (addToMenu) {
      store.dispatch("permission/setRoutesFromRouter", {
        routes: newRoutes,
        isConstant,
      });
    }
  };

  router.$addPluginRoutes = (routes) => {
    const replacedRoutes = replaceRoute(constantRoutes, routes);

    // 重置路由规则
    router.matcher = new VueRouter({
      ...routeOptions,
      routes: replacedRoutes,
    }).matcher;

    // TODO: 插件路由权限替换
    constantRoutes = replacedRoutes.concat(routes);
    // 注册插件路由以及其它从后端接口返回的所有路由，待详细测试
    const newAllRoutes = replaceRoute(storedRoutes, routes);
    router.addRoutes(newAllRoutes.concat(routes)); // 添加路由
  };

  return router;
};

export const resetRoutes = () => {
  router.matcher = new VueRouter({
    ...routeOptions,
    routes: constantRoutes,
  }).matcher;

  store.dispatch("permission/resetRoutes");
};

export const getRouter = () => router;

export default initRouter;
