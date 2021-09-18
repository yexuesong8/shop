<template>
  <el-button type="primary" v-bind="$attrs" @click="handleClick" v-on="$listeners">{{ $attrs.label || "新增" }}</el-button>
</template>

<script>
import PageCreate from "@/components/Page/create";

export default {
  name: "ToolBarCreate",
  mixins: [PageCreate],
  methods: {
    handleClick() {
      this.showDetailForm();
    },
  },
};
</script>
