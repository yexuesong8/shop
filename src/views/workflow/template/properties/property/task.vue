<template>
  <el-row>
    <el-row>
      <div style="float:right;margin-bottom:10px">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button :disabled="!selectedRows.length" @click="handleDelete">删除</el-button>
      </div>
    </el-row>
    <el-table :data="list" @selection-change="handleSelectionChange" @cell-dblclick="cellDbClick">
      <el-table-column type="selection" align="center" />
      <el-table-column label="名称" prop="name" show-overflow-tooltip />
      <el-table-column label="时机" prop="opportunity" show-overflow-tooltip>
        <template v-slot:default="slot">
          {{ dictFormatter(elementType === 'process' ? 'rabbit_workflow_task_opportunity' : 'rabbit_workflow_node_task_opportunity', slot.row.opportunity) }}
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" show-overflow-tooltip>
        <template v-slot:default="slot">
          {{ dictFormatter("rabbit_workflow_task_type", slot.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="顺序" prop="sortNum" show-overflow-tooltip />
    </el-table>
    <Dialog :title="title" :visible="visible" @cancel="handleCancel" @confirm="handleConfirm">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称:" prop="name">
          <el-input v-model.trim="form.name" placeholder="请填写任务名称" :maxlength="50" />
        </el-form-item>
        <el-form-item label="触发时机:" prop="opportunity">
          <dictionary-selector :value.sync="form.opportunity" :code="elementType === 'process' ? 'rabbit_workflow_task_opportunity' : 'rabbit_workflow_node_task_opportunity'" />
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <dictionary-selector :value.sync="form.type" code="rabbit_workflow_task_type" />
        </el-form-item>
        <el-form-item label="执行顺序:" prop="sortNum">
          <el-input-number v-model="form.sortNum" :min="0" :max="100 " />
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请填写内容" :maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请填写执行顺序" :maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog title="修改任务" :visible="editVisible" @cancel="handleEditCancel" @confirm="handleEditConfirm">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px">
        <el-form-item label="名称:" prop="name">
          <el-input v-model.trim="editForm.name" placeholder="请填写任务名称" :maxlength="50" />
        </el-form-item>
        <el-form-item label="触发时机:" prop="opportunity">
          <dictionary-selector :value.sync="editForm.opportunity" :code="elementType === 'process' ? 'rabbit_workflow_task_opportunity' : 'rabbit_workflow_node_task_opportunity'" />
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <dictionary-selector :value.sync="editForm.type" code="rabbit_workflow_task_type" />
        </el-form-item>
        <el-form-item label="执行顺序:" prop="sortNum">
          <el-input-number v-model="editForm.sortNum" :min="0" :max="100 " />
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <el-input v-model="editForm.content" type="textarea" placeholder="请填写内容" :maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="editForm.description" type="textarea" placeholder="请填写执行顺序" :maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
    </Dialog>
  </el-row>
</template>

<script>
import { Dialog } from "@monkey.do/monkey";
// import { dictFormatter } from '@/utils';
import { DictionarySelector } from "@/components";

export default {
  name: "TaskProperty",
  components: { Dialog, DictionarySelector },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    elementType: {
      type: String,
      default: "node",
    },
  },
  data() {
    return {
      type: "add",
      visible: false,
      editVisible: false,
      fields: ["name", "opportunity", "type", "content", "sortNum", "description", "id"],
      form: {},
      editForm: {},
      rules: {
        name: [{ required: true, message: "请填写任务名称", trigger: 'blur' }],
        opportunity: [{ required: true, message: "请选择触发时机", trigger: 'change' }],
        type: [{ required: true, message: "请选择类型", trigger: 'change' }],
        content: [{ required: true, message: "请填写内容", trigger: 'blur' }],
        sortNum: [{ required: true, message: "请填写执行顺序", trigger: 'change' }],
      },
      selectedRows: [],
      customId: 1,
      list: [],
    };
  },
  computed: {
    title() {
      return this.type === "add" ? "新增任务" : "修改任务";
    },
  },
  watch: {
    value: {
      handler: function(value) {
        this.list = value;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleAdd() {
      this.visible = true;
    },

    handleConfirm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const data = { ...this.form, customId: this.customId };
          this.customId = this.customId + 1;
          const list = [...this.list];
          list.unshift(data);
          this.handleCancel();
          this.$emit("change", list);
        }
      });
    },

    handleCancel() {
      this.visible = false;
      this.$refs["form"].resetFields();
    },
    cellDbClick(list) {
      this.editVisible = true;
      this.editForm = { ...list };
    },
    handleEditCancel() {
      this.editVisible = false;
      this.$refs["editForm"].resetFields();
    },
    handleEditConfirm() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          const data = { ...this.editForm };
          const list = [...this.list];
          list.forEach((item, index) => {
            if (item.customId === this.editForm.customId) {
              list.splice(index, 1, data);
            }
          });
          this.handleEditCancel();
          this.$emit("change", list);
        }
      });
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },

    handleDelete() {
      let list = [...this.list];

      this.selectedRows.forEach(row => {
        if (row.id) {
          // TODO: 批量删除 节约性能
          list = list.filter(item => item.id !== row.id);
        }

        if (row.customId) {
          list = list.filter(item => {
            return item.customId !== row.customId;
          });
        }
      });

      this.$emit("change", list);
    },
  },
};
</script>
