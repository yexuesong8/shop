<!-- @author zhengjie -->
<template>
  <div class="menu-icon-selector">
    <el-input v-model="name" style="position: relative;" clearable placeholder="请输入图标名称" @clear="filterIcons" @input="filterIcons">
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div v-for="(item, index) in menuIconList" :key="index" class="menu-icon-item">
        <img :src="getImgSrc(item.fileId)" alt="" @click="selectedMenuIcon(item)">
        <div class="icon-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'MenuIconSelector',
  data() {
    return {
      name: '',
      iconList: [],
    };
  },
  computed: {
    ...mapState("systemMenu", {
      menuIconList: state => state.menuIconList,
    }),
  },
  watch: {
    menuIconList: {
      handler: function(value) {
        this.iconList = value;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.fetchImages();
  },
  methods: {
    fetchImages() {
      if (!this.menuIconList.length) {
        this.$store.dispatch("systemMenu/getMenuIcons");
      }
    },
    filterIcons(value) {
      if (value) {
        this.iconList = this.menuIconList.filter(item => (item.name || "").includes(value));
      } else {
        this.iconList = this.menuIconList;
      }
    },
    selectedMenuIcon(item) {
      this.$emit('selected', item);
      document.body.click();
    },
    reset() {
      this.name = '';
      this.iconList = this.menuIconList;
    },
  },
};
</script>

<style lang="scss">
.menu-icon-selector {
  width: 100%;
  .icon-list {
    height: 200px;
    padding: 5px 0;
    overflow-y: auto;
    overflow-x: hidden;
    img {
      width: 32px;
      height: 32px;
      margin-bottom: 5px;
      cursor: pointer;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
  .menu-icon-item {
    width: 25%;
    float: left;
    text-align: center;
    font-size: 12px;
    margin-bottom: 5px;
    .icon-name {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
