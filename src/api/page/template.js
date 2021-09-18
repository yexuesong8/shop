import { request } from "@/utils";

// 分页查询
export const del = (data) => request({
  url: '/rabbit/page/template/delete',
  data,
});

// 新增
export const create = (data) => request({
  url: '/rabbit/page/template/create',
  data,
});

// 修改
export const update = (data) => request({
  url: '/rabbit/page/template/update',
  data,
});

// 获取
export const getTemplateInfo = (data) => request({
  url: '/rabbit/page/template/get',
  data,
});

// 获取
export const parseDataSource = (data) => request({
  url: '/rabbit/page/template/parse',
  data,
});
