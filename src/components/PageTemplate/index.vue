<template>
  <page-render ref="template" :code="code" />
</template>

<script>
import { PageRender } from "@/components";
import { getTemplateInfo } from "@/api/page/template";

export default {
  name: "PageTemplate",
  components: { PageRender },
  props: {
    id: {
      type: [Number, String],
      required: true,
      default: "",
    },
  },
  data() {
    return {
      code: "",
    };
  },
  watch: {
    id: {
      handler(value) {
        if (value) {
          this.getCode(value);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getCode(id) {
      getTemplateInfo({ id }).then(res => {
        if (res.statusCode === 600) {
          this.code = res.data.sourceCode;
        }
      });
    },
    getData() {
      return this.$refs["template"].$data["componentTemplate"].$data;
    },
  },
};
</script>
