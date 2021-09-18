<template>
  <div class="login-platform-item">
    <slot @click="handleClick()" />
    <div v-if="!$scopedSlots.default" @click="handleDDLogin()">
      <div :class="iconClass" />
      <div class="name">{{ iconName }}</div>
    </div>
    <el-dialog :class="dialogClass" :title="ddTitle" :center="center" :visible="visible" :has-footer="hasFooter" :width="width" :height="height" @close="handleCancel">
      <DingDing />
    </el-dialog>
  </div>
</template>

<script>
import DingDing from "./dingding";
import { setAppId, setToken } from "@monkey.do/monkey";
import { ddLogin } from "@/api/login";
import "./dd.js";
export default {
  name: "DingDingLogin",
  components: { DingDing },
  props: {
    iconClass: {
      type: String,
      default: "icon dingding",
    },
    dialogClass: {
      type: String,
      default: "dialogClass",
    },
    width: {
      type: String,
      default: "365px",
    },
    height: {
      type: String,
      default: "365px",
    },
    hasFooter: {
      type: Boolean,
      default: false,
    },
    center: {
      type: Boolean,
      default: true,
    },
    ddTitle: {
      type: String,
      default: "钉钉扫码登录",
    },
    iconName: {
      type: String,
      default: "钉钉登录",
    },
  },
  data() {
    return {
      code: '',
      visible: false,
      iconVisible: true,
    };
  },
  created() {
    this.getUrlCode();
    this._ddLogin();
  },
  methods: {
    handleClick() {
      this.visible = true;
    },
    handleDDLogin() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    },
    getUrlCode() {
      this.code = this.$router.history.current.query.code || "";
    },
    login(code) {
      this.$emit("loading", true);
      ddLogin({ code: code }).then((res) => {
        if (res.statusCode === 600) {
          setToken(res.data.token);
          setAppId(res.data.appId);
        }
      }).finally(() => {
        this.$emit("loading", false);
        this.$router.push({ path: "/" });
      });
    },
    _ddLogin() {
      if (this.code !== "") {
        this.login(this.code);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialogClass .el-dialog__body {
  padding-left: 0px;
}
.login-platform-item {
  display: inline-block;
  margin-right: 40px;
  font-size: 12px;
  cursor: pointer;
  .icon {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    &.dingding {
      background: url("../../../assets/rabbit/images/dingding.png") no-repeat
        center center;
    }
  }
  .name {
    margin-top: 12px;
  }
}
</style>
