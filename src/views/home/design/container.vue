<template>
  <el-card ref="card" class="card" shadow="hover">
    <slot />
  </el-card>
</template>

<script>
export default {
  name: 'Container',
  props: {
    width: {
      type: [Number, String],
      default: 200,
    },
    height: {
      type: [Number, String],
      default: 200,
    },
    x: {
      type: [Number, String],
      default: 0,
    },
    y: {
      type: [Number, String],
      default: 0,
    },
  },
  mounted() {
    this.position();
  },
  methods: {
    splicing(val) {
      return typeof val === 'number' ? `${val}px` : val;
    },
    position() {
      const cardStyle = this.$refs.card.$el.style;
      const obj = {
        position: 'absolute',
        width: `calc(${this.width} - 10px)`,
        height: `${this.height - 10}px`,
        left: this.splicing(this.x),
        top: `${this.y + 5}px`,
      };
      Object.assign(cardStyle, obj);
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  min-width: 100px;
  display: inline-block;
  border-radius: 8px;
  box-shadow: 3px 4px 22px rgba(0, 0, 0, 0.1);
  background-color: lightpink;
  &:hover{
    transform: scale(1.01);
  }
}
</style>
