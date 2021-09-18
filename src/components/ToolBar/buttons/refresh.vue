<template>
  <el-button icon="el-icon-refresh-left" :loading="$page.loading" v-bind="$attrs" @click="onClick" v-on="$listeners" />
</template>

<script>
export default {
  name: "ToolBarRefreshButton",
  inject: ["$page"],
  methods: {
    onClick() {
      this.$page.$emit("page.refresh");
    },
  },
};
</script>
