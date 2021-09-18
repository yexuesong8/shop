<template>
  <div id="login_container" class="login_container" />
</template>

<script>
import { getAppid } from "@/api/login";
export default {
  name: "DingDing",
  data() {
    return {
      appid: '',
      redirectUri: '',
      code: '',
      loginTmpCode: '',
    };
  },
  mounted() {
    this._getAppid();
  },
  methods: {
    async _getAppid() {
      const res = await getAppid();
      if (res.statusCode !== 600) return;
      this.appid = res.data.appId;
      this.redirectUri = res.data.redirectUri;
      console.log(this.redirectUri, 888);
      this.initDDLogin();
    },

    // 钉钉实例化
    initDDLogin() {
      this.dd = window.DDLogin({
        id: "login_container",
        goto: encodeURIComponent(
          `https://oapi.dingtalk.com/connect/qrconnect?appid=${this.appid}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${this.redirectUri}login`
        ),
        style: "border:none;background-color:#FFFFFF",
      });
      var handleMessage = function(event) {
        var origin = event.origin;
        if (origin === "https://login.dingtalk.com") {
          // 判断是否来自ddLogin扫码事件。
          this.loginTmpCode = event.data;
          // 获取到loginTmpCode后就可以在这里构造跳转链接进行跳转了
          window.location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.appid}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${this.redirectUri}login&loginTmpCode=${this.loginTmpCode}`;
        } else {
          console.info(event);
        }
      };
      if (typeof window.addEventListener !== "undefined") {
        window.addEventListener("message", handleMessage.bind(this), false);
      } else if (typeof window.attachEvent !== "undefined") {
        window.attachEvent("onmessage", handleMessage.bind(this));
      }
    },
  },
};
</script>

