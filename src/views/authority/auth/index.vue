<template>
  <!-- 权限管理-数据授权 -->
  <div class="main-content-container full-fill">
    <Page
      ref="page"
      list-api="/api/v1/rabbit/system/data/auth/find/page"
      base-api="/api/v1/rabbit/system/data/auth"
      :toolbar-buttons="[
        { type: 'create', events: { click: handleAdd } },
        'refresh',
      ]"
      :form="{
        props: {
          'label-width': 'auto',
        },
        items: [
          { component: { name: 'el-input', props: { placeholder: '请输入名称' } }, trim: false, span: 6, props: { label: '名称', prop: 'name' }, },
          { component: { name: 'drop-down-tree', props: { 'data-source-uri': '/api/v1/rabbit/auth/data/table/find/all', 'source-type': 'uri' }, }, span: 6, props: { label: '表名', prop: 'tableId' } },
          { component: { name: 'button' }, span: 6 },
        ],
      }"
      :table="{
        props:{
          border:true,
        },
        columns: [
          { label: '名称', prop: 'name' },
          { label: '角色', prop: 'roleIds', formatter: (row) => row.roleNames },
          { label: '表', prop: 'tableId', formatter: (row) => row.tableName },
          { label: '操作行为', prop: 'actionType', formatter: (row) => actionFormatter(row.actionType)},
          { label: '范围', prop: 'conditionType', formatter: (row) => dictFormatter('conditionType', row.conditionType)},
          {
            label: '操作',
            type: 'handlers',
            handlers: [
              { type: 'button', label: '修改', events: { click: handleUpdate } },
              { type: 'delete', props: { api: '/api/v1/rabbit/system/data/auth/delete', type: 'button',confirmMessageFormatter: (row) => ({ title: '删除', message: `确定要删除吗?` })} },
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
        <el-form-item label="表" prop="tableId">
          <drop-down-tree-selector
            v-model="form.tableId"
            data-source-uri="/api/v1/rabbit/auth/data/table/find/all"
            placeholder="请选择表"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <drop-down-tree-selector
            v-model="form.roleIds"
            source-type="uri"
            data-source-uri="/api/v1/rabbit/system/role/find/all"
            placeholder="请选择角色"
            multiple
          />
        </el-form-item>
        <el-form-item label="操作" prop="actionType">
          <dictionary-selector :value.sync="form.actionType" code="actionType" multiple />
        </el-form-item>
        <el-form-item label="范围" prop="conditionType">
          <dictionary-selector :value.sync="form.conditionType" code="conditionType" />
        </el-form-item>
        <el-form-item v-if="String(form.conditionType)=== '1'" label="范围条件">
          <el-row>
            <edit-table
              ref="EditTable"
              :form="{
                props: {
                  'label-width': 'auto',
                  rules: {
                    fieldId: [{ required: true, message: '请选择字段' }],
                    matchMode: [{ required: true, message: '请选择匹配条件' }],
                    value: [{ validator: validateNumber}],

                  },
                },
                items: [
                  {
                    component: {
                      name: 'list-selector',
                      isNeedInstance: true,
                      props: {
                        'data-source-uri': '/api/v1/rabbit/auth/data/field/object/find',
                        params: {
                          tableId: form.tableId,
                        },
                        wants: 'id',
                        'node-disabled': handleNodeDisabled
                      },
                      events: {
                        change: handleFieldChange
                      },
                    },
                    formatter: (scope) => scope.row.fieldName || scope.row.sdField.name,
                    label: '字段',
                    props: {
                      prop: 'fieldId',
                    },
                  },
                  {
                    component: {
                      name: 'list-selector',
                      props: {
                        'source-type':'json',
                        'json-data': matchModes,
                        wants: 'id',
                      },
                    },
                    formatter: (scope) => dictFormatter('matchMode', scope.row.matchMode),
                    label: '匹配条件',
                    props: {
                      prop: 'matchMode',
                    },
                  },
                  {
                    component: {
                      name: 'component',
                      component: getConditionComponent(),
                      events: {
                        change: handleMatchValueChange,
                      },
                    },
                    formatter: (scope) => scope.row.matchName || scope.row.sdField.matchName,
                    label: '条件值',
                    props: {
                      prop: 'value',
                      customValidator: matchValueValidator,
                    },
                  },
                ],
              }"
              :detail="form.conditionList"
              :before-update="true"
              @confirm="handleConfirm"
              @delete="deleteItem"
              @update="handleUpdateTable"
              @beforeUpdate="handleBeforeUpdate"
            />
          </el-row>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import statusComponent from "./statusComponent";
import { getById, add, update, getObject } from '@/api/authority/auth';
import ConditionValue from "./condition-value";
import EditTable from '@/components/EditTableForRule';
import Vue from "vue";
// import { getField } from '@/api/data/table';
import { getDictionaryValues } from '@/utils';

Vue.component("ConditionValue", ConditionValue);
export default {
  name: "Auth",
  components: { EditTable },
  data() {
    const validateNumber = (rule, value, callback) => {
      if (rule.required === false && !value) {
        callback();
      }
      if (this.type === "number") {
        const isNumber = /^[0-9]*$/;
        if (isNumber.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的数字"));
        }
      }
    };
    return {
      validateNumber,
      statusComponent,
      submitLoading: false,
      loading: false,
      ids: [],
      total: 0,
      postList: [],
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
      menuOptions: [],
      defaultProps: {
        // el-tree 配置
        children: "children",
        label: "name",
      },
      checkedTreeNode: [], // 角色选中的接口
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
        tableId: [
          { required: true, message: "表不能为空", trigger: "blur" },
        ],
        roleIds: [
          { required: true, message: "角色不能为空", trigger: "blur" },
        ],
        conditionType: [
          { required: true, message: "范围不能为空", trigger: "change" },
        ],
        actionType: [
          { required: true, message: "操作不能为空", trigger: "blur" },
        ],
      },
      authObject: [],
      authMode: '',
      matchModes: [],
      json: 'json',
      type: '',

    };
  },
  methods: {
    actionFormatter(row) {
      if (row.includes(',')) {
        const tempValue = row.split(',');
        let newArry = [];
        const actionArr = [{ name: '新增', value: 'insert' }, { name: '删除', value: 'delete' }, { name: '修改', value: 'update' }, { name: '查询', value: 'select' }];
        tempValue.forEach(element => {
          actionArr.forEach(item => {
            if (element.toString() === String(item.value)) {
              newArry.push(item.name + ',');
              const arr = String(newArry);
              const str = arr.substring(0, arr.length - 1);
              newArry = [str];
            }
          });
        });
        return newArry;
      } else {
        const val = this.dictFormatter('actionType', row);
        return val;
      }
    },
    handleChange() {
      this.form.conditionList = [];
    },
    getConditionComponent() {
      return ConditionValue;
    },
    handleNodeDisabled(data) {
      return (data && data.authModeCode === "exclude");
    },
    handleFieldChange(self, value, detail) {
      console.log(self, value, detail, 12222);
      this.type = '';
      this.matchModes = [];
      const editTable = this.$refs["EditTable"];
      this.type = detail.authModeCode;
      editTable.resetForm(self.scope.$index, {
        add: true,
        handle: true,
        ...editTable.getModelForm(self.scope.$index),
        fieldId: detail.id,
        fieldName: detail.name,
        entityTableCode: detail.authModeCode,
        entityTableId: detail.tableId,
        authObjects: detail.authObjects,
        dictionaryCode: detail.dictionaryCode,
      });
      const newArray = [{ name: "等于", value: '=' }, { name: "不等于", value: '!=' }, { name: "大于", value: '>' }, { name: "小于", value: '<' }, { name: "大于等于", value: '>=' }, { name: "小于等于", value: '<=' }, { name: "包含", value: 'in' }, { name: "不包含", value: 'not in' }];
      if (detail.authMode && detail.authMode.matchModes) {
        if (detail.authMode.matchModes.includes(',')) {
          const tempValue = detail.authMode.matchModes.split(',');
          tempValue.forEach(element => {
            newArray.forEach(item => {
              if (item.value === element.toString()) this.matchModes.push({ name: item.name, id: item.value });
            });
          });
          return this.matchModes;
        } else {
          newArray.forEach(item => {
            if (item.value === detail.authMode.matchModes.toString()) this.matchModes = [{ name: item.name, id: item.value }];
          });
          return this.matchModes;
        }
      }
    },
    handleMatchChange(self, value, detail) {
      const editTable = this.$refs["EditTable"];

      editTable.resetForm(self.scope.$index, {
        add: true,
        handle: true,
        ...editTable.getModelForm(self.scope.$index),
        value: detail.content,
        matchName: detail.name,
      });
    },
    matchValueValidator(model, field) {
      if (model.fieldId) {
        let fieldValid = true;
        field.validate(valid => {
          fieldValid = valid;
        });
        return fieldValid && field.validateState !== "error";
      }
      return true;
    },
    handleMatchValueChange(model, instance) {
      const form = instance.elForm;
      form.validateField("value");
    },
    handleConfirm(value, index, callback) {
      this.form.conditionList = value.data;
    },
    deleteItem(value, index, callback) {
      this.form.conditionList = value.data;
    },
    handleUpdateTable(val) {
      this.type = '';
      if (val.sdField) this.type = val.sdField.authModeCode;
    },
    handleBeforeUpdate(scope) {
      const data = {
        tableId: scope.sdField.tableId,
        name: scope.sdField.name,

      };
      getObject(data).then((res) => {
        this.matchModes = [];
        if (res.statusCode === 600) {
          // const newArray = [{ name: "等于", value: '=' }, { name: "不等于", value: '!=' }, { name: "大于", value: '>' }, { name: "小于", value: '<' }, { name: "大于等于", value: '>=' }, { name: "小于等于", value: '<=' }, { name: "包含", value: 'in' }, { name: "不包含", value: 'not in' }];
          const newArray = getDictionaryValues('matchMode');
          if (res.data[0].authMode.matchModes && res.data[0].authMode.matchModes.includes(',')) {
            const tempValue = res.data[0].authMode.matchModes.split(',');
            tempValue.forEach(element => {
              newArray.forEach(item => {
                if (item.content === element.toString()) this.matchModes.push({ name: item.name, id: item.content });
              });
            });
            return this.matchModes;
          } else {
            newArray.forEach(item => {
              if (item.content === res.data[0].authMode.matchModes.toString()) this.matchModes = [{ name: item.name, id: item.content }];
            });
            return this.matchModes;
          }
        }
      });
      // return callback({ id: 11111 });
      return true;
    },
    // 取消按钮
    cancel() {
      this.visible = false;
      this.form = { status: 1 };
      this.$refs["form"].resetFields();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.visible = true;
      this.title = "新增数据授权";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.visible = true;
      this.title = "修改数据授权";
      getById(row.row.id).then((res) => {
        this.form = res.data;
        this.form.objectList = this.form.conditionList;
        if (this.form.roleIds.includes(',')) {
          const tempValue = this.form.roleIds.split(',');
          const newArry = [];
          tempValue.forEach(element => {
            newArry.push(element.toString());
          });
          this.form.roleIds = newArry;
        } else {
          this.form.roleIds = [this.form.roleIds];
        }
        if (this.form.actionType.includes(',')) {
          const tempValue = this.form.actionType.split(',');
          const newArry = [];
          tempValue.forEach(element => {
            newArry.push(element.toString());
          });
          this.form.actionType = newArry;
        } else {
          this.form.actionType = [this.form.actionType];
        }
        // this.form.actionType = this.form.sdField;
        // this.form.roleIds = this.form.sdField;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          this.form.actionType = this.form.actionType.toString();
          this.form.roleIds = this.form.roleIds.toString();
          if (this.form.id) {
            update(this.form).then((res) => {
              if (res.statusCode === 600) {
                this.msgSuccess("修改成功");
                this.$refs.page.refresh(1);
                this.cancel();
              }
            })
              .finally(() => (this.submitLoading = false));
          } else {
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
  },
};
</script>
