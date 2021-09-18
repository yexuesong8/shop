import { getLocalStorage, setLocalStorage } from "@monkey.do/monkey";
import { $request, getImgSrc, setDocumentTitle } from "@/utils";

function getLocalStorageSetting() {
  return getLocalStorage("rb-system-setting") || {};
}

const localSystemSetting = getLocalStorageSetting();
const storageSettingList = ["theme", "tagsView", "sidebarLogo", "sidebarStatus"];

const global = {
  namespaced: true,
  state: {
    authButtons: [],
    systemSetting: {
      ...localSystemSetting,
    },
    appSystemSetting: {},
    defaultSystemSetting: {},
    remoteSystemSetting: {},
    dictionaryOption: {},
  },
  mutations: {
    setAuthButton(state, payload) {
      state.authButtons = payload;
    },
    setSystemSetting(state, payload) {
      if (payload.documentTitle) setDocumentTitle(payload.documentTitle);
      state.systemSetting = payload;
    },
    setRemoteSystemSetting(state, payload) {
      state.remoteSystemSetting = payload;
    },
    setAppSystemSetting(state, payload) {
      state.appSystemSetting = payload;
    },
    setDefaultSystemSetting(state, payload) {
      state.defaultSystemSetting = payload;
    },
    setDictionaryOption(state, payload) {
      state.dictionaryOption = payload;
    },
  },

  actions: {
    async fetchDictionaryOption({ commit }, payload) {
      const res = await $request("rabbit.system.data.fetchAllDictionaryOption", payload);
      if (res.statusCode === 600) commit("setDictionaryOption", res.data);
      return res;
    },
    // async fetchAuthButton({ commit }, payload) {
    //   const res = await $request("rabbit.system.menu.fetchAuthButton", payload);
    //   if (res.statusCode === 600) commit("setAuthButton", res.data);
    //   return res;
    // },
    async fetchAuthButton({ commit }, payload) {
      const res = await $request("rabbit.system.menu.getIndexMenu");
      if (res.statusCode === 600) commit("setAuthButton", initChildData(res.data));
      return res;
    },
    async fetchSystemSetting({ dispatch }, payload) {
      const res = await $request("rabbit.system.parameter.fetch", { data: payload });
      if (res.statusCode === 600) {
        const data = res.data;
        Object.keys(data).forEach(item => {
          if (data[item] === "false") data[item] = false;
          if (data[item] === "true") data[item] = true;
          if (item === "logo") data[item] = getImgSrc(data[item]);
        });
        dispatch("setRemoteSystemSetting", data);
        return res.data;
      }
      return {};
    },
    setSystemSetting({ commit, state }, payload) {
      commit("setSystemSetting", {
        ...state.systemSetting,
        ...payload,
      });
    },
    setRemoteSystemSetting({ commit, dispatch }, payload) {
      dispatch("setSystemSetting", payload);
      commit("setRemoteSystemSetting", payload);
    },
    setAppSystemSetting({ commit, dispatch, state }, payload) {
      dispatch("setSystemSetting", {
        ...payload,
        whiteList: (state.systemSetting.whiteList || []).concat(payload.whiteList || []),
      });
      commit("setAppSystemSetting", payload);
    },
    setDefaultSystemSetting({ commit, dispatch }, payload) {
      dispatch("setSystemSetting", payload);
      commit("setDefaultSystemSetting", payload);
    },
    changeSystemSetting({ dispatch }, payload) {
      dispatch("setSystemSetting", payload);
      Object.keys(payload).forEach(storageKey => {
        if (storageSettingList.includes(storageKey)) {
          setLocalStorage("rb-system-setting", { ...getLocalStorageSetting(), [storageKey]: payload[storageKey] });
        }
      });
    },
  },
};

function initChildData(data) {
  const authButtons = [];
  data.map(item => {
    if (item.childList && item.childList !== 0) {
      item.childList.forEach((element) => {
        if (element.operates && element.operates.length > 0) {
          element.operates.forEach((ele) => {
            authButtons.push(ele);
          });
        }
      });
      initChildData(item.childList);
    }
  });
  return authButtons;
}

export default global;
