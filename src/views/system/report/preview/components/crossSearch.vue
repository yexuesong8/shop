<template>
  <el-form :model="form" label-width="auto">
    <el-form-item label="姓名:">
      <el-input v-model="form.name" placeholder="请输入姓名" clearable :maxlength="10" @keyup.enter.native="search" />
    </el-form-item>
    <el-form-item label="年度:">
      <el-date-picker
        v-model="form.yearStart"
        type="year"
        format="yyyy年"
        value-format="yyyy"
        placeholder="请选择开始"
        clearable
      />
      <span class="gapText"> 至 </span>
      <el-date-picker
        v-model="form.yearEnd"
        type="year"
        format="yyyy年"
        value-format="yyyy"
        placeholder="请选择结束"
        :clearable="true"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "OldYearSearch",
  props: {
    search: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      form: {
        yearStart: "",
        yearEnd: "",
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
      margin-right: 20px;
      /deep/ .el-form-item__content {
        display: flex;
        justify-content: space-between;
      }
    }
    .gapText {
      margin: 0 10px;
    }
  }
</style>
