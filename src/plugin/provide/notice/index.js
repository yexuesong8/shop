import Notice from "@/views/notice/index.vue";

const routes = require("./routes.json");

const components = [
  Notice,
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
  window.loader.installPluginRoute("rabbit", "notice", routes);
}

export default {
  install,
  Notice,
};
