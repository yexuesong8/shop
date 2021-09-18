import { request } from "@/utils";

export const fetch = (data, params) => request({
  url: "/rabbit/system/field/allow/rule/assignment/list",
  data: {},
  params,
});

export const save = (data, params) => request({
  url: "/rabbit/system/field/allow/rule/assignment/save",
  data,
  params,
});
