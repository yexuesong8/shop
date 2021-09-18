<template>
  <!--
    transition并没有实际的动画效果，如果不加上会出现热更新时页面不能加载出来
    加上能够出现，
    所以为了解决 https://github.com/vuejs/vue-loader/issues/1332 这个问题加上
    TODO：其它更好的解决方式
  -->
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="keepAlive">
      <router-view :key="key" />
    </keep-alive>
  </transition>
</template>

<script>
export default {
  name: "LayoutRouterView",
  computed: {
    key() {
      return this.$route.path;
    },
    keepAlive() {
      return this.$store.state.permission.keepAlive;
    },
  },
  watch: {
    $route: {
      handler(val) {
        if (val) {
          val.matched.forEach(item => {
            if (item.components && item.components.default) { // 判断是否有组件
              if (item.meta && item.meta.type === 1) { // 只有菜单才进行keep-alive缓存
                this.$store.commit("permission/ADD_KEEP_ALIVE", item.components.default.name || "");
              }
            }
          });
        }
      },
    },
  },
};
</script>
