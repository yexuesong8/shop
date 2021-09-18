// import { getIndexMenu } from "@/api/system/menu";
import Report from "@/views/system/report/preview/index";
import Page from "@/layout/components/Page/index";
import Modules from "@/views/modules/index";
import { request } from "@monkey.do/monkey";

let rabbitView = {};
if (process.env.PACK_ENV !== 'plugin') {
  rabbitView = require("@/router/rabbit-config").default;
}

const permission = {
  namespaced: true,
  state: {
    routes: [], // 用于左侧菜单
    loadView: () => {
    }, // 加载外部view
    keepAlive: [],
    menus: [],
    constantRoutes: [],
  },
  mutations: {
    setRoutes: (state, routes) => {
      state.routes = replaceDuplicateMenus(state.routes, routes);
    },
    setConstantRoutes(state, routes) {
      state.constantRoutes = routes;
    },
    resetRoutes(state) {
      state.routes = state.constantRoutes;
    },
    setLoadView(state, payload) {
      state.loadView = payload;
    },
    // SET_MENUS: (state, payload) => {
    //   state.menus = payload;
    // },
    ADD_KEEP_ALIVE: (state, data) => {
      const index = state.keepAlive.indexOf(data);
      if (index !== -1) {
        state.keepAlive.splice(index, 1);
      }
      state.keepAlive.push(data);
    },
    DEL_KEEP_ALIVE: (state, data) => {
      const index = state.keepAlive.indexOf(data);
      state.keepAlive.splice(index, 1);
    },
    CLOSE_ALL_KEEP_ALIVE: (state) => {
      state.keepAlive = [];
    },
    SET_KEEP_ALIVE: (state, data) => {
      state.keepAlive = [data];
    },
  },

  actions: {
    // 生成路由
    GenerateRoutes({ commit }, payload) {
      commit("setLoadView", payload);
      // 向后端请求路由数据
      return getRoute(payload).then((routes) => routes);
    },

    updateRoutes({ commit, state }) {
      const { loadView } = state;
      return getRoute(loadView).then((routes) => routes);
    },

    setConstantRoutes({ commit }, payload) {
      commit("setConstantRoutes", payload);
      commit("setRoutes", payload);
    },

    setRoutesFromRouter({ commit, state }, payload) {
      const { routes, isConstant } = payload;
      if (isConstant) commit("setConstantRoutes", replaceDuplicateMenus(state.constantRoutes, routes));
      commit("setRoutes", routes);
    },

    resetRoutes({ commit }) {
      commit("resetRoutes");
    },
  },
};

function getRoute(loadView) {
  return request({
    url: "/mock/api/v1/system/menu/get",
  }).then((result) => {
    if (result.statusCode === 600) {
      const accessedRoutes = generatorRoute(result.data, loadView);
      accessedRoutes.push({ path: "*", redirect: "/404", hidden: true });
      return accessedRoutes;
    }
    return [];
  });
  // return getIndexMenu().then(res => {
  //   if (res.statusCode === 600) {
  //     const accessedRoutes = generatorRoute(res.data, loadView);
  //     accessedRoutes.push({ path: "*", redirect: "/404", hidden: true });
  //     return accessedRoutes;
  //   }
  //   return [];
  // });
}

function generatorRoute(data, loadView) {
  return data.map(route => {
    if (route.parentId === '0') {
      route.path = undefined;
    }
    const item = route;
    const childList = route.childList || [];
    let children = [];
    if (childList && childList.length > 0) children = generatorRoute(childList, loadView);

    const pageType = getPageType(item);
    const component = getComponent(pageType, item, loadView);
    let path = item.path || "";

    if (pageType === "iframe") {
      item.iframeSrc = item.component;
    }
    // module 使用默认配置路由
    if (pageType === "module") path = `/rabbit/modules/${item.id}`;

    return {
      ...item,
      name: item.name,
      path,
      hidden: item.visible === 0 || item.type === 2 || item.status === 0,
      component,
      meta: {
        title: item.name,
        icon: item.icon || "system",
        ...item,
        pageType,
        component,
      },
      children,
    };
  });
}

function loadRabbitView(item) {
  const component = item.component;
  return rabbitView[component] || null;
}

function replaceDuplicateMenus(oldMenus = [], newMenus = []) {
  const oldMenusCopy = [...oldMenus];
  const newMenusCopy = [...newMenus];

  oldMenusCopy.forEach((oldMenu, oldMenuIndex) => {
    /* 只做一级菜单替换 */
    newMenusCopy.forEach((newMenu, newMenuIndex) => {
      if (oldMenu.path === newMenu.path) {
        oldMenusCopy.splice(oldMenuIndex, 1, newMenu);
        newMenusCopy.splice(newMenuIndex, 1);
      }
    });
  });

  return oldMenusCopy.concat(newMenusCopy);
}

/** 菜单页面类型，key对应字典选项 */
export const menuPageType = {
  1: "component",
  2: "iframe",
  3: "page",
  4: "report",
  5: "module",
};

/** 菜单组件 */
export const menuPageTypeComponent = {
  iframe: null,
  report: Report,
  page: Page,
  module: Modules,
};

function getPageType(route) {
  return menuPageType[route.pageType];
}

function getComponent(pageType, item, loadView) {
  if (pageType === 'component' || !pageType) {
    // 菜单
    if (item && item.path) {
      return item.path.includes("/rabbit") ? loadRabbitView(item) : (loadView ? loadView(item) : null);
    }
  }

  // module
  if (pageType === "module") {
    return loadRabbitView(item).name ? loadRabbitView(item) : (loadView ? loadView(item) : null);
  }

  return menuPageTypeComponent[pageType];
}

export default permission;
