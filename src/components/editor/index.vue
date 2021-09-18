<template>
  <div id="editor" />
</template>

<script>
import wangEditor from "wangeditor";
import { request, getImgSrc } from "@/utils";
import { getAppId } from "@monkey.do/monkey";

export default {
  name: "Editor",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editor: null,
    };
  },
  watch: {
    value(val) {
      this.editor.txt.html(val);
    },
  },
  mounted() {
    var E = wangEditor;
    this.editor = new E("#editor");
    // 显示base图片
    this.editor.customConfig.uploadImgShowBase64 = true;
    // this.editor.customConfig.zIndex = '1 !important';
    // 上传图片
    this.editor.customConfig.customUploadImg = (files, insert) => {
      files.forEach(item => {
        this.handleRequestFile(item, insert);
      });
    };
    // 内容change事件
    this.editor.customConfig.onchange = (html) => {
      this.$emit("change", html);
    };
    // 创建editor
    this.editor.create();
    // 回显写入
    if (this.value) this.editor.txt.html(this.value);
  },
  methods: {
    // 自定义上传
    handleRequestFile(file, insert) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("appId", getAppId());
      formData.append("type", 1);
      request({
        url: "/rabbit/file/upload",
        data: formData,
      }).then(res => {
        if (res.statusCode === 600 && res.data) {
          const str = getImgSrc(res.data.id);
          // 写入editor内容
          insert(str);
        }
      });
    },
    clear() {
      if (this.editor) {
        this.editor.txt.clear();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .w-e-menu {
  z-index: 3 !important // 这是工具栏
}

/deep/ .w-e-text {
  z-index: 1 !important // 这是内容框
}

/deep/ .w-e-text-container {
  z-index: 1 !important;
}
</style>
