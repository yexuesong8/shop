<template>
  <Import
    :export-url="templateExportApi || $page.api.excelTemplateDownload"
    :import-url="importApi || $page.api.excelImport"
    :on-change="onChange"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import { Import } from "@monkey.do/monkey";
import props from "./import-props";

export default {
  name: "ToolbarExport",
  inject: ["$page"],
  components: { Import },
  mixins: [props],
};
</script>

