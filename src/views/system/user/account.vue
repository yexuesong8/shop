<template>
  <Dialog width="720px" :visible="visible" :loading="loading" title="开通账号" @cancel="handleCancel" @confirm="handleConfirm">
    <el-form ref="form" :model="form" :rules="rules" label-width="auto">
      <el-form-item label="账号:" prop="account">
        <el-input v-model="form.account" :maxlength="20" clearable />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import { Dialog } from "@monkey.do/monkey";
export default {
  name: "UserAccount",

  components: { Dialog },

  props: {
    id: {
      type: String,
      default: "",
    },
    account: {
      type: String,
      default: "",
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      form: {},
      loading: false,
      rules: {
        account: [{ required: true, message: "账户不能为空" }],
      },
    };
  },

  watch: {
    account: {
      handler: function(value) {
        if (value) this.form = { ...this.form, account: value };
      },
      immediate: true,
    },
  },

  methods: {
    handleConfirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$request("rabbit.system.user.createAccount", { data: { id: this.id, ...this.form }}).then(res => {
            if (res.statusCode === 600) {
              this.$message.success("开通成功");
              this.handleCancel();
              this.onSubmit();
            }
          });
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
