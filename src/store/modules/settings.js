import variables from '@assets/styles/element-variables.scss';
import defaultSettings from '@/settings';
import { getLocalStorage, setLocalStorage } from "@monkey.do/monkey";

const { showSettings, tagsView, fixedHeader, sidebarLogo, showMessage, showHeader, showSidebarHeader, showSidebarBackgroundImg, logo, title } = defaultSettings;
const storageList = ["theme", "tagsView", "sidebarLogo", "sidebarStatus"];
const storageRb = getLocalStorage("rb-system-setting");
const state = {
  options: {
    theme: storageRb && storageRb.theme ? storageRb.theme : variables.theme,
    showHeader: showHeader,
    showMessage: showMessage,
    showSettings: showSettings,
    showSidebarHeader: showSidebarHeader,
    showSidebarBackgroundImg: showSidebarBackgroundImg,
    sidebarLogo: sidebarLogo,
    logo: logo,
    title: title,
    tagsView: tagsView,
    fixedHeader: fixedHeader,
  },
};

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.options.hasOwnProperty(key)) {
      state.options[key] = value;
      const options = getLocalStorage("rb-system-setting") || {};
      if (storageList.includes(key)) {
        setLocalStorage("rb-system-setting", { ...options, [key]: value });
      }
    }
  },
  SET_SYSTEM_SETTING(state, payload) {
    const options = getLocalStorage("rb-system-setting") || {};
    const newOptions = { ...options, ...payload };
    state.options = newOptions;
    // setLocalStorage("rb-system-setting", newOptions);
  },
};

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

