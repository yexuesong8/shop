<template>
  <el-button type="primary" @click="handleAdd">新增</el-button>
</template>

<script>
export default {
  name: "TemplateAdd",
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleAdd() {
      this.$router.push(`/rabbit/workflow/template?typeId=${this.id}`);
      this.$emit("add");
    },
  },
};
</script>
