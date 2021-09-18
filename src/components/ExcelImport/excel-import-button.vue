<template>
  <div class="rb-excel-import-button">
    <div class="trigger-box" @click="handleClick">
      <slot v-if="$slots.default" />
      <el-button v-else>{{ label }}</el-button>
    </div>
    <ExcelImport
      :visible="visible"
      :excel-import-url="excelImportUrl"
      :template-download-url="templateDownloadUrl"
      :excel-save-url="excelSaveUrl"
      :table="table"
      :upload-success-text="uploadSuccessText"
      :el-upload="elUpload"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
import ExcelImport from "./excel-import";
import ExcelImportProps from "./import-mixin-props";
import UploadMixinProps from "@/components/FileUpload/mixin-props.vue";

export default {
  name: "ExcelImportButton",
  components: { ExcelImport },
  mixins: [ExcelImportProps, UploadMixinProps],
  props: {
    label: {
      type: String,
      default: "导入",
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    handleClick() {
      this.visible = true;
    },
    handleConfirm() {
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss">
.rb-excel-import-button {
  display: inline-block;
  .trigger-box {
    display: inline-block;
  }
}
</style>
