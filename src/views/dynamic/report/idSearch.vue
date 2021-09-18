<template>
  <el-form :model="form" label-width="auto">
    <el-form-item label="Id:">
      <el-input v-model="form.id" clearable :maxlength="20" placeholder="请输入id" @keyup.enter.native="search" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "IdSearch",
  props: {
    search: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      form: {},
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
    margin-top: 20px;
    .el-form-item {
      width: 20%;
      margin-right: 20px;
    }
  }
</style>
