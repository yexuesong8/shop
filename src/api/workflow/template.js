import { request } from "@/utils";

export const fetch = (data) => request({
  url: "/rabbit/workflow/template/find/page",
  data,
});

export const del = (data) => request({
  url: "/rabbit/workflow/template/delete",
  data,
});

export const get = (data) => request({
  url: "/rabbit/workflow/template/get",
  data,
});

export const save = (data) => request({
  url: "/rabbit/workflow/template/save",
  data,
});

export const enable = (data) => request({
  url: "/rabbit/workflow/template/enable",
  data,
});

export const copy = (data) => request({
  url: "/rabbit/workflow/template/copy",
  data,
});
