<template>
  <div id="app">
    <Layout v-if="!(route.meta || {}).noLayout " />
    <router-view v-else />
  </div>
</template>

<script>
import Layout from "@/layout";

export default {
  name: 'App',
  components: { Layout },
  computed: {
    route() {
      return this.$route;
    },
  },
};
</script>
