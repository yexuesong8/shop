const ErrorPrefix = "[loader]:";

export const getPluginComponent = ({ componentName, components, env, moduleName, pluginName }) => {
  if (!componentName || !components) return null;
  if (env === 'dev') return (components[`${moduleName}.${pluginName}`] || {})[componentName] || {};
  return components[componentName] || null;
};

// 获取插件路由信息
export const getPluginRouteInfo = ({ pluginRoutes, originRoutes, components, moduleName, pluginName, env }) => {
  pluginRoutes = pluginRoutes || [];
  originRoutes = originRoutes || [];

  // 获取路由信息 TODO: 优化性能
  const getRouteInfo = (path, routes) => {
    let routeInfo = {};

    for (let i = 0, len = routes.length; i < len; i++) {
      // 跳出上层循环
      if (Object.keys(routeInfo).length) break;

      const route = routes[i];
      if (route.path === path) {
        routeInfo = { ...route };
        break;
      } else {
        if (route.children && route.children.length) {
          routeInfo = getRouteInfo(path, route.children);
        }
      }
    }

    return routeInfo;
  };

  const routeLists = [];
  pluginRoutes.forEach(pluginRoute => {
    const component = getPluginComponent({ componentName: pluginRoute.componentName, components, moduleName, pluginName, env });
    const routeInfo = getRouteInfo(pluginRoute.path, originRoutes);
    if (Object.keys(routeInfo).length > 0) { // 存在路由信息再注册到路由 避免账号权限问题
      routeLists.push({
        ...routeInfo,
        component,
        componentName: undefined,
      });
    }
  });
  return routeLists;
};

export const installPluginRoute = ({ moduleName, pluginName, pluginRoutes, router, store, EventBus, env, components }) => {
  EventBus.on("data.routes.back", () => {
    const originRoutes = store.state.permission.routes;
    const newComponents = env === 'dev' ? components : window[`${moduleName}.${pluginName}`] || {};
    const routes = getPluginRouteInfo({ originRoutes, pluginRoutes, components: newComponents, moduleName, pluginName, env });
    try {
      router.$addPluginRoutes(routes);
    } catch (err) {
      console.error(`${ErrorPrefix}注册${moduleName}.${pluginName}路由时报错，信息为:`);
      console.log(err);
      console.error(`${ErrorPrefix}生成组件路由为：`, routes);
      console.error(`${ErrorPrefix}请检查组件路径以及组件名称是否正确!`);
    }
  });
};

class Loader {
  constructor(plugins = []) {
    this.plugins = plugins;
    this.rabbit = window.Rabbit || {};
  }

  loadPlugins() {
    this.plugins.forEach(key => {
      const array = key.split("|");
      const plugin = array[0].split(".");
      const version = array[1] || '';

      const moduleName = plugin[0];
      const pluginName = plugin[1];

      this.loadPluginScript(moduleName, pluginName, version);
    });
  }

  loadPluginStyle(moduleName, pluginName, version) {
    const href = `/plugins/${moduleName}${version ? `-${version}` : `-v${window.pluginVersion[moduleName]}`}/${pluginName}/css/${pluginName}.${window.pluginHash[moduleName]}.css`;
    const style = document.createElement("link");
    style.href = href;
    style.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(style);
  }

  loadPluginScript(moduleName, pluginName, version) {
    const src = `/plugins/${moduleName}${version ? `-${version}` : `-v${window.pluginVersion[moduleName]}`}/${pluginName}/js/${pluginName}.${window.pluginHash[moduleName]}.js`;
    document.write(`<script type='text/javascript' src=${src}></script>`);
  }

  // 注册路由
  installPluginRoute(moduleName, pluginName, pluginRoutes) {
    const { router, store, EventBus } = this.rabbit;
    installPluginRoute({ router, store, EventBus, moduleName, pluginName, pluginRoutes });
  }
}

if (process.env.NODE_ENV !== 'development') {
  const loader = new Loader(window.injectPlugins);
  window.loader = loader;
  loader.loadPlugins();
}

export {
  Loader,
};
