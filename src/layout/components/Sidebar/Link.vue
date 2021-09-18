
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@monkey.do/monkey';

export default {
  props: {
    to: {
      type: [String, Object],
      required: true,
    },
  },
  methods: {
    linkProps(item) {
      const { path, pageType } = item;
      if (isExternal(path)) {
        return {
          is: 'a',
          href: path,
          target: '_blank',
          rel: 'noopener',
        };
      }
      if (pageType === 5) { // module
        return {
          is: 'router-link',
          to: path,
        };
      }
      return {
        is: 'router-link',
        to: path,
      };
    },
  },
};
</script>
