import { Message } from '@monkey.do/element-ui';
// import { router, store } from "@/entry";
import { request } from "@monkey.do/monkey";

const service = options => request({
  baseURL: `/api/v1/rabbit`,
  timeout: 10000,
  ...options,
}).then(res => {
  const code = res.statusCode;
  if (code === 604 || code === 601) {
    localStorage.setItem("isFirstLogin", false);
    Message.closeAll();
    Message.error("登录状态过期,请重新登录");
    // store.dispatch("AfterLogout").then(() => {
    //   router.push("/login");
    // });
  } else if (code !== 600) {
    Message.error(res.message); // todo 异常处理
  }
  return res;
}).catch(err => console.log(err));

export default service;
