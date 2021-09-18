<template>
  <el-switch
    v-model="innerEditorValue"
    v-bind="$attrs"
    inactive-value="false"
    active-value="true"
    @change="handleChange"
    v-on="$listeners"
  />
</template>

<script>
import BaseEditor from "./index.vue";

export default {
  name: "SwitchEditor",
  extends: BaseEditor,
  methods: {
    handleChange() {
      this.setValue();
    },
  },
};
</script>
