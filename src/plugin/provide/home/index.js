import HomeComponent from "@/views/home/component/index.vue";
import HomeTemplate from "@/views/home/template/index.vue";
import HomeDesign from "@/views/home/design/index.vue";
import HomeTemplateCreate from "@/views/home/template/create/index";

const routes = require("./routes.json");
const version = require("../../../../package").version;

const components = [
  HomeTemplate,
  HomeComponent,
  HomeDesign,
  HomeTemplateCreate,
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
  window.loader.installPluginRoute("rabbit", "home", routes);
  window.loader.loadPluginStyle("rabbit", "home", `v${version}`);
}

export default {
  install,
  HomeTemplate,
  HomeComponent,
  HomeTemplateCreate,
  HomeDesign,
};
