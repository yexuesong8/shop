import request from "./request";

export default (options) => request({
  ...options,
  baseURL: "/mock/api/v1",
});
