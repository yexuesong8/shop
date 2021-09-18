import request from "@/utils/request";
import requestNoToken from "@/utils/requestNoToken";
import { getRabbitConsolePrefix } from "@/config";

class Api {
  constructor() {
    this.apis = {};
  }

  install(apis) {
    apis.forEach(item => {
      const reqDefault = item.default;
      if (reqDefault && reqDefault.name) {
        const apis = reqDefault.api || {};
        Object.keys(apis).forEach(apiKey => {
          if (this.apis[`${reqDefault.name}.${apiKey}`]) {
            console.error(`${getRabbitConsolePrefix("utils-api")}名称为${reqDefault.name}.${apiKey}的接口已经存在，请勿重复注册`);
            return;
          }
          this.apis[`${reqDefault.name}.${apiKey}`] = apis[apiKey];
        });
      }
    });
  }

  getApi(name) {
    return this.apis[name];
  }

  generator(baseApi) {
    function createApi(api) {
      return `${baseApi}${api}`;
    }

    return {
      create: createApi("/create"), // 新增
      createBatch: createApi("/create/batch"), // 批量新增
      get: createApi("/get"), // 获取详细信息
      update: createApi("/update"), // 更新
      delete: createApi("/delete"), // 删除
      deleteBatch: createApi("/delete/batch"), // 批量删除
      find: createApi("/find"), // 查找
      all: createApi("/find/all"), // 全部查找
      page: createApi("/find/page"), // 分页查找
      tree: createApi("/find/tree"), // 树形查找
      excelExport: createApi("/export/excel"), // excel导出
      excelImport: createApi("/import/excel"), // excel 导入
      excelTemplateDownload: createApi("/template/download/excel"), // excel 模板导出
      save: createApi("/save"), // 保存
      check: createApi("/check"), // 检测
      conditionAll: createApi("/find/condition/all"), // 条件查找全部
    };
  }
}

const api = new Api();

class RequestClass {
  constructor() {
    this.config = {
      baseURL: "/api/v1",
      methods: "post",
    };
  }

  setConfig(config) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  request(string, options, isMock) {
    const apiString = api.getApi(string);

    if (!apiString) {
      console.error(`${getRabbitConsolePrefix("utils-api")}未找到名称为${string}的api,请确认已在api中注册`);
      return;
    }

    const baseURL = isMock ? `/mock${this.config.baseURL}` : this.config.baseURL;

    if (string.includes("NoToken")) {
      return requestNoToken({
        url: apiString,
        ...this.config,
        baseURL,
        ...options,
      });
    }

    return request({
      url: apiString,
      ...this.config,
      baseURL,
      ...options,
    });
  }
}

const Request = new RequestClass();
const $mockRequest = (string, options) => Request.request(string, options, true);

export default (string, options) => Request.request(string, options);
export {
  api,
  Request,
  $mockRequest,
};
