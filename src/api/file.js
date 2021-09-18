import request from "@/utils/rabbit-request";

export const fileUpload = data => {
  return request({
    url: "/file/upload",
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
