<template>
  <div class="rb-editable-tree-container">
    <Header v-if="showHeader" :title="title" :create-api="createApi" :property="property" @afterCreate="handleAfterCreate">
      <template v-slot:button="slot">
        <slot name="button" :click="slot.click" />
      </template>
    </Header>
    <Tree
      ref="tree"
      class="with-header"
      :list-api="listApi"
      :delete-api="deleteApi"
      :create-api="createApi"
      :update-api="updateApi"
      :sort-api="sortApi"
      :is-all-button="isAllButton"
      :create-params-formatter="createParamsFormatter"
      :delete-params-formatter="deleteParamsFormatter"
      :update-params-formatter="updateParamsFormatter"
      :sort-params-formatter="sortParamsFormatter"
      :create-success-text="createSuccessText"
      :delete-success-text="deleteSuccessText"
      :update-success-text="updateSuccessText"
      :params="params"
      :property="property"
      :max-length="maxLength"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import Tree from "./tree";
import Header from "./header";
import TreeMixProps from "./mixins/tree";
import HeaderMixProps from "./mixins/header-props";

export default {
  name: 'EditableTree',
  components: { Tree, Header },
  mixins: [TreeMixProps, HeaderMixProps],
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    handleAfterCreate(data) {
      this.$refs["tree"].append(data);
    },
  },
};
</script>
<style lang="scss">
  @import "~@/assets/rabbit/styles/element-variables.scss";
  @import "~@/assets/rabbit/styles/variables";
  @import "~@/assets/rabbit/styles/mixin";

  .rb-editable-tree-container {
    max-width: 350px;
    font-size: 14px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .add-box {
      display: flex;
      align-items: center;
      .el-input {
        margin-right: 10px;
        .el-input__inner {
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

    // .el-tree-node__content {
    //   height: 32px;
    // }

    // .custom-tree-node {
    //   flex: 1;
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    //   .el-input--small {
    //     margin-right: 10px;
    //     .el-input__inner {
    //       height: 26px;
    //       padding: 0 10px;
    //       line-height: 26px;
    //       border-radius: 2px;
    //     }
    //   }
    //   &:hover > .icon {
    //     display: block;
    //   }
    //   .label{
    //     max-width: 150px;
    //     overflow: hidden;
    //     text-overflow: ellipsis;
    //     white-space:nowrap;
    //     outline: none;
    //   }
    // }
    // .el-input__inner {
    //   height: 22px;
    //   line-height: 1;
    //   margin-right: 5px;
    //   font-size: inherit;
    // }
    // .icon {
    //   font-size: 16px;
    //   color: $--color-primary;
    //   cursor: pointer;
    //   @include disabledUserSelect;
    // }

  }
</style>
