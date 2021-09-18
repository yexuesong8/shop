
/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
declare function objectMerge(target: object, source: object): object;


/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
declare function deepClone(source: object): object;


/**
 * @param {Array} arr
 * @returns {Array}
 */
declare function uniqueArr(arr: any[]): any[];

declare function menuTreeFormatter(data: any[], key: string, sortKey?: string): any[];

declare function roleMenuTreeFormatter(data: any[], key?: string): any[];

declare function menuTreeFormatter2(data: any[]): any[];


/**
 * getDictValue 将字典选项code转化为字典值
 * @param dictionary 字典数据
 * @param dict 字典code
 * @param option 选项code
 */
declare function getDictValue(dictionary: object, dict: string, option: any[]): any[];


/**
 * dictFormatter 字典转化
 * @param dict 字典code
 * @param option 选项code
 * @returns {any}
 */
declare function dictFormatter(dict: string, option: string): string;


// 重置form表单
declare function resetForm(name: string): void;


declare function dataFormatter(options: object): object;


/**
 * firstUpperCase 字符串首字母大写
 * @returns {string}
 */
declare function firstUpperCase(value: string): string;


/**
 * getCheckedValue
 * @param value 数据
 * @param key 取值
 */
declare function getCheckedValue(value: any, key: string): any;

/** getDictionaryValues
 * @param dictionaryCode 字典code
 * @return {Array}
 */
declare function getDictionaryValues(dictionaryCode: string): any[];

declare function getImgSrc(id: string): string;

/**
 * fieldsFilter 字段过滤
 * @param {Object} data 传给后端的数据
 * @param {Array} fields 需要的字段
 */
export declare function fieldsFilter(data: object, fields: string[]): object;
export declare function hasPermission(code: string): boolean;
export declare function setDocumentTitle(title: string): void;

/**
 * openReport 打开报表
 * @param {Object} opts 报表code
 */
declare function openReport(opts: object): object;

/**
 * openBill 打开单据
 * @param {Object} opts 报表code和单据id
 */
declare function openBill(opts: object): object;

export {
  getCheckedValue,
  firstUpperCase,
  dataFormatter,
  resetForm,
  dictFormatter,
  getDictValue,
  uniqueArr,
  menuTreeFormatter,
  roleMenuTreeFormatter,
  menuTreeFormatter2,
  deepClone,
  objectMerge,
  getImgSrc,
  getDictionaryValues,
  openReport,
  openBill
};

export { default as requestNoToken } from "./requestNoToken";
export { default as request } from "./request";
export { default as rabbitRequest } from "./rabbit-request";
export { default as mockRequest } from "./mockRequest";
export { EventBus } from "./event-bus";
export { $request, api, Request } from "./api";
export { pageComponent } from "./page-component";
export { pageEditor } from "./page-editor";
export { Map } from "../components/Map/index";
