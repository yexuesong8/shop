import DingTalk from "@/views/plugins/dingTalk/index.vue";
const version = require("../../../../package").version;

const routes = require('./routes.json');

const components = [
  DingTalk,
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
  window.loader.installPluginRoute("rabbit", "plugins", routes);
  window.loader.loadPluginStyle("rabbit", "plugins", `v${version}`);
}

export default {
  install,
  DingTalk,
};
