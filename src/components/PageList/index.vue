<template>
  <div class="page-list-container">
    <el-table
      ref="table"
      v-loading="loading"
      v-fixedTable="fixedTable"
      :data="list"
      v-bind="tableProps"
      :row-key="listKey"
      @row-click="rowClick"
      @row-contextmenu="rowContextMenu"
      @selection-change="handleSelectionChange"
      @expand-change="handleExpandChange"
      @row-dblclick="handleRowDbClick"
      v-on="tableEvents"
    >
      <template v-for="(column, index) in (innerColumns || [])">
        <el-table-column
          v-if="getColumnsShow(column)"
          :key="`column-${column.type || ''}-${column.label}-${index}`"
          :show-overflow-tooltip="getTooltipShow(column)"
          :render-header="renderHeader"
          v-bind="column"
          v-on="column['events'] || {}"
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
    <pagination
      v-if="hasPagination && isShowPagination"
      :page-num="pageNum"
      :page-size="pageSize"
      :total="total"
      @change="handlePaginationChange"
    />
  </div>
</template>

<script>
import { CellMenu, NoData, ListHeaderSorter, isFunction } from "@monkey.do/monkey";
import { defaultPagination } from "@/config/index";
import { request } from "@/utils";
import mixProps from "./props";
import PageListHandler from "./handler/index";
import ColumnCellHtml from "./column-cell-html";

const existEvents = ["selection-change", "row-click", "row-dblclick", 'row-contextmenu', 'expand-change'];
const stableColumns = ["expand", "selection"];

export default {
  name: "PageList",
  components: { PageListHandler, NoData, ColumnCellHtml },
  mixins: [mixProps],
  inject: {
    $page: {
      default: null,
    },
    $fixTable: {
      default: null,
    },
  },
  provide() {
    return {
      $pageList: this,
    };
  },
  props: {
    api: {
      type: String,
      required: true,
    },
    /** 查询参数 */
    params: {
      type: Object,
      default: () => ({}),
    },
    /** 初始化时不进行查询 */
    initNoFetch: {
      type: Boolean,
      default: false,
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
    table: {
      type: Object,
      default: () => ({
        events: {},
        props: {},
      }),
    },
    checkedColumns: {
      type: Array,
      default: null,
    },
    orderedColumns: {
      type: Array,
      default: null,
    },
    dbClickShowDetailForm: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      ...defaultPagination,
      total: 0,
      list: [],
      loading: false,
      innerCheckedColumns: [],
      innerColumns: [],
      selectedRows: [],
      activeSortFields: [],
      expandRow: {},
      expandedRows: [],
    };
  },
  computed: {
    tableProps() {
      return {
        ...this.props || {},
      };
    },
    tableEvents() {
      const events = { ...this.events || {}};
      // 去除已经绑定的事件，防止v-on 和 @bind会同时触发
      existEvents.forEach(event => {
        if (events[event]) Reflect.deleteProperty(events, event);
      });
      return events;
    },
  },
  watch: {
    params: {
      handler: function() {
        const payload = this.hasPagination ? { pageNum: 1 } : {};
        this.fetch({ ...payload });
      },
      deep: true,
    },
    /** 设置columns */
    checkedColumns: {
      handler: function(columns) {
        // 默认为null 传入空数组则赋值
        if (columns) {
          this.innerCheckedColumns = columns;
        } else {
          const initColumns = [];
          this.columns && this.columns.forEach(column => {
            if (column.type === 'index') {
              initColumns.push("序号");
            } else {
              if (column.label) {
                initColumns.push(column.label);
              }
            }
          });
          this.innerCheckedColumns = initColumns;
        }
      },
      immediate: true,
      deep: true,
    },
    orderedColumns: {
      handler: function(value) {
        if (value && value.length) {
          // TODO: 优化
          const newColumns = [];
          const oldColumns = [...this.columns];

          oldColumns.forEach((column, index) => {
            if (stableColumns.includes(column.type)) {
              oldColumns.splice(index - newColumns.length, 1);
              newColumns.push(column);
            }
          });

          value.forEach(item => {
            const column = oldColumns.filter(column => column.label === item);
            if (column && column[0]) newColumns.push(column[0]);
          });

          this.innerColumns = newColumns;
        }
      },
    },
  },
  created() {
    if (!this.initNoFetch) this.fetch();
  },
  mounted() {
    this.innerColumns = [...this.columns];
  },
  methods: {
    async fetch(params = {}) {
      if (this.api) {
        let payload = {};
        if (this.hasPagination) {
          payload = { pageSize: this.pageSize, pageNum: this.pageNum, ...this.params, ...params };
        } else {
          payload = { ...this.params, ...params };
        }
        if (isFunction(this.isFetch)) {
          if (!this.isFetch(payload)) return;
        } else {
          if (!this.isFetch) return;
        }

        if (this.loading) return;
        this.setLoading(true);

        const res = await request({
          baseURL: "/",
          url: this.api,
          data: payload,
        }).then(res => {
          this.dataBack(res);
          if (this.$page) this.$page.$emit("page.listChange", res.data);
          return res;
        }).catch(err => {
          console.error(err);
        }).finally(() => {
          this.setLoading(false);
        });

        if (res.statusCode === 600) {
          let list = []; let pageNum = 1; let pageSize = 10; let total = 0;

          if (this.hasPagination) {
            list = res.data.list;
            pageNum = res.data.pageNum;
            pageSize = res.data.pageSize;
            total = res.data.total;
          } else {
            list = res.data;
          }

          this.pageNum = pageNum;
          this.list = this.listFormatter(list);
          this.pageSize = pageSize;
          this.total = total;
        }
        return res;
      }
      return null;
    },
    handlePaginationChange(pagination, changeType) {
      if (changeType === "sizeChange" && this.$fixTable) {
        this.$nextTick(() => {
          this.$fixTable.trigger();
        });
      }

      this.fetch(pagination);
      this.$emit("paginationChange", pagination);
    },
    resetPageNum() {
      this.pageNum = defaultPagination.pageNum;
    },
    resetSort() {
      this.activeSortFields = [];
    },
    refresh(pageNum) {
      if (pageNum) {
        this.fetch({ pageNum });
      } else {
        this.fetch();
      }
    },
    reset() {
      this.resetPageNum();
      this.pageSize = defaultPagination.pageSize;
      this.total = 0;
      this.setLoading(false);
      this.list = [];
    },
    setLoading(isLoading) {
      this.loading = isLoading;
      if (this.$page) this.$page.$emit("page.setLoading", isLoading);
    },
    getLoading() {
      return this.loading;
    },
    getColumnsShow(column) {
      const columnsShowList = {
        index: this.innerCheckedColumns.indexOf("序号") !== -1,
        selection: true,
        expand: true,
      };

      if (columnsShowList[column.type]) {
        return columnsShowList[column.type];
      } else {
        return this.innerCheckedColumns.indexOf(column.label) !== -1;
      }
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows;
      if (this.$page) this.$page.$emit("page.setSelectedRows", rows);
      if (this.isEventExist("selection-change")) this.events["selection-change"](rows);
    },
    handleExpandChange(row, expanded) {
      // const expandInstance = this.$refs[`Expand-${row.id}`];
      // if (expandInstance && expandInstance.onExpand) {
      //   expandInstance.onExpand(row, expanded);
      // }
      this.expandRow = { ...row };
      this.expandedRows = { ...expanded };
      if (this.isEventExist("expand-change")) this.events["expand-change"](row, expanded);
    },
    rowClick(row, column, event) {
      if (this.$page) this.$page.$emit("page.rowClick", row, column, event);
      if (this.isEventExist("row-click")) this.events["row-click"](row, column, event);
      // 设置选中
      if (this.isSelectWhenClick) {
        const index = this.inSelectedRowsIndex(row);
        this.$refs["table"].toggleRowSelection(row, index === -1);
      }
    },
    handleRowDbClick(row, column, event) {
      if (this.$page) this.$page.$emit("page.rowDbClick", row, column, event);
      if (this.isEventExist("row-dblclick")) this.events["row-dblclick"](row, column, event);
      if (this.dbClickShowDetailForm) {
        if (this.$page) {
          const detailForm = this.$page.getDetailForm();
          if (detailForm) {
            detailForm.load(row.id, (res) => {
              if (res.statusCode === 600) {
                detailForm.show(res.data);
              }
            });
          }
        }
      }
    },
    rowContextMenu(row, column, event) {
      const that = this;
      if (this.cellMenus.length) {
        CellMenu({
          data: this.cellMenus.map(menu => ({
            ...menu,
            name: menu.label,
            disabled: (menu.props || {}).disabled || false,
          })),
          row,
          event,
          onClick: function(item, row) {
            if (item.type === 'delete') that.cellMenuDelete(row, item);
            if (item.events && item.events.click) item.events.click(row);
          },
        });
      }
      if (this.isEventExist("cell-contextmenu")) this.events["cell-contextmenu"](row, column, event);
    },
    inSelectedRowsIndex(row) {
      let index = -1;
      for (let i = 0, len = this.selectedRows.length; i < len; i++) {
        if (this.selectedRows[i].id === row.id) {
          index = i;
          break;
        }
      }
      return index;
    },
    async cellMenuDelete(row, item) {
      if (item.props && item.props.api) {
        const { id } = row;
        const { confirmMessageFormatter } = item.props;
        const isConfirm = await this.$doingConfirm(confirmMessageFormatter ? confirmMessageFormatter(row) : { title: "删除", message: "确实要删除这条数据吗?" }).catch(() => {});
        if (isConfirm !== 'confirm') return;
        const response = await request({
          url: item.props.api,
          data: {
            id: id,
          },
        });
        if (response.statusCode === 600) {
          this.$message.success("删除成功");
          if (item.events && item.events.deleteSuccess) item.events.deleteSuccess();
          this.refresh(1);
        }
      } else {
        console.error("缺少api");
      }
    },
    getTooltipShow(column) {
      return !(column.type === "index" || column.type === 'selection' || column.type === 'handlers');
    },
    renderHeader(h, params) {
      const { column } = params;
      if (this.sortFields.includes(column.property)) {
        return ListHeaderSorter(h, params, {
          onClick: this.handleSortChange,
          activeFields: this.activeSortFields,
        });
      } else {
        return h("span", column.label);
      }
    },
    handleSortChange(sort) {
      if (this.sortType === 'single') {
        sort = sort.length > 0 ? [sort[sort.length - 1]] : [];
      }
      this.activeSortFields = [...sort];

      const sortField = sort.map(item => {
        const splitArr = item.split("&");
        return {
          filed: splitArr[0],
          asc: splitArr[1] === 'desc' ? 'desc' : 'asc',
        };
      });
      this.fetch({
        sortField,
      });
    },
    getColumnTemplateShow(column) {
      return ['handlers', 'expand', 'component'].indexOf(column.type) !== -1 || !!column.htmlFormatter;
    },
    getExpandRef(refString) {
      if (!refString) return this.$refs;
      return this.$refs[refString];
    },

    isEventExist(eventName) {
      return this.events && this.events[eventName];
    },
  },
};
</script>
