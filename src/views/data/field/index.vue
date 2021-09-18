<template>
  <!-- 数据管理-字段管理 容器 -->
  <div class="main-content-container">
    <Search />

    <el-row class="mb20">
      <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
    </el-row>

    <List />

    <Detail />

  </div>
</template>

<script>
import List from "./list";
import Search from "./search";
import Detail from "./detail";

export default {
  name: 'Field',
  components: { List, Search, Detail },
  methods: {
    handleAdd() {
      this.$store.commit("field/setDialog", {
        title: "新增字段",
        visible: true,
        type: "add",
        detail: {},
      });
    },
  },
};
</script>
