<template>
  <div>
    <slot :click="handleClick" :loading="loading" />
    <el-button v-if="!$scopedSlots.default" :loading="loading" type="primary" @click="handleClick">{{ buttonLabel }}</el-button>
    <member-dialog :loading="memberLoading" :visible="visible" title="抄送人" :value="ccMemberIdList" @confirm="handleConfirm" @cancel="handleCancel" />
  </div>
</template>

<script>
import { start, getCc } from "@/api/workflow/instance";
import memberDialog from '@/components/MemberSelector/member-dialog.vue';
export default {
  name: "WorkflowLaunch",
  components: { memberDialog },

  props: {
    buttonLabel: {
      type: String,
      default: "发起",
    },
    code: {
      type: String,
      default: "",
      required: true,
    },
    dataId: {
      type: Number,
      default: 0,
      required: true,
    },
    dataTitle: {
      type: null,
      default: "",
      required: true,
    },
    successText: {
      type: String,
      default: "抄送成功",
    },
    errorText: {
      type: String,
      default: "请传递代码!",
    },
  },
  provide() {
    return {

    };
  },
  data() {
    return {
      loading: false,
      memberLoading: false, // 人员选择器loading
      visible: false,
      ccMemberIdList: [],
      form: {},
    };
  },
  methods: {
    handleConfirm(val) {
      if (this.memberLoading) {
        return;
      }
      this.memberLoading = true;
      this.form.code = this.code;
      this.form.dataId = this.dataId;
      this.form.dataTitle = this.dataTitle;
      this.form.ccMemberIdList = [...this.ccMemberIdList, ...val.map(item => item.id)];
      start({ ...this.form }).then(res => {
        this.memberLoading = false;
        if (res.statusCode === 600) {
          this.$message.success(this.successText);
          this.handleCancel();
        }
      });
    },
    handleCancel() {
      this.ccMemberIdList = [];
      this.visible = false;
    },
    handleClick() {
      this.loading = true;
      if (this.code && this.code !== null) {
        getCc({ code: this.code }).then(res => {
          this.loading = false;
          if (res.statusCode === 600 && res.data.enabledCC && res.data.enabledCC === 1) {
            this.ccMemberIdList = res.data.ccMemberIds ? res.data.ccMemberIds : [];
            this.visible = true;
          }
        });
      } else {
        this.loading = false;
        console.error(this.errorText);
      }
    },
  },

};
</script>
