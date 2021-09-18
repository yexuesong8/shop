<template>
  <!-- 权限管理-数据授权方式 -->
  <div class="main-content-container full-fill">
    <Page
      ref="page"
      base-api="/api/v1/rabbit/system/data/auth/mode"
      :toolbar-buttons="[
        { type: 'create', events: { click: handleAdd } },
        'refresh',
      ]"
      :has-filter="false"
      :table="{
        props:{
          border: true,
        },
        columns: [
          { label: '名称', prop: 'name' },
          { label: '编码', prop: 'code' },
          { label: '匹配方式', prop: 'matchModes', formatter: (row) => matchFormat(row) },
          {
            label: '操作',
            type: 'handlers',
            handlers: [
              { type: 'button', label: '修改', events: { click: handleUpdate } },
              { type: 'delete', props: { api: '/api/v1/rabbit/system/data/auth/mode/delete', type: 'button',confirmMessageFormatter: (row) => ({ title: '删除', message: `确定要删除${row.name}吗?` })} },
            ],
          },
        ]
      }"
    />
    <!-- 添加或修改接口对话框 -->
    <Dialog v-if="visible" :loading="submitLoading" :title="title" :visible="visible" @cancel="cancel" @confirm="submitForm">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto" label-suffix=":">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="form.name" :maxlength="50" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model.trim="form.code" :maxlength="100" placeholder="请输入编码" clearable />
        </el-form-item>
        <el-form-item label="匹配方式" prop="matchModes">
          <dictionary-selector :value.sync="form.matchModes" code="matchMode" placeholder="请输入匹配方式" :multiple="true" />
        </el-form-item>
        <el-form-item label="授权对象">
          <el-row>
            <el-row type="flex" :gutter="30">
              <el-col :span="1.5">
                <el-button type="primary" class="btnAdd" size="mini" @click="addObjectList()">新增</el-button>
              </el-col>
            </el-row>
            <edit-table
              ref="authObject"
              :form="{
                props:{
                  'label-width':'auto',
                },
                items:[
                  { component: { name: 'el-input',placeholder: '请输入名称' }, label: '名称', props: { prop: 'name' }},
                  { component: { name: 'el-input',placeholder: '请输入编码' }, label: '编码', props: { prop: 'code' }},
                ],
              }"
              :is-bottom-create="false"
              :is-top-create="false"
              :detail="form.objectList"
              create-mode="top"
              @confirm="handleConfirm"
              @delete="deleteItem"
            />
          </el-row>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>

import statusComponent from "./statusComponent";
import { getById, add, update } from '@/api/authority/way';
import { getDictionaryValues } from '@/utils';

export default {
  name: "AuthMode",
  data() {
    return {
      statusComponent,
      submitLoading: false,
      loading: false,
      ids: [],
      total: 0,
      title: "",
      visible: false,
      statusOptions: [
        { key: 1, value: 1, label: "启用" },
        { key: 0, value: 0, label: "停用" },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      matchModes: [],
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "编码不能为空", trigger: "blur" },
        ],
        // matchModes: [
        //   { required: true, message: "匹配方式不能为空", trigger: "blur" },
        // ],
      },
    };
  },
  created() {
  },
  methods: {
    matchFormat(row) {
      let matchModes = [];
      // const newArray = [{ name: "等于", value: '=' }, { name: "不等于", value: '!=' }, { name: "大于", value: '>' }, { name: "小于", value: '<' }, { name: "大于等于", value: '>=' }, { name: "小于等于", value: '<=' }, { name: "包含", value: 'in' }, { name: "不包含", value: 'not in' }];
      const newArray = getDictionaryValues('matchMode');
      if (row.matchModes !== '') {
        if (row.matchModes.includes(',')) {
          const tempValue = row.matchModes.split(',');
          tempValue.forEach(element => {
            newArray.forEach(item => {
              if (item.content === element) matchModes.push(item.name);
            });
          });
          return matchModes.join();
        } else {
          newArray.forEach(item => {
            if (item.content === row.matchModes) matchModes = [item.name];
          });
          return matchModes.join();
        }
      }
    },
    // 取消按钮
    cancel() {
      this.visible = false;
      this.$refs["form"].resetFields();
      this.form.objectList = [];
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.visible = true;
      this.title = "新增授权方式";
      this.form = {};
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = {};
      this.visible = true;
      this.title = "修改授权方式";
      getById(row.row.id).then((res) => {
        this.form = res.data;
        if (this.form.matchModes !== '') {
          if (this.form.matchModes.includes(',')) {
            const tempValue = this.form.matchModes.split(',');
            const newArry = [];
            tempValue.forEach(element => {
              newArry.push(element.toString());
            });
            this.form.matchModes = newArry;
          } else {
            this.form.matchModes = [this.form.matchModes];
          }
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          this.form.matchModes = String(this.form.matchModes);
          if (this.form.id) {
            update(this.form).then(res => {
              if (res.statusCode === 600) {
                this.msgSuccess("修改成功");
                this.$refs.page.refresh(1);
                this.cancel();
              }
            })
              .finally(() => (this.submitLoading = false));
          } else {
            if (this.form.matchModes === "undefined") this.form.matchModes = '';
            add(this.form).then((res) => {
              if (res.statusCode === 600) {
                this.msgSuccess("新增成功");
                this.$refs.page.refresh(1);
                this.cancel();
              }
            }).finally(() => (this.submitLoading = false));
          }
        }
      });
    },
    addObjectList() {
      this.$refs.authObject.add();
    },
    handleConfirm(value, index, callback) {
      this.form.objectList = value.data;
    },
    deleteItem(value) {
      this.form.objectList = value.data;
    },
    // deleteItem(value, index, callback) {
    //   this.form.objectList.splice(index, 1);
    // },
  },
};
</script>
