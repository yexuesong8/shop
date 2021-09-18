
const initState = {
  isComponent: false,
};

export default {
  namespaced: true,
  state: { ...initState },
  mutations: {
    SET_IS_COMPONENT(state, payload) {
      state.isComponent = payload;
    },
  },
};
