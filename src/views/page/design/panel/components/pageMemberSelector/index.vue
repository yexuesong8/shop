<template>
  <label-wrapper :style="{ width: width }" :title="title" :title-arrangement="titleArrangement" :required="required" :is-name="isName">
    <member-selector
      :multiple="multiple === 'true'"
      :disabled="disabled === 'true'"
      @change="handleSelectorChange"
    />
  </label-wrapper>
</template>

<script>
import { MemberSelector } from "@/components";
import LabelWrapper from "../pageItem";
import { isArray } from "@monkey.do/monkey";

export default {
  name: "PgMemberSelector",
  components: { MemberSelector, LabelWrapper },
  model: {
    prop: "templateValue",
    event: "handleChange",
  },
  props: {
    width: {
      type: String,
      default: "446px",
    },
    disabled: {
      type: String,
      default: "false",
    },
    title: {
      type: String,
      default: "",
    },
    multiple: {
      type: String,
      default: "false",
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
    handleSelectorChange(value) {
      if (isArray(value)) {
        this.innerValue = value.map(item => item.id);
      } else {
        const { id } = value;
        this.innerValue = id;
      }
      this.$emit("change", value);
      this.$emit("handleChange", this.innerValue);
    },
  },
};
</script>
