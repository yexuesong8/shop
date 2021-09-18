<template>
  <el-input
    v-model="innerEditorValue"
    v-bind="$attrs"
    @blur="handleInput"
    v-on="$listeners"
  />
</template>

<script>
import BaseEditor from "./index.vue";

export default {
  name: "InputEditor",
  extends: BaseEditor,
  methods: {
    handleInput() {
      this.setValue();
    },
  },
};
</script>
