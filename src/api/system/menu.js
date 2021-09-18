import { request } from "@/utils";

// 查询功能所有
export const listMenu = (data) => request({
  // url: '/rabbit/system/menu/tree/find/all',
  url: '/rabbit/system/action/find/all/tree',
  data,
});

// 获取功能
export function getMenuById(data) {
  return request({
    // url: '/rabbit/system/menu/get',
    url: '/rabbit/system/action/get',
    data: data,
  });
}

// 新增菜单
export const add = (data) => request({
  // url: '/rabbit/system/menu/create',
  url: '/rabbit/system/action/create',
  data,
});

// 修改菜单
export const update = (data) => request({
  // url: '/rabbit/system/menu/update',
  url: '/rabbit/system/action/update',
  method: 'post',
  data: data,
});

// 删除菜单
// export const del = (data) => request({ url: '/rabbit/system/menu/delete', data });
export const del = (data) => request({ url: '/rabbit/system/action/delete', data });

// 获取左侧菜单
// export const getIndexMenu = (data) => request({
//   url: "/rabbit/system/menu/tree/index",
//   data,
// });
export const getIndexMenu = (data) => request({
  url: "/rabbit/system/action/find/auth/tree",
  data,
});
// 获取当前应用的菜单
export const getAppMenu = (data) => request({
  url: "/rabbit/system/menu/tree/app/all",
  data,
});

// 获取所有按钮
export const getMenuButton = () => request({
  url: "/rabbit/system/user/button/find",
});

// 获取菜单下的接口
export const getMenusUri = (data) => request({
  url: "/rabbit/system/uri/find",
  data,
});

// 当前应用菜单接口
// export const appMenuApi = "/api/v1/rabbit/system/menu/tree/app/all";
export const appMenuApi = "/api/v1/rabbit/system/action/find/app/tree";

export const getMenuIcons = (data) => request({
  url: "/rabbit/system/icon/find/all",
  data,
});

export default {
  name: "rabbit.system.menu",
  api: {
    fetchAuthButton: "/rabbit/system/user/button/find",
    getIndexMenu: "/rabbit/system/action/find/auth/tree",
  },
};
