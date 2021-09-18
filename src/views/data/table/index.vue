<template>
  <!-- 数据管理-表管理 容器 -->
  <div class="main-content-container">
    <Search />

    <el-row class="mb20">
      <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
    </el-row>

    <!-- 列表 -->
    <List />

    <Detail />

    <field-list v-if="visible && type !== 'add'" />

    <AddFieldList v-if="visible && type === 'add'" />

  </div>
</template>

<script>
import { mapState } from "vuex";
import List from "./list";
import Search from "./search";
import Detail from "./detail";
import FieldList from "./filed";
import AddFieldList from "./addField";

export default {
  name: 'Table',
  components: { FieldList, List, Search, Detail, AddFieldList },
  computed: {
    ...mapState("table", {
      visible: state => state.fieldVisible,
      type: state => state.fieldType,
    }),
  },
  methods: {
    handleAdd() {
      this.$store.commit("table/setDialog", {
        title: "新增表",
        visible: true,
        type: "add",
        detail: {},
      });
    },
  },
};
</script>
