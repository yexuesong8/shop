<template>
  <div ref="pageContainer" class="page-container">
    <slot />
  </div>
</template>

<script>
import { handleStringFunction } from "@/views/page/design/utils";

export default {
  name: "PgContainer",
  props: {
    pageContainerPadding: {
      type: String,
      default: "",
    },
    pageContainerMargin: {
      type: String,
      default: "",
    },
  },
  watch: {
    pageContainerPadding: {
      handler(value) {
        if (value) {
          const padding = handleStringFunction(value);
          this.$nextTick(() => {
            Object.keys(padding).forEach(item => {
              this.$refs["pageContainer"].style[item] = padding[item] + "px";
            });
          });
        }
      },
      immediate: true,
      deep: true,
    },
    pageContainerMargin: {
      handler(value) {
        if (value) {
          const margin = handleStringFunction(value);
          this.$nextTick(() => {
            Object.keys(margin).forEach(item => {
              this.$refs["pageContainer"].style[item] = margin[item] + "px";
            });
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
