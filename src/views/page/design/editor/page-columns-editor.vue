<template>
  <div class="page-columns-editor">
    <el-input
      v-model="innerEditorValue"
      v-bind="$attrs"
      @input="handleInput"
      v-on="$listeners"
    >
      <a slot="suffix" class="el-input__icon el-icon-s-grid" @click="handleMore" />
    </el-input>
    <!--    页面配置-->
    <Dialog v-if="pageVisible" :visible.sync="pageVisible" :title="pageDialogTitle" append-to-body @confirm="handleColumnsSubmit" @close="handleColumnsClose" @cancel="handleColumnsClose">
      <!--      <div class="json-editor">-->
      <!--        <ace-editor :code="pageEditorCode" language="json" @change="handleInput" />-->
      <!--      </div>-->
      <el-row>
        <el-form>
          <el-col :span="6">
            <el-form-item class="page-columns-item" label="开启多选">
              <el-switch v-model="tableSelection" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="page-columns-item" label="显示序号">
              <el-switch v-model="tableIndex" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24">
          <h4>列配置:</h4>
          <div v-for="(item, index) in columns" :key="index + 'columns'" class="column">
            <el-input v-model="item.label" placeholder="label" class="field" @input="handleInputChange" />
            <el-input v-model="item.prop" placeholder="prop" class="field" @input="handleInputChange" />
            <el-input v-model="item.formatter" placeholder="formatter" class="field" @input="handleInputChange" />
            <div class="btn">
              <el-button size="mini" type="text" @click="addColumns(index)">添加</el-button>
              <el-button size="mini" type="text" @click="delColumns(index)">删除</el-button>
            </div>
          </div>
          <!--操作-->
          <h4>操作:</h4>
          <div v-for="(item, index) in handles" :key="index + 'handles'" class="column">
            <el-input v-model="item.type" placeholder="type" class="field" @input="handleInputChange" />
            <el-input v-model="item.label" placeholder="label" class="field" @input="handleInputChange" />
            <el-input v-model="item.props" placeholder="props" class="field" @input="handleInputChange" />
            <el-input v-model="item.events" placeholder="events" class="field" @input="handleInputChange" />
            <div class="btn">
              <el-button size="mini" type="text" @click="addHandles(index)">添加</el-button>
              <el-button size="mini" type="text" @click="delHandles(index)">删除</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </Dialog>
  </div>
</template>

<script>
import BaseEditor from "./index.vue";
import beautifier from "js-beautify";
import { Dialog } from "@monkey.do/monkey";
import { beautifierConf } from "@/views/page/design/utils/config";
import { handleStringFunction } from "@/views/page/design/utils/index";

export default {
  name: "PageColumnsEditor",
  components: {
    Dialog,
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
      pageVisible: false,
      table: {},
      pageEditorCode: "",
      pageDialogTitle: "",
      columns: [],
      handles: [
        { type: "button", label: "测试", props: "", events: "" },
      ],
      tableIndex: false,
      tableSelection: false,
    };
  },
  watch: {
    pageVisible: {
      handler(value) {
        if (value) {
          this.table = handleStringFunction(this.data.props["page-table"]);
          if (this.table && this.table.columns) {
            const defaultArr = this.table.columns.filter(item => item.type);
            defaultArr.forEach(item => {
              if (item.type === "selection") {
                this.tableSelection = true;
              }
              if (item.type === "index") {
                this.tableIndex = true;
              }
            });
            const columns = this.table.columns.filter(item => !item.type);
            columns.forEach(item => {
              if (item.formatter && typeof item.formatter === "function") {
                item.formatter = item.formatter.toString();
              }
            });
            this.columns = columns;
          }
        } else {
          this.tableSelection = false;
          this.tableIndex = false;
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
        case "page-table":
          this.pageVisible = true;
          this.pageEditorCode = this.data.props[this.type];
          this.pageDialogTitle = "表格配置";
          break;
        case "toolbar-buttons":
          this.pageVisible = true;
          this.pageEditorCode = this.data.props[this.type];
          this.pageDialogTitle = "工具栏配置";
          break;
        case "page-search":
          this.pageVisible = true;
          this.pageEditorCode = this.data.props[this.type];
          this.pageDialogTitle = "筛选配置";
          break;
        default:
          break;
      }
    },
    handleColumnsSubmit() {
      this.columns.forEach(item => {
        if (!item.formatter) {
          delete item["formatter"];
        }
      });
      if (this.tableIndex) {
        this.columns.unshift({ label: "序号", type: "index" });
      }
      if (this.tableSelection) {
        this.columns.unshift({ type: "selection" });
      }
      this.table["columns"] = this.columns;
      this.handleColumnsClose();
      this.innerEditorValue = beautifier.html(JSON.stringify(this.table), beautifierConf.html);
      this.setValue();
    },
    handleColumnsClose() {
      this.pageVisible = false;
    },
    // 下拉选择change
    handleInputChange() {
      this.handleInput(JSON.stringify(this.columns));
    },
    addColumns(index) {
      this.columns.splice((index + 1), 0, { label: "", prop: "", formatter: "" });
    },
    delColumns(index) {
      this.columns.splice(index, 1);
    },
    addHandles(index) {
      this.handles.splice((index + 1), 0, { type: "", label: "", props: "", events: "" });
    },
    delHandles(index) {
      this.handles.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
  .page-columns-editor{
    width: 100%;
  }
  .column{
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    .field{
      margin-right: 10px;
    }
  }
  .btn{
    display: flex;
  }
  .json-editor{
    height: 500px;
    min-height: 500px;
  }
  .formatter{
    height: 100px;
  }
  h4{
    margin: 10px 0;
  }
</style>
