<template>
  <el-button v-bind="$attrs" @click="handleClick">{{ title }}</el-button>
</template>

<script>
export default {
  name: "PgButton",
  inject: {
    that: {
      default: "",
    },
  },
  props: {
    title: {
      type: String,
      default: "button",
    },
  },
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>
