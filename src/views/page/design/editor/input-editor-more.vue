<template>
  <div>
    <el-input
      v-model="innerEditorValue"
      v-bind="$attrs"
      @input="handleInput"
      v-on="$listeners"
    >
      <a slot="suffix" class="el-input__icon el-icon-s-grid" @click="handleMore" />
    </el-input>
    <!--    下拉选择-->
    <Dialog v-if="selectVisible" :visible.sync="selectVisible" title="配置选项" append-to-body @confirm="handleSelectSubmit" @close="handleSelectClose" @cancel="handleSelectClose">
      <div v-for="(item, index) in columns" :key="index" class="column">
        <el-input v-model="item.label" placeholder="label" class="field" @input="handleSelectInputChange" />
        <el-input v-model="item.value" placeholder="value" @input="handleSelectInputChange" />
        <div class="btn">
          <el-button type="text" class="el-icon-circle-plus-outline btn-item" @click="add(index)" />
          <el-button type="text" class="el-icon-remove-outline btn-item" @click="del(index)" />
        </div>
      </div>
    </Dialog>
    <!--    页面配置-->
    <Dialog v-if="pageVisible" :visible.sync="pageVisible" :title="pageDialogTitle" append-to-body @confirm="handleSelectSubmit" @close="handleSelectClose" @cancel="handleSelectClose">
      <div class="json-editor">
        <!--        <ace-editor :code="pageEditorCode" language="json" @change="handleInput" />-->
        <code-mirror-editor :code="pageEditorCode" mode="application/json" @change="handleInput" />
      </div>
    </Dialog>
  </div>
</template>

<script>
import BaseEditor from "./index.vue";
import beautifier from "js-beautify";
import { Dialog } from "@monkey.do/monkey";
import { beautifierConf } from "@/views/page/design/utils/config";
import { handleStringFunction } from "@/views/page/design/utils/index";
// import AceEditor from "@/views/page/design/components/aceEditor/index";
import CodeMirrorEditor from "@/views/page/design/codemirror";

export default {
  name: "InputEditorMore",
  components: {
    Dialog,
    // AceEditor,
    CodeMirrorEditor,
  },
  extends: BaseEditor,
  props: {
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectVisible: false,
      pageVisible: false,
      columns: [],
      pageEditorCode: "",
      pageDialogTitle: "",
    };
  },
  watch: {
    selectVisible: {
      handler(value) {
        if (value) {
          this.columns = handleStringFunction(this.data.props.options);
        }
      },
    },
  },
  methods: {
    handleInput(value = "") {
      this.innerEditorValue = value.trim();
    },
    handleMore() {
      switch (this.type) {
        case "options":
          this.selectVisible = true;
          break;
        case "page-table":
          this.pageVisible = true;
          this.pageEditorCode = JSON.stringify(handleStringFunction(this.data.props[this.type]), null, 2);
          // this.pageEditorCode = this.data.props[this.type];
          this.pageDialogTitle = "表格配置";
          break;
        case "toolbar-buttons":
          this.pageVisible = true;
          this.pageEditorCode = JSON.stringify(handleStringFunction(this.data.props[this.type]), null, 2);
          // this.pageEditorCode = this.data.props[this.type];
          this.pageDialogTitle = "工具栏配置";
          break;
        case "page-search":
          this.pageVisible = true;
          this.pageEditorCode = JSON.stringify(handleStringFunction(this.data.props[this.type]), null, 2);
          // this.pageEditorCode = this.data.props[this.type];
          this.pageDialogTitle = "筛选配置";
          break;
        case "events":
          this.pageVisible = true;
          this.pageEditorCode = this.list.events;
          this.pageDialogTitle = "事件配置";
          break;
        default:
          break;
      }
    },
    handleSelectSubmit() {
      this.handleSelectClose();
      this.innerEditorValue = beautifier.html(this.innerEditorValue, beautifierConf.html);
      this.setValue();
    },
    handleSelectClose() {
      this.selectVisible = false;
      this.pageVisible = false;
    },
    // 下拉选择change
    handleSelectInputChange() {
      this.handleInput(JSON.stringify(this.columns));
    },
    add(index) {
      this.columns.splice(index + 1, 0, { label: "", value: "" });
    },
    del(index) {
      this.columns.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
  .column{
    display: flex;
    margin-bottom: 10px;
    .field{
      margin-right: 10px;
    }
  }
  .btn{
    display: flex;
    margin-left: 4px;
    .btn-item{
      font-size: 20px;
    }
  }
  .json-editor{
    height: 500px;
    min-height: 500px;
  }
</style>
