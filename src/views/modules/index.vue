<template>
  <div class="modules-container">
    <component
      :is="getComponent()"
    />
  </div>
</template>
<script>
export default {
  mounted() {
    console.log(this.getComponent(), 1212121212);
  },
  methods: {
    getComponent() {
      const { meta } = this.$route;
      if (meta.pageType === "module") {
        return meta.componentName;
      }
      return "";
    },
  },
};
</script>
