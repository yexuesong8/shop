<template>
  <el-button type="text" :disabled="getButtonDisabled()" v-bind="handler.props" @click="handleClick">{{ handler.label }}</el-button>
</template>

<script>
import { _typeof } from "@monkey.do/monkey";

export default {
  name: "ButtonHandler",
  props: {
    data: {
      type: Object,
      required: true,
    },
    handler: {
      type: Object,
      default: () => ({
        props: {},
      }),
    },
  },
  methods: {
    handleClick() {
      const fn = this.$listeners.click;
      if (fn) fn(this.data);
    },
    getButtonDisabled() {
      const handler = this.handler;
      if (handler.props && handler.props.disabled) {
        if (_typeof(handler.props.disabled) === 'function') {
          return handler.props.disabled(this.data);
        } else {
          return handler.props.disabled;
        }
      }
      return false;
    },
  },
};
</script>
