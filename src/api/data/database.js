import { request } from "@/utils";

// 获取列表
export const get = (data) => request({
  url: "/rabbit/data/db/find/all",
  data,
});

// 获取列表-分页
export const getByPage = (data) => request({
  url: "/rabbit/data/db/find/page",
  data,
});

// 获取详情
export const getById = (id) => request({
  url: "/rabbit/data/db/get",
  data: { id },
});

// 创建
export const add = (data) => request({
  url: "/rabbit/data/db/create",
  data,
});

// 更新
export const update = (data) => request({
  url: "/rabbit/data/db/update",
  data,
});

// 删除
export const del = (id) => request({
  url: "/rabbit/data/db/delete",
  data: { id },
});

// 获取表
export const getTableByPage = (data) => request({
  url: "/rabbit/data/db/table/find/page",
  data,
});

// 添加表
export const addTables = data => request({
  url: "/rabbit/data/db/tables/create",
  data,
});

// 移除表
export const rmTables = data => request({
  url: "/rabbit/data/db/tables/delete",
  data,
});
