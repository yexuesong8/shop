<template>
  <el-button v-bind="$attrs" @click="handleDelete" v-on="$listeners">{{ $attrs.label || "删除" }}</el-button>
</template>

<script>
import PageDelete from "@/components/Page/delete";

export default {
  name: "ToolBarDelete",
  mixins: [PageDelete],
};
</script>
