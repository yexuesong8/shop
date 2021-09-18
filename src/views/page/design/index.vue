<template>
  <div class="main-content-container rb-page-design full-fill">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="页面设计" name="pageDesign">
        <div class="fm-container">
          <design-panel ref="panel" :widget-form.sync="widgetForm" :component-property-data="componentPropertyData" clearable />
        </div>
      </el-tab-pane>
      <el-tab-pane label="页面预览" name="pagePreview">
        <div v-if="activeName === 'pagePreview' && executeCode" class="template-component">
          <div class="template-component-wrapper">
            <page-render :has-main-container="false" :code="executeCode" />
          </div>
        </div>
        <div v-if="activeName === 'pagePreview' && !executeCode">暂无内容</div>
      </el-tab-pane>
      <el-tab-pane label="设计代码" name="designCode">
        <codemirror v-if="activeName === 'designCode'" :code="designCode" @change="handleDesignChange" />
      </el-tab-pane>
      <el-tab-pane label="执行代码" name="executeCode">
        <codemirror v-if="activeName === 'executeCode'" :code="executeCode" disabled />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DesignPanel from "@/views/page/design/panel/index";
import Codemirror from "@/views/page/design/codemirror/index";
import { PageRender } from "@/components";
import designCodeCompiler from "@/views/page/design/compiler/design";
import executeCodeCompiler from "@/views/page/design/compiler/execute";
import CodeDecompiler from "@/views/page/design/compiler/decompiler";
import { getTemplateInfo } from "@/api/page/template";
import { getPropertys } from "@/api/page/group";
import "@assets/styles/cover.scss"; // rabbit样式
import "@assets/styles/form.scss"; // rabbit样式
// 页面设计器 属性编辑器组件注册
import "@/views/page/design/editor/index.js";
// 页面设计器 组件注册
import "@/views/page/design/panel/components/index.js";

export default {
  provide() {
    return {
      catalogId: this.$route.query.catalogId,
      getTemplateInfo: () => this.templateInfo,
      componentNameList: () => this.componentNameList,
      componentPropertyData: () => this.componentPropertyData,
    };
  },
  components: {
    DesignPanel,
    Codemirror,
    PageRender,
  },
  data() {
    return {
      activeName: "pageDesign",
      widgetForm: {
        list: [],
        hide: [],
        events: {},
        style: "",
      },
      executeCode: "", // 执行代码
      designCode: "", // 设计代码
      componentPropertyData: {}, // 全部组件和属性数据
      templateInfo: {},
      componentNameList: [],
    };
  },
  mounted() {
    // 获取全部组件和属性 => 获取模板数据
    this.getComponentProperty();
  },
  methods: {
    handleTabClick(val) {
      this.$refs.panel.blurSelect();
      if (val.name === "designCode") {
        this.designCode = designCodeCompiler.build(this.widgetForm); // 设计码
      }
      if (val.name === "pagePreview" || val.name === "executeCode") {
        this.executeCode = executeCodeCompiler.build(this.widgetForm); // 执行码
        this.$nextTick(() => { // 设置预览页面容器高度 避免底部被遮挡
          const appMainHeight = document.querySelector(".app-main").offsetHeight;
          const headerHeight = document.querySelector(".el-tabs__header").offsetHeight;
          const height = appMainHeight - headerHeight - 15;
          const dom = document.querySelector(".template-component");
          if (dom) dom.style.maxHeight = height + "px";
        });
      }
    },
    handleDesignChange(val) { // 设计码change事件 重新编译成JSON数据
      this.designCode = val;
      // this.widgetForm = CodeDecompiler.handleCodeBuildJson(val);
      this.widgetForm = CodeDecompiler.compile(val);
    },
    // 获取模板数据
    getTemplateInfo(id) {
      return new Promise(resolve => {
        getTemplateInfo({ id }).then(res => {
          if (res.statusCode === 600) {
            this.templateInfo = res.data;
            this.designCode = res.data.sourceCode;
            resolve(res);
          }
        });
      });
    },
    // 获取全部组件属性
    async getComponentProperty() {
      if (this.$route.query.id) await this.getTemplateInfo(this.$route.query.id);
      getPropertys().then(res => {
        if (res.statusCode === 600) {
          this.componentPropertyData = res.data;
          const componentNameList = [];
          const { componentGroups = [] } = this.componentPropertyData;
          componentGroups.forEach(item => {
            item.components.forEach(itemChild => {
              componentNameList.push(itemChild.code);
            });
          });
          this.componentNameList = [...componentNameList, "el-row", "el-col"];
          const obj = {
            componentNameList: this.componentNameList,
            componentPropertyData: this.componentPropertyData,
          };
          this.widgetForm = CodeDecompiler.compile(this.designCode, obj);
        } else {
          this.componentPropertyData = {};
        }
      });
    },
  },
};
</script>
