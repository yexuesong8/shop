<template>
  <div :class="{ 'has-logo': systemSetting.showSidebarHeader }">
    <logo :collapse="isCollapse" />
    <el-scrollbar :style="getScrollbarStyle()" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        class="nav-bar-list side-nav-bar"
      >
        <sidebar-item v-for="(route, index) in routes" :key="index" :item="route" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@assets/styles/variables.scss';

export default {
  name: "Sidebar",
  components: { SidebarItem, Logo },
  computed: {
    ...mapState("permission", {
      routes: state => state.routes,
    }),
    ...mapState({
      systemSetting: state => state.global.systemSetting,
    }),
    ...mapGetters([
      'sidebar',
    ]),
    activeMenu() {
      const route = this.$route;
      const { meta } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) return meta.activeMenu;
      // return meta.path;
      return meta.id;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    getScrollbarStyle() {
      if (this.systemSetting.showSidebarBackgroundImg) {
        return {
          backgroundImage: `url(${this.systemSetting.sidebarBackgroundImg})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
        };
      }
      return {};
    },
  },
};
</script>
