<template>
  <label-wrapper :style="{ width: width }" :title="title" :title-arrangement="titleArrangement" :required="required" :is-name="isName">
    <el-input
      v-model="innerValue"
      v-bind="$attrs"
      @input="handleInputChange"
    />
  </label-wrapper>
</template>

<script>
import LabelWrapper from "../pageItem";

export default {
  name: "PgInput",
  components: { LabelWrapper },
  model: {
    prop: "templateValue",
    event: "handleInput",
  },
  props: {
    width: {
      type: String,
      default: "446px",
    },
    title: {
      type: String,
      default: "",
    },
    isName: {
      type: String,
      default: "false",
    },
    required: {
      type: String,
      default: "false",
    },
    titleArrangement: {
      type: String,
      default: "row",
    },
    templateValue: {
      type: null,
      default: "",
    },
  },
  data() {
    return {
      innerValue: "",
    };
  },
  watch: {
    templateValue: {
      handler(value) {
        this.innerValue = value;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleInputChange() {
      this.$emit("handleInput", this.innerValue);
    },
  },
};
</script>
