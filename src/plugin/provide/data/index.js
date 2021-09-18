import Dictionary from "@/views/data/dict/index.vue";
import DataMessage from "@/views/data/message/index.vue";
import MsgTemplate from "@/views/data/msgTemplate/index.vue";

const routes = require('./routes.json');

const components = [
  DataMessage,
  Dictionary,
  MsgTemplate,
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
  window.loader.installPluginRoute("rabbit", "data", routes);
}

export default {
  install,
  DataMessage,
  Dictionary,
  MsgTemplate,
};
