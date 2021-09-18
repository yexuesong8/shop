import AuthorityData from "@/views/system/authority/data/index.vue";
import AuthorityField from "@/views/system/authority/field/index.vue";
import AuthorityRules from "@/views/system/authority/rules/index.vue";
import Dept from "@/views/system/dept/index.vue";
import Interface from "@/views/system/interface/index.vue";
import Menu from "@/views/system/menu/index.vue";
import Post from "@/views/system/post/index.vue";
import Role from "@/views/system/role/index.js";
import User from "@/views/system/user/index.vue";
import UserProfile from "@/views/system/user/profile/index.vue";
import Report from "@/views/system/report/index";
import ReportPreview from "@/views/system/report/preview/index";
import ReportAuthority from "@/views/system/report/authority/index";
import TableManage from "@/views/system/table/index.vue";
import Parameter from "@/views/system/parameter/index.vue";

const routes = require("./routes.json");
const version = require("../../../../package.json").version;

const components = [
  AuthorityRules,
  AuthorityData,
  AuthorityField,
  Dept,
  Interface,
  Menu,
  Post,
  Role,
  User,
  UserProfile,
  Report,
  ReportPreview,
  ReportAuthority,
  TableManage,
  Parameter,
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
  window.loader.installPluginRoute("rabbit", "system", routes);
  window.loader.loadPluginStyle("rabbit", "system", `v${version}`);
}

export default {
  install,
  AuthorityRules,
  AuthorityData,
  AuthorityField,
  Dept,
  Interface,
  Menu,
  Post,
  Role,
  User,
  UserProfile,
  Report,
  ReportPreview,
  ReportAuthority,
  TableManage,
  Parameter,
};
