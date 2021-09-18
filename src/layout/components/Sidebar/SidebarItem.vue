<template>
  <div v-if="!item.hidden">
    <template v-if="menuShow(item)">
      <app-link v-if="item.meta" :to="item">
        <el-menu-item :index="resolvePath(item.id)" :class="{'submenu-title-noDropdown': !isNest, 'sub-menu-icon': subMenuIcon, 'is-active': route.meta.id === item.id}">
          <item :icon="item.meta ? item.meta.icon : ''" :title="item.meta.title" :data="item" :sub-menu-icon="subMenuIcon" />
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else-if="subMenuShow(item)" ref="subMenu" :index="resolvePath(item)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" :data="item" :sub-menu-icon="subMenuIcon" />
      </template>
      <sidebar-item
        v-for="(child, index) in item.children"
        :key="child.path + index"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import { isObject } from '@monkey.do/monkey';
import Item from './Item';
import AppLink from './Link';

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    route() {
      return this.$route;
    },
    subMenuIcon() {
      return this.$store.state.global.systemSetting.subMenuIcon;
    },
  },
  methods: {
    menuShow(menu) {
      return (!menu.children || !menu.children.length) && (menu.path) && menu.visible !== 0 && menu.meta && menu.meta.title;
    },
    subMenuShow(menu) {
      return menu.children && menu.children.length && menu.meta && menu.meta.title;
    },
    resolvePath(menu) {
      if (isObject(menu)) {
        const { id } = menu;
        // todo 目录不存在path 以ID作为唯一键
        return `/${id}`;
        // return path;
      }
      return menu;
    },
  },
};
</script>
