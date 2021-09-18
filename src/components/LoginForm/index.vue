<template>
  <el-form ref="form" :model="form" v-bind="$attrs" v-on="$listeners">
    <slot
      :loading="loading"
      :captchaLoading="captchaLoading"
      :form="form"
      :login="login"
      :captcha="verificationCode"
      :freshCaptcha="getVerificationCode"
      :platform="platform"
    />
  </el-form>
</template>

<script>
import { encrypt, decrypt, setAppId, setToken, getAppId, getLocalStorage, setLocalStorage, delLocalStorage, isEmptyObject } from "@monkey.do/monkey";
import { requestNoToken } from "@/utils";

export default {
  name: "LoginForm",
  props: {
    appId: {
      type: [Number, String],
      default: "",
    },
  },
  data() {
    return {
      form: {},
      loading: false,
      captchaLoading: false,
      verificationCode: "",
      platform: [],
    };
  },
  mounted() {
    // 登录获取系统参数相关配置
    this.fetchSystemSetting(this.appId);

    this.getCookie();
    this.getVerificationCode();
  },
  methods: {
    login() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.loading = true;
            const payload = { appId: this.appId || getAppId() || "", ...this.form, password: encrypt(this.form.password), rememberMe: undefined };
            this.$store.dispatch('Login', payload).then((res) => {
              this.loading = false;
              if (res.statusCode === 600) {
                this.setCookie({ ...payload, rememberMe: this.form.rememberMe });
                localStorage.setItem("isFirstLogin", true);
                setAppId(payload["appId"] || "");
                setToken(res.data);
                this.$router.push({ path: '/' });
              } else {
                this.getVerificationCode();
              }
              resolve(res);
            }).catch(err => reject(err));
          }
        });
      });
    },
    getCookie() {
      const loginInfo = getLocalStorage('rb-login-info') || {};
      const username = loginInfo.username;
      const password = loginInfo.password;
      const rememberMe = loginInfo.rememberMe;

      this.form = {
        ...this.form,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        username,
        password: password ? decrypt(password) : undefined,
      };
    },
    setCookie(value) {
      if (value.rememberMe) {
        setLocalStorage("rb-login-info", {
          username: value.username,
          password: value.password,
          rememberMe: value.rememberMe,
        });
      } else {
        delLocalStorage('rb-login-info');
      }
    },
    getVerificationCode() {
      this.captchaLoading = true;
      requestNoToken({ url: "/rabbit/captcha/get", method: "get" }).then((res) => {
        if (res.statusCode === 600) {
          this.verificationCode = "data:image/gif;base64," + res.data.image;
          this.form.uuid = res.data.uuid;
          this.captchaLoading = false;
        }
      });
    },
    fetchSystemSetting(appId) {
      return new Promise((resolve, reject) => {
        const { remoteSystemSetting } = this.$store.state.global;
        if (isEmptyObject(remoteSystemSetting)) {
          this.$store.dispatch("global/fetchSystemSetting", { appId }).then(() => {
            resolve();
          });
        }
        resolve();
      });
    },
  },
};
</script>
