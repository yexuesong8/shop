<template>
  <label-wrapper :style="{ width: width }" :title="title" :title-arrangement="titleArrangement" :required="required" :is-name="isName">
    <el-checkbox-group
      v-model="innerValue"
      v-bind="$attrs"
      :class="[optionsArrangement === 'column' ? 'radio-group-box' : '']"
      @change="handleComponentChange"
    >
      <el-checkbox v-for="(item, index) in optionsList" :key="index" :label="item.value">{{ item.label }}</el-checkbox>
    </el-checkbox-group>
  </label-wrapper>
</template>

<script>
import { handleStringFunction } from "@/views/page/design/utils";
import LabelWrapper from "../pageItem";

export default {
  name: "PgCheckbox",
  components: { LabelWrapper },
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
    required: {
      type: String,
      default: "false",
    },
    titleArrangement: {
      type: String,
      default: "row",
    },
    optionsArrangement: {
      type: String,
      default: "",
    },
    templateValue: {
      type: null,
      default: "",
    },
    options: {
      type: null,
      default: "",
    },
  },
  data() {
    return {
      innerValue: [],
      optionsList: [],
    };
  },
  watch: {
    templateValue: {
      handler(value) {
        this.innerValue = handleStringFunction(value);
      },
      immediate: true,
      deep: true,
    },
    options: {
      handler(value) {
        this.optionsList = handleStringFunction(value);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleComponentChange() {
      this.$emit("handleChange", this.innerValue);
    },
  },
};
</script>
