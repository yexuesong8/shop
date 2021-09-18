import { request } from "@/utils";

// 查询公告列表
export function pageFind(data) {
  return request({
    url: "/rabbit/system/notice/find/page",
    method: "post",
    data: data,
  });
}
// 新增公告
export function createNotice(data) {
  return request({
    url: "/rabbit/system/notice/create",
    method: "post",
    data: data,
  });
}

// 更新公告
export const updateNotice = (data) => request({
  url: "/rabbit/system/notice/update",
  data,
});

// 删除公告
export const deleteNotice = data => request({
  url: '/rabbit/system/notice/delete',
  data,
});

// 当前登录人相关公告
export const memberFind = data => request({
  url: '/rabbit/system/notice/member/find',
  data,
});

export const isAllow = data => request({
  url: '/rabbit/system/table/allow/rule/has/all',
  data,
});
