import { request } from "@/utils";

// 查询字典数据列表
// export function listData(query) {
//   return request({
//     url: '/rabbit/system/dict/data/list',
//     method: 'get',
//     params: query,
//   });
// }
// 字典列表
export const fetch = (data) => request({
  url: "/rabbit/data/dictionary/find/page",
  data,
});

// 字典删除
export const del = (data) => request({
  url: "/rabbit/data/dictionary/delete",
  data,
});

// 字典详情
export const get = (data) => request({
  url: "/rabbit/data/option/get",
  data,
});

// 字典更新
export const update = (data) => request({
  url: "/rabbit/data/dictionary/update",
  data,
});

// 字典新增
export const add = (data) => request({
  url: "/rabbit/data/dictionary/create",
  data,
});

// 上级字典选项
export const getParentOption = (data) => request({
  url: "/rabbit/data/option/parentoption/find",
  data,
});

// 获取所有字典
export const getAllDictionary = (data) => request({
  url: "/rabbit/data/dictionary/find/all",
  data,
});

export default {
  name: "rabbit.system.data",
  api: {
    fetch: "/rabbit/data/dictionary/find/page",
    del: "/rabbit/data/dictionary/delete",
    get: "/rabbit/data/option/get",
    update: "/rabbit/data/dictionary/update",
    add: "/rabbit/data/dictionary/create",
    getParentOption: "/rabbit/data/option/parentoption/find",
    getAllDictionary: "/rabbit/data/dictionary/find/all",
    fetchAllDictionaryOption: "/rabbit/data/dictionary/option/all",
  },
};
