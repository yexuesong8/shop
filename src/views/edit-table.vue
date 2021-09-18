<template>
  <div class="main-content-container">
    <edit-table
      ref="editTable"
      :form="{
        props: {
          'label-width': 'auto',
          rules: {
            name: [{ required: true, message: '请填写角色名称' }],
            appId: [{ required: true, message: '请选择适用范围' }],
          },
        },
        items: [
          { component: { name: 'el-input' }, isEdit: false, label: '角色名称', props: { prop: 'name' }, },
          { component: { name: 'dictionary', isNeedInstance: true, events: { change: handleSelectChange }, props: { code: 'general_app', disabled: handleDisabled, }}, formatter: (scope) => dictFormatter('general_app', scope.row.appId),label: '适用范围', props: { prop: 'appId' }, },
          { component: { name: 'status-selector' }, label: '状态', props: { prop: 'status', width: 'auto' }, },
          { component: { name: 'list-selector', events: { change: handleSelectFocus }, props: { 'json-data': [{id: 1, name: '是'}, { id: 2, name: '否' }], 'source-type': 'json' } }, label: '下拉框select', props: { prop: 'select' } },
          { component: { name: 'el-input', props: { type: 'textarea' }, }, label: '备注', props: { prop: 'remark' }, },
          { component: { name: 'component', component: ToolbarColumnComponent}, label: '自定义组件', props: { prop: 'age' } },
        ],
      }"
      :detail="detail"
      :create-method="handleConfirm"
      :delete-method="handleDelete"
      :create-click="handleCreateRow"
      :before-create="handleBeforeCreate"
      :is-bottom-create="false"
      :is-top-create="false"
      create-mode="bottom"
      :handle-fixed-mode="false"
    >
      <!-- <template slot="editTableHandles" slot-scope="scope"> -->
      <template v-slot:editTableHandles="scope">
        <el-button type="primary" @click="scope.data.add">测试按钮</el-button>
        <screening-button
          ref="screening"
          width="600"
          :items="[
            { component: { name: 'el-input' }, isEdit: false, label: '角色名称', props: { prop: 'name' }, },
            { component: { name: 'dictionary', isNeedInstance: true, events: { change: handleSelectChange }, props: { code: 'general_app', disabled: handleDisabled, }}, formatter: (scope) => dictFormatter('general_app', scope.row.appId),label: '适用范围', props: { prop: 'appId' }, },
            { component: { name: 'status-selector' }, label: '状态', props: { prop: 'status', width: 'auto' }, },
            { component: { name: 'list-selector', events: { change: handleSelectFocus }, props: { 'json-data': [{id: 1, name: '是'}, { id: 2, name: '否' }], 'source-type': 'json' } }, label: '下拉框select', props: { prop: 'select' } },
            { component: { name: 'el-input', props: { type: 'textarea' }, }, label: '备注', props: { prop: 'remark', span: 24 }, },
            { component: { name: 'component', component: ToolbarColumnComponent}, label: '自定义组件', props: { prop: 'age' } },
          ]"
          :search="handleScreenSearch"
          :reset="handleScreenReset"
          :search-reset="false"
          :search-close="true"
        />
      </template>
    </edit-table>
  </div>
</template>
<script>
import ToolbarColumnComponent from "./page-demo-column-component";
import Vue from "vue";
import { EditTable, ScreeningButton } from '@/components';
Vue.component("ToolbarColumnComponent", ToolbarColumnComponent);
export default {
  components: { EditTable, ScreeningButton },
  data() {
    return {
      ToolbarColumnComponent,
      detail: [
        { name: "测试1112", remark: "备注测试222", appId: 4311, status: 0, deleteDisabled: false, updateDisabled: false },
      ],
    };
  },
  methods: {
    handleConfirm(value, index, callback) {
      console.log("确定", index, value);
      // callback("success");
    },
    handleBeforeCreate(data) {
      console.log("before create", data);
      // return false;
      return true;
    },
    handleSelectChange(value, instance) {
      console.log(value);
      console.log(instance);
    },
    handleDisabled(scope) {
      console.log(scope);
      return false;
    },
    handleCreateRow(data) {
      data.setFormValue({ prop: "name", index: data.index, value: "2233344" });
    },
    handleSelectFocus(val) {
      console.log(val);
    },
    handleDelete(val) {
      console.log(val);
    },
    handleScreenSearch(val) {
      console.log("确定：", val);
    },
    handleScreenReset(val) {
      console.log("重置：", val);
      this.$refs["screening"].setModelFormValue({ prop: "status", value: 0 });
    },
  },
};
</script>
