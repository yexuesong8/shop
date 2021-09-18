<template>
  <div class="login">
    <div class="login-bg">
      <img class="left-bg" :src="LogoBg" alt="">
    </div>
    <login-form class="login-form" size="medium" :rules="rules" :app-id="appId">
      <template v-slot:default="slot">
        <h3 class="title">
          <span>登录</span>
          <span>SIGN IN</span>
        </h3>
        <el-form-item prop="username">
          <el-input v-model="slot.form.username" type="text" auto-complete="off" :maxlength="20" placeholder="请输入账号">
            <span slot="prefix">
              <svg-icon class="login-icon" icon-class="user" />
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="slot.form.password"
            :type="passShow ? 'text' : 'password'"
            auto-complete="off"
            placeholder="请输入密码"
            :maxlength="30"
            @keyup.enter.native="slot.login"
          >
            <span slot="prefix">
              <svg-icon class="login-icon" icon-class="lock" />
            </span>
            <span slot="suffix" class="check-pass" @click="handleCheckPass">
              <svg-icon class="login-icon" :icon-class="passShow ? 'yanjing_kai' : 'yanjing_bi'" />
            </span>
          </el-input>
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item prop="captcha" class="login-code-box">
          <el-input
            v-model="slot.form.captcha"
            auto-complete="off"
            placeholder="请输入验证码"
            :maxlength="6"
            @keyup.enter.native="slot.login"
          >
            <span slot="prefix">
              <svg-icon class="login-icon" icon-class="safetycertificate" />
            </span>
          </el-input>
          <div class="login-code" :style="{'pointer-events':slot.captchaLoading ? 'none':''}" style="-webkit-user-select:none">
            <img v-if="!!slot.captcha" :src="slot.captcha" @click="slot.freshCaptcha()">
          </div>
        </el-form-item>

        <!-- 选择平台 -->
        <el-form-item v-if="!appId" prop="appId">
          <platform-selector v-model="slot.form.appId" placeholder="请选择平台" />
        </el-form-item>

        <!-- 记住密码 -->
        <el-row v-if="systemSetting.rememberMe">
          <el-col :span="24">
            <el-checkbox v-model="slot.form.rememberMe" style="margin:0 0 24px 0;">记住密码</el-checkbox>
          </el-col>
        </el-row>

        <el-form-item style="width:100%;">
          <el-button class="submit-login-btn" :loading="slot.loading" type="primary" @click.native.prevent="slot.login()">
            <span v-if="!slot.loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>

        <div class="other-login">
          <div class="login-platform-wrapper">
            <div v-show="false" class="login-platform-item">
              <div class="icon wechat" />
              <div class="name">微信登录</div>
            </div>
            <DingDingLogin
              v-if="isDingLogin"
              @loading="handleDdLoginLoading"
            />
          </div>
        </div>
        <slot />
      </template>
    </login-form>
  </div>
</template>

<script>
import LogoBg from "@assets/images/login-form-bg.png";
import LoginForm from "@/components/LoginForm";
import PlatformSelector from "@/components/PlatformSelector";
import "@assets/styles/login.scss";
import DingDingLogin from "@/components/ThirdLogin/dingding";
import { mapState } from 'vuex';
import { get } from "@/api/plugins/dingTalk";

export default {
  name: "RabbitLogin",
  components: { LoginForm, DingDingLogin, PlatformSelector },
  props: {
    appId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      LogoBg,
      rules: {
        username: [{ required: true, trigger: "blur", message: "用户名不能为空" }],
        password: [{ required: true, trigger: "blur", message: "密码不能为空" }],
        captcha: [{ required: true, trigger: "change", message: "验证码不能为空" }],
        appId: [{ required: true, trigger: "change", message: "请选择平台" }],
      },
      passShow: false,
      fullscreenLoading: false,
      isDingLogin: undefined,
    };
  },
  computed: {
    ...mapState({
      systemSetting: state => state.global.systemSetting,
    }),
    loginForm: {
      get() {
        return this.$store.getters.loginForm;
      },
      set(val) {
        this.$store.commit("setLoginForm", val);
      },
    },
  },
  created() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      this.submitLoading = true;
      get({ }).then((response) => {
        this.submitLoading = false;
        if (response.statusCode === 600 && response.data.length > 0) {
          const { isSyncLogin } = response.data[0];
          this.isDingLogin = Boolean(isSyncLogin);
        }
      });
    },
    handleCheckPass() {
      this.passShow = !this.passShow;
    },
    handleDdLoginLoading(loading) {
      this.fullscreenLoading = loading;
    },
  },
};
</script>
