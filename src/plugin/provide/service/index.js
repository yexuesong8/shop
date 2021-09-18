import ServiceStatus from "@/views/service/status.vue";
import ServiceWarning from "@/views/service/warning.vue";

const routes = require("./routes.json");
const version = require("../../../../package").version;

const components = [
  ServiceStatus,
  ServiceWarning,
];

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

if (window.loader) {
  window.loader.installPluginRoute("rabbit", "service", routes);
  window.loader.loadPluginStyle("rabbit", "service", `v${version}`);
}

export default {
  install,
  ServiceStatus,
  ServiceWarning,
};
