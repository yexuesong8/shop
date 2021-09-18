<template>
  <label-wrapper :style="{ width: width }" :title="title" :title-arrangement="titleArrangement" :required="required" :is-name="isName">
    <el-select v-model="innerValue" clearable @change="handleSelectChange">
      <el-option
        v-for="item in columns"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </label-wrapper>
</template>

<script>
import { handleStringFunction } from "@/views/page/design/utils/index";
import LabelWrapper from "../pageItem";
export default {
  name: "PgSelect",
  components: { LabelWrapper },
  model: {
    prop: "templateValue",
    event: "handleSelect",
  },
  props: {
    options: {
      type: null,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    model: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "",
    },
    required: {
      type: String,
      default: "false",
    },
    templateValue: {
      type: null,
      default: "",
    },
    isName: {
      type: String,
      default: "false",
    },
  },
  data() {
    return {
      innerValue: "",
      columns: [],
      titleArrangement: "row",
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
    options: {
      handler(value) {
        if (value) {
          this.columns = handleStringFunction(value);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleSelectChange() {
      this.$emit("handleSelect", this.innerValue);
    },
  },
};
</script>
