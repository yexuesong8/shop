<template>
  <Page :list-api="listApi" v-bind="props" v-on="$listeners" />
</template>

<script>
import { Page } from "@/components";

export default {
  name: "PgPage",
  components: { Page },
  inject: {
    that: {
      default: "",
    },
  },
  props: {
    listApi: {
      type: String,
      default: "",
    },
    pageTable: {
      type: null,
      default: "",
    },
    toolbarButtons: {
      type: null,
      default: "",
    },
    pageSearch: {
      type: null,
      default: "",
    },
  },

  data() {
    return {
      props: {},
    };
  },
  watch: {
    pageTable: {
      handler(value) {
        if (value) {
          if (typeof value === "string") {
            const table = new Function(`return ${value}`).bind(this.that || this)();
            this.props["table"] = this.handleData(table);
          } else {
            this.props["table"] = this.handleData(value);
          }
        }
      },
      immediate: true,
      deep: true,
    },
    toolbarButtons: {
      handler(value) {
        if (value) {
          if (typeof value === "string") {
            const toolbarButtons = new Function(`return ${value}`).bind(this.that || this)();
            toolbarButtons.forEach(item => {
              if (item.events) {
                Object.keys(item.events).forEach(eventItem => {
                  item.events[eventItem] = this.that[item.events[eventItem]];
                });
              }
            });
            this.props["toolbar-buttons"] = toolbarButtons;
          } else {
            this.props["toolbar-buttons"] = value;
          }
        }
      },
      immediate: true,
      deep: true,
    },
    pageSearch: {
      handler(value) {
        if (value) {
          if (typeof value === "string") {
            this.props["form"] = new Function(`return ${value}`).bind(this.that || this)();
          } else {
            this.props["form"] = value;
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleData(data) {
      if (data.events) {
        Object.keys(data.events || {}).forEach(item => {
          data.events[item] = this.that[data.events[item]];
        });
      }
      if (data.columns) {
        data.columns.forEach(item => {
          if (item.formatter && typeof item.formatter === "string") {
            item.formatter = new Function(`return ${item.formatter}`).bind(this.that || this)();
          }
        });
      }
      return data;
    },
  },
};
</script>
