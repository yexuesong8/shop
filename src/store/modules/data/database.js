import { getByPage, getById, update, del, add, addTables, rmTables } from "@/api/data/database";
import { listState, defaultPagination } from "@/config/index";
import { getTableByDBId, getNoTableByDBId } from "@/api/data/table";

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

    // 添加/移除 表
    tableData: {},
    tableTitle: "",
    tableVisible: false,
    tableType: "",
    databaseId: "",
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
    tableManage: (state, payload) => {
      state.tableTitle = payload.title;
      state.tableVisible = payload.visible;
      state.tableType = payload.type;
      state.databaseId = payload.id;
    },
    setTableData: (state, payload) => {
      state.tableData = payload;
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
        if (res.statusCode === 600) dispatch("getByPage");
        return res;
      });
    },
    getById(_, payload) {
      return getById(payload).then(res => {
        return res;
      });
    },
    getTable({ commit }, payload) {
      return getTableByDBId({ ...defaultPagination, ...payload }).then(res => {
        if (res.statusCode === 600) commit("setTableData", res.data);
        return res;
      });
    },
    getNoTable({ commit }, payload) {
      return getNoTableByDBId({ ...defaultPagination, ...payload }).then(res => {
        if (res.statusCode === 600) commit("setTableData", res.data);
        return res;
      });
    },
    addTables(_, payload) {
      return addTables(payload);
    },
    rmTables(_, payload) {
      return rmTables(payload);
    },
  },
};
