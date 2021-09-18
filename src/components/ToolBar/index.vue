<template>
  <el-row type="flex" class="rabbit-tool-bar-container">
    <el-row v-for="(button, index) in toolbarButtons" :key="index" class="rb-tool-bar-button">
      <component
        :is="getComponent(button)"
        :ref="`tool-bar-${getComponentRef(button)}`"
        :label="getLabel(button)"
        v-bind="getComponentProps(button)"
        v-on="getComponentEvent(button)"
      >
        <span v-if="button.type === 'button'">
          {{ button.label }}
        </span>
      </component>
    </el-row>
  </el-row>
</template>

<script>
import { isObject, isVue } from "@monkey.do/monkey";
import props from "./props";
import ToolBarRefresh from "./buttons/refresh";
import ToolBarCreate from "./buttons/create";
import ToolBarUpdate from "./buttons/update";
import ToolBarDelete from "./buttons/delete";
import ToolBarExport from "./buttons/export";
import ToolBarImport from "./buttons/import";
import ToolBarMore from "./buttons/more";
import ToolBarColumnsFilter from "./buttons/columns-filter";
import ToolBarPrinting from "@/components/Page/printing";

export default {
  name: "ToolBar",
  mixins: [props],
  inject: {
    $page: {
      default: null,
    },
  },
  data() {
    return {
      components: {
        refresh: ToolBarRefresh,
        create: ToolBarCreate,
        delete: ToolBarDelete,
        export: ToolBarExport,
        import: ToolBarImport,
        more: ToolBarMore,
        update: ToolBarUpdate,
        printing: ToolBarPrinting,
        "columns-filter": ToolBarColumnsFilter,
      },
      refIndex: 0,
    };
  },
  methods: {
    getComponent(button) {
      if (isVue(button)) return button;
      if (isObject(button)) {
        if (button.type === "button") return "el-button";
        return this.components[button.type] || button.type;
      }
      return this.components[button];
    },
    getLabel(button) {
      if (isObject(button)) {
        return button.label || (button.props || {}).label;
      }
      return "";
    },
    getComponentProps(button) {
      if (isObject(button)) {
        return button["props"];
      }
      return {};
    },
    getComponentEvent(button) {
      if (isObject(button)) {
        return {
          ...button["events"],
          click: () => {
            if (button.events && button.events.click) button.events.click(this.$page.selectedRows);
          },
        };
      }
      return {};
    },
    getComponentRef(button) {
      if (isVue(button)) {
        this.refIndex++;
        return this.refIndex;
      }
      if (isObject(button)) return button.type;
      return button;
    },
  },
};
</script>

<style lang="scss" scoped>
.rb-tool-bar-button {
  margin-right: 5px;
  &:last-child {
    margin-right: 0;
  }
}
</style>
