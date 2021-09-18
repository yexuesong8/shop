<template>
  <list-selector
    data-source-uri="/api/v1/rabbit/login/get/app/list"
    source-type="uri"
    :value="value"
    wants="id"
    v-bind="$attrs"
    @change="handleChange"
  />
</template>

<script>
export default {
  name: "PlatformSelector",
  model: {
    props: "value",
    event: "change",
  },
  props: {
    value: {
      type: [String, Number],
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
