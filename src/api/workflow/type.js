import { request } from "@/utils";

// 查找全部
// export const typeListData = (data) => request({
//   url: "/rabbit/workflow/type/find/all",
//   method: "post",
//   data: data
// })
// 查找
export function selectTypeList(data) {
  return request({
    url: "/rabbit/workflow/type/find/page",
    method: "post",
    data: data,
  });
}
// 新增
export function addTypeData(data) {
  return request({
    url: "/rabbit/workflow/type/create",
    method: "post",
    data: data,
  });
}
// 删除
export function delectTypeData(data) {
  return request({
    url: "/rabbit/workflow/type/delete",
    method: "post",
    data: data,
  });
}
// 修改
export function updateTypeData(data) {
  return request({
    url: "/rabbit/workflow/type/update",
    method: "post",
    data: data,
  });
}

export const get = (data) => request({
  url: "/rabbit/workflow/type/get",
  data: data,
});
