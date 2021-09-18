<template>
  <div class="iframe-container">
    <component
      :is="BaseIframe"
      v-for="(iframe, index) in visitedIframe"
      v-show="iframe.path === route.path"
      :key="index"
      :route="iframe"
    />
  </div>
</template>

<script>
import BaseIframe from "./iframe";

export default {
  name: "Iframe",
  data() {
    return {
      BaseIframe,
    };
  },
  computed: {
    visitedIframe() {
      return this.$store.state.tagsView.visitedIframe;
    },
    route() {
      return this.$route;
    },
  },
};
</script>

<style lang="scss">
.iframe-container {
  width: 100%;
  height: calc(100vh - 90px - 24px);
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>
