<template>
  <page-render :id="id" />
</template>

<script>
import { PageRender } from "@/components";

export default {
  name: "Page",
  components: { PageRender },
  data() {
    return {
      id: null,
    };
  },
  mounted() {
    const { meta: { pgTemplateId }} = this.$route;
    this.id = pgTemplateId;
  },
};
</script>
