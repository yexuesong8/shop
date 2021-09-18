import { getByPage, getById, update, del, add, addField, getField, getExistField, rmField, bindField } from "@/api/data/table";
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

    // 添加/移除 字段
    fieldVisible: false,
    fieldTitle: "",
    tableId: "",
    fieldType: "",
    fieldData: {},
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
    fieldManage: (state, payload) => {
      state.fieldVisible = payload.visible;
      state.fieldType = payload.type;
      state.tableId = payload.id;
    },
    setFieldData: (state, payload) => {
      state.fieldData = payload;
    },
  },
  actions: {
    getByPage({ commit, state }, payload = { ...defaultPagination }) {
      commit("setLoading", true);
      return getByPage({ ...payload, ...state.search }).then(res => {
        if (res.statusCode === 600) {
          commit("setData", res.data);
        }
        commit("setLoading", false);
        return res;
      });
    },
    add({ dispatch, commit, state }, payload) {
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
      return del({ id: payload }).then(res => {
        if (res.statusCode === 600) dispatch("getByPage");
        return res;
      });
    },
    getById(_, payload) {
      return getById(payload).then(res => {
        return res;
      });
    },

    addField({ dispatch, commit }, payload) {
      return addField(payload).then(res => {
        if (res.statusCode === 600) dispatch("getByPage");
        return res;
      });
    },

    bindField({ dispatch, commit }, payload) {
      return bindField(payload).then(res => {
        if (res.statusCode === 600) dispatch("getByPage");
        return res;
      });
    },

    rmField({ dispatch, commit }, payload) {
      return rmField(payload).then(res => {
        if (res.statusCode === 600) dispatch("getByPage");
        return res;
      });
    },

    getField({ dispatch, commit, state }, payload) {
      return getField({ ...defaultPagination, ...payload, id: state.tableId }).then(res => {
        if (res.statusCode === 600) commit("setFieldData", res.data);
        return res;
      });
    },

    getExistField({ dispatch, commit, state }, payload) {
      return getExistField({ ...defaultPagination, ...payload, id: state.tableId }).then(res => {
        if (res.statusCode === 600) {
          commit("setFieldData", res.data);
        }
        return res;
      });
    },
  },
};
