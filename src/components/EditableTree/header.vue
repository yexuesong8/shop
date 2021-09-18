<template>
  <div class="editable-tree-header">
    <el-row class="mb5 header" type="flex" justify="space-between">
      <span class="title">{{ title }}</span>
      <slot name="button" :click="handleCreate" />
    </el-row>
    <span v-if="visible" class="add-box">
      <el-input ref="input" v-model="inputValue" :maxlength="maxlength" :placeholder="placeholder" @keyup.enter.native="create" />
      <i class="el-icon-check icon" @click="create" />
      <i class="el-icon-close icon" @click="cancel" />
    </span>
  </div>
</template>

<script>
import { request } from "@monkey.do/monkey";
import HeaderMinProps from "./mixins/header-props";

export default {
  name: 'EditableTreeHeader',
  mixins: [HeaderMinProps],
  props: {
    propsOption: {
      type: Object,
      default: () => {
        return {
          children: 'childList',
          label: 'name',
        };
      },
    },
    placeholder: {
      type: String,
      default: '请输入分类名称',
    },
    createProps: {
      type: Object,
      default: () => ({
        parentId: 'parentId',
        name: 'inputValue',
      }),
    },
    updateProps: {
      type: Object,
      default: () => ({
        id: 'id',
        name: 'inputValue',
      }),
    },
    deleteProps: {
      type: Object,
      default: () => ({
        id: 'id',
      }),
    },
    createSuccessText: {
      type: String,
      default: '新增成功',
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      inputValue: '',
      visible: false,
      loading: false,
    };
  },

  methods: {
    handleCreate() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["input"].focus();
      });
    },
    async create() {
      if (!this.inputValue) return this.msgError('请输入内容');
      const res = await request({ url: this.createApi, data: { parentId: '', [this.property.label]: this.inputValue }});
      if (res.statusCode !== 600) return;
      this.visible = false;
      this.msgSuccess(this.createSuccessText);
      this.inputValue = "";
      this.$emit("afterCreate", res.data);
    },
    cancel() {
      this.visible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
  @import "~@/assets/rabbit/styles/element-variables.scss";
  @import "~@/assets/rabbit/styles/mixin";

  .editable-tree-header {
    font-size: 14px;
    .add-box {
      display: flex;
      align-items: center;
      .el-input {
        margin-right: 10px;
        /deep/.el-input__inner {
          height: 26px;
          line-height: 26px;
          padding: 0 10px;
          border-radius: 2px;
        }
      }
      .el-icon-check {
        margin-right: 5px;
      }
    }
    .header {
      display: flex;
      align-items: center;
      padding: 0 5px;
      .title {
        font-weight: 600;
      }
    }
    /deep/.el-input__inner {
      height: 22px;
      line-height: 1;
      margin-right: 5px;
      font-size: inherit;
    }
  }
  .icon {
    font-size: 16px;
    color: $--color-primary;
    cursor: pointer;
    @include disabledUserSelect;
  }
</style>
