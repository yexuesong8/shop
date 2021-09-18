import { request } from '@/utils';

// 列表
export const fetch = (data) => request({
  url: "/rabbit/system/table/allow/scope/list",
  data,
});

// 保存
export const save = (data) => request({
  url: "/rabbit/system/table/allow/scope/save",
  data,
});
