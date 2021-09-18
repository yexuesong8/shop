import { request } from "@/utils";

// 查询字典类型列表
export function listType(data) {
  return request({
    url: '/rabbit/data/dictionary/find/page',
    method: 'post',
    data,
  });
}

// 查询字典类型详细
export function getType(data) {
  return request({
    url: '/rabbit/data/dictionary/find/all',
    method: 'post',
    data,
  });
}

// 新增字典类型
export function addType(data) {
  return request({
    url: '/rabbit/data/dictionary/create',
    method: 'post',
    data,
  });
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: '/rabbit/data/dictionary/update',
    method: 'post',
    data,
  });
}

// 删除字典类型
export function delType(data) {
  return request({
    url: '/rabbit/data/dictionary/delete',
    method: 'post',
    data,
  });
}

// 设置状态
export function changeTypeStatus(data) {
  return request({
    url: '/rabbit/data/dictionary/status/set',
    method: 'post',
    data,
  });
}
export default {
  name: "rabbit.system.type",
  api: {
    // 新增字典类型
    addType: "/rabbit/data/dictionary/create",
    // 修改字典类型
    updateType: "/rabbit/data/dictionary/update",
    // 查询字典类型列表
    listType: "/rabbit/data/dictionary/find/page",
    // 查询字典类型详细
    getType: "/rabbit/data/dictionary/find/all",
    // 删除字典类型
    delType: "/rabbit/data/dictionary/delete",
    // 设置状态
    changeTypeStatus: "/rabbit/data/dictionary/status/set",
  },
};
