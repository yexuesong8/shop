<template>
  <Import :text="text" :export-url="templateExportApi || $page.api.excelTemplateDownload" :import-url="importApi || $page.api.excelImport" v-bind="$attrs" :on-change="onChange">{{ $attrs.label || '导入' }}</Import>
</template>

<script>
import { Import } from "@monkey.do/monkey";
import props from "../import-props";

export default {
  name: "More",
  inject: ["$page"],
  components: { Import },
  mixins: [props],
};
</script>

<style scoped>
.action-more-item .m-import-container {
  display: inline-block;
  width: 100%;
}
</style>
