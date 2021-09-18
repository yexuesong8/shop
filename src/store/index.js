import Vue from "vue";
import Vuex from "vuex";

import app from "./modules/app";
import user from "./modules/user";
import tagsView from "./modules/tagsView";
import permission from "./modules/permission";
import global from "./modules/global";
import getters from "./getters";

let pluginStore = {};
if (process.env.PACK_ENV !== 'plugin') {
  const home = require("./modules/home").default;
  const plugins = require("./modules/plugins/dingTalk").default;
  const workflow = require("./modules/workflow").default;
  const systemMenu = require("./modules/system/menu").default;
  const pagePanel = require("./modules/page/panel").default;
  const database = require("./modules/data/database").default;
  const table = require("./modules/data/table").default;
  const field = require("./modules/data/field").default;
  const dict = require("./modules/data/dict").default;

  pluginStore = {
    ...pluginStore,
    home,
    plugins,
    workflow,
    systemMenu,
    pagePanel,
    database,
    table,
    field,
    dict,
  };
}

let store = null;

const initStore = () => {
  Vue.use(Vuex);

  // 注册store
  store = new Vuex.Store({
    modules: {
      app,
      user,
      tagsView,
      permission,
      global,
      ...pluginStore,
    },
    getters,
  });

  return store;
};

export const getStore = () => store;

export default initStore;
