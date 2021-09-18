import { request } from "@/utils";

// 获取列表
export const get = (data) => request({
  url: "/rabbit/data/field/find/all",
  data,
});

// 获取列表-分页
export const getByPage = (data) => request({
  url: "/rabbit/data/field/find/page",
  data,
});

// 获取详情
export const getById = (id) => request({
  url: "/rabbit/system/field/get",
  data: { id },
});

// 创建
export const add = (data) => request({
  url: "/rabbit/data/field/create",
  data,
});

// 更新
export const update = (data) => request({
  url: "/rabbit/data/field/update",
  data,
});

// 删除
export const del = (id) => request({
  url: "/rabbit/data/field/delete",
  data: { id },
});
