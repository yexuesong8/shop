<!-- 设置中心-组件设置 -->
<template>
  <div class="main-content-container">
    <el-row :gutter="20">
      <el-col :span="6" :style="{height: '660px', overflowY: 'auto', borderRight: '1px solid #ccc'}">
        <EditableTree
          title="组件分类"
          :tree-props="{ draggable: true }"
          sort-api="/api/v1/rabbit/home/component/type/update/tree"
          list-api="/api/v1/rabbit/home/component/type/tree"
          create-api="/api/v1/rabbit/home/component/type/create"
          update-api="/api/v1/rabbit/home/component/type/update"
          delete-api="/api/v1/rabbit/home/component/type/delete"
          :create-params-formatter="(node, data) => ({ parentId: data.parentId, name: data.inputValue })"
          @nodeClick="handleNodeClick"
        >
          <template v-slot:button="slot">
            <el-button type="primary" @click="slot.click">新增分类</el-button>
          </template>
        </EditableTree>
      </el-col>
      <el-col :span="18">
        <el-row class="mb10" type="flex" justify="space-between">
          <el-col :span="6">
            <search-input placeholder="请输入组件名称" clearable :on-input="handleSearchDept" />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="handleAdd">新增组件</el-button>
          </el-col>
        </el-row>

        <Table ref="table" api="/api/v1/rabbit/home/component/type/id/find" :params="params">
          <template v-slot:default="slot">
            <el-table v-loading="slot.loading" :data="slot.list">
              <el-table-column type="index" label="序号" align="center" />
              <el-table-column label="组件名称" prop="name" align="center" show-overflow-tooltip />
              <el-table-column label="组件分类" prop="typeName" align="center" show-overflow-tooltip>
                <template slot-scope="{ row }">
                  <span>{{ row.typeName.replace(/^(\/)/, '') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="地址" prop="path" show-overflow-tooltip />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </Table>
      </el-col>
    </el-row>

    <Dialog :visible.sync="visible" :current-row.sync="currentRow" :title="title" @success="refreshTable()" />
  </div>
</template>
<script>
import { SearchInput } from "@monkey.do/monkey";
import { EditableTree } from "@/components";
import Dialog from "./detail";
import { deleteComponent } from "@/api/setCenter/home";

export default {
  name: "HomeComponent",
  components: {
    EditableTree,
    SearchInput,
    Dialog,
  },
  data() {
    return {
      params: {
        typeId: undefined,
        name: undefined,
      },
      form: {
        region: '',
        name: "",
        address: "",
        picture: "",
      },
      visible: false,
      loading: false,
      currentRow: {},
      componentType: "",
    };
  },
  computed: {
    title() {
      return this.componentType === "add" ? "新增组件" : "修改组件";
    },
  },
  methods: {
    handleSearchDept(value) {
      this.params.name = value;
    },
    handleNodeClick(data) {
      if (!data) {
        this.params.typeId = undefined;
      } else {
        this.params.typeId = data.id;
      }
    },
    // 新增
    handleAdd() {
      this.componentType = "add";
      this.visible = true;
    },
    // 编辑
    handleEdit(row) {
      this.componentType = "update";
      this.currentRow = row;
      this.visible = true;
    },
    // 刷新
    refreshTable() {
      this.$refs.table.refresh(1);
    },
    // 删除
    handleDelete(row) {
      this.$doingConfirm({ title: "删除组件", message: "确定要删除当前组件吗？" })
        .then(() => {
          deleteComponent({ id: row.id }).then(res => {
            if (res.statusCode === 600) {
              this.msgSuccess('删除成功');
              this.refreshTable();
            }
          });
        })
        .catch(() => console.log("取消删除"));
    },
  },
};
</script>
