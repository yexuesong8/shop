<template>
  <section class="app-main">
    <section class="app-container">
      <Iframe v-show="route.meta.pageType === 'iframe'" />
      <layout-router-view />
    </section>
    <!--    <Platforms />-->
  </section>
</template>

<script>
// import { Platforms } from "@monkey.do/monkey";
import LayoutRouterView from "./router-view";
import Iframe from "./Iframe";

export default {
  name: "AppMain",
  components: { LayoutRouterView, Iframe },
  computed: {
    route() {
      return this.$route;
    },
  },
};
</script>

<style lang="scss">
.app-main {
  width: 100%;
  // navbar 48 tagsView 40
  min-height: calc(100vh - 88px);
  padding: 12px;
  position: relative;
  overflow: hidden;
}
</style>
