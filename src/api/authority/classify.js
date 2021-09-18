import { request } from "@/utils";
// 获取详情
export const getById = (id) => request({
  url: "/rabbit/system/api/category/get",
  data: { id },
});

// 创建
export const add = (data) => request({
  url: "/rabbit/system/api/category/create",
  data,
});

// 更新
export const update = (data) => request({
  url: "/rabbit/system/api/category/update",
  data,
});

