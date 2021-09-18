import { request } from "@/utils";
// 获取列表
export const get = (data) => request({
  url: "/rabbit/data/table/find/all",
  data,
});

// 获取列表-分页
export const getByPage = (data) => request({
  url: "/rabbit/data/table/find/page",
  data,
});

// 获取详情
export const getById = (id) => request({
  url: "/rabbit/data/table/get",
  data: { id },
});

// 创建
export const add = (data) => request({
  url: "/rabbit/data/table/create",
  data,
});

// 更新
export const update = (data) => request({
  url: "/rabbit/data/table/update",
  data,
});

// 删除
export const del = (data) => request({
  url: "/rabbit/data/table/delete",
  data,
});

// 添加字段
export const addField = (data) => request({
  url: "/rabbit/data/table/field/add",
  data,
});

// 获取字段
export const getField = data => request({
  url: "/rabbit/data/table/field/not/added/list",
  data,
});

// 获取已有字段
export const getExistField = data => request({
  url: "/rabbit/data/table/field/added/list",
  data,
});

// 移除字段
export const rmField = data => request({
  url: "/rabbit/data/table/field/remove",
  data,
});

export const bindField = data => request({
  url: "/rabbit/data/field/create/table/bind",
  data,
});

// 获取库的表
export const getTableByDBId = data => request({
  url: "/rabbit/data/table/db/added/list",
  data,
});

// 获取库未有的表
export const getNoTableByDBId = data => request({
  url: "/rabbit/data/table/db/not/added/list",
  data,
});
