<template>
  <!-- 流程管理-流程类型 -->
  <div class="main-content-container">
    <el-row class="mb20">
      <el-col :span="18" class="fl">
        <search-input placeholder="请输入表单名称" style="width:440px" clearable :on-input="handleInput" />
      </el-col>
      <el-col :span="6">
        <el-button class="fr" type="primary" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>

    <!-- 表单区域 -->
    <Table ref="table" api="/api/v1/rabbit/workflow/form/find/page" :params="params">
      <template v-slot:default="slot">
        <el-table v-loading="slot.loading" :data="slot.list">
          <el-table-column label="表单名称" prop="name" min-width="120" />
          <el-table-column label="表单路径" prop="path" />
          <el-table-column label="所属表" prop="tableName" />
          <el-table-column label="创建人" prop="creatorName" />
          <el-table-column label="创建时间" prop="createTime" min-width="120">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="text" @click="handleDeleteDictionary(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </Table>

    <!-- 弹框 -->
    <Dialog :title="flag ? '新增表单' : '修改表单'" :visible="visible" :loading="submitLoading" @cancel="handleCancel" @confirm="handleSubmit">
      <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="表单名称:" prop="name">
          <el-input v-model="formData.name" placeholder="请输入表单名称" :maxlength="50" />
        </el-form-item>
        <el-form-item label="表单路径:" prop="path">
          <el-input v-model="formData.path" placeholder="请输入表单路径" :maxlength="200" />
        </el-form-item>
        <el-form-item label="所属表:" prop="belongTable">
          <el-select v-model="formData.belongTable" placeholder="请选择所属表ID">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>
<script>
import { SearchInput } from '@monkey.do/monkey';
import { addFormData, delectFormData, updateFormData, getTheirTable } from "@/api/workflow/form";
import { Table } from "@/components";

export default {
  name: "WorkflowForm",
  components: {
    SearchInput,
    Table,
  },
  data() {
    return {
      visible: false,
      // 新增数据
      formData: {
        id: "",
        name: "",
        path: "",
        belongTable: "",
        appId: "",
      },
      options: [],
      flag: false,
      params: {},
      submitLoading: false,
      rules: {
        name: [{ required: true, message: "表单名称不能为空", trigger: "blur" }],
        path: [{ required: true, message: "表单路径不能为空", trigger: "blur" }],
        belongTable: [{ required: true, message: "所属表ID不能为空", trigger: "blur" }],
        appId: [{ required: true, message: "所属范围不能为空", trigger: "blur" }],
      },
    };
  },

  methods: {
    // 搜索
    handleInput(val) {
      this.params = { ...this.params, name: val };
    },
    // 新增
    handleAdd() {
      this.visible = true;
      this.flag = true;
      this.TheirTableId();
    },
    // 所属表ID
    TheirTableId() {
      getTheirTable().then(res => {
        if (res.statusCode === 600) {
          this.options = res.data;
        }
      });
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.flag) {
            addFormData(this.formData).then(res => {
              this.submitLoading = false;
              if (res.statusCode === 600) {
                this.$refs["table"].refresh(1);
                this.handleCancel();
                this.$message.success('添加成功！');
              }
            });
          } else {
            updateFormData(this.formData).then(res => {
              this.submitLoading = false;
              if (res.statusCode === 600) {
                this.$refs["table"].refresh(1);
                this.handleCancel();
                this.$message.success('修改成功！');
              }
            });
          }
        }
      });
    },
    handleCancel() {
      this.visible = false;
      this.$refs.form.resetFields();
      this.formData = {
        id: "",
        name: "",
        path: "",
        belongTable: "",
        appId: "",
      };
    },
    // 修改
    handleUpdate(row) {
      this.visible = true;
      this.flag = false;
      this.TheirTableId();
      this.formData.id = row.id;
      this.formData.name = row.name;
      this.formData.path = row.path;
      this.formData.belongTable = row.belongTable;
      this.formData.appId = row.appId;
    },
    // 删除
    handleDeleteDictionary(row) {
      this.$doingConfirm({ title: "删除表单", message: "确定要删除表单吗?" }).then(() => {
        delectFormData({ id: row.id }).then(res => {
          if (res.statusCode === 600) {
            this.$message.success('删除成功');
            this.$refs["table"].refresh(1);
          }
        });
      });
    },
  },
};
</script>
