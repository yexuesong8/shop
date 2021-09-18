<template>
  <!-- 页面组件-搜索-->
  <el-form ref="form" class="mt20 no-margin" :model="form" label-width="auto">
    <div class="flex-between">
      <el-form-item label="组:">
        <list-selector v-model="form.groupId" wants="id" data-source-uri="/api/v1/rabbit/page/component/group/find" source-type="uri" />
      </el-form-item>
      <el-form-item label="名称:">
        <el-input v-model="form.name" clearable placeholder="请输入名称" @keyup.enter.native="search" />
      </el-form-item>
      <el-form-item label="代码:">
        <el-input v-model="form.code" clearable placeholder="请输入代码" @keyup.enter.native="search" />
      </el-form-item>
      <el-form-item label="是否可见:">
        <el-switch v-model="form.visible" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'Search',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        groupId: '',
        name: '',
        code: '',
        visible: true,
      },

    };
  },
  methods: {
    search() {
      this.$emit("search", this.form);
    },
    reset() {
      this.form = {
        groupId: '',
        name: '',
        code: '',
        visible: true,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.search{
  background: #fafafa;
  padding: 24px 24px 6px 24px;
}
</style>
