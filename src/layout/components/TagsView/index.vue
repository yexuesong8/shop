<template>
  <div id="tags-view-container" class="tags-view-container">
    <!-- 没有顶部栏时显示 -->
    <div v-if="!systemSetting.showHeader" class="hamburger-icon" :class="{active: sidebar.opened}" @click="toggleSideBar">
      <span class="el-icon-arrow-down el-icon--right" />
    </div>
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" :class="{'no-header': !systemSetting.showHeader}">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="{
          active: isActive(tag),
          isAffixTag: isAffix(tag),
        }"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <i v-if="!isAffix(tag)" class="el-icon-circle-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{position: 'fixed', left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane';
import { mapState } from 'vuex';
import "@assets/styles/tagsView.scss";

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    routes() {
      return this.$store.state.permission.routes;
    },
    ...mapState({
      sidebar: state => state.app.sidebar,
      systemSetting: state => state.global.systemSetting,
    }),
  },
  watch: {
    $route() {
      this.addTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
    },
  },
  mounted() {
    this.initTags();
    this.addTags();
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path;
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix;
    },
    filterAffixTags(routes) {
      let tags = [];
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          // const tagPath = path.resolve(basePath, route.path);
          tags.push({
            fullPath: route.path,
            path: route.path,
            name: route.name,
            meta: { ...route.meta },
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes);
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag);
        }
      }
    },
    addTags() {
      const { meta: { title }, name } = this.$route;
      if (title || name) {
        this.$store.dispatch('tagsView/addVisitedView', this.$route);
        // 添加到访问的iframe
        if (this.$route.meta.pageType === "iframe") {
          this.$store.commit('tagsView/setVisitedIframe', this.$route);
        }
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag || [];
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route);
            }
            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath,
          });
        });
      });
    },
    closeSelectedTag(view) {
      // if (view) {
      //   view.matched.forEach(item => {
      //     console.log("close selected tag", view);
      //     if (item.components && item.components.default) {
      //       this.$store.commit("permission/DEL_KEEP_ALIVE", item.components.default.name || "");
      //     }
      //   });
      // }
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view);
        }
      });
    },
    closeOthersTags() {
      if (this.selectedTag) {
        this.selectedTag.matched.forEach(item => {
          if (item.components && item.components.default) {
            this.$store.commit("permission/SET_KEEP_ALIVE", item.components.default.name || "");
          }
        });
      }
      this.$router.push(this.selectedTag);
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags(view) {
      this.$store.commit("permission/CLOSE_ALL_KEEP_ALIVE");
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath });
        } else {
          this.$router.push('/');
        }
        this.$router.push('/');
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const left = e.clientX;

      if (left + menuMinWidth > (offsetLeft + offsetWidth)) {
        this.left = offsetLeft + offsetWidth - menuMinWidth;
      } else {
        this.left = left;
      }
      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
  },
};
</script>
