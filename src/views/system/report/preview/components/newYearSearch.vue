<template>
  <el-form :model="form" label-width="auto">
    <el-form-item label="年度:">
      <el-date-picker
        v-model="form.yearEnd"
        type="year"
        format="yyyy年"
        value-format="yyyy"
        placeholder="请选择年份"
        :clearable="true"
        @change="handleYearChange"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "NewYearSearch",
  data() {
    return {
      form: {
        yearStart: new Date().getFullYear().toString(),
        yearEnd: new Date().getFullYear().toString(),
      },
    };
  },
  methods: {
    getData() {
      return this.form;
    },
    handleYearChange(val) {
      this.form.yearStart = val;
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
