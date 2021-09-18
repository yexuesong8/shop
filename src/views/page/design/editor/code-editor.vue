<template>
  <div class="json-editor">
    <code-mirror-editor :code="code" mode="json" @change="handleInput" />
  </div>
</template>

<script>
import BaseEditor from "./index.vue";
import beautifier from "js-beautify";
import CodeMirrorEditor from "@/views/page/design/codemirror";
import { beautifierConf } from "@/views/page/design/utils/config";

export default {
  name: "CodeEditor",
  components: { CodeMirrorEditor },
  extends: BaseEditor,
  data() {
    return {
      code: this.innerEditorValue,
    };
  },
  mounted() {
    this.code = this.innerEditorValue;
  },
  methods: {
    handleInput(value) {
      this.innerEditorValue = beautifier.html(value, beautifierConf.html); // 格式化
      this.setValue();
    },
  },
};
</script>
<style lang="scss" scoped>
  .json-editor{
    width: 100%;
    height: 200px;
    min-height: 200px;
  }
</style>
