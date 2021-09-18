import { request } from "@/utils";

// 查找
export function selectFormList(data) {
  return request({
    url: "/rabbit/workflow/form/find/page",
    method: "post",
    data: data,
  });
}
// 新增
export function addFormData(data) {
  return request({
    url: "/rabbit/workflow/form/create",
    method: "post",
    data: data,
  });
}
// 删除
export function delectFormData(data) {
  return request({
    url: "/rabbit/workflow/form/delete",
    method: "post",
    data: data,
  });
}
// 修改
export function updateFormData(data) {
  return request({
    url: "/rabbit/workflow/form/update",
    method: "post",
    data: data,
  });
}
export function getTheirTable(data) {
  return request({
    url: "/rabbit/system/table/find/all",
    method: "post",
    data: data,
  });
}

export const getForm = data => request({
  url: "/rabbit/workflow/form/get",
  data,
});
