<template>
  <DropDownTreeSelector
    :data-source-uri="dataSourceUri"
    source-type="uri"
    :value="value"
    :placeholder="placeholder"
    :wants="wants"
    :multiple="multiple"
    :property="property"
    :disabled="disabled"
    :show-tooltip="showTooltip"
    :params="params"
    v-bind="$attrs"
    @change="handleChange"
  />
</template>
<script>
import { DropDownTreeSelector } from "@monkey.do/monkey";
export default {
  name: "Catalog",
  components: { DropDownTreeSelector },
  model: {
    props: "value",
    event: "change",
  },
  props: {
    dataSourceUri: {
      type: String,
      default: "/api/v1/rabbit/system/property/group/find/tree",
    },
    value: {
      type: [String, Number, Array],
      default: () => [],
    },
    wants: {
      type: String,
      default: "id",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "请选择目录",
    },
    property: {
      type: Object,
      default: () => ({
        id: "id",
        name: "name",
        children: "childList",
        key: "id",
      }),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showTooltip: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    handleChange(value) {
      this.$emit("change", value);
      this.$emit("update:value", value);
    },
  },
};
</script>
