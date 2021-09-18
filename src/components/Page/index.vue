<template>
  <div class="rb-page-container">
    <FixTableHeight :has-pagination="table.hasPagination !== false" :is-show-pagination="table.isShowPagination !== false">
      <template #top>
        <div v-if="$scopedSlots.extraAboveForm" class="mb10">
          <slot name="extraAboveForm" />
        </div>
        <div class="t-part clearfix">
          <div class="page-find-form">
            <PageFindForm
              ref="pageForm"
              :form="form"
              :has-filter="hasFilter"
              :params="formExtraParams"
              :default-params="formDefaultParams"
              :loading="loading"
              @reset="handleReset"
              @search="handleSearch"
            >
              <template v-if="$scopedSlots.form" v-slot:search="slot">
                <slot name="form" :search="slot.search" :reset="slot.reset" :refresh="() => refresh()" :form="slot.form" :loading="slot.loading" />
              </template>
              <template v-slot:tools="slot">
                <slot name="basicSearch" :search="slot.search" :reset="slot.reset" :refresh="() => refresh()" :form="slot.form" :loading="slot.loading" />
              </template>
            </PageFindForm>
          </div>
          <div class="page-tool-bar">
            <ToolBar :toolbar-buttons="computedToolbarButtons" />
          </div>
        </div>
        <div v-if="$scopedSlots.extraAboveTable" class="c-part mt10">
          <slot name="extraAboveTable" />
        </div>
      </template>
      <template #bottom>
        <PageList
          v-if="!$scopedSlots.table"
          ref="pageList"
          :api="listApi || api.page"
          :params="searchParams"
          :checked-columns="tableColumns"
          :ordered-columns="orderedColumns"
          v-bind="getTableProps"
        />
        <template v-else ref="pageList">
          <slot name="table" :params="searchParams" :checked-columns="tableColumns" />
        </template>
      </template>
    </FixTableHeight>

    <detail-form
      v-if="!isEmptyObject(detailForm)"
      ref="detailForm"
      :show-create-button="false"
      v-bind="detailForm.props || {}"
      v-on="detailForm.events || {}"
    >
      <template v-if="$scopedSlots.detailForm" v-slot:form="props">
        <slot name="detailForm" :form="props.form" />
      </template>
    </detail-form>

    <TablePrinting
      v-if="isPrinting"
      :list="list"
      :api="api.conditionAll"
      :columns="table.columns"
      :props="table.props"
      :width="printingTable.width"
      :search-params="searchParams"
      :print-type-list="printingTable.printTypeList"
      :print-prop-list="printingTable.printPropList"
      :type="printingTable.type"
    />
  </div>
</template>

<script>
import { isObject, isEmptyObject } from "@monkey.do/monkey";
import { api } from "@/utils";
import ToolBar from "@/components/ToolBar";
import PageList from "@/components/PageList";
import PageFindForm from "./findForm";
import FormMixProps from "./findForm/props";
import ToolbarMixProps from "@/components/ToolBar/props";
import ListMixProps from "@/components/PageList/props";
import DetailForm from "@/components/DetailForm";
import TablePrinting from "@/components/TablePrinting";

export default {
  name: "Page",
  components: {
    ToolBar,
    PageList,
    PageFindForm,
    DetailForm,
    TablePrinting,
  },
  mixins: [FormMixProps, ToolbarMixProps, ListMixProps],
  props: {
    form: {
      type: Object,
      default: () => ({
        props: {
        },
        events: {},
        items: [],
        defaultParams: {},
        params: {},
      }),
    },
    table: {
      type: Object,
      default: () => ({
        props: {},
        events: {},
      }),
    },
    listApi: {
      type: String,
      default: "",
    },
    baseApi: {
      type: String,
      default: "",
    },
    detailForm: {
      type: Object,
      default: () => ({}),
    },
    printingTable: {
      type: Object,
      default: () => ({
        printTypeList: null,
        printPropList: null,
        type: '0',
        width: null,
      }),
    },
  },
  provide() {
    return {
      $page: this,
      api: this.api,
    };
  },
  data() {
    return {
      PageFindForm,
      disabled: true,
      selectedRows: [],
      loading: false,
      tableColumns: [],
      orderedColumns: [],
      printColumns: [], // 需要打印的columns
      searchParams: {}, // 查询参数
      api: {},
      list: [],
    };
  },
  computed: {
    computedToolbarButtons() {
      return this.toolbarButtons.map(button => {
        // TODO:应该放在Toolbar里面处理??
        let typeCase = '';
        let obj = {};

        if (isObject(button)) {
          typeCase = button.type;
          obj = button;
        } else {
          typeCase = button;
          obj = {
            type: button,
          };
        }

        switch (typeCase) {
          case "update":
            return this.handleToolbarUpdateButton(obj);
          case "delete":
            return this.handleToolbarDeleteButton(obj);
          default: return obj;
        }
      });
    },
    getTableProps() {
      return {
        ...this.table,
      };
    },
    formExtraParams() {
      return this.form.params;
    },
    formDefaultParams() {
      return this.form.defaultParams;
    },
  },
  watch: {
    /** 在不存在columns-filter时 设置全部显示 */
    table: {
      handler: function(table) {
        if (!this.handleHasColumnsFilter()) {
          const initColumns = [];
          (table.columns || []).forEach(column => {
            if (column.type === 'index') {
              initColumns.push("序号");
            } else {
              if (column.label) {
                initColumns.push(column.label);
              }
            }
          });
          this.setCheckedColumns(initColumns);
        }
      },
      immediate: true,
    },
    /** 额外的查询参数: 没有在form表单内 */
    formExtraParams: {
      handler: function(newValue, oldValue) {
        if (!this.isEqualObject(newValue || {}, oldValue || {})) {
          const modelForm = this.$refs["pageForm"] ? this.$refs["pageForm"].getModelForm() : {};
          this.searchParams = {
            ...this.formDefaultParams,
            ...modelForm,
            ...newValue,
          };
        }
      },
      immediate: true,
      deep: true,
    },
    /** 表单的默认查询参数 */
    formDefaultParams: {
      handler: function(newValue, oldValue) {
        if (!this.isEqualObject(newValue || {}, oldValue || {})) {
          this.searchParams = {
            ...this.searchParams,
            ...newValue,
          };
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.$on("page.setSelectedRows", this.setSelectedRows);
    this.$on("page.setLoading", this.setLoading);
    this.$on("page.columnsChange", this.setCheckedColumns);
    this.$on("page.columnsOrderChange", this.columnsOrderChange);
    this.$on("page.refresh", this.refresh);
    this.$on("page.listChange", this.listChange);
    this.api = api.generator(this.baseApi);
  },
  methods: {
    setSelectedRows(keys = []) {
      this.selectedRows = keys;
    },
    setLoading(isLoading) {
      this.loading = isLoading;
    },
    setCheckedColumns(columns) {
      this.tableColumns = columns;
    },
    columnsOrderChange(columns) {
      this.orderedColumns = columns;
    },
    listChange(data = {}) {
      this.list = data.list || [];
    },
    handleHasColumnsFilter() {
      let hasColumnsFilter = false;

      const toolbarButtons = this.toolbarButtons;
      for (let i = 0, len = toolbarButtons.length; i < len; i++) {
        if (isObject(toolbarButtons[i])) {
          if (toolbarButtons[i].type === 'columns-filter') {
            hasColumnsFilter = true;
            break;
          }
        } else {
          if (toolbarButtons[i] === 'columns-filter') {
            hasColumnsFilter = true;
            break;
          }
        }
      }

      return hasColumnsFilter;
    },
    handleToolbarUpdateButton(button) {
      return {
        ...button,
        props: {
          disabled: this.selectedRows.length !== 1,
          id: (this.selectedRows[0] || { id: "" }).id,
          row: this.selectedRows[0] || {},
          ...button.props,
        },
      };
    },
    handleToolbarDeleteButton(button) {
      return {
        ...button,
        props: {
          disabled: !this.selectedRows.length,
          ids: this.selectedRows.map(row => row.id),
          selectedRows: this.selectedRows,
          deleteType: "batch",
          ...button.props || {},
        },
        events: {
          ...button.events || {},
          deleteSuccess: () => {
            this.refresh(1);
          },
        },
      };
    },
    refresh(pageNum) {
      this.$refs["pageList"].refresh(pageNum);
    },
    search(params) {
      const modelForm = this.$refs["pageForm"].getModelForm();
      this.searchParams = { ...this.form.defaultParams, ...this.form.params, ...params, ...modelForm };
    },
    handleSearch(params) {
      this.searchParams = { ...this.searchParams, ...params };
      this.$emit("search", this.searchParams);
    },
    handleReset() {
      this.searchParams = { ...this.formDefaultParams };
      this.$emit("reset");
      this.$emit("update:params", {});
      this.getTable().resetSort();
    },
    getTable() {
      return this.$refs["pageList"];
    },
    getForm() {
      return this.$refs["pageForm"];
    },
    getExpandRef(refString) {
      return this.getTable().getExpandRef(refString);
    },
    getDetailForm() {
      return this.$refs["detailForm"];
    },
    isEmptyObject(object) {
      return isEmptyObject(object);
    },
    isEqualObject(obj1, obj2) {
      if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
      } else {
        const keys = Object.keys(obj1);
        for (let i = 0, len = keys.length; i < len; i++) {
          if (obj1[keys[i]] !== obj2[keys[i]]) return false;
        }
        return true;
      }
    },
  },
};
</script>

<style lang="scss">
.rb-page-container {
  position: relative;
  height: 100%;
  overflow: hidden;
  .t-part {
    position: relative;
    min-height: 32px;
    .page-tool-bar {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
