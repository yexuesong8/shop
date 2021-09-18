<template>
  <Dialog v-if="visible" :title="title" :visible="visible" :loading="loading" @cancel="handleCancel" @confirm="handleSubmit">
    <el-form ref="form" :model="value" :rules="rules" label-width="80px">
      <el-form-item label="字典名称:" prop="name">
        <el-input v-model.trim="value.name" placeholder="请输入字典名称" clearable :maxlength="50" />
      </el-form-item>
      <el-form-item label="代码:" prop="code">
        <el-input v-model.trim="value.code" placeholder="请输入代码" clearable :maxlength="50" />
      </el-form-item>
      <ApplicationItem :value.sync="value.appId" />
      <el-form-item label="类型:" prop="type">
        <dictionary-selector code="system_dict_type" :value.sync="value.type" />
      </el-form-item>
      <el-form-item label="上级字典:">
        <el-select v-model="value.parentId" filterable clearable>
          <el-option v-for="(item) in dictionaries" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input v-model.trim="value.remark" type="textarea" placeholder="请输入内容" show-word-limit clearable :maxlength="500" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import { fieldsFilter } from "@/utils";

const updateFilds = ["id", "code", "name", "type", "appId", "remark", "parentId"];

export default {
  name: 'Dictionary',
  props: {
    form: {
      type: Object,
      default: () => ({}),
    },
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 状态数据字典
      statusOptions: [
        { key: 1, value: 1, label: '启用' },
        { key: 0, value: 0, label: '停用' },
      ],
      // 表单校验
      rules: {
        name: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '字典代码不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '值不能为空', trigger: 'blur' }],
        appId: [{ required: true, message: '适用范围不能为空', trigger: 'blur' }],
      },
      // 上级字典
      dictionaries: [],
      loading: false,
      value: {},
    };
  },
  watch: {
    form: {
      handler: function(value) {
        this.value = value || {};
      },
      immediate: true,
      deep: true,
    },
    'value.appId': {
      handler: function() {
        if (this.$refs["form"]) {
          this.$refs["form"].validateField('appId');
        }
      },
    },
  },
  mounted() {
    this.getDictionaries();
  },
  methods: {
    getDictionaries() {
      this.$request("rabbit.system.data.getAllDictionary").then((res) => {
        this.dictionaries = res.data;
      });
    },
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.value.id !== undefined) {
            this.$request("rabbit.system.data.update", { data: fieldsFilter({ id: this.id, ...this.value }, updateFilds) }).then((res) => {
              this.loading = false;
              if (res.statusCode === 600) {
                this.msgSuccess("修改成功");
                this.$emit("success");
                this.handleCancel();
              }
            });
          } else {
            this.$request("rabbit.system.data.add", { data: { ...this.value }}).then((res) => {
              this.loading = false;
              if (res.statusCode === 600) {
                this.msgSuccess("新增成功");
                this.$emit("success");
                this.handleCancel();
              }
            });
          }
        }
      });
    },
    handleCancel() {
      this.$refs["form"].resetFields();
      this.$emit("cancel");
    },
  },
};
</script>
