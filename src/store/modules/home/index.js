export default {
  namespaced: true,
  state: {
    zIndex: 100,
    prevTargetId: null,
  },
  mutations: {
    setZIndex(state) {
      const { zIndex } = state;
      state.zIndex = zIndex + 1;
    },
    setPrevTargetId(state, payload) {
      state.prevTargetId = payload;
    },
  },
  actions: {
    setZIndex({ commit }) {
      commit("setZIndex");
    },
    setPrevTargetId({ commit }, payload) {
      commit("setPrevTargetId", payload);
    },
  },
};
