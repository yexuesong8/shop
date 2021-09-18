<template>
  <div class="rb-table-priting-container" :style="{ width: width ? `${width}px` : '100%' }">
    <el-table
      id="rb-table-printing"
      ref="table"
      :data="printList"
      v-bind="props"
      :row-key="listKey"
    >
      <template v-for="(column, index) in (columns || [])">
        <el-table-column
          v-if="getColumnsShow(column)"
          :key="`column-${column.type || ''}-${column.label}-${index}`"
          :show-overflow-tooltip="getTooltipShow(column)"
          v-bind="column"
        >
          <template v-if="getColumnTemplateShow(column)" v-slot="slot">
            <!-- 操作按钮 -->
            <PageListHandler v-if="column.type === 'handlers'" :handlers="column.handlers" :data="slot" />
            <!-- 展开 -->
            <component
              :is="column.component"
              v-if="column.type === 'expand'"
              :ref="`Expand-${slot.row[listKey]}`"
              :data="slot"
              :expand-row="expandRow"
              :expanded-rows="expandedRows"
            />
            <!-- 内容为html标签 -->
            <column-cell-html v-if="!!((column.html || {}).formatter || column.htmlFormatter)" :column="column" :data="slot" />
            <!-- 内容为组件时 -->
            <component
              :is="column.component"
              v-if="column.type === 'component'"
              :row="slot.row"
              :data="slot"
              :column="slot.column"
              :index="slot.$index"
            />
          </template>
        </el-table-column>
      </template>
      <template v-slot:empty>
        <no-data />
      </template>
    </el-table>
  </div>
</template>

<script>
import { request } from "@/utils";
import { NoData } from "@monkey.do/monkey";
import PageListHandler from "@/components/PageList/handler/index";
import ColumnCellHtml from "@/components/PageList/column-cell-html";
const hiddenColumnTypeList = ["selection", "handlers"];

export default {
  name: "PageList",
  components: { PageListHandler, NoData, ColumnCellHtml },
  props: {
    api: {
      type: String,
      default: '',
    },
    props: {
      type: Object,
      default: () => ({}),
    },
    events: {
      type: Object,
      default: () => ({}),
    },
    columns: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: '0',
    },
    list: {
      type: Array,
      default: () => [],
    },
    listKey: {
      type: String,
      default: "id",
    },
    searchParams: {
      type: Object,
      default: () => ({}),
    },
    printPropList: {
      type: Array,
      default: null,
    },
    printTypeList: {
      type: Array,
      default: null,
    },
    width: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      expandRow: {},
      expandedRows: [],
      printList: [],
      params: this.searchParams,
    };
  },
  watch: {
    searchParams: {
      handler: function(params) {
        if (this.type !== '0') {
          this.params = {
            ...params,
          };
          this.getTableCel();
        }
      },
    },
    list: {
      handler: function() {
        if (this.type === '0') {
          this.printList = this.list;
        }
      },
    },
  },
  mounted() {
    console.log(this.type, 'type');
    if (this.type === '0') {
      this.printList = this.list;
    } else {
      this.getTableCel();
    }
  },
  methods: {
    getColumnsShow(column) {
      if (this.printTypeList) {
        if (column.type && column.type !== 'component' && !this.printTypeList.includes(column.type)) return false;
      } else {
        if (column.type && column.type !== 'component' && hiddenColumnTypeList.includes(column.type)) return false;
      }

      if (this.printPropList) {
        if (column.prop && !this.printPropList.includes(column.prop)) return false;
      }
      return true;
    },
    getTooltipShow(column) {
      return !(column.type === "index" || column.type === 'selection' || column.type === 'handlers');
    },
    getColumnTemplateShow(column) {
      return ['handlers', 'expand', 'component'].indexOf(column.type) !== -1 || !!column.htmlFormatter;
    },
    getExpandRef(refString) {
      if (!refString) return this.$refs;
      return this.$refs[refString];
    },
    getTableCel() {
      if (this.api) {
        request({
          baseURL: "/",
          url: this.api,
          data: this.params,
        }).then(res => {
          this.printList = res.data || [];
        });
      }
    },
  },
};
</script>

<style lang="scss">
.rb-table-priting-container {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: -1;
}
</style>
