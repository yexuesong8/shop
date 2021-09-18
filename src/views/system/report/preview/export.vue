<template>
  <div>
    <el-radio-group v-model="type" @change="handleChange">
      <el-radio v-for="(item, index) in types" :key="index" :label="item">
        <svg-icon :icon-class="item.icon" />
        {{ item.type }}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>

export default {
  name: 'Export',
  data() {
    return {
      types: [
        { type: 'pdf', icon: 'exportPdf' },
        { type: 'html', icon: 'html' },
        { type: 'xls', icon: 'xlsx' },
        { type: 'doc', icon: 'doc' },
      ],
      type: "",
    };
  },
  methods: {
    handleChange(val) {
      this.$emit('change', val);
    },
    clean() {
      this.type = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.el-radio-group {
  display: flex;
  justify-content: space-around;
  .el-radio {
    display: flex;
    align-items: center;
    /deep/ .el-radio__label {
      display: flex;
      flex-direction: column;
      align-items: center;
      .svg-icon {
        margin-bottom: 5px;
        width: 18px;
        height: 18px;
      }
    }
  }
}
</style>

