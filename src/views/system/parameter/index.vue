<template>
  <div class="main-content-container full-fill">
    <el-row :gutter="30" style="height: 100%">
      <el-col :sm="9" :md="9" :lg="6" style="height: 100%">
        <!-- 树目录开始-->
        <EditableTree
          title="目录"
          :highlight.sync="highlight"
          list-api="/api/v1/rabbit/system/property/group/find/tree"
          create-api="/api/v1/rabbit/system/property/group/create"
          update-api="/api/v1/rabbit/system/property/group/update"
          delete-api="/api/v1/rabbit/system/property/group/delete"
          sort-api="/api/v1/rabbit/system/property/group/update/tree"
          @nodeClick="handleNodeClick"
        >
          <template v-slot:button="slot">
            <el-button type="primary" @click="slot.click">新增目录</el-button>
          </template>
        </EditableTree>
      </el-col>
      <el-col :sm="15" :md="15" :lg="18" style="height: 100%">
        <Page
          ref="page"
          base-api="/api/v1/rabbit/system/property"
          :toolbar-buttons="[
            { type: 'create', events: { click: handleAdd } },
            'refresh',
          ]"
          :form="{
            props: {
              'label-width': 'auto',
            },
            params: params,
            items: [
              { component: { name: 'dictionary', props: { code: 'general_app' }, }, span: 6, props: { label: '适用范围', prop: 'appId' }, },
              { component: { name: 'el-input', props: { placeholder: '请输入参数名称', maxlength: '20', clearable: true } }, span: 6, props: { label: '参数名称', prop: 'name' },},
              { component: { name: 'button' }, span: 6 },
            ],
          }"
          :table="{
            props:{
              border:true,
            },
            columns: [
              { label: '适用范围', prop: 'appId',formatter:(row)=>dictFormatter('general_app', row.appId)},
              { label: '参数名称', prop: 'name' },
              { label: '标识码', prop: 'code' },
              { label: '值类型', prop: 'valueType', formatter: (row) => handleValueType(row)},
              { label: '设置值', prop: 'value', htmlFormatter: ({ row }) => valueTypeFormatter(row)},
              {
                label: '操作',
                type: 'handlers',
                handlers: [
                  { type: 'button', label: '修改', events: { click: handleUpdate } },
                  { type: 'delete', props: { type: 'button',confirmMessageFormatter: (row) => ({ title: '删除', message: `确定要删除${row.name}吗?` })} },
                ],
              },
            ]
          }"
          @reset="handleReset"
        />
      </el-col>
    </el-row>
    <!-- 新增修改框 -->
    <Dialog :title="title" :visible="visible" :loading="loading" @cancel="handleCancel" @confirm="handleSubmit">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="48">
          <el-col :span="24">
            <el-form-item label="选择目录:" prop="groupId">
              <Catalog v-model="form.groupId" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <ApplicationItem :value.sync="form.appId" prop="appId" />
          </el-col>
          <el-col :span="12">
            <el-form-item label="参数名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入参数名称" :maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标识码:" prop="code">
              <el-input v-model.trim="form.code" placeholder="请输入标识码" :maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="值类型:">
              <el-select v-model="form.valueType" placeholder="请选择" @change="handleValueTypeChange">
                <el-option
                  v-for="item in valueTypeOptions"
                  :key="item.key"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设置值:">
              <el-input v-if="form.valueType === '1' || form.valueType === '2'" v-model.trim="form.value" />
              <el-date-picker
                v-if="form.valueType === '3'"
                v-model="form.value"
                type="datetime"
                value-format="timestamp"
                placeholder="选择日期时间"
              />
              <div v-if="form.valueType === '4'" class="upload-img-box">
                <img
                  v-if="form.value"
                  :src="getImgSrc(form.value)"
                  class="parameter-img"
                  alt=""
                >
                <Upload ref="upload" :show-file-list="false" :data="uploadData" @change="handleChange">
                  <el-button>上传图片</el-button>
                </Upload>
              </div>
              <el-switch
                v-if="form.valueType === '5'"
                v-model="form.value"
                active-value="true"
                inactive-value="false"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import EditableTree from "@/components/EditableTree";
import { getImgSrc, toBoolean, setDocumentTitle } from "@/utils";
import { getAppId } from "@monkey.do/monkey";
import Catalog from "./catalog";

const ValueType = [
  { key: "1", value: "1", label: "number" },
  { key: "2", value: "2", label: "char" },
  { key: "3", value: "3", label: "time" },
  { key: "4", value: "4", label: "img" },
  { key: "5", value: "5", label: "bool" },
];

const getValueTypeByValue = (value) => {
  const obj = ValueType.filter(item => item.value === value)[0];
  if (obj) return obj["label"];
  return null;
};

export default {
  name: 'Parameter',
  components: { EditableTree, Catalog },
  data() {
    return {
      highlight: true,
      // 遮罩层
      loading: false,
      // 表单
      form: {},
      rowId: "",
      disabled: false,
      params: {},
      // 标题
      title: "",
      // 新增修改弹出框
      visible: false,
      // 值编辑组件选择
      valueTypeOptions: [
        { key: "1", value: "1", label: "数字" },
        { key: "2", value: "2", label: "字符" },
        { key: "3", value: "3", label: "时间" },
        { key: "4", value: "4", label: "图片" },
        { key: "5", value: "5", label: "布尔" },
      ],
      // 表单校验
      rules: {
        // groupId: [{ required: true, message: "选择目录不能为空", trigger: "blur" }],
        name: [{ required: true, message: "参数名称不能为空", trigger: "blur" }],
        code: [{ required: true, message: "标识码不能为空", trigger: "blur" }],
        appId: [{ required: true, message: '适用范围不能为空', trigger: "blur" }],
      },
      uploadData: {
        appId: 1,
        name: "file",
        type: 1,
      },
    };
  },
  methods: {
    // 重置
    handleReset() {
      this.highlight = false;
      this.rowId = "";
      this.form = {};
    },
    // 树目录
    handleNodeClick(row) {
      this.params = { ...this.params, groupId: row.id };
      this.form = { ...this.from, groupId: row.id };
      this.rowId = row.id;
      this.highlight = true;
      // this.disabled = this.rowId === ""; // 全部，选择目录不可选
    },
    // 取消按钮
    handleCancel() {
      this.visible = false;
      this.$refs["form"].resetFields();
      this.form = {};
      this.form.groupId = this.rowId;
    },
    // 新增按钮
    handleAdd() {
      this.title = "添加参数";
      this.visible = true;
    },
    // 修改按钮
    handleUpdate(data) {
      this.title = "修改参数";
      this.visible = true;
      this.form = { ...data.row };
    },
    handleValueType(row) {
      let name = "";
      switch (String(row.valueType)) {
        case "1":
          name = "数字";
          break;
        case "2":
          name = "字符";
          break;
        case "3":
          name = "时间";
          break;
        case "4":
          name = "图片";
          break;
        case "5":
          name = "布尔";
          break;
        default:
          name = "";
          break;
      }
      return name;
    },
    validAppid() {
      // 如果适用范围等于当前应用或者通用,返回true
      if (this.form.appId === getAppId() || this.form.appId === "1") {
        return true;
      } return false;
    },
    // 提交按钮
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          const url = this.form.id ? "rabbit.system.parameter.update" : "rabbit.system.parameter.add";
          const message = this.form.id ? "修改成功" : "新增成功";
          this.$request(url, { data: { ...this.form, ...this.params }}).then(res => {
            if (res.statusCode === 600) {
              this.msgSuccess(message);
              // 如果是标签标题，手动更新
              if (this.form.code === "documentTitle" && this.form.value && this.validAppid()) {
                setDocumentTitle(this.form.value);
              }
              // 如果是图片，先转换再传仓库
              if (this.form.valueType === "4") {
                this.form.value = getImgSrc(this.form.value);
              }
              this.$store.dispatch('global/setSystemSetting', { [this.form.code]: toBoolean(this.form.value) });
              this.handleCancel();
              this.$refs["page"].refresh();
            }
          }).finally(() => (this.loading = false));
        }
      });
    },
    // 上传成功后返回文件
    handleChange(file) {
      this.form = { ...this.form, value: file.response.data.id };
    },
    getValueTypeByValue(value) {
      return getValueTypeByValue(value);
    },
    valueTypeFormatter(row) {
      const type = getValueTypeByValue(row.valueType);

      switch (type) {
        case "time":
          return this.parseTime(row.value);
        case "img":
          return `<img width="20" height="20" src="${this.getImgSrc(row.value)}" />`;
        default: return row.value;
      }
    },
    handleValueTypeChange() {
      this.form = {
        ...this.form,
        value: "",
      };
    },
  },
};
</script>
<style scoped>
.upload-img-box{
  display: flex;
}
.parameter-img{
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
</style>
