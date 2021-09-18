import { store } from '@/entry/lib';
import { isArray, isObject, quickSortByKey, isEmptyObject } from '@monkey.do/monkey';

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

export const menuTreeFormatter = (data, key = "action", sortKey) => {
  const formatterData = data.map(item => {
    const action = item[key] || {};
    const childList = item.childList;

    let children = [];

    if (childList && childList.length > 0) {
      children = menuTreeFormatter(quickSortByKey(childList, sortKey), key, sortKey);
    }

    const child = children.length > 0 ? { children } : {};
    return { ...action, label: action.name || "", ...child };
  });

  if (sortKey) {
    return quickSortByKey(formatterData, sortKey);
  }
  return formatterData;
};
export const menuTreeFormatter2 = (data, sortKey) => {
  const formatterData = data.map(item => {
    const action = item || {};
    const childList = item.childList;

    let children = [];

    if (childList && childList.length > 0) {
      children = menuTreeFormatter2(quickSortByKey(childList, sortKey), sortKey);
    }

    const child = children.length > 0 ? { children } : {};
    return { ...action, label: action.name || "", ...child };
  });

  if (sortKey) {
    return quickSortByKey(formatterData, sortKey);
  }
  return formatterData;
};

export const roleMenuTreeFormatter = (data, key = "menu") => {
  return data.map(item => {
    const menu = item[key] || {};

    let buttonList = [];
    if (menu.buttonList && menu.buttonList.length > 0) {
      buttonList = menu.buttonList.map(m => {
        m.isButton = true;
        m.label = m.name;
        m.childList = [];
        m[key] = { ...m, childList: [], label: m.name };
        return m;
      });
    }

    let uriList = [];
    if (menu.uriList && menu.uriList.length > 0) {
      uriList = menu.uriList.map(m => {
        m.isUri = true;
        m.label = m.name;
        m[key] = { ...m, childList: [], label: m.name };
        m.childList = [];
        return m;
      });
    }

    // 创建button下拉节点
    const button = {
      menu: {
        id: `${menu.id}-buttons`,
        name: "按钮",
        label: "按钮",
        isCustomerNode: true,
      },
      childList: buttonList,
    };

    // 创建uri下拉节点
    const uri = {
      menu: {
        id: `${menu.id}-uris`,
        name: "接口",
        label: "接口",
        isCustomerNode: true,
      },
      childList: uriList,
    };

    let childList = item.childList || [];
    let children = [];

    if (buttonList.length > 0) childList = childList.concat(button);
    if (uriList.length > 0) childList = childList.concat(uri);

    if (childList && childList.length > 0) {
      children = roleMenuTreeFormatter(childList, key);
    }

    return { ...menu, label: menu.name || "", childList: children };
  });
};

export const roleMenuTreeFormatter2 = (data) => {
  return data.map(item => {
    const menu = item || {};

    let buttonList = [];
    if (menu.buttonList && menu.buttonList.length > 0) {
      buttonList = menu.buttonList.map(m => {
        m.isButton = true;
        m.label = m.name;
        m.childList = [];
        m = { ...m, childList: [], label: m.name };
        return m;
      });
    }

    let uriList = [];
    if (menu.uriList && menu.uriList.length > 0) {
      uriList = menu.uriList.map(m => {
        m.isUri = true;
        m.label = m.name;
        m = { ...m, childList: [], label: m.name };
        m.childList = [];
        return m;
      });
    }

    // 创建button下拉节点
    const button = {
      menu: {
        id: `${menu.id}-buttons`,
        name: "按钮",
        label: "按钮",
        isCustomerNode: true,
      },
      childList: buttonList,
    };

    // 创建uri下拉节点
    const uri = {
      menu: {
        id: `${menu.id}-uris`,
        name: "接口",
        label: "接口",
        isCustomerNode: true,
      },
      childList: uriList,
    };

    let childList = item.childList || [];
    let children = [];

    if (buttonList.length > 0) childList = childList.concat(button);
    if (uriList.length > 0) childList = childList.concat(uri);

    if (childList && childList.length > 0) {
      children = roleMenuTreeFormatter2(childList);
    }

    return { ...menu, label: menu.name || "", childList: children };
  });
};

/**
 * getDictValue 将字典选项code转化为字典值
 * @param dictionary 字典数据
 * @param dict 字典code
 * @param option 选项code
 */
export function getDictValue(dictionary, dict, option) {
  if (dictionary && (dict || dict === 0) && (option || option === 0)) {
    const options = dictionary[dict];
    if (options && options.length > 0) {
      const value = options.filter((item) => String(item.content) === String(option));
      if (value[0] && value[0]["name"]) {
        return value[0]["name"];
      }
      return "";
    }
    return "";
  }
  return "";
}

/**
 * dictFormatter 字典转化
 * @param dict 字典code
 * @param option 选项code
 * @returns {string}
 */
export function dictFormatter(dict, option) {
  const { state: { global: { dictionaryOption = {}}}} = store;
  return getDictValue(dictionaryOption, dict, option);
}

/** getDictionaryValues
 * @param dictionaryCode 字典code
 */
export function getDictionaryValues(dictionaryCode) {
  const { state: { global: { dictionaryOption = {}}}} = store;
  if (dictionaryOption && dictionaryCode) return dictionaryOption[dictionaryCode] || [];
  return [];
}

// 重置form表单
export function resetForm(name) {
  if (this.$refs && this.$refs[name]) {
    this.$refs[name].resetFields();
  }
}

/**
 * dataFormatter 数据格式化
 * @param timeType
 * @param beginTime
 * @param endTime
 * @param rangeQueryList
 * @param sortFieldList
 * @param idList
 * @param planId
 * @param other
 * @returns {{sortFieldList: *, timeType: *, model: *, idList: *, beginTime: *, endTime: *, rangeQueryList: *}}
 */
export function dataFormatter({ timeType, beginTime, endTime, rangeQueryList, planId, sortFieldList, idList, ...other }) {
  return {
    idList,
    timeType,
    sortFieldList,
    beginTime,
    endTime,
    rangeQueryList,
    planId,
    model: other,
  };
}

/**
 * firstUpperCase 字符串首字母大写
 * @returns {string}
 */
export function firstUpperCase([first, ...rest]) {
  return first.toUpperCase() + rest.join("");
}

/**
 * getCheckedValue
 * @param value 数据
 * @param key 取值
 */
export function getCheckedValue(value, key) {
  let checkedValue = [];

  if (value) checkedValue = [value];

  if (isArray(value)) {
    // 数组里是对象
    if (value && value.length > 0 && isObject(value[0])) {
      checkedValue = value.map(item => item[key]);
    } else {
      checkedValue = value;
    }
  }

  if (isObject(value) && value[key]) {
    checkedValue = [value[key]];
  }

  return checkedValue;
}

export const getImgSrc = (id) => {
  if (id) {
    return `/api/v1/rabbit/file/get/image/${id}`;
  }
  console.error('获取图片路径：请传入有效的图片id');
};

/**
 * fieldsFilter 字段过滤
 * @param {Object} data 传给后端的数据
 * @param {Array} fields 需要的字段
 */
export const fieldsFilter = (data, fields) => {
  if (isEmptyObject(data)) return {};
  const newData = {};
  fields.forEach(field => {
    newData[field] = data[field];
  });
  return newData;
};

/**
 * 判断是不是vue 组件
 * @param options
 * @returns {boolean}
 */
export const isVue = (options) => {
  if (!options) return false;
  return typeof options.template === "string" || typeof options.render === "function";
};

/**
 * 根据code判断是否有权限
 * @param {string} code
 * @return {boolean}
 */
export const hasPermission = (code) => {
  const buttons = store.state.global.authButtons;
  return !!buttons[code];
};

/**
 * 设置document title
 * @param title
 */
export const setDocumentTitle = (title) => {
  if (title) document.title = title;
};
/**
 * 格式化字符串true和false,或返回本身
 * @param data
 */
export const toBoolean = (val) => {
  if (val) {
    if (val === "true") {
      val = true;
    } else if (val === "false") {
      val = false;
    }
    return val;
  }
};
export function startDatePicker(str, prop) {
  const that = this;
  return {
    disabledDate(time) {
      if (that[str][prop]) {
        //  - 1 * 24 * 3600 * 1000 * 365 * 3
        return new Date(that[str][prop]).getTime() < time.getTime();
      }
    },
  };
}
export function endDatePicker(str, prop) {
  const that = this;
  return {
    disabledDate(time) {
      if (that[str][prop]) {
        return new Date(that[str][prop]).getTime() > time.getTime();
      }
    },
  };
}

export { default as requestNoToken } from "./requestNoToken";
export { default as request } from "./request";
export { default as rabbitRequest } from "./rabbit-request";
export { default as mockRequest } from "./mockRequest";
export { default as EventBus } from "./event-bus";
export { default as $request, api, Request, $mockRequest } from "./api";
export { openReport, openBill } from "./report";
export { default as pageComponent } from "./page-component";
export { default as pageEditor } from "./page-editor";
export { default as Map } from "../components/Map/index.js";
