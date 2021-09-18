<template>
  <Dialog
    v-if="dialogVisible"
    :title="title"
    :visible.sync="dialogVisible"
    append-to-body
    v-bind="$attrs"
    @cancel="cancel"
    @confirm="confirm"
  >
    <slot />
  </Dialog>
</template>

<script>
import { Dialog } from "@monkey.do/monkey";

export default {
  name: "PgDialog",
  components: { Dialog },
  props: {
    title: {
      type: String,
      default: "",
    },
    visible: {
      type: null,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  watch: {
    visible: {
      handler(value) {
        this.dialogVisible = value;
      },
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel", this.$slots.default[0].componentInstance.$refs["pageForm"]);
    },
    confirm() {
      this.$emit("confirm", this.$slots.default[0].componentInstance.$refs["pageForm"]);
    },
  },
};
</script>
