<template>
  <el-table :data="data">
    <el-table-column type="index" label="序号" />
    <el-table-column label="序号1" prop="index" />
  </el-table>
</template>

<script>
export default {
  name: "ToolbarExpand",
  props: {
    expandRow: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      data: [],
    };
  },
  mounted() {
    console.log(this.expandRow);
  },
  methods: {
  },
};
</script>
