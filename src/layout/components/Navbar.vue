<template>
  <div v-if="systemSetting.showHeader" class="app-navbar clearfix">
    <hamburger :is-active="sidebar.opened" @toggleClick="toggleSideBar" />
    <div id="nav-bar-extra-content" class="nav-bar-extra-content fl" />
    <div class="right-menu fr">
      <div class="right-menu-item">
        <screen-full v-if="systemSetting.showScreenFull" class="screen-full-icon" />
      </div>
      <my-message v-if="showMessage" class="right-menu-item" />
      <el-dropdown v-if="systemSetting.showUserCenter" class="header-user-info-container right-menu-item hover-effect" trigger="hover">
        <div class="user-info-box">
          <div class="avatar-wrapper">
            <img v-if="avatar" :src="getImgSrc(avatar)" class="user-avatar" alt="">
            <span v-else class="no-avatar-bg" />
          </div>
          <span class="user-name">{{ name || "" }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleLoadUserCenter">个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="showSetting">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Hamburger from '@/layout/components/Hamburger';
import { navBarExtraLoad } from "./ExtraContent";
import { getImgSrc } from "@/utils";
import MyMessage from "./MyMessage";
import ScreenFull from "@/components/Screenfull";

export default {
  name: "Navbar",
  components: {
    Hamburger,
    MyMessage,
    ScreenFull,
  },
  data() {
    return {
      getImgSrc,
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      "name",
    ]),
    ...mapState("global", {
      systemSetting: state => state.systemSetting,
    }),
    showMessage: {
      get() {
        return this.$store.state.global.systemSetting.showMessage;
      },
    },
    setting: {
      get() {
        return this.$store.state.global.systemSetting.showSettings;
      },
      set(val) {
        this.$store.dispatch('global/changeSystemSetting', { showSettings: val });
      },
    },
  },
  mounted() {
    navBarExtraLoad();
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      this.$doingConfirm({ title: "退出登录", message: "确实要注销并退出系统吗？" }).then(() => {
        localStorage.setItem("isFirstLogin", false);
        this.$store.dispatch('LogOut').then(() => {
          localStorage.setItem("AuthToken", '');
          this.$router.push("/login");
        });
      });
    },
    handleLoadUserCenter() {
      this.$router.push({ path: '/user/profile' });
    },
    showSetting() {
      this.setting = true;
    },
  },
};
</script>

<style lang="scss">
.app-navbar {
  display: flex;
  height: 48px;
  overflow: hidden;
  position: relative;
  background: #fff;
  border-bottom: 1px solid rgba(0,21,41,.08);
  .right-menu {
    display: flex;
    height: 100%;
    padding-right: 20px;
    align-items: center;
    .screen-full-icon {
      width: 12px;
      height: 12px;
      fill: #666;
      cursor: pointer;
    }
    &:focus {
      outline: none;
    }
    .right-menu-item {
      padding: 0 8px;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .header-user-info-container {
      .user-info-box {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
      }
      .avatar-wrapper {
        position: relative;
        .user-avatar {
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
      .user-name {
        display: inline-block;
        margin-left: 8px;
      }
    }
  }
  .no-avatar-bg {
    display: block;
    width: 24px;
    height: 24px;
    background:rgba(212,215,217,1);
    border-radius: 50%;
  }
  .nav-bar-extra-content {
    flex: 1;
    height: 48px;
    line-height: 48px;
  }
}
</style>
