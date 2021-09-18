<template>
  <div v-if="button" class="rb-auth-botton" @click="handleClick">
    <slot v-if="$slots.default" v-bind="$attrs" />
    <el-button v-else native-type="button" v-bind="$attrs">{{ button.name }}</el-button>
  </div>
</template>

<script>
export default {
  name: "AuthButton",

  props: {
    /** 按钮代码 */
    code: {
      type: String,
      default: "",
      required: true,
    },
    /** 按钮执行方法 */
    method: {
      type: Function,
      default: () => {},
    },
    /** 执行方法需要的参数 */
    params: {
      type: null,
      default: null,
    },
  },

  inject: {
    AuthButtonScope: {
      default: null,
    },
  },

  computed: {
    button() {
      const buttons = this.$store.state.global.authButtons;
      let currentButton;
      if (buttons.length > 0) {
        buttons.forEach(element => {
          if (this.code === element.code) {
            currentButton = element;
          }
        });
      }
      return currentButton || undefined;
    },
  },

  methods: {
    handleClick() {
      if (this.$attrs.disabled) return;
      if (this.AuthButtonScope) {
        const event = this.AuthButtonScope[this.button.event];
        if (event) event(this.params);
      } else {
        if (this.method) this.method(this.params);
      }
    },
  },

};
</script>

<style lang="scss">
.rb-auth-botton {
  display: inline-block;
}
</style>
