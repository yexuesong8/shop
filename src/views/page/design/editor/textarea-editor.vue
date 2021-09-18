<template>
  <el-input
    v-model="innerEditorValue"
    v-bind="$attrs"
    type="textarea"
    :rows="5"
    @blur="handleInput"
    v-on="$listeners"
  />
</template>

<script>
import BaseEditor from "./index.vue";

export default {
  name: "TextareaEditor",
  extends: BaseEditor,
  methods: {
    handleInput() {
      this.setValue();
    },
  },
};
</script>
