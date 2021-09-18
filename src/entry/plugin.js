import { getRouter } from "@/router";
import { getStore } from "@/store";
import EventBus from "@/utils/event-bus";
import { routes, injectPlugins, components } from "./plugin-route";
import { installPluginRoute } from "@/plugin/loader";

export const loader = () => {
  const router = getRouter();
  const store = getStore();

  injectPlugins.forEach(pluginsString => {
    const [moduleName, pluginName] = pluginsString.split(".");
    const pluginRoutes = routes[pluginsString];

    installPluginRoute({ moduleName, pluginName, router, store, EventBus, pluginRoutes, env: "dev", components });
  });
};
