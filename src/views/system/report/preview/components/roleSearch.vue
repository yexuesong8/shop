<template>
  <el-form :model="form" label-width="auto">
    <el-form-item label="角色名称:">
      <el-input v-model="form.name" clearable :maxlength="20" placeholder="请输入角色名称" @keyup.enter.native="search" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "RoleSearch",
  props: {
    search: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      form: {
        name: "5656",
      },
    };
  },
  methods: {
    getData() {
      return this.form;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 20%;
    }
  }
</style>
