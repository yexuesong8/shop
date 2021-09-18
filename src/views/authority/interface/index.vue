<template>
  <!-- 权限管理-接口管理 -->
  <div class="main-content-container full-fill">
    <Page
      ref="page"
      list-api="/api/v1/rabbit/system/api/find/page"
      base-api="/api/v1/rabbit/system/api"
      :toolbar-buttons="[
        { type: 'create', events: { click: handleAdd } },
        { type: 'button', label: '同步接口', events: { click: handleSyncApi }, },

        'refresh',
      ]"
      :form="{
        props: {
          'label-width': 'auto',
        },
        items: [
          { component: { name: 'el-input', props: { placeholder: '请输入名称' } }, trim: false, span: 6, props: { label: '名称', prop: 'name' }, },
          { component: { name: 'el-input', props: { maxlength: 100,placeholder: '请输入地址' } }, trim: false, span: 6, props: { label: '地址', prop: 'path' }, },
          { component: { name: 'drop-down-tree', props: { 'data-source-uri': '/api/v1/rabbit/system/api/category/find/tree', 'source-type': 'uri' }, }, span: 6, props: { label: '分类', prop: 'categoryId' } },
          { component: { name: 'list-selector', props: { wants: 'id', 'json-data': [{id: '1', name: '启用'}, { id: '0', name: '禁用' }], 'source-type': 'json' } }, span: 6, props: { label: '开启授权', prop: 'needAuth' } },
          { component: { name: 'list-selector', props: { wants: 'id', 'json-data': [{id: '1', name: '启用'}, { id: '0', name: '禁用' }], 'source-type': 'json' } }, span: 6, props: { label: '状态', prop: 'enabled' } },
          { component: { name: 'button' }, span: 6 },
        ],
      }"
      :table="{
        props:{
          border:true,
        },
        columns: [
          { label: '名称', prop: 'name' },
          { label: '地址', prop: 'path' },
          { label: '分类', prop: 'categoryId', formatter: (row) => row.categoryName },
          { label: '授权', type: 'component', prop: 'needAuth', component: AuthComponent },
          { label: '状态', type: 'component', prop: 'enabled', component: StatusComponent },
          {
            label: '操作',
            type: 'handlers',
            handlers: [
              { type: 'button', label: '修改', events: { click: handleUpdate } },
              { type: 'delete', props: { api: '/api/v1/rabbit/system/api/delete', type: 'button',confirmMessageFormatter: (row) => ({ title: '删除', message: `确定要删除吗?` })} },
            ],
          },
        ]
      }"
      :detail-form="{
        props: {
          createTitle: '新增接口',
          updateTitle: '修改接口',
          type:type,
          visible:visible,
          id:id,
          form: {
            props: {
              'label-width': 'auto',
              rules: {
                path: [{ required: true, message: '地址不能为空'}],
                name: [{ required: true, message: '名称不能为空' },],
                categoryId: [{ required: true, message: '请选择分类', trigger:'change' },],
              },
            },
            items: [
              { component: { name: 'el-input', props: { maxlength: '50' } }, span: 24, props: { label: '名称', prop: 'name' }},
              { component: { name: 'el-input', props: { maxlength: '100' } }, span: 24, props: { label: '地址', prop: 'path' }, },
              { component: { name: 'drop-down-tree', props: { 'data-source-uri': '/api/v1/rabbit/system/api/category/find/tree','source-type':'uri' }, }, span: 24, props: { label: '分类', prop: 'categoryId' }, },
              { component: { name: 'status-selector'}, span: 24, props: { label: '开启授权', prop: 'needAuth' }},
              { component: { name: 'status-selector'}, span: 24, props: { label: '接口状态', prop: 'enabled' }},
            ],
          },
        },
        events: {
          success: handleCreateSuccess,
          cancel:handleDetailCancel,
        },
      }"
    />
    <Dialog v-if="syncApiVisible" :loading="submitLoading" :title="'同步接口'" :visible="syncApiVisible" @cancel="cancel" @confirm="submitForm">
      <el-form ref="syncApiForm" :model="syncApiForm" :rules="syncApiFormRules" label-width="auto" label-suffix=":">
        <el-form-item label="所属分类" prop="parentId">
          <drop-down-tree-selector
            v-model="syncApiForm.parentId"
            data-source-uri="/api/v1/rabbit/system/api/category/find/tree"
            placeholder="请选择分类"
            :node-disabled="handleNodeDisabled"
            @change="handleParentIdChange"
          />
        </el-form-item>
        <el-form-item label="swagger-api地址" prop="apiUrl">
          <el-input v-model.trim="syncApiForm.apiUrl" :maxlength="50" placeholder="请输入名称" clearable />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import StatusComponent from "./statusComponent";
import AuthComponent from "./authComponent";
import { syncApi } from '@/api/authority/api';

import Vue from "vue";

Vue.component("StatusComponent", StatusComponent);
Vue.component("AuthComponent", AuthComponent);

export default {
  name: "Interface",
  data() {
    return {
      StatusComponent,
      AuthComponent,
      id: '',
      type: '',
      visible: false,
      syncApiVisible: false,
      submitLoading: false,
      classifyProperty: {
        id: "code",
        name: "name",
        children: "childList",
        key: "id",
      },
      // 表单参数
      form: {
        needAuth: 1,
        enabled: 1,
      },
      syncApiForm: {},
      syncApiFormRules: {
        parentId: [
          { required: true, message: "所属分类不能为空", trigger: "blur" },
        ],
        apiUrl: [
          { required: true, message: "swagger-api地址不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    statusFormat(row) {
      if (row.needAuth === 1) {
        return "启用";
      }
      return "禁用";
    },
    statusFormat1(row) {
      if (row.enabled === 1) {
        return "启用";
      }
      return "禁用";
    },
    handleSyncApi() {
      this.syncApiVisible = true;
    },
    // 新增
    handleAdd() {
      this.type = "create";
      this.visible = true;
    },
    // 编辑
    handleUpdate(data) {
      this.type = "update";
      this.visible = true;
      this.id = data.row.id;
    },
    handleDetailCancel() {
      this.visible = false;
      this.id = "";
      this.type = "";
    },
    handleCreateSuccess() {
      this.$refs["page"].refresh(1);
    },
    cancel() {
      this.syncApiVisible = false;
      this.$refs["syncApiForm"].resetFields();
    },
    submitForm() {
      this.$refs["syncApiForm"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          syncApi(this.syncApiForm).then((res) => {
            if (res.statusCode === 600) {
              this.$refs["page"].refresh(1);
              this.cancel();
            }
          }).finally(() => (this.submitLoading = false));
        }
      });
    },
    handleNodeDisabled(data) {
      return data.parentId !== '0';
    },
    handleParentIdChange(data) {
      console.log(data, 88);
      // this.$refs["form"].validateField("parentId");
    },
    validateParentId(rules, value, callback) {
      if (!this.form.parentId || this.form.parentId === 0) {
        callback();
      } else {
        callback(new Error("请选择上级菜单"));
      }
    },
  },
};
</script>
