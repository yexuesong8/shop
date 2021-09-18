<template>
  <div :class="['property-wrapper', { baseline: baseline, column: column }]">
    <div v-if="noTitle" class="property-field">
      <b v-for="(item, index) in title" :key="index" class="field-word">{{ item }}</b>:
    </div>
    <div class="property-body">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    noTitle: {
      type: Boolean,
      default: true,
    },
    baseline: {
      type: Boolean,
      default: false,
    },
    column: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
