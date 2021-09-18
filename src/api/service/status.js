import { request } from "@/utils";

// 查询服务状态
export function getResource() {
  return request({
    url: '/rabbit/resource/state/get/resource/list',
    method: 'post',
  });
}
