<template>
  <ColumnsFilter
    :id="id"
    :data="data"
    :max-height="maxHeight"
    :has-checked-all="hasCheckedAll"
    v-bind="$attrs"
    @change="handleChange"
    @orderChange="handleOrderChange"
  />
</template>

<script>
import { ColumnsFilter } from "@monkey.do/monkey";
import ColumnsFilterMixProps from "./columns-filter-props";

export default {
  name: "ToolbarFilterColumns",
  components: { ColumnsFilter },
  mixins: [ColumnsFilterMixProps],
  inject: ["$page"],
  methods: {
    handleChange(columns) {
      if (this.$page) this.$page.$emit("page.columnsChange", columns);
      this.$emit("change", columns);
    },
    handleOrderChange(columns) {
      if (this.$page) this.$page.$emit("page.columnsOrderChange", columns);
      this.$emit("orderChange", columns);
    },
  },
};
</script>
