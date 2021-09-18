<template>
  <div class="main-content-container full-fill" :class="'body-' + theme">
    <el-button type="primary" @click="changeTheme('default')">切换到primary</el-button>
    <el-button type="success" @click="changeTheme('orange')">切换到success</el-button>
    <div class="text-color">
      文本颜色
    </div>
    <div class="bg-color">
      背景
    </div>
  </div>
</template>

<script>
export default {
  name: "Theme",
  data() {
    return {
      theme: "default",
    };
  },
  methods: {
    changeTheme(theme) {
      this.theme = theme;
    },
  },
};
</script>

<style lang="scss">

@include themeify {
    .text-color {
      color: themed('color');
    }
    .bg-color {
      background: themed('color');
    }
}
</style>
