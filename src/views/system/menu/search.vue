<template>
  <!-- 系统管理-菜单管理 搜索 -->
  <div class="search mt10">
    <el-form label-width="auto" class="no-margin">
      <el-row :gutter="8">
        <el-col :span="6">
          <el-form-item label="菜单名称:">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入菜单名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <ApplicationItem v-model="queryParams.appId" />
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态:">
            <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
              <el-option
                v-for="item in statusOptions"
                :key="item.key"
                :label="item.value"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="handleQuery">搜索</el-button>
            <el-button @click="handleRest">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { ApplicationItem } from "@/components";

export default {
  components: { ApplicationItem },
  props: {
    queryParams: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 菜单状态数据字典
      statusOptions: [
        { key: 1, label: 1, value: "启用" },
        { key: 0, label: 0, value: "停用" },
      ],
    };
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.$emit("getList", this.queryParams);
    },
    handleRest() {
      this.$emit("update:queryParams", {});
    },
  },
};
</script>
