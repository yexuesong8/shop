<template>
  <span class="tool-bar-more-update" @click="handleUpdate">{{ $attrs.label || "修改" }}</span>
</template>

<script>
import PageUpdate from "@/components/Page/update/index.vue";

export default {
  name: "MoreUpdate",
  mixins: [PageUpdate],
  props: {
    id: {
      default: "",
      type: String,
    },
    row: {
      type: Object,
      default: () => ({}),
    },
    moreDisabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleUpdate() {
      if (this.moreDisabled) return;
      if (this.$listeners.click && this.id) this.$listeners.click(this.id, this.row);
      this.showDetailForm(this.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.tool-bar-more-update {
  display: inline-block;
  width: 100%;
}
</style>
