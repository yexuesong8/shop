import { request } from "@/utils";

// export const fetch = (data, params) => request({
//   url: "/rabbit/system/table/allow/rule/assignment/list",
//   data: {},
//   params,
// });

// export const save = (data, params) => request({
//   url: "/rabbit/system/table/allow/rule/assignment/save",
//   data,
//   params,
// });

// export const getByRoleId = (data, params) => request({
//   url: "/rabbit/system/table/allow/rule/assignment/already/list",
//   data,
//   params,
// });
// 拿取所有数据
export const backList = (data, params) => request({
  url: "/rabbit/report/allow/rule/assignment/already/list",
  data,
  params,
});
export const distributable = (data) => request({
  url: "/rabbit/report/template/find/distributable",
  data,
});
  // 分页
export const tableList = (data) => request({
  url: "rabbit/report/allow/rule/find/page",
  data,
});
// 保存
export const save = (data, params) => request({
  url: "/rabbit/report/allow/rule/save",
  data,
  params,
});
