<template>
  <ExcelExport :url="api || $page.api.excelExport" :params="params" :params-formatter="paramsFormatter" :on-fail="onFail" :hide="hide" v-bind="$attrs" v-on="$listeners">
    <template v-slot:default="slot">
      <el-button :loading="slot.loading">{{ $attrs.label || "导出" }}</el-button>
    </template>
  </ExcelExport>
</template>

<script>
import { ExcelExport } from "@monkey.do/monkey";
import props from "./export-props";

export default {
  name: "ToolbarExport",
  components: { ExcelExport },
  mixins: [props],
  inject: ["$page"],
  methods: {
    paramsFormatter(params) {
      if (this.$page) return { ...params, ...this.$page.searchParams };
      return params;
    },
  },
};
</script>
