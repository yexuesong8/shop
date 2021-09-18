import { getLocalStorage, setLocalStorage } from "@monkey.do/monkey";

const localRb = getLocalStorage("rb-system-setting") || "";
const sidebarStatus = localRb && localRb.sidebarStatus;
const state = {
  sidebar: {
    opened: sidebarStatus !== "hide",
    withoutAnimation: false,
  },
  device: 'desktop',
  size: getLocalStorage('element-size') || 'medium',
};

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      setLocalStorage("rb-system-setting", { ...localRb, sidebarStatus: "open" });
    } else {
      setLocalStorage("rb-system-setting", { ...localRb, sidebarStatus: "hide" });
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    setLocalStorage("rb-system-setting", { ...localRb, sidebarStatus: "hide" });
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  SET_SIZE: (state, size) => {
    state.size = size;
    setLocalStorage("element-size", size);
  },
};

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
