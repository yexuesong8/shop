import { getMenuIcons } from "@/api/system/menu";

const initState = {
  menuIconList: [],
};

export default {
  namespaced: true,
  state: { ...initState },
  mutations: {
    setMenuIconList(state, payload) {
      state.menuIconList = payload;
    },
  },
  actions: {
    getMenuIcons({ commit }, payload) {
      return getMenuIcons(payload).then(res => {
        if (res.statusCode === 600) {
          commit("setMenuIconList", res.data);
        }
      });
    },
  },
};
