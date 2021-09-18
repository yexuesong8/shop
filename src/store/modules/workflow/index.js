import { getElementType } from '@/views/workflow/template/utils';

const initialState = {
  taskList: [],
  memberList: [],
  ccMemberIdList: [], // 抄送人列表
  enabledCC: 0, // 支持抄送
  visible: false,
  id: "",
  elementType: "", // 节点类型
  data: {}, // 以element的id作为key， value为element的property值
  element: null, // 当前节点
  process: {}, // process 数据
  originProcess: {},
  originData: {},
  nodeNameIndex: 1,
  endNameIndex: 0,
  autoNameIndex: 1,
};

export default {
  namespaced: "workflow",
  state: { ...initialState },
  mutations: {
    setTaskList(state, payload) {
      state.taskList = payload;
    },
    setMemberList(state, payload) {
      state.memberList = payload;
    },
    setCcMemberIdList(state, payload) {
      state.ccMemberIdList = payload;
    },
    setEnabledCc(state, payload) {
      state.enabledCC = payload;
    },
    manage(state, payload) {
      const { id, visible, element } = payload;
      state.id = id;
      state.visible = visible;
      state.element = element;
    },
    setData(state, payload) {
      const { id, data } = state;
      state.data = { ...data, [id]: payload };
    },
    setExtraData(state, payload) {
      const { data } = state;
      const { id, extraData } = payload;
      state.data = { ...data, [id]: { ...data[id], ...extraData }};
    },
    setElement(state, payload) {
      state.element = payload;
    },
    removeElement(state, payload) {
      const { data } = state;
      state.data = { ...data, [payload]: undefined };
    },
    setProcess(state, payload) {
      const { data } = state;
      state.data = { ...data, "process": payload };
    },
    updateProcess(state, payload) {
      const { data, data: { process }} = state;
      state.data = { ...data, "process": { ...process, ...payload }};
    },
    setOriginData(state, payload) {
      state.data = payload;
    },
    setOriginProcess(state, payload) {
      state.originProcess = { ...payload };
    },
    reset(state) {
      const keys = Object.keys(initialState);
      keys.forEach(key => {
        state[key] = initialState[key];
      });
    },
    setEndNameIndex(state, payload) {
      state.endNameIndex = payload;
    },
    setAutoNameIndex(state, payload) {
      state.autoNameIndex = payload;
    },
    setNodeNameIndex(state, payload) {
      state.nodeNameIndex = payload;
    },
  },
  actions: {
    getElementName({ state, commit }, payload) {
      const type = getElementType(payload);
      const { endNameIndex, autoNameIndex, nodeNameIndex } = state;

      let name = "";
      switch (type) {
        case "start":
          name = "开始";
          break;
        case "end":
          name = endNameIndex === 0 ? "结束" : `结束${endNameIndex}`;
          commit("setEndNameIndex", endNameIndex + 1);
          break;
        case "auto":
          name = `自动${autoNameIndex}`;
          commit("setAutoNameIndex", autoNameIndex + 1);
          break;
        case "node":
          name = `节点${nodeNameIndex}`;
          commit("setNodeNameIndex", nodeNameIndex + 1);
          break;
        default:break;
      }

      // 设置element的form name值
      commit("setExtraData", {
        id: payload.id,
        extraData: { name },
      });

      return name;
    },
    getCurrentNameIndex({ state }, payload) {
      const type = getElementType(payload);
      const { endNameIndex, autoNameIndex, nodeNameIndex } = state;

      let name = "";
      switch (type) {
        case "start":
          name = "开始";
          break;
        case "end":
          name = `结束${endNameIndex - 1}`;
          break;
        case "auto":
          name = `自动${autoNameIndex - 1}`;
          break;
        case "node":
          name = `节点${nodeNameIndex - 1}`;
          break;
        default:break;
      }
      return name;
    },
  },
};
