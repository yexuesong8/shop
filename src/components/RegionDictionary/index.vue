<template>
  <dictionary-selector code="general_location_area" :value="value" @change="handleChange" />
</template>

<script>
import { DictionarySelector } from "@/components";

export default {
  name: "RegionDictionary",

  components: { DictionarySelector },

  model: {
    prop: "value",
    event: "change",
  },

  props: {
    value: {
      type: null,
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

