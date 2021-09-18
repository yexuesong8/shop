<template>
  <Dialog
    v-if="visible"
    :title="title"
    :visible="visible"
    width="500px"
    :loading="loading"
    @cancel="cancel"
    @confirm="submitForm"
  >
    <el-form ref="addForm" :model="addForm" :rules="rules" label-width="auto">
      <el-form-item label="名称:" prop="name">
        <el-input v-model="addForm.name" clearable placeholder="请输入名称" :maxlength="50" />
      </el-form-item>
      <el-form-item label="类型:" prop="type">
        <el-select v-model="addForm.type">
          <el-option v-for="item in type" :key="item.id" clearable :value="item.id" :label="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="addForm.type==2||addForm.type=='私有'" label="组件:" prop="componentId">
        <el-select v-model="addForm.componentId">
          <template v-for="item in components">
            <el-option v-for="val in item.components" :key="val.id" :value="val.id" :label="val.name" />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="图标:" prop="icon">
        <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelector'].reset()">
          <IconSelector ref="iconSelector" @selected="selected" />
          <el-input slot="reference" v-model="addForm.icon" placeholder="点击选择图标" readonly>
            <svg-icon slot="prefix" :icon-class="addForm.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="顺序:" prop="sortNum">
        <el-input-number v-model="addForm.sortNum" :min="1" :maxlength="10" />
      </el-form-item>
      <el-form-item label="描述:" prop="description">
        <el-input v-model="addForm.description" type="textarea" :clearable="true" placeholder="请输入描述" :maxlength="200" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import { fetchAll } from '@/api/page/group';
import { addGroup, updateGroup } from '@/api/page/propertiesGroup';
import { IconSelector } from '@/components';

export default {
  name: "PropertyGroup",
  components: {
    IconSelector,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      // 新增&修改表单
      addForm: { ...this.form },
      // 属性类型
      type: [
        { id: "1", label: "公有" },
        { id: "2", label: "私有" },
      ],
      // 组件
      components: [],
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "类型不能为空", trigger: "blur" },
        ],
        componentId: [
          { required: true, message: "组件不能为空", trigger: "blur" },
        ],
        icon: [
          { required: true, message: "图标不能为空", validator: this.validateReceiver },
        ],
        sortNum: [
          { required: true, message: "顺序不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getComponents();
  },
  methods: {
    // 获取组件
    async getComponents() {
      const { statusCode, data } = await fetchAll();
      if (statusCode === 600) {
        this.components = data;
      }
    },
    // 取消
    cancel() {
      this.addForm = {};
      this.$emit("close");
    },
    // 提交
    submitForm() {
      this.$refs["addForm"].validate(async(valid) => {
        if (valid) {
          this.loading = true;
          if (this.addForm.hasOwnProperty("id")) {
            const { statusCode } = await updateGroup({ ...this.addForm, type: this.addForm.type === "公有" || this.addForm.type === "1" ? "1" : "2" });
            if (statusCode === 600) {
              this.msgSuccess("修改成功");
              this.$emit("close");
              this.$emit("update");
            }
          } else {
            const { statusCode } = await addGroup(this.addForm);
            if (statusCode === 600) {
              this.msgSuccess("新增成功");
              this.$emit("close");
              this.$emit("update");
            }
          }
          this.loading = false;
        }
      });
    },
    // 图标验证
    validateReceiver(rules, value, callback) {
      if (!this.addForm.icon) {
        callback(new Error("请选择图标"));
      }
      callback();
    },
    // 图标选择
    selected(name) {
      this.addForm = { ...this.addForm, icon: name };
    },
  },
};
</script>
