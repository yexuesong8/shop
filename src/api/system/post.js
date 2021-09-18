export default {
  name: "rabbit.system.post",
  api: {
    // 分配/角色
    allotRole: "/rabbit/system/job/role/allot",
    // 查找/已分配/角色
    findAllocatedRole: "/rabbit/system/job/allocated/role/find",
    findJob: "/rabbit/system/job/find/all",
    // 获取岗位类型
    fetchJobType: "/rabbit/system/job/type/find/page",
    // 删除岗位类型
    delJobType: "/rabbit/system/job/type/delete",
    // 新建岗位类型
    createJobType: "/rabbit/system/job/type/create",
    // 修改岗位类型
    updateJobType: "/rabbit/system/job/type/update",
    // 获取
    fetch: "/rabbit/system/job/type/all/find",
    fetchByPage: "/rabbit/api/system/job/find/page",
    // 获取当前
    getPost: "/rabbit/system/job/get",
    // 新增
    addjob: "/rabbit/system/job/create",
    // 岗位状态设置
    setPost: "/rabbit/system/job/status/set",
    // 修改岗位
    updatePost: "/rabbit/system/job/update",
    // 删除岗位
    delPost: "/rabbit/system/job/delete",
    // 批量删除
    delPostBatch: "/rabbit/system/job/delete/batch",
    // 岗位分页
    pagePost: "/rabbit/system/job/find/page",
    // 岗位状态修改
    update: "/rabbit/system/job/status/set",
  },
};
