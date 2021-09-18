<template>
  <div v-bind="$attrs" v-on="$listeners">
    <slot :loading="loading" :list="list" :total="total" :page-num="pageNum" :page-size="pageSize" />
    <pagination
      :page-num="pageNum"
      :page-size="pageSize"
      :on-change="handlePaginationChange"
      :total="total"
    />
  </div>
</template>

<script>
import { defaultPagination } from "@/config/index";
import { request } from "@/utils";
import props from "./props";

export default {
  name: "Table",
  mixins: [props],
  data() {
    return {
      ...defaultPagination,
      total: 0,
      list: [],
      loading: false,
    };
  },
  watch: {
    params: {
      handler: function() {
        this.fetch({ pageNum: 1 });
      },
      deep: true,
    },
  },
  created() {
    if (!this.initNoFetch) this.fetch();
  },
  methods: {
    async fetch(params) {
      if (this.api) {
        if (this.loading) return;
        this.loading = true;
        const res = await request({
          baseURL: "/",
          url: this.api,
          data: { pageSize: this.pageSize, pageNum: this.pageNum, ...params, ...this.params },
        }).then(res => {
          this.$emit("dataBack", res);
          return res;
        }).catch(err => {
          console.error(err);
        }).finally(() => {
          this.loading = false;
        });
        if (res.statusCode === 600) {
          const { list, pageNum, pageSize, total } = res.data;
          this.pageNum = pageNum;
          this.list = this.dataHandler(list);
          this.pageSize = pageSize;
          this.total = total;
        }
        return res;
      }
      return null;
    },
    handlePaginationChange(pagination) {
      this.fetch(pagination);
      this.$emit("paginationChange", pagination);
    },
    resetPageNum() {
      this.pageNum = defaultPagination.pageNum;
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
      this.loading = false;
      this.list = [];
    },
    getLoading() {
      return this.loading;
    },
  },
};
</script>
