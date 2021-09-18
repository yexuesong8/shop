<template>
  <selected-form-item>
    <selected-box :value="data" :disabled="disabled" @change="handleChange" />
    <slot :disabled="disabled" :multiple="multiple" :confirm="handleChange" />
  </selected-form-item>
</template>

<script>
import { isArray, SelectedFormItem, SelectedBox, isEmptyObject } from "@monkey.do/monkey";

export default {
  name: "CommonButtonSelect",

  components: {
    SelectedFormItem,
    SelectedBox,
  },

  props: {
    value: {
      type: null,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    property: {
      type: Object,
      default: () => ({
        id: "id",
        name: "name",
      }),
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
      deep: true,
      immediate: true,
    },
  },

  methods: {
    updateData(data) {
      if (!data) {
        this.data = [];
        return;
      }
      if (isArray(data)) {
        this.data.splice(0, this.data.length, ...data);
      } else {
        if (data && !isEmptyObject(data) && data[this.property.id]) {
          this.data.splice(0, this.data.length, data);
        } else {
          this.data.splice(0, this.data.length);
        }
      }
    },

    handleChange(value) {
      if (this.multiple) {
        this.$emit("change", value);
        this.$emit("value:update", value);
      } else {
        this.$emit("change", value[0] || {});
        this.$emit("value:update", value[0] || {});
      }
      this.updateData(value);
    },
  },
};
</script>
