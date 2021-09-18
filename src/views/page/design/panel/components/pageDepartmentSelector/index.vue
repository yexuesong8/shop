<template>
  <label-wrapper :style="{ width: width }" :title="title" :title-arrangement="titleArrangement" :required="required" :is-name="isName">
    <department-selector
      v-model="innerValue"
      :multiple="multiple === 'true'"
      :disabled="disabled === 'true'"
      @change="handleSelectorChange"
    />
  </label-wrapper>
</template>

<script>
import { DepartmentSelector } from "@/components";
import LabelWrapper from "../pageItem";

export default {
  name: "PgDepartmentSelector",
  components: { DepartmentSelector, LabelWrapper },
  model: {
    prop: "templateValue",
    event: "handleChange",
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
    multiple: {
      type: String,
      default: "false",
    },
    disabled: {
      type: String,
      default: "false",
    },
    placeholder: {
      type: String,
      default: "请选择部门",
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
    handleSelectorChange(value) {
      this.$emit("change", value);
      this.$emit("handleChange", this.innerValue);
    },
  },
};
</script>
