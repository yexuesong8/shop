<!-- 渲染通过页面设计器设计的页面 -->
<template>
  <div id="page-render-container" ref="page" :class="{'main-content-container': hasMainContainer}" />
</template>

<script>
import Vue from "vue";
import {
  styleStart,
  styleEnd,
  exportStart,
  exportEnd,
  templateStart,
  templateEnd,
} from "@/views/page/design/utils/config";
import { getTemplateInfo } from "@/api/page/template";

export default {
  name: "PageRender",
  props: {
    hasMainContainer: {
      type: Boolean,
      default: true,
    },
    code: {
      type: String,
      default: "",
    },
    id: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      pageTemplate: null,
    };
  },
  watch: {
    code: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.init(val);
          });
        }
      },
      deep: true,
      immediate: true,
    },
    id: {
      handler: function(value) {
        if (value) {
          this.getTemplateInfo(value);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 获取模板数据
    getTemplateInfo(id) {
      getTemplateInfo({ id }).then(res => {
        if (res.statusCode === 600) {
          this.init(res.data.sourceCode);
        }
      });
    },
    init(code) {
      const html = code.substr(code.indexOf(templateStart) + (templateStart.length), (code.indexOf(templateEnd) - 10));
      const script = code.substring(code.indexOf(exportStart) + (exportStart.length), (code.indexOf(exportEnd)));
      const style = code.substring(code.indexOf(styleStart) + (styleStart.length), (code.indexOf(styleEnd)));
      const str = script.replace(/export default/, "return");
      const fn = new Function(str).bind(this)();
      const PageTemplate = Vue.extend({
        ...fn,
        template: html,
      });
      this.createStyle(style || "");
      this.pageTemplate = new PageTemplate({
        router: this.$router,
        store: this.$store,
      }).$mount();
      document.querySelector("#page-render-container").appendChild(this.pageTemplate.$el);
    },
    createStyle(text) {
      // 如果存在style先删除
      const bodyStyle = document.querySelector("#component");
      if (bodyStyle) document.querySelector("head").removeChild(bodyStyle);

      const style = document.createElement("style");
      style['id'] = "component";
      style['innerHTML'] = text;
      document.querySelector("head").appendChild(style);
    },
    getData() {
      return this.$refs["page"].$data["pageTemplate"].$data;
    },
  },
};
</script>
