<template>
  <div class="main-content-container full-fill">
    <div v-loading="submitLoading" class="dingding-synchronous">
      <div class="left">
        <el-steps :active="active" align-center direction="vertical" finish-status="success">
          <el-step title="插件配置" />
          <el-step title="非必要操作" />
          <el-step title="组织初始化" />
          <el-step title="操作" />
        </el-steps>
      </div>
      <div class="right">
        <div class="config">
          <el-button class="btn" @click="handleConfig">配置</el-button>
        </div>
        <div class="pushD">
          <el-button class="btn" @click="pushDD">推送钉钉</el-button>
        </div>
        <div class="init">
          <span>
            <el-tag v-if="pullStatus == 2" type="danger">未完成</el-tag>
            <el-tag v-else-if="pullStatus == 1" type="success">已完成</el-tag>
            <el-tag v-else>进行中</el-tag>
          </span>
          <span class="add">
            <el-button class="btn" @click="pullDD">拉取钉钉</el-button>
          </span>
        </div>
        <div class="operate">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row :gutter="20" class="el-row" type="flex">
              <el-col :span="8">
                <el-form-item label="部门同步">
                  <el-switch v-model="form.isSyncDept" :disabled="defaultDisabled" @change="changeisSyncDept" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="钉钉登陆">
                  <el-switch v-model="form.isSyncLogin" :disabled="defaultDisabled" @change="changeisSyncLogin" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="el-row" type="flex">
              <el-col :span="8">
                <el-form-item label="用户同步">
                  <el-switch v-model="form.isSyncUser" :disabled="defaultDisabled" @change="changeisSyncUser" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="角色同步">
                  <el-switch v-model="form.isSyncRole" :disabled="defaultDisabled" @change="changeisSyncRole" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <Dialog v-if="visible" title="钉钉插件配置" :visible="visible" width="600px" @cancel="handleOnCancel" @confirm="handleOnConfirm">
        <el-form ref="form1" :model="form1" label-width="120px" :rules="rules" @submit.native.prevent>
          <el-row>
            <el-col :span="24">
              <el-form-item label="AgentId:" prop="agentId">
                <el-input v-model="form1.agentId" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="AppKey:" prop="appKey">
                <el-input v-model="form1.appKey" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="AppSecret:" prop="appSecret">
                <el-input v-model="form1.appSecret" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="aesKey:" prop="aesKey">
                <el-input v-model="form1.aesKey " clearable placeholder="请输入43位的字母或数字" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="aesToken:" prop="aesToken">
                <el-input v-model="form1.aesToken" clearable placeholder="请输入6-64位的字符" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </Dialog>
    </div>
  </div>
</template>
<script>
import { Dialog } from "@monkey.do/monkey";
import { get, save, pull, push, getStatus } from "@/api/plugins/dingTalk";

export default {
  name: "DingTalk",
  components: {
    Dialog,
  },
  data() {
    const validateaesKey = (rule, value, callback) => {
      if (value) {
        const reg = /^[A-Za-z0-9]{43}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的数字或字符'));
        } else {
          callback();
        }
      } else {
        callback(new Error('请填写aesKey'));
      }
    };
    const validateToken = (rule, value, callback) => {
      if (value) {
        const reg = /^.{6,64}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确长度的字符'));
        } else {
          callback();
        }
      } else {
        callback(new Error('请填写aesToken'));
      }
    };
    return {
      active: undefined, // 顶部操作进度选中
      submitLoading: false,
      activeName: "1",
      visible: false,
      defaultDisabled: true,
      // 表单校验
      rules: {
        agentId: [{ required: true, message: "请填写agentId", trigger: "blur" }],
        appKey: [{ required: true, message: "请填写appKey", trigger: "blur" }],
        appSecret: [{ required: true, message: "请填写appSecret", trigger: "blur" }],
        aesKey: [{ required: true, validator: validateaesKey, trigger: "blur" }],
        aesToken: [{ required: true, validator: validateToken, trigger: "blur" }],
      },
      form: {
        isSyncDept: false,
        isSyncUser: false,
        isSyncLogin: false,
        isSyncRole: false,
      },
      form1: {
        agentId: undefined,
        appKey: undefined,
        appSecret: undefined,
        aesKey: undefined,
        aesToken: undefined,
        id: undefined,
      },
      pullStatus: 2,
    };
  },
  created() {
    this.getConfig();
    this.getState();
  },
  methods: {
    getConfig() {
      this.submitLoading = true;
      get({ }).then((response) => {
        this.submitLoading = false;
        if (response.statusCode === 600 && response.data.length > 0) {
          this.defaultDisabled = false;
          const { isSyncDept, isSyncUser, isSyncLogin, isSyncRole, id, agentId, appKey, appSecret, aesKey, aesToken } = response.data[0];
          this.form.isSyncDept = Boolean(isSyncDept);
          this.form.isSyncUser = Boolean(isSyncUser);
          this.form.isSyncLogin = Boolean(isSyncLogin);
          this.form.isSyncRole = Boolean(isSyncRole);
          // this.$store.commit("plugins/setisNailingLogin", this.form.isSyncLogin);
          localStorage.setItem("isNailingLogin", this.form.isSyncLogin);
          this.form1.id = id;
          this.form1.agentId = agentId;
          this.form1.appKey = appKey;
          this.form1.appSecret = appSecret;
          this.form1.aesKey = aesKey;
          this.form1.aesToken = aesToken;
        } else {
          this.$message('请先点击配置按钮完成插件配置');
        }
      });
    },
    getState() {
      this.submitLoading = true;
      getStatus({ }).then((response) => {
        this.submitLoading = false;
        if (response.statusCode === 600) {
          if (response.data) {
            this.pullStatus = response.data.state;
          } else {
            this.pullStatus = 2;
          }
          if (this.pullStatus === 2) {
            this.$message('请先点击拉取钉钉（同步钉钉企业组织架构）');
          }
        }
      });
    },
    changeisSyncDept() {
      if (this.pullStatus === 1) {
        this.submitLoading = true;
        this.form = {
          isSyncDept: this.form.isSyncDept ? 1 : 0,
          isSyncUser: this.form.isSyncUser ? 1 : 0,
          isSyncLogin: this.form.isSyncLogin ? 1 : 0,
          isSyncRole: this.form.isSyncRole ? 1 : 0,
        };
        this.form.isSyncUser = this.form.isSyncDept ? this.form.isSyncUser : 0;
        save({
          ...this.form1,
          ...this.form,
          id: this.form1.id,
        }).then((response) => {
          this.submitLoading = false;
          if (response.statusCode === 600) {
            this.msgSuccess("编辑成功");
            this.visible = false;
            this.getConfig();
          }
        });
      } else {
        this.$message({
          message: '不可操作，请先拉取钉钉',
          type: 'warning',
        });
      }
    },
    changeisSyncLogin() {
      if (this.pullStatus === 1) {
        this.submitLoading = true;
        this.form = {
          isSyncDept: this.form.isSyncDept ? 1 : 0,
          isSyncUser: this.form.isSyncUser ? 1 : 0,
          isSyncLogin: this.form.isSyncLogin ? 1 : 0,
          isSyncRole: this.form.isSyncRole ? 1 : 0,
        };
        save({
          ...this.form1,
          ...this.form,
          id: this.form1.id,
        }).then((response) => {
          this.submitLoading = false;
          if (response.statusCode === 600) {
            this.msgSuccess("编辑成功");
            this.visible = false;
            this.getConfig();
          }
        });
      } else {
        this.$message({
          message: '不可操作，请先拉取钉钉',
          type: 'warning',
        });
      }
    },
    changeisSyncUser() {
      if (this.pullStatus === 1) {
        this.submitLoading = true;
        this.form = {
          isSyncDept: this.form.isSyncDept ? 1 : 0,
          isSyncUser: this.form.isSyncUser ? 1 : 0,
          isSyncLogin: this.form.isSyncLogin ? 1 : 0,
          isSyncRole: this.form.isSyncRole ? 1 : 0,
        };

        this.form.isSyncDept = this.form.isSyncUser ? 1 : this.form.isSyncDept;
        save({
          ...this.form1,
          ...this.form,
          id: this.form1.id,
        }).then((response) => {
          this.submitLoading = false;
          if (response.statusCode === 600) {
            this.msgSuccess("编辑成功");
            this.visible = false;
            this.getConfig();
          }
        });
      } else {
        this.$message({
          message: '不可操作，请先拉取钉钉',
          type: 'warning',
        });
      }
    },
    changeisSyncRole() {
      if (this.pullStatus === 1) {
        this.submitLoading = true;
        this.form = {
          isSyncDept: this.form.isSyncDept ? 1 : 0,
          isSyncUser: this.form.isSyncUser ? 1 : 0,
          isSyncLogin: this.form.isSyncLogin ? 1 : 0,
          isSyncRole: this.form.isSyncRole ? 1 : 0,
        };
        save({
          ...this.form1,
          ...this.form,
          id: this.form1.id,
        }).then((response) => {
          this.submitLoading = false;
          if (response.statusCode === 600) {
            this.msgSuccess("编辑成功");
            this.visible = false;
            this.getConfig();
          }
        });
      } else {
        this.$message({
          message: '不可操作，请先拉取钉钉',
          type: 'warning',
        });
      }
    },
    handleConfig() {
      this.visible = true;
    },
    handleOnConfirm() {
      this.$refs["form1"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          this.form = {
            isSyncDept: this.form.isSyncDept ? 1 : 0,
            isSyncUser: this.form.isSyncUser ? 1 : 0,
            isSyncLogin: this.form.isSyncLogin ? 1 : 0,
            isSyncRole: this.form.isSyncRole ? 1 : 0,
          };
          if (!this.form1.id) {
            save({ ...this.form1, ...this.form }).then((response) => {
              this.submitLoading = false;
              if (response.statusCode === 600) {
                this.msgSuccess("新增成功");
                this.visible = false;
                this.getConfig();
              }
            });
          } else {
            save({
              ...this.form1,
              ...this.form,
              id: this.form1.id,
            }).then((response) => {
              this.submitLoading = false;
              if (response.statusCode === 600) {
                this.msgSuccess("编辑成功");
                this.visible = false;
                this.getConfig();
              }
            });
          }
        }
      });
    },

    handleOnCancel() {
      this.visible = false;
      this.form1 = {};
    },
    pushDD() {
      this.submitLoading = true;
      push({ }).then((response) => {
        this.submitLoading = false;
        if (response.statusCode === 600) {
          this.msgSuccess("推送钉钉成功");
        }
      });
    },
    pullDD() {
      this.submitLoading = true;
      pull({ }).then((response) => {
        this.submitLoading = false;
        if (response.statusCode === 600) {
          // this.pullStatus = true;
          this.msgSuccess("拉取钉钉成功");
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dingding-synchronous {
  width: 90%;
  height: 90%;
  background: #ffffff;
  border-radius: 10px;
}
.config {
  padding: 20px 0;
  padding-left: 15px;
}
.pushD {
  padding: 30px 0;
  padding-left: 15px;
}
.init {
  padding: 30px 0;
  padding-left: 15px;
}
.operate{
  margin-top: 25px;
}
.dingding-synchronous {
  .left {
    float: left;
    width: 260px;
    height: 390px;
    margin-bottom: 24px;
    padding: 20px 0;
    padding-left: 130px;
  }
  .right {
    float: left;
    width: 460px;
    height: 390px;
  }
  /deep/ .el-step__icon {
    background-color: #1890ff;
    width: 25px;
    height: 25px;
  }
  /deep/.el-step__title.is-process,
  /deep/.el-step__title.is-wait,
  /deep/.el-step__title.is-success {
    color: #333;
    font-size: 14px;
    font-weight: normal;
  }
  /deep/.el-step__head.is-process,
  /deep/.el-step__head.is-success {
    .el-step__icon.is-text {
      color: #1890ff;
      border-color: #1890ff;
    }
  }
  /deep/.el-step__line-inner {
    display: none;
  }
  /deep/.el-step.is-horizontal .el-step__line {
    margin: 0 52px !important;
    height: 1px;
    top: 20px;
  }
  /deep/.el-tabs__nav-wrap::after {
    height: 0;
  }
  /deep/.el-rate {
    height: 26px;
    .el-rate__icon {
      font-size: 24px;
    }
  }
}
</style>
