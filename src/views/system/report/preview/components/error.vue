<template>
  <Dialog title="错误提示" class="rabbit-preview-error" :has-footer="false" width="420px" :visible="isVisible" @close="hanldeCancel">
    <i class="el-icon-warning" />
    <p class="tips">查询方案：{{ queryScheme.name }} 来自于{{ queryScheme.formType === 1 ? "自定义的组件地址: " : "页面模板的id: " }}{{ queryScheme.formSource }}不存在，请检查！</p>
  </Dialog>
</template>

<script>
export default {
  props: {
    queryScheme: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isVisible: true,
    };
  },
  methods: {
    hanldeCancel() {
      this.isVisible = false;
    },
  },
};
</script>

<style lang="scss">
.rabbit-preview-error{
    // .el-dialog{
      // border-radius: 10px;
      // overflow: hidden;
    // .el-dialog__header{
    //   // padding: 10px 20px 5px 15px;
    //   // background: #fff !important;
    //     .el-dialog__title{
    //       // font-size: 18px;
    //     }
    //   }
    .el-dialog__body{
      display: flex;
      align-items: center;
      padding: 10px 20px 20px 30px;
      .el-icon-warning{
        margin-right: 10px;
        font-size: 24px;
        color: #e6a23c;
      }
      .tips{
        margin: 10px 0 0 0;
        line-height: 20px;
      }
    }
  // }
}
</style>
