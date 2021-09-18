<template>
  <el-switch v-model="name" @change="handleSwitchChange" />
</template>

<script>
export default {
  name: "ToolbarColumnComponent",
  // inject: ["$pageList"],
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
    column: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
    data: {
      type: null,
      default: 0,
    },
    value: {
      type: null,
      default: false,
    },
  },
  data() {
    return {
      name: 1,
    };
  },
  watch: {
    value: {
      handler(value) {
        console.log(value, 991);
        this.name = value;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleSwitchChange(value) {
      console.log(value);
      this.$emit("change", value);
    },
  },
};
</script>
