<template>
  <Dialog :title="title" :visible="visible" :loading="loading" @cancel="handleCancel" @confirm="handleSubmit">
    <el-form ref="form" :model="detail" :rules="rules" label-width="auto">
      <el-form-item label="标题" prop="title">
        <el-input v-model="detail.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="代码" prop="code">
        <el-input v-model="detail.code" placeholder="请输入代码" />
      </el-form-item>
      <el-form-item label="接收人" prop="receiverIds">
        <member-selector ref="memberSelector" v-model="detail.receiverIds" @change="handleReceiverChange" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="detail.content" type="textarea" show-word-limit placeholder="请输入内容" maxlength="1500" />
      </el-form-item>
      <ApplicationItem v-model="detail.appId" />
    </el-form>
  </Dialog>
</template>

<script>
import { send } from "@/api/data/message";

export default {
  name: "Detail",
  props: {
    title: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rules: {
        title: [{
          required: true,
          message: "请输入标题",
          trigger: "blur",
        }],
        code: [{
          required: true,
          message: "请输入代码",
          trigger: "blur",
        }],
        content: [{
          required: true,
          message: "请输入内容",
        }],
        appId: [{
          required: true,
          message: "请输入AppId",
        }],
        receiverIds: [{
          required: true,
          message: "请选择接收人",
          validator: this.validateReceiver,
        }],
      },
      loading: false,
      detail: {},
    };
  },
  methods: {
    // 新增
    handleSubmit() {
      this.$refs["form"].validate((validate) => {
        if (validate) {
          this.loading = true;
          const payload = {
            ...this.detail,
            receiverIds: this.detail.receiverIds.map((item) => item.id),
          };
          send(payload).then((res) => {
            if (res.statusCode === 600) {
              this.msgSuccess("新增成功");
              this.$emit("refresh");
              this.handleCancel();
            }
          }).finally(() => (this.loading = false));
        }
      });
    },
    // 关闭
    handleCancel() {
      this.$emit("close");
      this.detail = {};
      this.$refs.form.resetFields();
    },
    validateReceiver(rules, value, callback) {
      if (!(this.detail.receiverIds || []).length) {
        callback(new Error("请选择接收人"));
      }
      callback();
    },
    handleReceiverChange() {
      this.$refs["form"].validateField("receiverIds");
    },
  },
};
</script>
