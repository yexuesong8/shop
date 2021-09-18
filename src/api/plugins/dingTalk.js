import { request } from "@/utils";

export function get() {
  return request({
    url: '/rabbit/plugin/configure/select/all',
    method: 'post',
  });
}

export function save(payLoad) {
  return request({
    url: '/rabbit/plugin/configure/save',
    method: 'post',
    data: payLoad,
  });
}
export function pull() {
  return request({
    url: '/rabbit/dingding/plugin/pull',
    method: 'post',
  });
}
export function push() {
  return request({
    url: '/rabbit/dingding/plugin/push',
    method: 'post',
  });
}
export function getStatus() {
  return request({
    url: '/rabbit/plugin/logs/get',
    method: 'post',
  });
}
