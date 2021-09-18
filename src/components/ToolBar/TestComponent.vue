<template>
  <el-button type="primary" @click="handleClick">更多</el-button>
</template>

<script>
export default {
  name: "More",
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    handleClick() {
      this.visible = !this.visible;
    },
  },
};
</script>
