import { request } from "@/utils";

// 分组新增
export const add = (data) => request({
  url: "/rabbit/page/component/group/create",
  data,
});

// 分组更新
export const update = (data) => request({
  url: "/rabbit/page/component/group/update",
  data,
});

// 分组删除
export const del = (data) => request({
  url: "/rabbit/page/component/group/delete",
  data,
});

// 分组排序
export const sort = (data) => request({
  url: "/rabbit/page/component/group/sort",
  data,
});

// 分组查询
export const fetch = (data) => request({
  url: "/rabbit/page/component/group/find",
  data,
});

// 查询
export const fetchList = (data) => request({
  url: "/rabbit/page/component/find/page",
  data,
});

// 查询全部
export const fetchAll = () => request({
  url: "/rabbit/page/component/find/all",
});

// 组件新增
export const addComponent = (data) => request({
  url: "/rabbit/page/component/create",
  data,
});

// 组件修改
export const updateComponent = (data) => request({
  url: "/rabbit/page/component/update",
  data,
});

// 组件删除
export const delComponent = (data) => request({
  url: "/rabbit/page/component/delete",
  data,
});

// 组件属性查询
export const getPropertys = (data = {}) => request({
  url: "/rabbit/page/component/property/find",
  data,
});

// 组件排序
export const groupSort = (data) => request({
  url: "/rabbit/page/component/sort",
  data,
});
