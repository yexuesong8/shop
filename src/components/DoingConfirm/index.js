import { MessageBox } from "@monkey.do/element-ui";
import { isObject, isString } from "@monkey.do/monkey";

export async function doingConfirm(options) {
  const defaultSetting = {
    closeOnClickModal: false,
    type: 'warning',
    confirmButtonText: "是",
    cancelButtonText: "否",
  };

  return new Promise((resolve, reject) => {
    if (isString(options)) {
      MessageBox.confirm(options || "是否确认本操作?", "提示", {
        ...defaultSetting,
        message: options,
      }).then(res => {
        resolve(res);
      }).catch(err => reject(err));
      return;
    }

    if (isObject(options)) {
      MessageBox.confirm(options.message || "是否确认本操作?", options.title || "提示", {
        ...defaultSetting,
        ...options,
      }).then(res => {
        resolve(res);
      }).catch(err => reject(err));
      return;
    }

    MessageBox.confirm("是否确认本操作?", "提示", {
      ...defaultSetting,
      ...options,
    }).then(res => {
      resolve(res);
    }).catch(err => reject(err));
  });
}
