<template>
  <component :is="dynamicView" />
</template>

<script>
import DynamicLoadView from "@/components/DynamicLoadView";

export default {
  name: "RenderComponent",
  mixins: [DynamicLoadView],
  props: {
    path: {
      type: String,
      required: true,
    },
    loadView: {
      type: Function,
      default: null,
    },
  },
  watch: {
    path: {
      handler: function(value) {
        if (value) this.renderComponent(value);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    renderComponent(path) {
      try {
        if (this.loadView) {
          this.dynamicView = this.loadView(path);
        } else {
          this.dynamicLoadView(path);
        }
      } catch (err) {
        throw new Error(`找不到对应路径的文件: ${path}`);
      }
    },
  },
};
</script>
