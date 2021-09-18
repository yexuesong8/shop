<template>
  <div class="main-content-container">
    <!-- 属性分组 -->
    <list-container ref="listContainer" api="/api/v1/rabbit/page/property/group/find/page" :form-props="{'label-width': 'auto'}">
      <template v-slot:form="slot">
        <FilterSearch class="mb10">
          <template v-slot:search>
            <el-row class="mt10">
              <el-row :gutter="64">
                <el-col :span="6">
                  <el-form-item label="名称：" prop="name">
                    <el-input v-model="slot.form.name" placeholder="请输入名称" clearable :maxlength="30" @keyup.enter.native="slot.search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="类型：" prop="type">
                    <ListSelector v-model="slot.form.type" wants="id" :json-data="type" source-type="json" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="组件：" prop="componentId">
                    <DropDownTreeSelector
                      v-model="slot.form.componentId"
                      source-type="uri"
                      data-source-uri="/api/v1/rabbit/page/component/find/all"
                      :property="{id: 'id', name: 'name', key: 'id', children: 'components'}"
                      :node-disabled="disabled"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-row type="flex" :gutter="8">
                    <el-col :span="1.5">
                      <el-button type="primary" :loading="slot.loading" @click="slot.search()">确认</el-button>
                    </el-col>
                    <el-col :span="1.5">
                      <el-button @click="slot.reset()">重置</el-button>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-row>
          </template>
          <template v-slot:actions>
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-button type="primary" :disabled="!group.length" @click="handleSort">排序</el-button>
          </template>
        </FilterSearch>
      </template>
      <template v-slot:table="table">
        <el-table v-loading="table.loading" :data="table.list" border>
          <el-table-column type="index" fixed="left" />
          <el-table-column label="名称" prop="name" min-width="100" show-overflow-tooltip />
          <el-table-column label="类型" prop="type" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.type==1?"公有":"私有" }}
            </template>
          </el-table-column>
          <el-table-column label="组件" prop="componentName" min-width="100" show-overflow-tooltip />
          <el-table-column label="图标" prop="icon" min-width="100" show-overflow-tooltip />
          <el-table-column label="顺序" prop="sortNum" min-width="100" show-overflow-tooltip />
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
              <el-button type="text" @click="handleEditor(scope.row)">修改</el-button>
              <el-button type="text" @click="handleDel(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <no-data />
          </template>
        </el-table>
      </template>
    </list-container>
    <!-- 新增&修改 -->
    <Detail v-if="visible" :visible="visible" :form="form" :title="title" @close="handleClose" @update="handleUpdate" />
    <!-- 排序 -->
    <Sort :visible="sortVisible" :title="title" :sort-list="group" @close="handleClose" />
  </div>
</template>

<script>
import { findGroup, delGroup } from "@/api/page/propertiesGroup";
import { ListContainer } from "@/components";
import Detail from "./detail";
import Sort from "./sort";

export default {
  name: "PropertiesGroup",
  components: {
    ListContainer,
    Detail,
    Sort,
  },
  data() {
    return {
      // 是否显示新增&修改
      visible: false,
      // 类型
      type: [
        { "id": "1", "name": "公有" },
        { "id": "2", "name": "私有" },
      ],
      // 是否显示排序
      sortVisible: false,
      // 模态标题
      title: "",
      // 属性分组
      group: [],
      // 表单
      form: {
        icon: "",
      },
    };
  },
  created() {
    this.getGroup();
  },
  methods: {
    // 查询属性分组
    async getGroup() {
      const { statusCode, data } = await findGroup();
      if (statusCode === 600) {
        this.group = data;
      }
    },
    // 新增
    handleAdd() {
      this.visible = true;
      this.title = "新增属性分组";
    },
    // 排序
    handleSort() {
      this.sortVisible = true;
      this.title = "排序";
      this.getGroup();
    },
    // 修改
    handleEditor(row) {
      this.title = "修改属性分组";
      this.visible = true;
      this.form = { ...row };
      this.form.type = this.form.type === 1 ? "公有" : "私有";
    },
    // 删除
    handleDel(id) {
      this.$doingConfirm({ title: "删除属性分组", message: "确定要删除当前属性分组吗?" })
        .then(async() => {
          const { statusCode } = await delGroup({ id: id });
          if (statusCode === 600) {
            this.msgSuccess("删除成功");
            this.handleUpdate();
          }
        })
        .catch(() => console.log("删除取消"));
    },
    // 刷新
    handleUpdate() {
      this.$refs.listContainer.refresh(1);
    },
    // 关闭模态框
    handleClose() {
      this.form = {
        icon: "",
      };
      this.visible = false;
      this.sortVisible = false;
    },
    // 禁用
    disabled(data, node) {
      if (node.childNodes.length) {
        return true;
      }
    },
  },
};
</script>
