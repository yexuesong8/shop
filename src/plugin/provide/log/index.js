import LogLogin from "@/views/log/login/index.vue";
import LogOperation from "@/views/log/operation/index.vue";

const routes = require("./routes.json");

const components = [
  LogOperation,
  LogLogin,
];

const install = function(Vue) {
  components.forEach(component => {
    if (component.name) Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

if (window.loader) {
  window.loader.installPluginRoute("rabbit", "log", routes);
}

export default {
  install,
  LogOperation,
  LogLogin,
};
