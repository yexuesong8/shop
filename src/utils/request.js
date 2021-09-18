import { Message } from '@monkey.do/element-ui';
import { store, router } from '@/entry/lib';
import { request } from "@monkey.do/monkey";

const service = options => request({
  baseURL: `/api/v1`,
  timeout: 10000,
  ...options,
}).then(res => {
  const code = res.statusCode;
  if (code === 604 || code === 601) {
    localStorage.setItem("isFirstLogin", false);
    Message.closeAll();
    Message.error("登录状态过期,请重新登录");
    store.dispatch("AfterLogout").then(() => {
      router.push("/login");
    });
  } else if (code !== 600) {
    Message.closeAll();
    Message.error({ message: res.message, duration: 2000 });
  }
  return res;
}).catch(err => {
  console.log(err);
  return {
    statusCode: 500,
    message: "请求错误",
    data: "",
  };
});

export default service;
