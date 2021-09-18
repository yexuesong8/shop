<script>
import { request } from "@/utils";
import { getRabbitConsolePrefix } from "@/config";

export default {
  name: "PageDelete",
  inject: ["$page"],
  props: {
    api: {
      type: String,
      default: "",
    },
    confirmMessageFormatter: {
      type: Function,
      default: (row) => ({ title: "删除", message: "确实要删除数据吗?" }),
    },
    selectedRows: {
      type: Array,
      default: () => [],
    },
    row: {
      type: Object,
      default: () => ({}),
    },
    deleteType: {
      type: String,
      default: "single", // batch, single
    },
  },
  methods: {
    async handleDelete() {
      if (!(this.api || this.$page.api.delete || this.$page.api.deleteBatch)) {
        console.error(`${getRabbitConsolePrefix("page-delete")}没有传入必须的删除接口api`);
        return;
      }

      if (!this.row.id && !this.selectedRows.length) return;

      const isConfirm = await this.$doingConfirm(this.confirmMessageFormatter(this.row.id ? this.row : this.selectedRows)).catch(() => {});
      if (isConfirm !== 'confirm') return;

      let payload = {};
      if (this.deleteType === 'single') {
        payload = { id: this.row.id };
      } else {
        payload = { ids: this.selectedRows.map(row => row.id) };
      }

      const res = await request({ baseURL: "/", url: this.api || (this.deleteType === 'single' ? this.$page.api.delete : this.$page.api.deleteBatch), data: payload });
      if (res.statusCode === 600) {
        this.$message.success("删除成功");
        this.$emit("deleteSuccess");
      }
    },
  },
};
</script>
