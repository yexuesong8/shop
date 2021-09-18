export default {
  name: "rabbit.system.user",
  api: {
    // 修改用户
    update: "/rabbit/system/member/base/update",
    // 删除用户
    del: "/rabbit/system/member/delete",
    // 用户密码重置
    resetPass: "/rabbit/system/member/password/reset",
    // 用户状态修改
    changeUserStatus: "/rabbit/system/user/changeStatus",
    // 人员验证
    userValidate: "/rabbit/system/member/valid/verify",
    // 创建账户
    createAccount: "/rabbit/system/member/account/set",
    // 创建账户
    fuzzySearchMember: "/rabbit/system/member/find/vague",
    // 同步钉钉
    matchDingDing: "/rabbit/system/member/match/dingding",
  },
};
