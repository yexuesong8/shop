<script>
export default {
  name: "ExcelImportMixinProps",
  props: {
    title: {
      type: String,
      default: "导入数据",
    },
    excelImportUrl: {
      type: String,
      default: "",
      required: true,
    },
    excelSaveUrl: {
      type: String,
      default: "",
    },
    templateDownloadUrl: {
      type: String,
      default: "",
    },
    showTemplateDownload: {
      type: Boolean,
      default: true,
    },
    table: {
      type: Object,
      default: () => ({}),
    },
    elUpload: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
