<template>
  <excel-export :url="api || $page.api.excelExport" :params="params" :on-fail="onFail" :hide="hide">{{ $attrs.label || "导出" }}</excel-export>
</template>

<script>
import { ExcelExport } from "@monkey.do/monkey";
import props from "../export-props";

export default {
  name: "More",
  inject: ["$page"],
  components: { ExcelExport },
  mixins: [props],
};
</script>

<style scoped>
.action-more-item .monkey-excel-export {
  display: inline-block;
  width: 100%;
}
</style>
