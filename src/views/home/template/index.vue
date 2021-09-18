<!-- 设置中心-首页模板 -->
<template>
  <div class="main-content-container">
    <ListContainer ref="listContainer" api="/api/v1/rabbit/home/template/find/page">
      <template v-slot:form="slot">
        <el-row class="mb10 fr" :gutter="8">
          <el-col :span="1.5">
            <el-button type="primary" @click="addTemplate">新增模板</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button class="el-icon-refresh" :loading="slot.loading" @click="slot.search" />
          </el-col>
        </el-row>
      </template>
      <template v-slot:table="slot">
        <el-table v-loading="slot.loading" :data="slot.list">
          <el-table-column prop="name" label="模板名称" />
          <el-table-column prop="roleNames" label="适用对象" show-overflow-tooltip />
          <el-table-column prop="creatorName" label="创建人" show-overflow-tooltip />
          <el-table-column label="更新时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="启用状态">
            <template slot-scope="{ row }">
              <span>{{ row.status ? '启用' : '停用' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="{ row }">
              <el-button type="text" @click="handleEdit(row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ListContainer>
  </div>
</template>

<script>
import { ListContainer } from "@/components";
import { deleteTemplate } from "@/api/home/template";

export default {
  name: "TemplateList",
  components: { ListContainer },
  data() {
    return {
    };
  },
  methods: {
    // 新增
    addTemplate() {
      this.$router.push('/rabbit/home/template/create');
    },
    // 编辑
    handleEdit(row) {
      this.$router.push({
        path: '/rabbit/home/template/update',
        query: {
          id: row.id,
        },
      });
    },
    // 删除
    handleDelete(row) {
      this.$doingConfirm({ title: "删除模板", message: "确定要删除当前模板吗？" })
        .then(() => {
          deleteTemplate({ id: row.id }).then(res => {
            if (res.statusCode === 600) {
              this.msgSuccess('删除成功');
              this.$refs.listContainer.refresh(1);
            }
          });
        })
        .catch(() => console.log("取消删除"));
    },
  },
};
</script>
