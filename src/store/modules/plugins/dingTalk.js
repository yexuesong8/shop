export default {
  namespaced: true,
  state: {
    // 是否开启钉钉登录
    isNailingLogin: true,
  },
  mutations: {
    setisNailingLogin(state, payload) {
      state.isNailingLogin = payload;
    },
  },
  actions: {
    setisNailingLogin({ commit }, payload) {
      commit("setisNailingLogin", payload);
    },
  },
};
