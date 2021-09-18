const logo = require("@assets/images/logo.png").default;
const sidebarBackgroundImg = require("@assets/images/sidebar-bottm-bg@2x.png").default;
const wsUrl = require("@/api/ws").default;

module.exports = {
  // sidebar title
  title: 'Rabbit Framework',
  // document title
  documentTitle: "Rabbit Framework",
  // 是否系统布局配置
  showSettings: false,
  // 是否显示 tagsView
  tagsView: true,
  // 是否固定头部
  fixedHeader: false,
  // 是否显示logo
  sidebarLogo: true,
  // sidebar logo图片
  logo,
  // 是否显示侧边栏底部背景图片
  showSidebarBackgroundImg: false,
  // 设置侧边栏底部背景图片
  sidebarBackgroundImg,
  // 是否显示消息
  showMessage: true,
  // 显示全屏功能按钮
  showScreenFull: false,
  // 是否显示头部
  showHeader: true,
  // 是否显示side Header
  showSidebarHeader: true,
  // 是否显示个人中心
  showUserCenter: true,
  // ws url地址
  wsUrl,
  // 路由白名单
  whiteList: ['/login', '/auth-redirect', '/401', '/404'],
  // 是否需要token 认证
  isAuthorization: true,
  // 是否显示二级菜单图标
  subMenuIcon: false,
  // 是否显示记住密码
  rememberMe: false,
  // 是否开启钉钉登录
  isNailingLogin: true,
  //  初始化默认路由 用于内嵌云平台
  initRoute: '/index',
};
