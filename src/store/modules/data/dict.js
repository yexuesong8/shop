import { getAllDictionary, fetch, del, update, add } from "@/api/system/dict/data";
import { listState } from "@/config/index";

const initialState = {
  dictionaries: [],
  ...listState,
  search: {},
  loading: false,
  detail: {},
  visible: false,
  type: "", // 详情模态框类型, add, update
};

export default {
  namespaced: true,

  state: { ...initialState },

  mutations: {
    setDictionary(state, payload) {
      state.dictionaries = payload;
    },
    setList(state, payload) {
      const { list, pageNum, pageSize, total } = payload;
      state.list = list;
      state.pageSize = pageSize;
      state.pageNum = pageNum;
      state.total = total;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setSearch(state, payload) {
      state.search = payload;
    },
    manage(state, payload) {
      const { type, detail, visible } = payload;
      state.type = type;
      state.detail = detail;
      state.visible = visible;
    },
  },

  actions: {
    // 字典列表
    fetch({ commit, state }, payload) {
      const { pageSize, pageNum, search } = state;
      commit("setLoading", true);
      return fetch({ pageSize, pageNum, ...payload, ...search }).then(res => {
        if (res.statusCode === 600) commit("setList", res.data);
        commit("setLoading", false);
        return res;
      });
    },

    // 字典更新
    update(_, payload) {
      return update(payload);
    },

    // 字典新增
    add(_, payload) {
      return add(payload);
    },

    // 字典删除
    del(_, payload) {
      return del(payload);
    },

    // 获取所有字典
    getAllDictionary({ commit }, payload) {
      getAllDictionary(payload).then(res => {
        if (res.statusCode === 600) commit("setDictionary", res.data);
      });
    },
  },
};
