import Auth from "@/views/authority/auth/index.vue";
import Classification from "@/views/authority/classification/index.vue";
import Data from "@/views/authority/data/index.vue";
import Interface from "@/views/authority/interface/index.vue";
import Table from "@/views/authority/table/index.vue";
import AuthMode from "@/views/authority/authMode/index.vue";

const routes = require('./routes.json');

const components = [
  Classification,
  Auth,
  Data,
  Interface,
  Table,
  AuthMode,
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
  window.loader.installPluginRoute("rabbit", "authority", routes);
}

export default {
  install,
  Classification,
  Auth,
  Data,
  Interface,
  Table,
  AuthMode,
};
