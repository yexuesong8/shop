<template>
  <RadioSelector :data="options" :default-value="data" :property="property" @change="handleStatusChange" />
</template>

<script>
import { RadioSelector } from "@monkey.do/monkey";
import { statusOptions } from "@/config/index";

export default {
  name: "StatusSelector",
  components: { RadioSelector },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [String, Number],
      default: 1,
    },
    options: {
      type: Array,
      default: () => [...statusOptions],
    },
    property: {
      type: Object,
      default: () => { return { id: 'value', value: 'label' }; },
    },
    defaultParams: {
      type: [String, Number],
      default: 1,
    },
  },
  data() {
    return {
      data: "",
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val || val === 0) {
          this.data = val;
          this.handleStatusChange(val);
        }
      },
      immediate: true,
      deep: true,
    },
    // defaultParams: {
    //   handler(val) {
    //     if (val || val === 0) {
    //       this.data = val;
    //       this.handleStatusChange(val);
    //     }
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  methods: {
    handleStatusChange(value) {
      this.$emit("update:value", value);
      this.$emit("change", value);
    },
  },
};
</script>
