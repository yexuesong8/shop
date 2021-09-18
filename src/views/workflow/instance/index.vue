<template>
  <el-form label-width="auto" :model="form">
    <el-form-item label="代码" prop="code">
      <el-input v-model.trim="form.code" />
    </el-form-item>
    <el-form-item label="表单数据id" prop="dataId">
      <el-input v-model.trim="form.dataId" />
    </el-form-item>
    <el-form-item label="表单数据标题" prop="dataTitle">
      <el-input v-model.trim="form.dataTitle" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="handleClick">发起</el-button>
    </el-form-item>
    <member-selector-dialog :loading="memberLoading" :visible="visible" title="抄送人" :value="ccMemberIdList" @confirm="handleConfirm" @cancel="handleCancel" />
    <WorkflowLaunch code="test-abc" :data-id="1478" data-title="测试" />
  </el-form>
</template>

<script>
import { start, getCc } from "@/api/workflow/instance";
import { MemberSelectorDialog, WorkflowLaunch } from '@/components';

export default {
  name: "WorkflowIndex",
  components: { MemberSelectorDialog, WorkflowLaunch },
  data() {
    return {
      form: {},
      ccMemberIdList: [],
      visible: false,
      loading: false,
      memberLoading: false,
    };
  },
  methods: {
    handleCancel() {
      this.ccMemberIdList = [];
      this.visible = false;
    },
    handleConfirm(val) {
      if (this.memberLoading) {
        return;
      }
      this.memberLoading = true;
      this.ccMemberIdList = [...this.ccMemberIdList, ...val.map(item => item.id)];
      start({ ...this.form, ccMemberIdList: this.ccMemberIdList }).then(res => {
        this.memberLoading = false;
        if (res.statusCode === 600) {
          this.$message.success("发起成功");
          this.handleCancel();
        }
      });
    },
    handleClick() {
      this.loading = true;
      if (this.form.code && this.form.code !== null) {
        getCc({ code: this.form.code }).then(res => {
          this.loading = false;
          if (res.statusCode === 600 && res.data.enabledCC && res.data.enabledCC === 1) {
            this.ccMemberIdList = res.data.ccMemberIds ? res.data.ccMemberIds : [];
            this.visible = true;
          }
        });
      } else {
        this.loading = false;
        console.error("请填写代码!");
      }
    },
  },
};
</script>
