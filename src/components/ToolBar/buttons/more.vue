<template>
  <ActionMore :data="innerData" />
</template>

<script>
import { ActionMore } from "@monkey.do/monkey";
import MoreExport from "./more/excel-export";
import MoreImport from "./more/import";
import MoreDelete from "./more/delete";
import MoreUpdate from "./more/update";
import MorePrinting from "@/components/Page/printing";

export default {
  name: "More",
  components: { ActionMore },
  inject: ["$page"],
  props: {
    data: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    innerData() {
      return this.data.map(item => {
        if (item.type === 'export') return { ...item, type: "component", component: MoreExport };
        if (item.type === 'import') return { ...item, type: "component", component: MoreImport };
        if (item.type === 'printing') return { ...item, props: { ...item.props, type: 'more' }, type: "component", component: MorePrinting };
        if (item.type === "update") {
          let itemProps = { ...item, type: "component", component: MoreUpdate, props: { id: "" }};
          if (this.$page) {
            itemProps = {
              ...itemProps,
              disabled: this.$page.selectedRows.length !== 1,
              props: {
                ...item.props,
                ...itemProps.props,
                id: (this.$page.selectedRows[0] || {}).id || "",
                row: this.$page.selectedRows[0] || {},
                moreDisabled: this.$page.selectedRows.length !== 1,
              },
            };
          }
          return itemProps;
        }
        if (item.type === 'delete') {
          const props = { ...item, props: { ...item.props, selectedRows: this.$page.selectedRows }, type: "component", component: MoreDelete };
          if (this.$page) props.disabled = !this.$page.selectedRows.length;
          return props;
        }
        return item;
      });
    },
  },
};
</script>
