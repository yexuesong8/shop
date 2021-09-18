<template>
  <div class="main-content-container full-fill">
    <!-- 页面模板 -->
    <el-row :gutter="20" class="rb-page-template-container">
      <!--目录数据-->
      <el-col
        :xs="24"
        :sm="9"
        :md="6"
        class="tree-container"
      >
        <EditableTree
          title="目录"
          :highlight.sync="highlight"
          list-api="/api/v1/rabbit/page/template/catalog/tree/find/all"
          create-api="/api/v1/rabbit/page/template/catalog/create"
          update-api="/api/v1/rabbit/page/template/catalog/update"
          delete-api="/api/v1/rabbit/page/template/catalog/delete"
          sort-api="/api/v1/rabbit/page/template/catalog/tree/sort"
          @nodeClick="handleNodeClick"
        >
          <template v-slot:button="slot">
            <el-button type="primary" @click="slot.click">新增目录</el-button>
          </template>
        </EditableTree>
      </el-col>
      <el-col :xs="24" :sm="15" :md="18">
        <!-- 模板数据 -->
        <list-container ref="listContainer" api="/api/v1/rabbit/page/template/find/page" :params="params" :form-props="{'label-width': 'auto'}">
          <template v-slot:form="slot">
            <FilterSearch class="mb10">
              <template v-slot:search>
                <el-row class="mt10">
                  <el-row :gutter="64">
                    <el-col :span="6">
                      <el-form-item label="名称：" prop="name">
                        <el-input v-model="slot.form.name" clearable placeholder="请输入名称" :maxlength="30" @keyup.enter.native="slot.search()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="代码" prop="code">
                        <el-input v-model="slot.form.code" clearable placeholder="请输入代码" :maxlength="50" @keyup.enter.native="slot.search()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-row type="flex" :gutter="8">
                        <el-col :span="1.5">
                          <el-button type="primary" :loading="slot.loading" @click="slot.search()">确认</el-button>
                        </el-col>
                        <el-col :span="1.5">
                          <el-button @click="() => reset(slot)">重置</el-button>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-row>
              </template>
              <template v-slot:actions>
                <el-button type="primary" @click="handleAdd">新增</el-button>
              </template>
            </FilterSearch>
          </template>
          <template v-slot:table="table">
            <el-table v-loading="table.loading" :data="table.list" border>
              <el-table-column type="index" />
              <el-table-column label="名称" prop="name" min-width="100" show-overflow-tooltip />
              <el-table-column label="代码" prop="code" min-width="100" show-overflow-tooltip />
              <el-table-column label="所属目录" prop="catalogName" min-width="100" show-overflow-tooltip />
              <el-table-column label="描述" prop="description" min-width="100" show-overflow-tooltip />
              <el-table-column label="创建人" prop="creatorName" min-width="150" show-overflow-tooltip />
              <el-table-column label="创建时间" prop="createTime" width="160" show-overflow-tooltip>
                <template v-slot:default="slot">
                  {{ parseTime(slot.row.createTime) }}
                </template>
              </el-table-column>
              <el-table-column label="修改人" prop="updatorName" width="140" show-overflow-tooltip />
              <el-table-column label="修改时间" prop="updateTime" min-width="100" show-overflow-tooltip>
                <template v-slot:default="slot">
                  {{ parseTime(slot.row.updateTime) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleEditor(scope.row.id, scope.row.catalogId)">修改</el-button>
                  <el-button type="text" @click="handleDel(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
              <template v-slot:empty>
                <no-data />
              </template>
            </el-table>
          </template>
        </list-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ListContainer, EditableTree } from "@/components";
import { NoData, FilterSearch } from "@monkey.do/monkey";
import { del } from "@/api/page/template";

export default {
  name: "PageTemplate",
  components: {
    NoData,
    ListContainer,
    FilterSearch,
    EditableTree,
  },
  data() {
    return {
      params: {},
      catalogId: "",
      highlight: true,
    };
  },
  methods: {
    // 新增
    handleAdd() {
      if (this.catalogId) {
        this.$router.push(
          {
            path: "/rabbit/page/design",
            query: {
              catalogId: this.catalogId,
            },
          });
      } else {
        this.msgError("请选择目录");
      }
    },
    // 修改
    handleEditor(id, catalogId) {
      this.$router.push({
        path: "/rabbit/page/design",
        query: {
          id,
          catalogId,
        },
      });
    },
    // 删除
    handleDel(id) {
      this.$doingConfirm({ title: "删除模板", message: "确定删除当前模板吗？" })
        .then(async() => {
          const { statusCode } = await del({ id: id });
          if (statusCode === 600) {
            this.msgSuccess("删除成功");
            this.$refs.listContainer.refresh(1);
          }
        })
        .catch(() => console.log("删除取消"));
    },
    // 重置
    reset(slot) {
      slot.reset();
      this.form = {};
      this.highlight = false;
    },
    // 目录
    handleNodeClick(data) {
      this.catalogId = data.id;
      this.params = { ...this.params, catalogId: data.id };
      this.highlight = true;
    },
  },
};
</script>

<style lang="scss">
.rb-page-template-container {
  height: 100%;
  .tree-container {
    height: 100%;
    overflow-y: auto;
    overflow-x: auto;
  }
}
</style>
