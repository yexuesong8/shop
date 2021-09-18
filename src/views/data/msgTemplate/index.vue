<template>
  <!-- 数据管理-字段管理 容器 -->
  <div class="main-content-container">
    <list-container ref="ListContainer" api="/api/v1/rabbit/system/message/template/find/page" :form-props="{ 'label-width': 'auto' }">
      <template v-slot:form="slot">
        <FilterSearch class="mb10">
          <template v-slot:search>
            <el-row class="mt10">
              <Search :search="slot.form" :loading="slot.loading" @search="slot.search()" @reset="slot.reset()" />
            </el-row>
          </template>
          <template v-slot:actions>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-button type="primary" @click="handleAdd">新增</el-button>
              </el-col>
            </el-row>
          </template>
        </FilterSearch>
      </template>
      <template v-slot:table="table">
        <el-table v-loading="table.loading" :data="table.list" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="title" label="标题" :show-overflow-tooltip="true" min-width="160" />
          <el-table-column prop="code" label="代码" :show-overflow-tooltip="true" min-width="160" />
          <el-table-column prop="content" label="内容" :show-overflow-tooltip="true" min-width="160" />
          <ApplicationColumn width="100" />
          <el-table-column label="创建时间" prop="createTime" width="150">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" class-name="small-padding fixed-width" width="150">
            <template v-slot:default="scope">
              <el-button type="text" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="table.total>0" :total="table.total" :page-num.sync="table.pageNum" :page-size.sync="table.pageSize" @paginationChange="slot.paginationChange()" />
      </template>
    </list-container>
    <Dialog :title="title" :visible="visible" append-to-body :loading="detailLoading" @cancel="handleCancel" @confirm="handleSubmit">
      <el-form ref="form" :model="detail" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="detail.title" planceholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="代码" prop="code">
          <el-input v-model="detail.code" placeholder="请输入代码" clearable />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="detail.content" type="textarea" show-word-limit maxlength="1500" placeholder="请输入内容" />
        </el-form-item>
        <ApplicationItem v-model="detail.appId" />
      </el-form>
    </Dialog>
  </div>
</template>
<script>
import Search from './search';
import { update } from '@/api/data/msgTemplate';
import { del } from '@/api/data/msgTemplate';
import { add } from '@/api/data/msgTemplate';

export default {
  name: 'MsgTemplate',
  components: {
    Search,
  },
  data() {
    return {
      visible: false,
      detail: {},
      title: '',
      detailLoading: false,
      type: '',
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        code: [{ required: true, message: '请输入代码', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        appId: [{ required: true, message: '请输入AppId', trigger: 'blur' }],
      },
    };
  },
  methods: {
    // 取消
    handleCancel() {
      this.detail = {};
      this.visible = false;
      this.$refs["form"].resetFields();
    },
    // 增加
    handleAdd() {
      this.visible = true;
      this.type = 'add';
      this.title = '新增';
    },
    // 修改
    handleUpdate(row) {
      this.title = '修改字段';
      this.visible = true;
      this.type = 'update';
      this.detail = { ...row };
    },
    // 提交
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.type === 'update') {
            update(this.detail).then((res) => {
              if (res.statusCode === 600) {
                this.handleCancel();
                this.$refs['ListContainer'].refresh();
              }
            });
          } else if (this.type === 'add') {
            add(this.detail).then((res) => {
              if (res.statusCode === 600) {
                this.handleCancel();
                this.$refs['ListContainer'].refresh(1);
              }
            });
          }
        }
      });
    },
    // 删除
    handleDelete(row) {
      this.$doingConfirm({ title: "删除消息模板", message: `确实要删除标题为${row.title}的消息模板吗?` }).then(() => {
        del(row.id).then((res) => {
          if (res.statusCode === 600) {
            this.$refs['ListContainer'].refresh(1);
            this.$message.success("删除成功");
          }
        });
      }).catch(() => {});
    },
  },
};
</script>
