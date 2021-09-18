<script>
export default {
  name: "ImportProps",
  props: {
    text: {
      type: String,
      default: "导入数据",
    },
    importApi: {
      type: String,
      default: "",
    },
    templateExportApi: {
      type: String,
      default: "",
    },
    onChange: {
      type: Function,
      default: (file, fileList) => {},
    },
  },
};
</script>
