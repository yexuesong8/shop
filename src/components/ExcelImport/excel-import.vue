<template>
  <Dialog v-if="visible" class="rb-excel-import-dialog" :title="title" :visible="visible" @cancel="handleCancel" @confirm="handleConfirm">
    <div class="rb-excel-import-button-group">
      <div class="rb-excel-buttom-item">
        <el-button type="primary" @click="load">加载数据</el-button>
      </div>
      <div class="rb-excel-buttom-item">
        <el-button :loading="saveLoading" @click="save">保存数据</el-button>
      </div>
      <div class="rb-excel-buttom-item">
        <el-button @click="clear">清除数据</el-button>
      </div>
      <TemplateDownload v-if="showTemplateDownload" :url="templateDownloadUrl" class="rb-excel-buttom-item" />
    </div>
    <div class="rb-excel-import-upload-button">
      <FileUpload
        ref="upload"
        :url="excelImportUrl"
        :el-upload="computedElUpload"
        :upload-success-text="uploadSuccessText"
        @upload="handleUpload"
        @remove="handleRemove"
        @uploadSuccess="handleUploadSuccess"
      />
    </div>
    <div v-if="!isEmptyObject(table)" class="rb-excel-import-list">
      <el-table
        :data="list"
        v-bind="table.props || {}"
        v-on="table.events || {}"
      >
        <template v-for="(column, index) in (table.columns || [])">
          <el-table-column
            :key="`column-${column.type || ''}-${column.label}-${index}`"
            show-overflow-tooltip
            v-bind="column"
            v-on="column['events'] || {}"
          />
        </template>
        <template v-slot:empty>
          <no-data />
        </template>
      </el-table>
    </div>
  </Dialog>
</template>

<script>
import { TemplateDownload, NoData, isEmptyObject } from "@monkey.do/monkey";
import ExcelImportMixinProps from "./import-mixin-props";
import FileUpload from "@/components/FileUpload/index.vue";
import { request } from "@/utils";

const defaultElUpload = {
  limit: 1,
  accept: ".xls,.xlsx",
  "auto-upload": false,
};

export default {
  name: "ExcelImport",
  components: { FileUpload, TemplateDownload, NoData },
  mixins: [ExcelImportMixinProps],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    uploadSuccessText: {
      type: String,
      default: "加载成功",
    },
  },
  data() {
    return {
      list: [],
      saveLoading: false,
    };
  },
  computed: {
    computedElUpload() {
      return {
        ...defaultElUpload,
        ...this.elUpload,
      };
    },
  },
  methods: {
    load() {
      this.$refs["upload"].upload();
    },
    save() {
      if (!this.list.length) return;
      this.saveLoading = true;
      request({
        url: this.excelSaveUrl,
        baseURL: "",
      }).then(res => {
        if (res.statusCode === 600) {
          this.$message.success("保存成功");
          this.clear();
        }
      }).finally(() => {
        this.saveLoading = false;
      });
    },
    clear() {
      this.list = [];
      this.$refs["upload"].clear();
    },
    downloadTemplate() {},
    handleUpload() {},
    handleRemove() {},
    handleUploadSuccess(res) {
      if (res.statusCode === 600) {
        this.list = this.list.concat(res.data);
      }
    },
    handleCancel() {
      this.$emit("cancel");
      this.$emit("update:visible");
    },
    handleConfirm() {
      this.$emit("confirm");
    },
    isEmptyObject(obj) {
      return isEmptyObject(obj);
    },
  },
};
</script>

<style lang="scss">
.rb-excel-import-button-group {
  font-size: 0;
}
.rb-excel-import-dialog {
  .rb-excel-import-list {
    padding-top: 24px;
    border-top: 1px solid #e9e9e9;
  }
  .el-table--border::after, .el-table--group::after, .el-table::before {
    content: " ";
    display: none;
  }
}
.rb-excel-import-upload-button {
  margin-top: 24px;
}
.rb-excel-buttom-item {
  display: inline-block;
  margin-right: 5px;
  &:last-child {
    margin-right: 0;
  }
}
</style>
