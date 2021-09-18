import { request } from "@/utils";

// 分页查询
export const fetch = (data) => request({
  url: '/rabbit/page/property/type/find/page',
  data,
});

// 查询属性类型
export const findType = (data) => request({
  url: '/rabbit/page/property/type/find',
  data,
});

// 新增属性类型
export const addType = (data) => request({
  url: '/rabbit/page/property/type/create',
  data,
});

// 更新属性类型
export const updateType = (data) => request({
  url: '/rabbit/page/property/type/update',
  data,
});

// 属性类型排序
export const sortType = (data) => request({
  url: '/rabbit/page/property/type/sort',
  data,
});

// 属性类型删除
export const delType = (data) => request({
  url: '/rabbit/page/property/type/delete',
  data,
});

