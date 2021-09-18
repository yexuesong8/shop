import { login, logout, getInfo } from '@/api/login';
import { getToken, removeToken } from "@monkey.do/monkey";
import { resetRoutes } from "@/router";
import { $request } from "@/utils";

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    userInfo: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return login(userInfo).then(res => {
        if (res.statusCode === 600) {
          commit('SET_TOKEN', res.data);
        }
        return res;
      });
    },
    // // // 钉钉扫码登录
    // ddLogin({ commit }, payload) {
    //   return ddLogin(payload).then(res => {
    //     if (res.statusCode === 600) {
    //       setToken(res.data.token);
    //       commit('SET_TOKEN', res.data.token);
    //     }
    //     return res;
    //   });
    // },
    // 获取用户信息
    GetInfo({ commit }) {
      return getInfo().then(res => {
        if (res.statusCode === 600) {
          const user = res.data;
          commit('setUserInfo', res.data);
          const avatar = user.avatar || "";
          commit('SET_NAME', user.name);
          commit('SET_AVATAR', avatar);
        }
        return res;
      });
    },

    UserUpdate({ state }, payload) {
      const { userInfo: { id }} = state;
      return $request("rabbit.system.user.update", { data: { id, avatar: payload.id }});
    },

    UserBaseUpdate({ state }, payload) {
      const { userInfo: { id }} = state;
      return $request("rabbit.system.user.update", { data: { id, avatar: payload.id }});
    },

    // 退出系统
    LogOut({ dispatch }) {
      return logout().then((res) => {
        if (res.statusCode === 600) dispatch("AfterLogout");
        return res;
      });
    },

    AfterLogout({ dispatch, commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '');
        commit('setUserInfo', {});
        // commit("permission/resetRoutes");
        // commit("permission/SET_ROUTES", []); // 清空路由
        // commit("permission/SET_MENUS", []); // 清空菜单
        dispatch("tagsView/delAllViews"); // 清空keep-alive缓存
        resetRoutes(); // 清空常用路由
        removeToken();
        resolve();
      });
    },
  },
};

export default user;
