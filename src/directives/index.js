import enterSearch from "./enterSearch";
import tabIndex from './tabIndex';
import onlyNumber from './onlyNumber';
import toggleFocus from './toggleFocus';
import fixedTable from './fixedTable';
import hasPermission from "./hasPermission";
import { NumberDirective } from "@monkey.do/monkey";

const install = (Vue) => {
  Vue.directive("enterSearch", enterSearch);
  Vue.directive("tabIndex", tabIndex);
  Vue.directive("onlyNumber", onlyNumber);
  Vue.directive("toggleFocus", toggleFocus);
  Vue.directive("number", NumberDirective);
  Vue.directive('fixedTable', fixedTable);
  Vue.directive("hasPermission", hasPermission);
};

export default install;
