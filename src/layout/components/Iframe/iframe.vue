<template>
  <iframe :src="route.meta.iframeSrc" />
</template>

<script>
export default {
  name: "BaseIframe",
  props: {
    route: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
