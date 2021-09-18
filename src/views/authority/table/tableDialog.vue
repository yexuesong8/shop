<template>
  <Dialog :visible="visible" :title="title" :loading="loading" @close="handleClose" @confirm="handleConfirm">
    <el-form ref="form" :model="form" :rules="rules" label-width="auto">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" maxlength="50" />
      </el-form-item>
      <el-form-item label="表名" prop="code">
        <el-input v-model="form.code" maxlength="100" />
      </el-form-item>
      <el-form-item label="类型" prop="categoryId">
        <DropDownTreeSelector
          v-model="form.categoryId"
          placeholder="请选择分类"
          data-source-uri="/api/v1/rabbit/data/category/find/tree"
          source-type="uri"
          wants="id"
        />
      </el-form-item>
      <el-form-item label="开启授权" prop="needAuth">
        <status-selector v-model="form.needAuth" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import { Dialog } from "@monkey.do/monkey";
import mixins from './mixins.js';
import { createTable, updateTable, stairMenu } from "@/api/authority/table";
export default {
  components: {
    Dialog,
  },
  mixins: [mixins],
  data() {
    return {
      form: {},
      rules: {
        name: [{ required: true, message: '请输入功能名', trigger: 'blur' }],
        code: [{ required: true, message: '请输入表名', trigger: 'blur' }],
        createType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        directoryId: [{ required: true, message: '请选择目录', trigger: 'change' }],
        appId: [{ required: true, message: '请选择应用', trigger: 'change' }],
      },
      loading: false,
      catalogueList: [],
    };
  },
  watch: {
    currentRow: {
      handler(val) {
        this.form = val;
      },
      deep: true,
    },
  },
  mounted() {
    // this.getCatalogue();
  },
  methods: {
    createTable,
    updateTable,
    async getCatalogue() {
      const res = await stairMenu();
      if (res.statusCode !== 600) return;
      this.catalogueList = res.data;
    },
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.currentRow.id
          ? this.handleRequest('updateTable', '修改成功')
          : this.handleRequest('createTable', '新增成功');
      });
    },
  },
};
</script>
