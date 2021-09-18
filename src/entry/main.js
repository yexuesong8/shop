import Vue from "vue";
import App from "./App";
import { install } from "@/entry/lib";
import Index from "@/views/index";

let loadView = null;

if (process.env.RUN_ENV !== 'plugin') {
  // 如果是插件机制，element-ui、monkey样式由外部引入
  // element ui样式
  require("@monkey.do/element-ui/lib/theme-chalk/index.css");
  // monkey css
  require("@monkey.do/monkey/lib/theme-chalk/index.css");

  loadView = item => (resolve) => require([`@/views/${item.component}`], resolve);

  const { loader } = require("./plugin");
  loader();
} else {
  loadView = () => null;
}

const { store, router } = install({
  loadView: loadView,
  setting: {
    showScreenFull: true,
  },
  routes: [
    /* 由于affix添加一次后会存在store，导致首页标签会一直在导航中，所以每个项目的首页单独添加 */
    {
      path: '/',
      redirect: '/index',
    },
    {
      path: "/index",
      component: Index,
      name: '首页',
      meta: { title: '首页', icon: 'home', noCache: true, affix: true },
      parentId: "0",
    },
  ],
});

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
});
