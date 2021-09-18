import { request } from "@/utils";

// 属性分页查询
export const getAttri = (data) => request({
  url: '/rabbit/page/property/find/page',
  data,
});

// 新增属性
export const addAttri = (data) => request({
  url: '/rabbit/page/property/create',
  data,
});
// 修改属性
export const updateAttri = (data) => request({
  url: '/rabbit/page/property/update',
  data,
});

// 删除属性
export const delAttri = (data) => request({
  url: '/rabbit/page/property/delete',
  data,
});

// 查询
export const findSort = (data) => request({
  url: '/rabbit/page/property/component/find',
  data,
});

// 排序
export const sort = (data) => request({
  url: '/rabbit/page/property/sort',
  data,
});

