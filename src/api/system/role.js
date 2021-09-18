import { request } from "@/utils";

// 查询角色列表
export function fetch(data) {
  return request({
    url: '/rabbit/system/role/find/page',
    data,
  });
}
// 查询角色分页
export function getRolePage(data) {
  return request({
    url: '/rabbit/system/role/find/page',
    data,
  });
}
// 查询角色详细
export function get(roleId) {
  return request({
    url: '/rabbit/system/role/get',
    data: {
      roleId,
    },
  });
}

// 新增角色
export function add(data) {
  return request({
    url: '/rabbit/system/role/create',
    data: data,
  });
}

// 修改角色
export function update(data) {
  return request({
    url: '/rabbit/system/role/update',
    data,
  });
}

// 查询修改角色对应的权限
export function getRoleDeptTreeSelect(id) {
  return request({
    url: '/rabbit/system/role/action/find/tree',
    data: { id },
  });
}

// 查询角色选中菜单/按钮/接口
// export function getRoleCheckedOption(id) {
//   return request({
//     url: '/rabbit/system/role/get/info',
//     data: { id },
//   });
// }
export function getRoleCheckedOption(id) {
  return request({
    url: '/rabbit/system/action/find/app/auth',
    data: { id },
  });
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/rabbit/system/role/dataScope',
    data: data,
  });
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status,
  };
  return request({
    url: '/rabbit/system/role/changeStatus',
    method: 'put',
    data: data,
  });
}

// 删除角色
export function del(data) {
  return request({
    url: "/rabbit/system/role/delete",
    data,
  });
}

// 批量删除
export function batchDel(data) {
  return request({ url: "/rabbit/system/role/delete/batch", data });
}

// 角色功能添加
export function addRoleMenu(data) {
  return request({
    url: '/rabbit/system/role/action/add',
    method: postMessage,
    data: data,
  });
}

export const fetchRole = () => request({ url: "/rabbit/system/role/find/all" });
// 根据roleid获取成员列表

export function fetchMemberListById(data) {
  return request({ url: "/rabbit/system/role/user/list", data });
}
// 保持角色下面的成员
export function saveMembers(data) {
  return request({ url: "/rabbit/system/role/user/list/save", data });
}

export const dispatchMenuToRole = (data) => request({
  // url: "/rabbit/system/role/menu/save",
  url: "/rabbit/system/role/action/save",
  data,
});

export default {
  name: "rabbit.role",
  api: {
    // 查询角色列表
    fetch: "/rabbit/system/role/find/page",
    // 查询角色分页
    getRolePage: "/rabbit/system/role/find/page",
    // 新增角色
    add: "/rabbit/system/role/create",
    // 查询角色详细
    get: "/rabbit/system/role/get",
    // 修改角色
    update: "/rabbit/system/role/update",
    // 查询修改角色对应的权限
    getRoleDeptTreeSelect: "/rabbit/system/role/action/find/tree",
    // 查询角色选中菜单/按钮/接口
    getRoleCheckedOption: "/rabbit/system/role/get/info",
    // 角色数据权限
    dataScope: "/rabbit/system/role/dataScope",
    // 角色状态修改
    changeRoleStatus: "/rabbit/system/role/changeStatus",
    // 批量删除
    batchDel: "/rabbit/system/role/delete/batch",
    // 角色功能添加
    addRoleMenu: "/rabbit/system/role/action/add",
    // 根据roleid获取成员列表
    fetchMemberListById: "/rabbit/system/role/user/list",
    // 保持角色下面的成员
    saveMembers: "/rabbit/system/role/user/list/save",
    fetchRole: "/rabbit/system/role/find/all",
    // dispatchMenuToRole: "/rabbit/system/role/menu/save",
    dispatchMenuToRole: "/rabbit/system/role/action/save",

  },
};
