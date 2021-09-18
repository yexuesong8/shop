import { request } from "@/utils";

export const fetch = (data, params) => request({
  url: "/rabbit/system/table/allow/rule/assignment/list",
  data: {},
  params,
});

export const save = (data, params) => request({
  url: "/rabbit/system/table/allow/rule/assignment/save",
  data,
  params,
});

export const getByRoleId = (data, params) => request({
  url: "/rabbit/system/table/allow/rule/assignment/already/list",
  data,
  params,
});
