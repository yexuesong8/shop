import { request } from "@/utils";

// 获取列表
export const get = (data) => request({
  url: "/rabbit/system/message/template/get",
  data,
});

// 获取列表-分页
export const getByPage = (data) => request({
  url: "/rabbit/system/message/template/find/page",
  data,
});

// 创建
export const add = (data) => request({
  url: "/rabbit/system/message/template/create",
  data,
});

// 更新
export const update = (data) => request({
  url: "/rabbit/system/message/template/update",
  data,
});

// 删除
export const del = (id) => request({
  url: "/rabbit/system/message/template/delete",
  data: { id },
});
