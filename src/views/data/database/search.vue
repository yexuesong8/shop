<template>
  <!-- 数据管理-数据库管理 搜索 -->
  <el-form ref="search" :model="search" :inline="true">
    <el-form-item label="数据库名称" prop="name">
      <el-input
        v-model="search.name"
        placeholder="请输入数据库名称"
        clearable
        size="small"
        @keyup.enter.native="handleSearch"
      />
    </el-form-item>
    <el-form-item label="数据库代码" prop="code">
      <el-input
        v-model="search.code"
        placeholder="请输入数据库代码"
        clearable
        size="small"
        @keyup.enter.native="handleSearch"
      />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="search.status" placeholder="数据状态" clearable size="small">
        <el-option
          v-for="item in statusOptions"
          :key="item.key"
          :label="item.value"
          :value="item.label"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
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
    ...mapState("database", [
      "loading",
      "search",
    ]),
  },
  methods: {
    handleSearch() {
      this.$store.dispatch("database/getByPage");
    },

    handleReset() {
      this.$store.commit("setSearch", {});
      this.resetForm('search');
    },
  },
};

</script>
