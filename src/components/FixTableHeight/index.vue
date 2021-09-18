<template>
  <div class="rb-fix-table-height">
    <div class="rb-fix-table__t-part">
      <slot name="top" />
    </div>
    <div class="rb-fix-table__b-part">
      <slot name="bottom" />
    </div>
  </div>
</template>

<script>
import { throttle } from "@monkey.do/monkey";

export default {
  name: "FixTableHeight",
  props: {
    hasPagination: {
      type: Boolean,
      default: false,
    },
    hasFilterSearch: {
      type: Boolean,
      default: true,
    },
    isShowPagination: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      $fixTable: this,
    };
  },
  mounted() {
    this.clacBPartHeight();

    this.$nextTick(() => {
      this.adjustHeight();
    });

    this.throttleAdjustHeight = throttle(this.trigger, 300);

    window.addEventListener("resize", this.throttleAdjustHeight);
  },
  activated() {
    window.addEventListener("resize", this.throttleAdjustHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.throttleAdjustHeight);
  },
  deactivated() {
    window.removeEventListener("resize", this.throttleAdjustHeight);
  },
  methods: {
    getComputedStyle(dom) {
      let computedStyle = null;
      if (window.getComputedStyle) {
        computedStyle = getComputedStyle(dom, null);
      } else {
        computedStyle = dom.currentStyle; // 兼容IE的写法
      }
      return computedStyle;
    },
    clacBPartHeight() {
      const outerBox = document.querySelector(".rb-fix-table-height");
      const tp = document.querySelector(".rb-fix-table__t-part");
      const bp = document.querySelector(".rb-fix-table__b-part");
      const computedStyle = this.getComputedStyle(bp);
      // 578 设置的最小高度
      const outerBoxHeight = outerBox.offsetHeight < 578 ? 578 : outerBox.offsetHeight;

      bp.style.height = `${outerBoxHeight - tp.offsetHeight - parseInt(computedStyle.marginTop, 10)}px`;
    },
    adjustHeight() {
      const box = document.querySelector(".rb-fix-table__b-part");
      const tableBodyWrapper = document.querySelector(".el-table__body-wrapper");
      const tableHeadWrapper = document.querySelector(".el-table__header-wrapper");
      const paginationHeight = this.getPaginationHeight();
      const senseHeight = 5;

      tableBodyWrapper.style.maxHeight = `${box.offsetHeight - tableHeadWrapper.offsetHeight - paginationHeight - senseHeight}px`;
      tableBodyWrapper.style.overflowY = "auto";
    },
    getPaginationHeight() {
      const box = document.querySelector(".rb-fix-table__b-part");
      let paginationHeight = 0;
      if (this.hasPagination && this.isShowPagination) {
        const pagination = box.querySelector(".pagination-container");
        const computedStyle = this.getComputedStyle(pagination);
        paginationHeight = parseInt(computedStyle.marginTop, 10) + pagination.offsetHeight;
      }
      return paginationHeight;
    },
    trigger() {
      this.clacBPartHeight();
      this.adjustHeight();
    },
  },
};
</script>

<style scoped lang="scss">
.rb-fix-table-height {
  height: 100%;
  .rb-fix-table__b-part {
    margin-top: 10px;
  }
}
</style>
