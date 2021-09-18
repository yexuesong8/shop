<template>
  <!-- 数据管理-字段管理 搜索 -->
  <el-form ref="search" :model="search" :inline="true">
    <el-form-item label="字段名称" prop="name">
      <el-input
        v-model="search.name"
        placeholder="请输入字段名称"
        clearable
        size="small"
        @keyup.enter.native="handleSearch"
      />
    </el-form-item>
    <el-form-item label="字段代码" prop="code">
      <el-input
        v-model="search.code"
        placeholder="请输入字段代码"
        clearable
        size="small"
        @keyup.enter.native="handleSearch"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
      <el-button size="mini" @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Search",
  data() {
    return {
      statusOptions: [
        { key: 1, label: 1, value: "启用" },
        { key: 0, label: 0, value: "停用" },
      ],
    };
  },
  computed: {
    ...mapState("field", [
      "loading",
      "search",
    ]),
  },
  methods: {
    handleSearch() {
      this.$store.dispatch("field/getByPage");
    },

    handleReset() {
      this.$store.commit("field/setSearch", {});
      this.resetForm('search');
    },
  },
};

</script>
