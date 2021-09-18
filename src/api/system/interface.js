import { request } from "@/utils";

// 接口分页列表
export function pageInterface(data) {
  return request({
    url: '/rabbit/system/uri/find/page',
    method: 'post',
    data,
  });
}

// 查询所有角色
export function allRole() {
  return request({
    url: '/rabbit/system/role/name/find/all',
  });
}

// 根据api查询可用的角色
export function getRoleInterface(id) {
  return request({
    url: "/rabbit/system/uri/get",
    data: { id },
  });
}

// 新增接口对应的角色
export function add(data) {
  return request({
    url: '/rabbit/system/uri/create',
    data: data,
  });
}

// 修改接口对应的角色
export function update(data) {
  return request({
    url: '/rabbit/system/uri/update',
    data,
  });
}

// 查询修改接口对应的角色
export function getRoleDeptTreeSelect(id) {
  return request({
    url: '/rabbit/system/role/action/find/tree',
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

// 删除接口
export function del(data) {
  return request({
    url: "/rabbit/system/uri/delete",
    data,
  });
}

// 批量删除
export function batchDel(data) {
  return request({ url: "/rabbit/system/uri/delete/batch", data });
}

export function updateStatus(data) {
  return request({ url: "/rabbit/system/uri/enabled", data });
}
