import { request } from "@/utils";
// 获取详情
export const getById = (id) => request({
  url: "/rabbit/system/data/auth/mode/get",
  data: { id },
});

// 创建
export const add = (data) => request({
  url: "/rabbit/system/data/auth/mode/create",
  data,
});

// 更新
export const update = (data) => request({
  url: "/rabbit/system/data/auth/mode/update",
  data,
});
