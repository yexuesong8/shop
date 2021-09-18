import Black from "@/views/safety/black/index.vue";
import White from "@/views/safety/white/index.vue";

const routes = require("./routes.json");

const components = [
  Black,
  White,
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
  window.loader.installPluginRoute("rabbit", "safety", routes);
}

export default {
  Black,
  White,
};
