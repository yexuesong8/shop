import { request } from "@/utils";

/**
 *  首页模板相关接口
 */

//  分页查询
export const fetchTemByMember = data => request({
  url: '/rabbit/home/template/find/page',
  data,
});

// 创建
export const createTemplate = data => request({
  url: '/rabbit/home/template/create',
  data,
});

// 获取
export const getTemplate = data => request({
  url: '/rabbit/home/template/get',
  data,
});

// 修改
export const updateTemplate = data => request({
  url: '/rabbit/home/template/update',
  data,
});

// 启用/停用
export const enableTemplate = data => request({
  url: '/rabbit/home/template/enable',
  data,
});

// 删除
export const deleteTemplate = data => request({
  url: '/rabbit/home/template/delete',
  data,
});

/**
 *  首页组件相关接口
 */

// 创建
export const createComponent = data => request({
  url: '/rabbit/home/component/create',
  data,
});

// 修改
export const updateComponent = data => request({
  url: '/rabbit/home/component/update',
  data,
});

// 删除
export const deleteComponent = data => request({
  url: '/rabbit/home/component/delete',
  data,
});

// 分页/查询
export const findComp = data => request({
  // url: '/rabbit/home/component/find/page',
  url: '/rabbit/home/component/type/id/find',
  data,
});

// 全部/查询
export const findAllComp = data => request({
  url: '/rabbit/home/component/find/all',
  data,
});

/**
 *  首页组件分类相关接口
 */

//  创建组件分类
export const createCompType = data => request({
  url: '/rabbit/home/component/type/create',
  data,
});

// 修改组件分类
export const updateCompType = data => request({
  url: '/rabbit/home/component/type/update',
  data,
});

// 删除组件分类
export const deleteCompType = data => request({
  url: '/rabbit/home/component/type/delete',
  data,
});

// 组件分类树
export const fetchTree = data => request({
  url: '/rabbit/home/component/type/tree',
  data,
});

