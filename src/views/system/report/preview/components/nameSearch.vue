<template>
  <el-form :model="form" label-width="auto" @submit.native.prevent>
    <el-form-item label="姓名:">
      <el-input v-model="form.name" clearable :maxlength="10" placeholder="请输入姓名" @keyup.enter.native="search" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "NameSearch",
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
    .el-form-item {
      width: 20%;
      margin-right: 20px;
    }
  }
</style>
