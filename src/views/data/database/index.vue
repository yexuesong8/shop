<template>
  <!-- 数据管理-数据库管理 页面容器 -->
  <div class="main-content-container">
    <Search />

    <el-row class="mb20">
      <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
    </el-row>

    <!-- 列表 -->
    <List />

    <Detail />

    <table-list v-if="visible" />

  </div>
</template>

<script>
import { mapState } from "vuex";
import List from "./list";
import Search from "./search";
import Detail from "./detail";
import TableList from "./table";

export default {
  name: 'DataBase',
  components: { List, Search, Detail, TableList },
  computed: {
    ...mapState("database", {
      visible: state => state.tableVisible,
    }),
  },
  methods: {
    handleAdd() {
      this.$store.commit("database/setDialog", {
        title: "新增数据库",
        visible: true,
        type: "add",
        detail: {},
      });
    },
  },
};
</script>
