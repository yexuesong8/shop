<template>
  <div class="rb-geocoordinate-button">
    <el-button v-if="!$slots.default" type="primary" :disabled="disabled" @click="handleButtonClick">{{ label }}</el-button>
    <slot v-else :click="handleButtonClick" />
    <GeoCoordinateSelector
      v-if="visible"
      :visible.sync="visible"
      :map-options="mapOptions"
      :value="value"
      :is-edit="isEdit"
      :show-search="showSearch"
      :show-label-layer="showLabelLayer"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script>
import GeoCoordinateSelector from "./index";

export default {
  name: "GeoCoordinateSelectorButton",
  components: { GeoCoordinateSelector },
  props: {
    label: {
      type: String,
      default: "选择坐标",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
    mapOptions: {
      type: Object,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    showLabelLayer: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      visible: false,
    };
  },

  methods: {
    handleButtonClick() {
      if (this.disabled) return;
      this.visible = true;
    },
    handleConfirm(position, address) {
      this.$emit("confirm", position, address);
      this.close();
    },
    close() {
      this.visible = false;
    },
    handleCancel() {
      this.close();
      this.$emit("cancel");
    },
  },
};
</script>
