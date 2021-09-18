<template>
  <div class="rb-hamburger" @click="toggleClick">
    <img
      :class="{'is-active':isActive}"
      class="hamburger"
      width="64px"
      height="64px"
      :src="MenuImage"
      alt=""
    >
  </div>
</template>

<script>
import MenuImage from "@assets/images/menu.png";

export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      MenuImage,
    };
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick');
    },
  },
};
</script>

<style lang="scss">
.rb-hamburger {
  line-height: 46px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background .3s;
  -webkit-tap-highlight-color: transparent;
  padding: 0 15px;
  &:hover {
    background: rgba(0, 0, 0, .025)
  }
  .hamburger {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    transform: rotate(180deg);
    &.is-active {
      transform: rotate(0);
    }
  }
}
</style>
