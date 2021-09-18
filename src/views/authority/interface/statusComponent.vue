<template>
  <el-switch :value="data" @change="handleSwitchChange" />
</template>

<script>
import { update } from '@/api/authority/api';

export default {
  name: "StatusComponent",
  inject: ["$pageList"],
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
    column: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      data: "1",
    };
  },
  watch: {
    row: {
      handler(val) {
        this.data = val.enabled === 1;
      },
      deep: true,
    },
  },
  mounted() {
    this.data = this.row.enabled === 1;
  },
  methods: {
    // 修改状态
    handleSwitchChange(val) {
      const text = this.row.enabled === 1 ? "停用" : "启用";
      this.$confirm(`确认要${text}吗?`, "状态修改", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      })
        .then(() => {
          update({ ...this.row, enabled: val ? 1 : 0 });
        })
        .then(() => {
          this.msgSuccess(text + "成功");
          this.$pageList.refresh(1);
        });
    },
  },
};
</script>
