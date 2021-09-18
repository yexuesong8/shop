import PageTemplate from "@/views/page/template/index.vue";
import PropertiesGroup from "@/views/page/properties/group/index.vue";
import PropertiesType from "@/views/page/properties/type/index.vue";
import PageComponent from "@/views/page/component/index";
import PageDesign from "@/views/page/design/index";
import { store } from "@/entry/lib";
import * as pageStore from "@/store/modules/page/index";

const routes = require("./routes.json");
const version = require("../../../../package").version;

Object.keys(pageStore).forEach(key => {
  store.registerModule(key, pageStore[key]);
});

const components = [
  PropertiesGroup,
  PropertiesType,
  PageTemplate,
  PageComponent,
  PageDesign,
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
  window.loader.installPluginRoute("rabbit", "page", routes);
  window.loader.loadPluginStyle("rabbit", "page", `v${version}`);
}

export default {
  install,
  PropertiesGroup,
  PropertiesType,
  PageTemplate,
  PageComponent,
  PageDesign,
};
