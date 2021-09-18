import { request } from "@/utils";

// 属性分组查询
export const findGroup = (data) => request({
  url: '/rabbit/page/property/group/find',
  data,
});

// 属性分组新增
export const addGroup = (data) => request({
  url: '/rabbit/page/property/group/create',
  data,
});

// 属性分组修改
export const updateGroup = (data) => request({
  url: '/rabbit/page/property/group/update',
  data,
});

// 属性分组删除
export const delGroup = (data) => request({
  url: '/rabbit/page/property/group/delete',
  data,
});

// 属性分组排序
export const sortGroup = (data) => request({
  url: '/rabbit/page/property/group/sort',
  data,
});
