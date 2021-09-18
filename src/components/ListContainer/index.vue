<template>
  <el-row>
    <FindForm ref="Form" v-bind="formProps" v-on="formEvent" @search="handleSearch" @reset="handleReset">
      <template v-slot:default="slot">
        <slot name="form" :search="slot.search" :reset="slot.reset" :refresh="() => refresh()" :form="slot.form" :loading="getLoading()" />
      </template>
    </FindForm>
    <Table
      ref="Table"
      :api="api"
      :params="searchParams"
      :init-no-fetch="initNoFetch"
      :data-handler="dataHandler"
      @dataBack="dataBack"
      @paginationChange="handlePaginationChange"
    >
      <template v-slot:default="slot">
        <slot name="table" :loading="slot.loading" :list="slot.list" :page-num="slot.pageNum" :page-size="slot.pageSize" />
      </template>
    </Table>
  </el-row>
</template>

<script>
import Table from "@/components/Table";
import FindForm from "@/components/FindForm";
import TableProps from "@/components/Table/props";

export default {
  name: "ListContainer",
  components: { Table, FindForm },
  mixins: [TableProps],
  props: {
    formProps: {
      type: Object,
      default: () => ({}),
    },
    formEvent: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      searchParams: {},
    };
  },
  watch: {
    params: {
      handler: function(value) {
        this.searchParams = { ...this.searchParams, ...(value || {}) };
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleSearch(params) {
      this.searchParams = { ...this.params, ...params };
      this.$emit("search", this.searchParams);
    },
    handleReset() {
      this.searchParams = {};
      this.$emit("reset");
    },
    getLoading() {
      const table = this.$refs["Table"];
      if (table) return table.getLoading();
      return false;
    },
    getTable() {
      return this.$refs["Table"];
    },
    getForm() {
      return this.$refs["Form"];
    },
    refresh(pageNum) {
      this.$refs["Table"].refresh(pageNum);
    },
    dataBack(data) {
      this.$emit("dataBack", data);
    },
    handlePaginationChange(pagination) {
      this.$emit("paginationChange", pagination);
    },
  },
};
</script>
