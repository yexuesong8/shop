import { Message } from '@monkey.do/element-ui';
import { requestNoToken } from "@monkey.do/monkey";

const service = options => requestNoToken({
  baseURL: "/api/v1",
  timeout: 10000,
  ...options,
}).then(res => {
  if (res["statusCode"] !== 600) Message.error(res["message"]);
  return res;
}).catch(err => console.log(err));

export default service;
