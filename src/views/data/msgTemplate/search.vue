<template>
  <!-- 数据管理-字段管理 搜索 -->
  <el-row :gutter="10">
    <el-col :span="8">
      <el-form-item label="标题:" prop="title">
        <el-input v-model="search.title" placeholder="请输入标题" clearable @keyup.enter.native="handleSearch" />
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="代码:" prop="code">
        <el-input v-model="search.code" placeholder="请输入代码" clearable @keyup.enter.native="handleSearch" />
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="内容:" prop="content">
        <el-input v-model="search.content" placeholder="请输入内容" clearable @keyup.enter.native="handleSearch" />
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="适用范围:" prop="appId">
        <dictionary-selector v-model="search.appId" code="general_app" />
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'Search',
  props: {
    search: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    // 搜索
    handleSearch() {
      this.$emit('search', this.search);
    },
    // 重置
    handleReset() {
      this.$emit('reset');
    },
  },
};
</script>
