<template>
  <el-collapse-item title="按钮名称" name="buttonName">
    <el-form-item label="提交:">
      <el-input v-model="form.postButtonName" placeholder="提交按钮名称" :maxlength="20" />
    </el-form-item>
    <el-form-item label="驳回:">
      <el-input v-model="form.rejectButtonName" placeholder="驳回按钮名称" :maxlength="20" />
    </el-form-item>
    <el-form-item label="转办:">
      <el-input v-model="form.handoverButtonName" placeholder="转办按钮名称" :maxlength="20" />
    </el-form-item>
    <el-form-item label="会办:">
      <el-input v-model="form.togetherButtonName" placeholder="会办按钮名称" :maxlength="20" />
    </el-form-item>
  </el-collapse-item>
</template>

<script>
export default {
  name: "ButtonNameProperty",
  // inject: {
  //   form: {
  //     default: {},
  //   },
  // },
  props: {
    defaultValue: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {},
    };
  },
  watch: {
    defaultValue: {
      handler: function(value) {
        this.form = { ...value };
      },
      immediate: true,
      deep: true,
    },
    form: {
      handler: function(value) {
        this.$emit("change", value);
      },
      deep: true,
    },
  },
};
</script>
