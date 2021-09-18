import { request } from "@/utils";

// 获取登录人相关模板
export const findTemplate = () => request({
  url: '/rabbit/home/template/member/find',
});

// 获取对应组件信息
export const findComponent = id => request({
  url: '/rabbit/home/template/find/component',
  data: { id },
});

