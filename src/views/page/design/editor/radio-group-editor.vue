<template>
  <el-radio-group
    v-model="innerEditorValue"
    v-bind="$attrs"
    fill="#999"
    text-color="#fff"
    size="mini"
    v-on="$listeners"
    @change="handleChange"
  >
    <el-radio-button v-for="(item, index) in radioList" :key="index" :label="item.value">{{ item.label }}</el-radio-button>
  </el-radio-group>
</template>

<script>
import BaseEditor from "./index.vue";
import { handleStringFunction } from "@/views/page/design/utils/index";

export default {
  name: "RadioGroupEditor",
  extends: BaseEditor,
  data() {
    return {
      radioList: [],
    };
  },
  watch: {
    options: {
      handler(value) {
        this.radioList = handleStringFunction(value);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleChange() {
      this.setValue();
    },
  },
};
</script>
