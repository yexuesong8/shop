<template>
  <div ref="pageFormBox">
    <el-form ref="pageForm" :model="form" :rules="rules" label-suffix=":" label-position="right" v-bind="$attrs" @submit.native.prevent>
      <slot />
    </el-form>
  </div>
</template>

<script>
import { handleStringFunction } from "@/views/page/design/utils";

export default {
  name: "PgForm",
  props: {
    rules: {
      type: Object,
      default: () => {},
    },
    form: {
      type: Object,
      default: () => {},
    },
    pageFormPadding: {
      type: String,
      default: "",
    },
    pageFormMargin: {
      type: String,
      default: "",
    },
  },
  watch: {
    pageFormPadding: {
      handler(value) {
        if (value) {
          const padding = handleStringFunction(value);
          this.$nextTick(() => {
            Object.keys(padding).forEach(item => {
              this.$refs["pageFormBox"].style[item] = padding[item] + "px";
            });
          });
        }
      },
      immediate: true,
      deep: true,
    },
    pageFormMargin: {
      handler(value) {
        if (value) {
          const margin = handleStringFunction(value);
          this.$nextTick(() => {
            Object.keys(margin).forEach(item => {
              this.$refs["pageFormBox"].style[item] = margin[item] + "px";
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
