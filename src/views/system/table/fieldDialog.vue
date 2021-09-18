<template>
  <Dialog :visible="visible" :title="title" :loading="loading" @close="handleClose" @confirm="handleConfirm">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" maxlength="50" />
      </el-form-item>
      <el-form-item label="字段" prop="code">
        <el-input v-model="form.code" maxlength="50" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <DictionarySelector :value.sync="form.type" code="system_field_type" @change="handleTypeChange" />
      </el-form-item>
      <el-form-item label="长度" prop="length">
        <el-input v-model="form.length" maxlength="10" oninput="value=value.replace(/[^\d]/g, '')" />
      </el-form-item>
      <el-form-item v-if="form.type === 'entity'" label="实体关联表" prop="entityTableId" :rules="[{ required: form.type === 'entity', message: '请选择实体关联表', trigger: 'change' }]">
        <el-select v-model="form.entityTableId" :disabled="disabled" filterable>
          <el-option v-for="item in tableList" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" maxlength="200" :autosize="{ minRows: 3 }" show-word-limit />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import mixins from './mixins.js';
import { createField, updateField, findAllTable } from "@/api/system/table";

export default {
  mixins: [mixins],
  data() {
    return {
      form: {},
      loading: false,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        length: [{ required: true, message: '请输入长度', trigger: 'blur' }],
      },
      tableList: [],
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
    handleTypeChange(val) {
      if (val === 'text') {
        this.$set(this.form, 'entityTableId', '');
      }
    },
  },
};
</script>
