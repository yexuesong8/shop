<template>
  <el-button v-bind="$attrs" @click="handleClick">{{ $attrs.label || "修改" }}</el-button>
</template>

<script>
import { _typeof } from "@monkey.do/monkey";
import PageUpdate from "@/components/Page/update";

export default {
  name: "ToolbarUpdate",
  mixins: [PageUpdate],
  props: {
    id: {
      type: String,
      required: true,
    },
    row: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    handleClick() {
      if (this.$listeners.click && _typeof(this.$listeners.click) === 'function') {
        this.$listeners.click(this.id, this.row);
      }
      this.showDetailForm(this.id);
    },
  },
};
</script>
