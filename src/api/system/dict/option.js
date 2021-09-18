import { request } from "@/utils";

// 查询选项类型列表
export function listOption(data) {
  return request({
    url: '/rabbit/data/option/find/page',
    method: 'post',
    data: data,
  });
}

// 选项详情分页
export function pageDict(data) {
  return request({
    url: '/rabbit/data/option/find/all',
    method: 'post',
    data: data,
  });
}

// 通过id查询选项
export function getOption(data) {
  return request({
    url: '/rabbit/data/option/get',
    method: 'post',
    data: data,
  });
}

// 新增选项
export function addOption(data) {
  return request({
    url: '/rabbit/data/option/create',
    method: 'post',
    data: data,
  });
}
// 新增选项
export function addOptionList(data) {
  return request({
    url: '/rabbit/data/option/create/batch',
    method: 'post',
    data: data,
  });
}
// 修改选项
export function updateOption(data) {
  return request({
    url: '/rabbit/data/option/update',
    method: 'post',
    data: data,
  });
}

// 删除字典
export function delOption(data) {
  return request({
    url: '/rabbit/data/option/delete',
    method: 'post',
    data: data,
  });
}
export default {
  name: "rabbit.system.option",
  api: {
    listOption: "/rabbit/data/option/find/page",
    pageDict: "/rabbit/data/option/find/all",
    getOption: "/rabbit/data/option/get",
    addOption: "/rabbit/data/option/create",
    addOptionList: "/rabbit/data/option/create/batch",
    updateOption: "/rabbit/data/option/update",
    delOption: "/rabbit/data/option/delete",
  },
};
