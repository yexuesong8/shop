import { request } from "@/utils";

// 获取列表
export const get = (data) => request({
  url: "/rabbit/system/message/get",
  data,
});

// 获取列表-分页
export const getByPage = (data) => request({
  url: "/rabbit/system/message/find/page",
  data,
});

// 创建
export const add = (data) => request({
  url: "/rabbit/system/message/create",
  data,
});

// 更新
export const update = (data) => request({
  url: "/rabbit/system/message/update",
  data,
});

// 删除
export const del = (id) => request({
  url: "/rabbit/system/message/delete",
  data: { id },
});

// 获取未确认
export const getUnreadMsg = () => request({
  url: "/rabbit/system/message/get/un/confirm",
});

// 获取新消息
export const getNewMsg = () => request({
  url: "/rabbit/system/message/get/new",
  timeout: 60000,
});

export const batchDel = (data) => request({
  url: "/rabbit/system/message/delete/batch",
  data,
});

export const readMsg = (data) => request({
  url: "/rabbit/system/message/confirm/batch",
  data,
});

// 发送消息
export const send = (data) => request({
  url: "/rabbit/system/message/send",
  data,
});
