<template>
  <div class="main-content-container home-design">
    <div class="home-container">
      <Container v-for="(item, index) in componentList" :key="index" :width="item.width" :height="item.height" :x="item.x" :y="item.y">
        <component :is="item.component" />
      </Container>
    </div>
  </div>
</template>

<script>
import Container from "./container";
import { findTemplate, findComponent } from "@/api/setCenter/template";

export default {
  name: "Home",
  components: {
    Container,
  },
  data() {
    return {
      componentList: [],
      gridModel: {},
    };
  },
  mounted() {
    this.computedGrid();
    this.getComponents();
  },
  methods: {
    getComponents() {
      findTemplate().then(res => {
        if (res.statusCode !== 600) return;
        const data = res.data;
        findComponent(data[0].id).then(res => {
          if (res.statusCode !== 600) return this.msgError('获取模板失败');
          res.data.layout = JSON.parse(res.data.layout);
          this.componentsRequire(res.data);
        });
      });
    },
    componentsRequire(data) {
      data.layout.forEach(item => {
        const { gridWidth, gridHeight, gridLeft, gridTop } = item;
        const obj = {
          width: gridWidth * 16.5 + '%',
          height: gridHeight * this.gridModel.height,
          x: gridLeft * 16.5 + '%',
          y: gridTop * this.gridModel.height,
        };
        this.componentList.push(obj);
      });
    },
    computedGrid() {
      const dom = document.querySelector(".main-content-container");
      const { clientWidth, clientHeight } = dom;
      dom.style.overflow = 'scroll';
      this.gridModel = {
        width: clientWidth / 6,
        height: clientHeight / 4,
      };
    },
  },
};
</script>

<style lang="scss">
.main-content-container.home-design {
  position: relative;
  width: 100%;
  height: calc(100vh - 114px);
  .home-container {
    position: relative;
    width: 100%;
  }
}
</style>
