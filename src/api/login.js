import { request, requestNoToken } from "@/utils";
import qs from 'qs';

// 登录方法
export function login(data) {
  return requestNoToken({
    url: '/rabbit/login',
    data,
  });
}

// 获取用户详细信息
export const getInfo = () => request({
  url: '/rabbit/system/member/get/current',
});

// 退出方法
export const logout = () => request({ url: '/rabbit/logout' });

// 获取验证码
export function getCodeImg() {
  return requestNoToken({
    url: '/rabbit/captcha/get',
    method: 'get',
  });
}

// 钉钉第三方登录 获取appid
export const getAppid = () => requestNoToken({
  url: '/rabbit/auth/dingding/info/get',
  method: 'post',
});

// 钉钉第三方登录
export const ddLogin = (data) => requestNoToken({
  url: '/rabbit/auth/dingding/login',
  data: qs.stringify(data),
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});
