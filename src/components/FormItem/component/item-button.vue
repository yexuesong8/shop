<template>
  <el-row class="rabbit-find-form-button-box">
    <el-button type="primary" :loading="loading" @click="search">查询</el-button>
    <el-button @click="reset">重置</el-button>
  </el-row>
</template>

<script>
export default {
  name: "ItemButton",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Function,
      default: () => {},
    },
    reset: {
      type: Function,
      default: () => {},
    },
  },
  inject: ["$pageFindForm"],
};
</script>

<style lang="scss">
.rabbit-find-form-button-box .el-button+.el-button {
  margin-left: 5px;
}
</style>
