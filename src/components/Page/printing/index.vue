<template>
  <ListPrinting :container="container" :options="options">
    <span v-if="type === 'more'">{{ $attrs.label || '打印' }}</span>
  </ListPrinting>
</template>

<script>
import { ListPrinting } from "@monkey.do/monkey";

export default {
  name: "PagePrinting",
  components: { ListPrinting },
  props: {
    container: {
      type: String,
      default: "rb-table-printing",
    },
    options: {
      type: Object,
      default: () => ({
        targetStyles: ['*'],
      }),
    },
    type: {
      type: String,
      default: "button",
      validator: function(value) {
        return ['button', 'more'].indexOf(value) !== -1;
      },
    },
  },
};
</script>
