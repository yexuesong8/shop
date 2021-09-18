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
    :formatter="dataFormatter"
    v-bind="$attrs"
    @change="handleChange"
  />
</template>

<script>
import { DropDownTreeSelector } from "@monkey.do/monkey";

export default {
  name: "PostSelector",
  components: { DropDownTreeSelector },
  model: {
    props: "value",
    event: "change",
  },
  props: {
    dataSourceUri: {
      type: String,
      default: "/api/v1/rabbit/system/job/find/all",
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
      default: true,
    },
    placeholder: {
      type: String,
      default: "请选择岗位",
    },
    property: {
      type: Object,
      default: () => ({
        id: "id",
        name: "name",
        children: "jobList",
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
    dataFormatter(data) {
      return data.map(post => ({
        ...post,
        id: post.typeId,
        name: post.typeName,
      }));
    },
  },
};
</script>
