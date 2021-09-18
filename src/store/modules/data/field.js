import { getByPage, getById, update, del, add } from "@/api/data/field";
import { listState, defaultPagination } from "@/config/index";

export default {
  namespaced: true,
  state: {
    loading: false,
    search: {},
    data: { ...listState },
    visible: false,
    title: "",
    type: "",
    detail: {},
    detailLoading: false,
  },
  mutations: {
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setSearch: (state, payload = {}) => {
      state.search = payload;
    },
    setData: (state, payload) => {
      state.data = payload;
    },
    setDialog: (state, payload) => {
      Object.keys(payload).forEach(item => {
        state[item] = payload[item];
      });
    },
    setDetailLoading: (state, payload) => {
      state.detailLoading = payload;
    },
  },
  actions: {
    getByPage({ commit, state }, payload = { ...defaultPagination }) {
      commit("setLoading", true);
      return getByPage({ ...payload, ...state.search }).then(res => {
        if (res.statusCode === 600) commit("setData", res.data);
        commit("setLoading", false);
        return res;
      });
    },
    add({ dispatch, commit }, payload) {
      commit("setDetailLoading", true);
      return add(payload).then(res => {
        if (res.statusCode === 600) dispatch("getByPage");
        commit("setDetailLoading", false);
        return res;
      });
    },
    update({ dispatch, commit }, payload) {
      commit("setDetailLoading", true);
      return update(payload).then(res => {
        if (res.statusCode === 600) dispatch("getByPage");
        commit("setDetailLoading", false);
        return res;
      });
    },
    del({ dispatch }, payload) {
      return del(payload).then(res => {
        if (res.statusCode === 600) {
          dispatch("getByPage");
        }
        return res;
      });
    },
    getById(_, payload) {
      return getById(payload).then(res => {
        return res;
      });
    },
  },
};
