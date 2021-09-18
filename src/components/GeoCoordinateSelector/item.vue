<template>
  <selected-form-item>
    <selected-box :value="data" :disabled="disabled" @change="handleChange" />
    <GeoCoordinateSelectorButton
      :disabled="disabled"
      :value="value"
      :map-options="mapOptions"
      :show-search="true"
      :is-edit="true"
      v-bind="$attrs"
      @confirm="handleChange"
      @cancel="handleCancel"
    />
  </selected-form-item>
</template>

<script>
import { isArray, SelectedFormItem, SelectedBox } from "@monkey.do/monkey";
import GeoCoordinateSelectorButton from "./button";

export default {
  name: "GeoCoordinateFormItem",
  components: { SelectedFormItem, SelectedBox, GeoCoordinateSelectorButton },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    mapOptions: {
      type: Object,
    },
  },
  data() {
    return {
      data: [],
    };
  },
  watch: {
    value: {
      handler: function(value) {
        this.updateData(value);
      },
      immediate: true,
    },
  },
  methods: {
    handleChange(value, address) {
      this.$emit("change", value, address);
      this.$emit("update:value", value);
    },
    handleCancel() {
      this.$emit("cancel");
    },
    updateData(value) {
      if (isArray(value)) {
        const [x, y] = value;
        const data = x ? [{ id: 1, name: `${x},${y}` }] : [];
        this.data.splice(0, this.data.length, ...data);
      }
    },
  },
};
</script>
