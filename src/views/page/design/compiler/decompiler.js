import {
  styleStart,
  styleEnd,
  exportStart,
  exportEnd,
  formConfig,
  templateEnd,
  templateStart,
} from "@/views/page/design/utils/config";
import { parseDom } from "@/views/page/design/utils/index";

class CodeDecompiler {
  constructor() {
    this.necessaryData = {};
    this.containerComponents = ["pg-container", "pg-dialog", "pg-form", "el-row", "el-col"];
  }
  compile(designCode, necessaryData) {
    if (necessaryData) this.necessaryData = necessaryData;
    return this.handleCodeBuildJson(designCode);
  }
  handleCodeBuildJson(designCode) {
    let page = { style: "", list: [], hide: [], events: {}};
    // 获取编辑的style
    page.style = designCode.substring(designCode.indexOf(styleStart) + (styleStart.length), (designCode.indexOf(styleEnd)));
    // 获取编辑的script
    const scriptString = designCode.substring(designCode.indexOf(exportStart) + (exportStart.length), (designCode.indexOf(exportEnd)));
    const newScript = new Function(scriptString.replace(/export default/, "return"))();
    const { methods } = newScript || { methods: {}};
    page = { ...page, events: methods };
    // 获取页面组件列表
    const htmlStr = designCode.substr(designCode.indexOf(templateStart) + templateStart.length, (designCode.indexOf(templateEnd) - templateEnd.length));
    const componentList = [];
    const domList = parseDom(htmlStr)[0];
    const dataList = this.getComponentList(domList, componentList);
    page = { ...page, list: this.handleJsonData(dataList) };
    return page;
  }
  // 解析源代码成JSON
  getComponentList(element, componentList) {
    const { componentNameList = [] } = this.necessaryData;
    if (element && !componentNameList.includes(element.localName) && element.children && element.children.length) {
      Object.keys(element.children).forEach(item => {
        this.getComponentList(element.children[item], componentList);
      });
    } else if (element && componentNameList.includes(element.localName)) {
      const { attributes = [] } = element;
      const attrs = {};
      if (attributes.length) {
        Object.keys(attributes).forEach(item => {
          let name = JSON.parse(JSON.stringify(attributes[item].name));
          if (name.indexOf(":") !== -1) {
            name = name.replace(/:/, "");
          }
          if (name.indexOf("@") !== -1) {
            name = name.replace(/@/, "");
          }
          if (name.indexOf("v-") !== -1) {
            name = name.replace(/v-/, "");
          }
          if (name.indexOf(".sync") !== -1) {
            name = name.replace(/.sync/, "");
          }
          if (attributes[item].value.indexOf(".") !== -1 && attributes[item].value.split(".")[0] === formConfig.formModel) {
            attrs[name] = attributes[item].value.split(".")[1];
          } else {
            attrs[name] = attributes[item].value;
          }
        });
      }
      const children = [];
      // containerComponents 排除非容器组件
      if (this.containerComponents.includes(element.localName) && element.children && element.children.length) {
        Object.keys(element.children).forEach(item => {
          this.getComponentList(element.children[item], children);
        });
      }
      const obj = { name: element.localName, attrs };
      if (this.containerComponents.includes(element.localName)) { // 排除非容器组件存在children
        obj["children"] = children;
      }
      componentList.push(obj);
    }
    return componentList;
  }
  handleJsonData(dataList) {
    const jsonList = [];
    dataList.forEach(item => {
      let obj = { code: item.name };
      const { componentPropertyData: { componentGroups = [], propertyGroups }} = this.necessaryData;
      componentGroups.forEach(cItem => {
        cItem.components.forEach(ccItem => {
          if (ccItem.id === item.attrs.cid) {
            obj = { ...obj, ...JSON.parse(JSON.stringify(ccItem)) };
          }
        });
      });
      const props = {};
      const property = propertyGroups && item.attrs.cid ? propertyGroups[item.attrs.cid] || [] : [];
      property.forEach(pyItem => {
        pyItem.properties.forEach(pycItem => {
          props[pycItem.code] = JSON.parse(JSON.stringify(pycItem.defaultValue));
        });
      });
      let childList = [];
      if (this.containerComponents.includes(item.name) && item.children && item.children.length !== 0) {
        childList = this.handleJsonData(item.children);
      }
      const itemObj = { ...obj, did: item.attrs.did, property, props: { ...props, ...item.attrs }};
      if (this.containerComponents.includes(item.name)) { // 排除非box存在children
        itemObj["children"] = childList;
      }
      delete itemObj.props["cid"];
      delete itemObj.props["did"];
      jsonList.push(itemObj);
    });
    return jsonList;
  }
}
export default new CodeDecompiler();
