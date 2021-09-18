import request from "@/utils/rabbit-request";

// 查询部门列表
export function listDept() {
  return request({
    url: '/system/department/find/all',
    method: 'post',
  });
}
// 添加负责人
export function addLeader(data) {
  return request({
    url: '/system/department/update',
    data: data,
  });
}

// 查询部门下拉树结构
export function getDeptTree(data) {
  return request({
    url: '/system/department/find/tree',
    data: data,
  });
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/system/department/create',
    method: 'post',
    data: data,
  });
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/department/update',
    method: 'post',
    data: data,
  });
}

// 删除部门
export function delDept(data) {
  return request({
    url: '/system/department/delete',
    method: 'post',
    data: data,
  });
}
