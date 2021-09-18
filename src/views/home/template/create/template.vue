<template>
  <Vdr
    class-name="vdr-container"
    :parent="parent"
    :is-conflict-check="isConflictCheck"
    :snap="snap"
    :w="width"
    :h="height"
    :handles="['br']"
    :on-resize-start="resizeStart"
    :on-drag-start="dragStart"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot>
      <el-card>
        <template slot="header">
          <span class="title">{{ title }}</span>
          <i class="el-icon-delete" @click="handleRemove" />
        </template>
        <el-image :style="{ 'max-width': width, 'max-height': height }" :src="imageSrc" />
        <div class="image-box">
          <!--          <el-image :style="{ 'max-width': width, 'max-height': height }" :src="imageSrc" />-->
        </div>
      </el-card>
    </slot>
  </Vdr>
</template>

<script>
import Vdr from '../vue-draggable-resizable/index.vue';
import '../vue-draggable-resizable/index.scss';
import { mapState } from "vuex";

export default {
  name: "Template",
  components: { Vdr },
  props: {
    id: {
      type: [Number, String],
      default: '',
    },
    isConflictCheck: { // 冲突检测
      type: Boolean,
      default: false,
    },
    snap: { // 吸附
      type: Boolean,
      default: false,
    },
    width: {
      type: [String, Number],
      default: 100,
    },
    height: {
      type: [String, Number],
      default: 100,
    },
    title: {
      type: String,
      default: '',
    },
    imageSrc: {
      type: String,
      default: '',
    },
    parent: {
      type: Boolean,
      default: true,
    },
    onDragStart: {
      type: Function,
      default: () => {},
    },
    onResizeStart: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState("home", {
      zIndex: state => state.zIndex,
      templateId: state => state.templateId,
    }),
  },
  methods: {
    handleRemove(e) {
      this.$doingConfirm({ title: "删除组件", message: "确定删除当前组件吗？" })
        .then(() => {
          this.$emit('deleteItem', this.id);
          e.stopPropagation();
        })
        .catch(() => console.log("取消删除"));
    },
    resizeStart(handle, event) {
      this.calcZIndex(event);
      this.onResizeStart(handle, event);
    },
    dragStart(event) {
      this.calcZIndex(event);
      this.onDragStart(event);
    },
    calcZIndex({ target }) {
      while (!target.dataset.templateId) target = target.parentNode;
      if (this.templateId && this.templateId === target.dataset.templateId) return;
      target.style.zIndex = this.zIndex;
      this.$store.dispatch("home/setZIndex");
      this.$store.dispatch("home/setPrevTargetId", target.dataset.templateId);
    },
  },
};
</script>
<style lang="scss" scoped>
  .vdr-container {
    position: absolute;
    overflow: hidden;
    background-color: #999;
    box-shadow: 1px 5px 15px rgba(0, 0, 0, 0.2);
    .image-box {
      padding: 10px 12px 12px;
      overflow: hidden;
      .el-image{
        border-radius: 5px;
      }
    }
    /deep/.handle-br {
      background: url("~@/assets/rabbit/images/drag.png");
      background-size: contain;
      border: none;
      position: absolute;
      height: 12px !important;
      width: 12px !important;
      bottom: 0 !important;
      right: 0 !important;
      z-index: 1000;
    }
    /deep/.el-card__header {
      display: flex;
      justify-content: space-between;
      padding: 0 5px;
      min-height: 20px;
    }
    /deep/.el-card {
      height: 100%;
    }
    /deep/.el-card__body {
      padding: 0 0 10px 0;
    }
  }
</style>
