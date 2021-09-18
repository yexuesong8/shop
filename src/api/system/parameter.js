export default {
  name: "rabbit.system.parameter",
  api: {
    add: "/rabbit/system/property/create", // 添加参数
    update: "/rabbit/system/property/update", // 修改参数
    fetch: "/rabbit/system/property/find/all", // 全部参数
  },
};
