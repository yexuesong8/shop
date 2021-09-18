import { request } from "@/utils";

// 模板新增接口
export function addTemplate(data) {
  return request({
    url: "/rabbit/report/template/create",
    data,
  });
}

// 模板修改接口
export function updateTemplate(data) {
  return request({
    url: "/rabbit/report/template/update",
    data,
  });
}

// 获取模板
export function getTemplate(data) {
  return request({
    url: "/rabbit/report/template/get",
    data,
  });
}

// 获取报表
export function getTemplateAll(data) {
  return request({
    url: "/rabbit/report/template/find/all",
    data,
  });
}

// 获取文件
export function getFile(data) {
  return request({
    url: "/rabbit/file/get/info",
    data,
  });
}

// 模板删除接口
export function deleteTemplate(data) {
  return request({
    url: "/rabbit/report/template/delete",
    data,
  });
}

// 报表查询方案新增接口
export function addQueryScheme(data) {
  return request({
    url: "/rabbit/report/query/plan/create",
    data,
  });
}
// 报表查询方案修改接口
export function updateQueryScheme(data) {
  return request({
    url: "/rabbit/report/query/plan/update",
    data,
  });
}
// 报表查询方案列表接口
export function getQueryScheme(data) {
  return request({
    url: "/rabbit/report/query/plan/find",
    data,
  });
}

// 报表查询方案删除接口
export function deleteQueryScheme(data) {
  return request({
    url: "/rabbit/report/query/plan/delete",
    data,
  });
}
// 报表查询方案排序接口
export function sortQueryScheme(data) {
  return request({
    url: "/rabbit/report/query/plan/sort",
    data,
  });
}
// 报表查询方案单行数据接口
export function getOneQueryScheme(data) {
  return request({
    url: "/rabbit/report/query/plan/get",
    data,
  });
}
// 点击树目录，表格实时显示数据接口
export function getTreeNode(data) {
  return request({
    url: "/rabbit/report/template/find/page",
    data,
  });
}

