<template>
  <div class="rabbit-page-component" :class="[titleArrangement === 'column' ? 'column-mode' : 'row-mode']">
    <div v-if="isName === 'true'" class="rabbit-page-component-label">
      <span v-if="required === 'true'" class="required">*</span>
      <span>{{ title }}:</span>
    </div>
    <div class="rabbit-page-component-mode">
      <slot />
    </div>
  </div>
</template>

<script>
import mixProps from "./props";
export default {
  name: "PgItem",
  mixins: [mixProps],
};
</script>

<style scoped>

</style>
