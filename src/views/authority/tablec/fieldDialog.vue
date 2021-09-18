<template>
  <Dialog :visible="visible" :title="title" :loading="loading" @close="handleClose" @confirm="handleConfirm">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" maxlength="50" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="form.code" maxlength="50" />
      </el-form-item>
      <el-form-item label="授权方式" prop="authModeCode">
        <drop-down-tree-selector
          v-model="form.authModeCode"
          data-source-uri="/api/v1/rabbit/system/data/auth/mode/find/all"
          placeholder="请选择授权方式"
          :property="authProperty"
          wants="code"
        />
      </el-form-item>
      <el-form-item label="对应字典" prop="dictionaryCode">
        <drop-down-tree-selector
          v-model="form.dictionaryCode"
          data-source-uri="/api/v1/rabbit/data/dictionary/find/all"
          placeholder="请选择对应字典"
        />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import mixins from './mixins.js';
import { createField, updateField, findAllTable } from "@/api/authority/table";

export default {
  mixins: [mixins],
  props: {
    tableId: {
      type: String,
    },
  },
  data() {
    return {
      form: {},
      loading: false,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        authModeCode: [{ required: true, message: '请选择类型', trigger: 'change' }],
      },
      tableList: [],
      authProperty: {
        id: "code",
        name: "name",
        children: "childList",
        key: "id",
      },
    };
  },
  computed: {
    disabled() {
      return this.form.type !== 'entity';
    },
  },
  watch: {
    currentRow: {
      handler(val) {
        this.form = val;
      },
      deep: true,
    },
  },
  created() {
    this.getTableList();
  },
  methods: {
    createField,
    updateField,
    async getTableList() {
      const res = await findAllTable();
      if (res.statusCode !== 600) return;
      this.tableList = res.data;
    },
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.currentRow.id
          ? this.handleRequest('updateField', '修改成功')
          : this.handleRequest('createField', '新增成功');
      });
    },
    handleRequest(method, msg) {
      this.loading = true;
      this.form.tableId = this.tableId;
      this[method](this.form).then(res => {
        if (res.statusCode !== 600) return;
        this.handleClose();
        this.$emit('success');
        this.msgSuccess(msg);
      }).finally(() => (this.loading = false));
    },
    handleTypeChange(val) {
      if (val === 'text') {
        this.$set(this.form, 'entityTableId', '');
      }
    },
  },
};
</script>
