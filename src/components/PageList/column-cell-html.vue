<template>
  <div class="rabbit-page-column-cell" v-bind="getProps()" @click="handleClick" v-html="getFormatter()" />
</template>

<script>
export default {
  name: "ColumnCellHtml",
  props: {
    column: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    handleClick() {
      if (this.column.html && this.column.html.events && this.column.html.events.click) {
        this.column.html.events.click(this.data);
      }
    },
    getProps() {
      if (this.column.html) {
        return this.column.html.props || {};
      }
      return {};
    },
    getFormatter() {
      if (this.column.html && this.column.html.formatter) return this.column.html.formatter(this.data);
      if (this.column.htmlFormatter) return this.column.htmlFormatter(this.data);
      return "";
    },
  },
};
</script>
