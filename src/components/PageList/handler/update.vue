<template>
  <el-button type="text" v-bind="handler.props" @click="handleUpdate">{{ handler.label || '修改' }}</el-button>
</template>

<script>
import PageUpdate from "@/components/Page/update";

export default {
  name: "PageListUpdateHandler",
  mixins: [PageUpdate],
  props: {
    handler: {
      type: Object,
      default: () => ({
        props: {},
      }),
      required: true,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    handleUpdate() {
      const { row: { id }} = this.data;
      this.showDetailForm(id);
    },
  },
};
</script>
