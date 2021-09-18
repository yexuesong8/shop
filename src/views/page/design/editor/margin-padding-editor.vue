<template>
  <div class="template-property-box">
    <div class="template-property-box-item">
      <el-input-number v-model="form[type.includes('margin')?'marginTop':'paddingTop']" class="input" controls-position="right" @change="handleInputChange" />
    </div>
    <div class="template-property-box-item">
      <el-input-number v-model="form[type.includes('margin')?'marginLeft':'paddingLeft']" class="input" controls-position="right" @change="handleInputChange" />
      <el-input-number v-model="form[type.includes('margin')?'marginRight':'paddingRight']" class="input" controls-position="right" @change="handleInputChange" />
    </div>
    <div class="template-property-box-item">
      <el-input-number v-model="form[type.includes('margin')?'marginBottom':'paddingBottom']" class="input" controls-position="right" @change="handleInputChange" />
    </div>
  </div>
</template>

<script>
import BaseEditor from "./index.vue";
import { handleStringFunction } from "@/views/page/design/utils/index";

export default {
  name: "MarginPaddingEditor",
  extends: BaseEditor,
  data() {
    return {
      form: {},
    };
  },
  mounted() {
    const { props } = this.data;
    this.form = handleStringFunction(props[this.type]);
  },
  methods: {
    handleInputChange() {
      this.innerEditorValue = JSON.stringify(this.form);
      this.setValue();
    },
  },
};
</script>
<style lang="scss" scoped>
  .template-property-box{
    background: #f3f3f3;
    padding: 10px 0;
    width: 100%;
    .template-property-box-item{
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 4px;
      .label{
        margin-right: 6px;
      }
      .input{
        width: 50px;
        /deep/.el-input-number__decrease, /deep/.el-input-number__increase{
          width: 16px;
        }
        /deep/.el-input__inner{
          padding: 0 16px 0 0;
        }
      }
    }
  }
</style>
