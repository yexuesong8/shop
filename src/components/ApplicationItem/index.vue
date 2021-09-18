<template>
  <el-form-item label="适用范围:" prop="appId">
    <dictionary-selector code="general_app" :value="value" @change="handleChange" />
  </el-form-item>
</template>

<script>
import DictionarySelector from "@/components/DictionarySelector";

export default {
  name: "ApplicationItem",
  components: { DictionarySelector },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleChange(value) {
      this.$emit("update:value", value);
      this.$emit("change", value);
    },
  },
};
</script>
