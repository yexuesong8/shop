import { request } from "@/utils";

// 表
export const findTable = (data) => request({
  url: '/rabbit/system/table/find/page',
  data,
});

export const findAllTable = () => request({
  url: '/rabbit/system/table/find/all',
});

export const allowRule = (id) => request({
  url: '/rabbit/system/table/allow/rule',
  data: {
    id,
  },
});

export const createTable = data => request({
  url: '/rabbit/system/table/create',
  data,
});

export const updateTable = data => request({
  url: '/rabbit/system/table/update',
  data,
});

export const deleteTable = id => request({
  url: '/rabbit/system/table/delete',
  data: {
    id,
  },
});

// 字段
export const createField = data => request({
  url: '/rabbit/system/field/create',
  data,
});

export const deleteField = data => request({
  url: '/rabbit/system/field/delete',
  data,
});

export const updateField = data => request({
  url: '/rabbit/system/field/update',
  data,
});

export const getField = id => request({
  url: '/rabbit/system/field/update',
  data: {
    id,
  },
});

export const findAllField = data => request({
  url: '/rabbit/system/field/find/all',
  data,
});

export const findField = data => request({
  url: '/rabbit/system/field/find/page',
  data,
});

export const fieldSort = data => request({
  url: '/rabbit/system/field/sort',
  data,
});

// 一级目录
export const stairMenu = data => request({
  url: '/rabbit/system/menu/find/stair/menu',
  data,
});
