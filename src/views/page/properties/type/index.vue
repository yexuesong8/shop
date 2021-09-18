<template>
  <div class="main-content-container">
    <!-- 属性类型 -->
    <list-container ref="listContainer" api="/api/v1/rabbit/page/property/type/find/page" :form-props="{'label-width': 'auto'}">
      <template v-slot:form="slot">
        <!-- 搜索 -->
        <FilterSearch class="mb10">
          <template v-slot:search>
            <el-row class="mt10">
              <el-row :gutter="64">
                <el-col :span="6">
                  <el-form-item label="名称:">
                    <el-input v-model="slot.form.name" placeholder="请输入属性名称" clearable @keyup.enter.native="slot.search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="编辑器:">
                    <el-input v-model="slot.form.editor" placeholder="请输入编辑器" clearable @keyup.enter.native="slot.search()" />
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
            <el-button type="primary" :disabled="!typeList.length" @click="handleSort">排序</el-button>
          </template>
        </FilterSearch>
      </template>
      <!-- 表格数据 -->
      <template v-slot:table="table">
        <el-table v-loading="table.loading" :data="table.list" border>
          <el-table-column type="index" />
          <el-table-column label="属性名称" prop="name" show-overflow-tooltip />
          <el-table-column label="代码" prop="code" show-overflow-tooltip />
          <el-table-column label="编辑器" prop="editor" show-overflow-tooltip />
          <el-table-column label="顺序" prop="sortNum" width="50" />
          <el-table-column label="描述" prop="description" show-overflow-tooltip />
          <el-table-column label="创建人" prop="creatorName" />
          <el-table-column label="创建时间" prop="createTime" width="150" show-overflow-tooltip>
            <template v-slot:default="slot">
              {{ parseTime(slot.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="修改人" prop="updatorName" />
          <el-table-column label="修改时间" prop="updateTime" width="150" show-overflow-tooltip>
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
    <!-- 新增&修改模态框 -->
    <Dialog
      v-if="visible"
      :title="title"
      :visible="visible"
      width="500px"
      :loading="loading"
      @cancel="cancel"
      @confirm="submitForm"
    >
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="auto">
        <el-form-item prop="name" label="属性名称:">
          <el-input v-model="addForm.name" clearable placeholder="请输入属性名称" :maxlength="50" />
        </el-form-item>
        <el-form-item prop="code" label="代码:">
          <el-input v-model="addForm.code" clearable placeholder="请输入代码" :maxlength="50" />
        </el-form-item>
        <el-form-item prop="editor" label="编辑器:">
          <el-input v-model="addForm.editor" clearable placeholder="请输入编辑器" :maxlength="100" />
        </el-form-item>
        <el-form-item prop="sortNum" label="顺序:">
          <el-input-number v-model="addForm.sortNum" :min="1" :maxlength="12" />
        </el-form-item>
        <el-form-item prop="description" label="属性描述:">
          <el-input v-model="addForm.description" type="textarea" placeholder="请输入属性描述" :maxlength="200" />
        </el-form-item>
      </el-form>
    </Dialog>
    <!-- 排序 -->
    <Sort v-if="sortVisible" :visible="sortVisible" :sort-list="typeList" :title="title" :update="refresh" @close="handleClose" />
  </div>
</template>

<script>
import { addType, updateType, findType, delType } from '@/api/page/propertiesType';
import { FilterSearch, Dialog, NoData } from "@monkey.do/monkey";
import { ListContainer } from "@/components";
import Sort from "./sort";

export default {
  name: "PropertiesType",
  components: {
    FilterSearch,
    Dialog,
    Sort,
    ListContainer,
    NoData,
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 模态框标题
      title: '',
      // 是否显示模态框
      visible: false,
      // 是否显示排序
      sortVisible: false,
      // 属性类型列表
      typeList: [],
      // 新增表单
      addForm: {},
      // 查询列表
      checkList: {
        pageNum: '1',
        pageSize: '10',
        name: "",
        editor: "",
      },
      // 表单验证
      rules: {
        name: [
          { required: true, message: "属性名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "代码不能为空", trigger: "blur" },
        ],
        editor: [
          { required: true, message: "编辑器不能为空", trigger: "blur" },
        ],
        sortNum: [
          { required: true, message: "顺序不能为空", trigger: "blur" },
        ],
        description: [
          { required: true, message: "描述不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getAllType();
  },
  methods: {
    // 查询属性所有类型
    async getAllType() {
      const { statusCode, data } = await findType();
      if (statusCode === 600) {
        this.typeList = data;
      }
    },
    // 新增
    handleAdd() {
      this.visible = true;
      this.title = "新增属性类型";
    },
    // 排序
    handleSort() {
      this.sortVisible = true;
      this.title = "排序";
      this.getAllType();
    },
    // 关闭排序
    handleClose() {
      this.sortVisible = false;
    },
    // 模态框取消按钮
    cancel() {
      this.addForm = {};
      this.visible = false;
    },
    // 修改
    handleEditor(row) {
      this.visible = true;
      this.title = "修改属性类型";
      this.addForm = { ...row };
    },
    // 删除
    handleDel(id) {
      this.$doingConfirm({ title: "删除属性类型", message: "确定要删除当前属性类型吗？" })
        .then(async() => {
          const { statusCode } = await delType({ id: id });
          if (statusCode === 600) {
            this.msgSuccess("删除成功");
            this.refresh();
          }
        })
        .catch(() => { console.log("取消删除"); });
    },
    // 刷新
    refresh() {
      this.$refs.listContainer.refresh(1);
    },
    // 模态框表单提交
    submitForm() {
      this.$refs["addForm"].validate(async(valid) => {
        if (valid) {
          this.loading = true;
          if (this.addForm.hasOwnProperty("id")) {
            const { statusCode } = await updateType(this.addForm);
            if (statusCode === 600) {
              this.msgSuccess("修改成功");
              this.visible = false;
              this.refresh();
            }
          } else {
            const { statusCode } = await addType(this.addForm);
            if (statusCode === 600) {
              this.msgSuccess("新增成功");
              this.visible = false;
              this.refresh();
              this.addForm = {};
            }
          }
          this.loading = false;
        }
      });
    },
  },
};
</script>
