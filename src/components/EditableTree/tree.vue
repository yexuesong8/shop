<template>
  <div class="rb-editable-tree">
    <span v-if="isAllButton" class="all-button" @click="handleAllButtonClick">{{ allButtonText }}</span>
    <el-tree
      ref="tree"
      v-loading="loading"
      node-key="id"
      :highlight-current="ishighlight"
      default-expand-all
      :accordion="true"
      :data="treeList"
      :props="property"
      :expand-on-click-node="false"
      :draggable="isSortable"
      v-bind="$attrs"
      v-on="$listeners"
      @node-click="handleNodeClick"
      @node-drop="handleNodeDrop"
    >
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <div v-if="!data.editable" ref="label" class="label" :title="node.label">{{ node.label }}</div>
        <el-input
          v-else
          :ref="`input-${node.id}`"
          v-model="data.inputValue"
          :maxlength="maxLength"
          @blur="(e) => handleInputBlur(e, node, data)"
          @keyup.enter.native="handleUpdate(node, data)"
        />
        <div v-if="data.id" :allow-drag="!data.id" class="icon">
          <i v-if="isEditable && !data.editable" class="el-icon-edit-outline" @click.stop="handleEdit(node, data)" />
          <i v-if="isCreatable && !data.editable" class="el-icon-plus" @click.stop="handleAdd(node, data)" />
          <el-popconfirm
            v-if="!data.editable"
            confirm-button-text="是"
            cancel-button-text="否"
            icon="el-icon-info"
            icon-color="#51abab"
            :title="`确定要删除${data[property.label]}吗？`"
            @confirm="handleDelete(node, data)"
          >
            <i v-if="isDeletable" slot="reference" class="el-icon-delete" @click="stopPropagation" />
          </el-popconfirm>
          <i v-if="data.editable" class="el-icon-check" @click.stop="handleUpdate(node, data)" />
          <i v-if="data.editable" class="el-icon-close" @click.stop="handleCancel(node, data)" />
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script>
import { request } from "@/utils";
import TreeMixProps from "./mixins/tree";

export default {
  name: 'EditableTree',
  mixins: [TreeMixProps],
  props: {
    highlight: {
      type: Boolean,
      default: false,
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
    refreshAfterRequest: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      treeList: [],
      loading: false,
      // defaultExpandedKeys: [],
      // highlight: true,
      isInEdit: false,
      isInCreate: false,
      ishighlight: true,
    };
  },
  watch: {
    highlight(val) {
      this.ishighlight = val;
    },
  },
  mounted() {
    this.getTree();
  },
  methods: {
    async getTree() {
      this.loading = true;
      const res = await request({ baseURL: "", url: this.listApi, data: { ...this.params }}).finally(() => (this.loading = false));
      if (res.statusCode !== 600) return;
      this.treeList = this.formatter(res.data);
    },
    handleNodeClick(data) {
      if (data.highlight) {
        this.ishighlight = false;
        this.$set(data, 'highlight', false);
      } else {
        this.ishighlight = true;
        this.$set(data, 'highlight', true);
      }
      this.$emit('nodeClick', data);
    },
    handleAllButtonClick() {
      this.$emit('nodeClick', { id: "", key: "" });
      this.ishighlight = false;
    },
    // 拖拽保存
    async handleNodeDrop() {
      if (!this.isSortable) return;

      const mapNodes = (nodes) => {
        return nodes.map(node => {
          let childList = [];
          if (node.childList) childList = mapNodes(node.childList);
          return {
            id: node.id,
            childList,
          };
        });
      };

      const nodes = this.sortParamsFormatter ? this.sortParamsFormatter(this.$refs["tree"].data) : mapNodes(this.$refs["tree"].data);
      const res = await request({ baseURL: "", url: this.sortApi, data: nodes });
      if (res.statusCode === 600) {
        this.$message.success(this.sortSuccessText);
      }
    },
    handleEdit(node, data) {
      this.$set(data, 'inputValue', data[this.property.label]);
      this.$set(data, 'editable', true);
    },
    handleAdd(node, data) {
      if (this.isInCreate) return;
      this.isInCreate = true;
      // this.defaultExpandedKeys = [data.id];
      const key = this.property.children;
      const child = { [key]: [], editable: true, isAdd: true, parentId: data.id };
      if (!data[key]) this.$set(data, [key], []);
      data[key].push(child);
      this.$nextTick(() => {
        const parentChildNodes = node.childNodes;
        this.$refs[`input-${parentChildNodes[parentChildNodes.length - 1].id}`].focus();
      });
    },
    async handleDelete(node, data) {
      if (!this.isDeletable || !this.deleteApi || this.loading) return;
      const payload = this.deleteParamsFormatter ? this.deleteParamsFormatter(node, data) : { id: data.id };
      this.loading = true;
      const res = await request({ baseURL: "", url: this.deleteApi, data: payload }).finally(() => { this.loading = false; });
      if (res.statusCode === 600) {
        this.msgSuccess(this.deleteSuccessText);
        if (this.refreshAfterRequest) {
          this.getTree();
        } else {
          if (node.parent.level === 0) { // 一级菜单取值不一样
            const index = node.parent.data.findIndex(item => item.id === data.id);
            node.parent.data.splice(index, 1);
          } else {
            const index = node.parent.data.childList.findIndex(item => item.id === data.id);
            node.parent.data.childList.splice(index, 1);
          }
        }
      }
    },
    async handleUpdate(node, data) {
      const key = this.property.label;
      if (data.isAdd) { // 新增
        if (!this.isCreatable || !this.createApi || this.loading) return;
        if (!data.inputValue) return this.msgError("输入框不能为空");
        data.name = data.inputValue;

        this.loading = true;
        const payload = this.createParamsFormatter ? this.createParamsFormatter(node, data) : { name: data.name, parentId: data.parentId };
        const res = await request({
          baseURL: "",
          url: this.createApi,
          data: payload,
        }).finally(() => {
          this.loading = false;
          this.isInCreate = false;
        });

        if (res.statusCode === 600) {
          this.msgSuccess(this.createSuccessText);
          if (this.refreshAfterRequest) {
            this.getTree();
          } else {
            if (node.parent.level === 0) { // 创建一级菜单
              const index = node.parent.data.findIndex(item => item.id === data.id);
              node.parent.data.splice(index, 1);
            } else {
              const index = node.parent.data[this.property.children].length - 1;
              node.parent.data[this.property.children].splice(index, 1, { ...res.data });
            }
          }
        }
      } else {
        if (!this.isEditable || !this.updateApi || this.loading) return;
        if (data.inputValue === data[key]) return this.$set(data, 'editable', false);

        const payload = this.updateParamsFormatter ? this.updateParamsFormatter(node, data) : { name: data.inputValue, id: data.id };
        this.loading = true;
        const res = await request({ baseURL: "", url: this.updateApi, data: payload }).finally(() => { this.loading = false; });

        if (res.statusCode === 600) {
          this.msgSuccess(this.updateSuccessText);
          if (this.refreshAfterRequest) {
            this.getTree();
          } else {
            data[key] = data.inputValue;
            this.$set(data, 'editable', false);
          }
        }
      }
    },
    handleCancel(node, data) {
      if (data.isAdd) {
        this.isInCreate = false;
        if (!data[this.property.label]) {
          // 此时data不存在id,通过node.id与parent.childNodes id比对获取
          const index = node.parent.childNodes.findIndex(item => item.id === node.id);
          node.parent.data.childList.splice(index, 1);
        }
      } else {
        this.$set(data, 'editable', false);
      }
    },
    refresh() {
      this.getTree();
    },
    append(data) {
      const tree = this.$refs["tree"];
      tree.append(data, tree.root);
    },
    stopPropagation(e) {
      e.stopPropagation();
    },
    handleInputBlur(e, node, data) {
      if (data.isAdd) {
        const value = e.target.value;
        if (!value) {
          const index = node.parent.childNodes.findIndex(item => item.id === node.id);
          node.parent.data.childList.splice(index, 1);
          this.isInCreate = false;
        } else {
          this.handleUpdate(node, data);
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/rabbit/styles/element-variables.scss";
@import "~@/assets/rabbit/styles/variables";
@import "~@/assets/rabbit/styles/mixin";

.rb-editable-tree {
  overflow: hidden auto;
  &.with-header {
    flex: 1;
  }

  .el-tree {
    min-width: 195px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-input--small {
      margin-right: 10px;
      .el-input__inner {
        height: 26px;
        padding: 0 10px;
        line-height: 26px;
        border-radius: 2px;
      }
    }
    &:hover > .icon {
      display: block;
    }
    .label{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space:nowrap;
      outline: none;
      width: 0;
      flex: 1;
    }
  }
  .el-input__inner {
    height: 22px;
    line-height: 1;
    margin-right: 5px;
    font-size: inherit;
  }
  .icon {
    width: 56px;
    font-size: 16px;
    color: $--color-primary;
    cursor: pointer;
    @include disabledUserSelect;
  }
  .all-button{
    width: 100%;
    display: block;
    cursor: pointer;
    margin-bottom: 4px;
    padding: 4px 10px;
    &:hover{
      background: #F5F7FA;
    }
  }
}
</style>
