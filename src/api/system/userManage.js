export default {
  name: "rabbit.system.userManage",
  api: {
    // 查询用户列表
    fetch: "/rabbit/system/member/find/page",
    // 查询单个用户信息
    getById: "/rabbit/system/member/get",
    // 新增用户
    add: "/rabbit/system/member/create",
    // 修改用户
    update: "/rabbit/system/member/update",
    // 删除用户
    del: "/rabbit/system/member/delete",
    // 重置密码
    resetPass: "/rabbit/system/member/password/reset",
    // 修改密码
    updatePass: "/rabbit/system/member/password/set",
    // 查找同部门成员
    getMember: "/rabbit/system/member/find/condition",
    getMemberTree: "/rabbit/system/member/dept/tree/find",
    // 树
    getTree: "/rabbit/system/department/find/tree",
    // 解锁
    unlock: "/rabbit/system/member/unlock",
    // 获取角色信息
    getByRole: "/rabbit/system/role/name/find/all",
  },
};
