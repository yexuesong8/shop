import beautifier from "js-beautify";
import {
  beautifierConf,
  codeType as codeTypeConfig,
  exportEnd,
  exportStart,
  formConfig,
  styleEnd,
  styleStart,
} from "@/views/page/design/utils/config";
import { handleArrayRepeat, handleStringFunction } from "@/views/page/design/utils";

class PageEditor {
  write(pageCodeModel, codeType) {
    return this.pageCodeGenerator(pageCodeModel, codeType);
  }
  // template
  /**
   * 生成组件代码
   * @param pageCodeModel
   * @param codeType 模式 design 设计 execute 执行
   * @returns {string}
   */
  pageCodeGenerator(pageCodeModel, codeType) {
    const htmlList = [];
    // const hideList = [];
    /* list: 显示组件集合 hide: 隐藏组件 (数据源) */
    const { list = [], style } = pageCodeModel;
    // 显示组件
    list.forEach(item => {
      if (item.code === "pg-container" || item.code === "pg-dialog") {
        htmlList.push(this.handleContainerString(item, codeType));
      } else if (item.code === "pg-form") {
        htmlList.push(this.handleFormString(item, codeType));
      } else if (item.code === "pg-row") {
        htmlList.push(this.handleRowString(item, codeType));
      } else {
        htmlList.push(this.componentCodeGenerator(item, codeType));
      }
    });
    // 隐藏组件
    // hide.forEach(item => {
    //   const str = this.componentCodeGenerator(item, codeType);
    //   hideList.push(str);
    // });
    const htmlStr = htmlList.join('\n');
    const htmlString = `<template><div class="page">${htmlStr}</div></template>`;
    const scriptString = `<script>${this.makeUpJs(pageCodeModel, codeType)}</script>`;
    // const scriptString = `<script>${exportStart}${stringObj.script}${exportEnd}</script>`;
    const styleString = `<style>${styleStart}${style}${styleEnd}</style>`;
    return beautifier.html(htmlString + scriptString + styleString, beautifierConf.html);
  }
  /**
   * 生成组件代码
   * @param componentCodeModel 组件data
   * @param codeType 模式 design 设计 execute 执行
   * @param componentType
   * @returns {string}
   */
  componentCodeGenerator(componentCodeModel, codeType, componentType) {
    const { code, did, id, children = [] } = componentCodeModel;
    // 属性
    let propertiesString = this.propertyCodeGenerator(componentCodeModel, componentType);
    let childrenString = "";
    if (children.length) {
      childrenString = children.reduce((childStr, childValue) => {
        return childStr + this.componentCodeGenerator(childValue, codeType, componentType);
      }, "").trim();
    }
    if (codeType === codeTypeConfig.design) {
      propertiesString += ` did="${did}" cid="${id}"`;
    }
    return `<${code} ${propertiesString}>\n${childrenString}\n</${code}>`;
  }
  /**
   * 属性生成
   * @param componentCodeModel
   * @param componentType // 判断form容器组件过来的
   **/
  propertyCodeGenerator(componentCodeModel, componentType) {
    const { props, property } = componentCodeModel;
    const propsData = this.handleProperties(property, props);
    return propsData.reduce((totalString, currentValue) => {
      const { key, value, type } = currentValue;
      // propType 1普通 2绑定 3事件 4指令
      if (type === "3") {
        return totalString + ` @${key}='${value}'`;
      }
      if (type === "4") {
        let valueMix = value;
        if (componentType === "form") {
          valueMix = formConfig.formModel + '.' + value;
        }
        return totalString + ` v-${key}='${valueMix}'`;
      }
      if (type === "2") {
        return totalString + ` :${key}='${value}'`;
      }
      return totalString + ` ${key}='${value}'`;
    }, "").trim();
  }
  // 处理属性数据格式
  handleProperties(data = [], options) {
    const properties = [];
    data.forEach(items => {
      items.properties.forEach(item => {
        const obj = {
          key: item.code,
          value: item.defaultValue,
          type: item.propType,
        };
        properties.push(obj);
      });
    });
    const attrList = handleArrayRepeat([...properties], "key");
    attrList.forEach(item => {
      Object.keys(options).forEach(items => {
        if (item.key === items) {
          item["value"] = options[items];
        }
      });
    });
    return attrList;
  }
  // 处理form组件循环
  handleFormString(componentCodeModel, codeType) {
    let strings = "";
    const { id, did, props, code, children = [] } = componentCodeModel;
    children.forEach((item) => {
      if (item.code === "pg-row" && item.children) {
        strings += this.handleRowString(item, codeType, "form");
      } else if (item.code === "pg-form") {
        strings += this.handleFormString(item, codeType, "form");
      } else if (item.code === "pg-container" || item.code === "pg-dialog") {
        strings += this.handleContainerString(item, codeType, "form");
      } else {
        const { props: { model }} = item;
        const prop = model ? `prop="${model}"` : "";
        strings += `<el-form-item ${prop}>${this.componentCodeGenerator(item, codeType, "form")}</el-form-item>`;
      }
    });
    let propsString = `ref="form" :form="form" :model="form" :rules="rules"`;
    Object.keys(props).forEach(item => {
      if (item === "form" || item === "rules" || item === "model" || item === "ref") {
        propsString += "";
      } else {
        propsString += ` ${item}='${props[item]}'`;
      }
    });
    let str = `<${code} ${propsString}>${strings}</${code}>`;
    if (codeType === codeTypeConfig.design) {
      str = `<${code} ${propsString} cid="${id}" did="${did}">${strings}</${code}>`;
    }
    return str;
  }
  // 处理container组件循环 type: form组件需要包裹一层form-item
  handleContainerString(componentCodeModel, codeType, type) {
    let strings = "";
    const { id, did, code, children = [] } = componentCodeModel;
    children.forEach((item) => {
      if (item.code === "pg-row" && item.children) {
        strings += this.handleRowString(item, codeType, type);
      } else if (item.code === "pg-form") {
        strings += this.handleFormString(item, codeType);
      } else if (item.code === "pg-container" || item.code === "pg-dialog") {
        strings += this.handleContainerString(item, codeType, type);
      } else {
        if (type === "form") {
          const { props: { model }} = item;
          const prop = model ? `prop="${model}"` : "";
          strings += `<el-form-item ${prop}>${this.componentCodeGenerator(item, codeType, type)}</el-form-item>`;
        } else {
          strings += this.componentCodeGenerator(item, codeType);
        }
      }
    });
    const propsString = this.propertyCodeGenerator(componentCodeModel);
    let str = `<${code} ${propsString}>${strings}</${code}>`;
    if (codeType === codeTypeConfig.design) {
      str = `<${code} ${propsString} cid="${id}" did="${did}">${strings}</${code}>`;
    }
    return str;
  }
  // 处理row组件循环 type: form组件需要包裹一层form-item
  handleRowString(componentCodeModel, codeType, type) {
    let strings = "";
    const { props: { column, gutter }, id, did, children = [] } = componentCodeModel;
    children.forEach((item, index) => {
      const childString = item.children.map(el => {
        let str = '';
        if (el.code === "pg-form" && el.children) {
          str += this.handleFormString(el, codeType);
        } else if (el.code === "pg-row") {
          str += this.handleRowString(el, codeType, type);
        } else if (el.code === "pg-container" || el.code === "pg-dialog") {
          str += this.handleContainerString(el, codeType, type);
        } else {
          if (type === "form") {
            const { props: { model }} = el;
            const prop = model ? `prop="${model}"` : "";
            str += `<el-form-item ${prop}>${this.componentCodeGenerator(el, codeType, type)}</el-form-item>`;
          } else {
            str += this.componentCodeGenerator(el, codeType);
          }
        }
        return str;
      }).join('\n');
      const span = Number(column ? column.split(':')[index] : '');
      strings += `<el-col :span="${span}">${childString}</el-col>`;
    });
    const gutterString = gutter ? `:gutter="${gutter}"` : "";
    const columnString = column ? `column="${column}"` : "";
    let str = `${gutterString}`;
    if (codeType === codeTypeConfig.design) {
      str += `${columnString} cid="${id}" did="${did}"`;
    }
    return `<el-row ${str}>${strings}</el-row>`;
  }
  // js
  makeUpJs(pageCodeModel, codeType) {
    const dataList = {
      form: [],
      data: [],
    };
    const rulesList = {};
    const methodsList = [];
    Object.keys(pageCodeModel.events).forEach(item => {
      methodsList.push(`${pageCodeModel.events[item].toString()},`);
    });
    pageCodeModel.list.forEach(componentCodeModel => {
      this.buildData(componentCodeModel, dataList);
      this.buildRules(componentCodeModel, rulesList);
      this.buildMethods(componentCodeModel, methodsList);
    });
    return this.buildExport(formConfig, codeType, dataList, rulesList, methodsList);
  }
  buildRules(element, rulesList) {
    const { code, children, props } = element;
    if ((code === "pg-form" || code === "pg-container" || code === "pg-dialog") && children) {
      children.forEach(item => {
        this.buildRules(item, rulesList);
      });
    }
    if (code === "pg-row" && children) {
      children.forEach(item => {
        item.children.map(itemChild => { this.buildRules(itemChild, rulesList); });
      });
    }
    if (props) {
      if (!props.model) return;
      const { required, title, model } = props;
      if (required === "true") {
        rulesList[model] = [{ required: true, message: `${title}不能为空`, trigger: "change" }];
      }
    }
  }
  buildData(element, dataList, componentType) {
    const { code, children, props } = element;
    if ((code === "pg-form") && children) {
      children.forEach(item => {
        this.buildData(item, dataList, "form");
      });
    }
    if ((code === "pg-container" || code === "pg-dialog") && children) {
      children.forEach(item => {
        this.buildData(item, dataList, componentType);
      });
    }
    if (code === "pg-dialog" && props) {
      dataList["data"].push(`${props.visible}: false,`);
    }
    if (code === "pg-row" && children) {
      children.forEach(item => {
        item.children.map(itemChild => { this.buildData(itemChild, dataList, componentType); });
      });
    }
    if (props) {
      if (!props.model || code === "pg-form") return;
      let defaultValue;
      const { value, model } = props;
      if (typeof (value) === 'string') {
        defaultValue = `'${value}'`;
      } else {
        defaultValue = `${JSON.stringify(value)}`;
      }
      if (componentType === "form") {
        dataList["form"].push(`${model}: ${defaultValue},`);
      } else {
        dataList["data"].push(`${model}: ${defaultValue},`);
      }
    }
  }
  buildMethods(element, methodsList) {
    const { code, props } = element;
    if (code === "pg-page") {
      if (props && props["page-table"]) { // 表格列配置
        const pageTable = handleStringFunction(props["page-table"]);
        if (pageTable.events) {
          Object.keys(pageTable.events).forEach(item => {
            if (!methodsList.join("").includes(pageTable.events[item])) methodsList.push(`${pageTable.events[item]}(value) { console.log(value); },`);
          });
        }
      }
    }
    if (code === "pg-dialog") {
      const { confirm, cancel } = props;
      if (!methodsList.join("").includes(confirm)) methodsList.push(`${confirm}(element) { console.log(element); element.resetFields(); this.dialogVisible = false; },`);
      if (!methodsList.join("").includes(cancel)) methodsList.push(`${cancel}(element) { console.log(element); element.resetFields(); this.dialogVisible = false; },`);
    }
    if (code === "pg-button") {
      const { click } = props;
      if (!methodsList.join("").includes(click)) methodsList.push(`${click}() { console.log("click");},`);
    }
  }
  buildExport(formConfig, codeType, dataList, rulesList, methodsList) {
    return `${exportStart}
      export default {
      provide() {
       return { 
         that: this
       };
      },
      data () {
        return {
          form: {
           ${dataList.form.join("\n")}
          },
          ${dataList.data.join("\n")}
          ${formConfig.formRules}: ${JSON.stringify(rulesList)},
        }
      },
      computed: {},
      watch: {},
      created () {},
      mounted () {},
      methods: {
        ${methodsList.join("\n")}
      },
   }
    ${exportEnd}`;
  }
}

export default new PageEditor();
