<template>
  <div class="member-select-button">
    <el-button type="primary" @click="handleChooseMember">选择人员</el-button>
    <member-dialog
      :max-number="maxNumber"
      :multiple="multiple"
      :value="value"
      :visible.sync="visible"
      :showed-tabs="showedTabs"
      :property="property"
      :title="title"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
import { getLocalStorage, setLocalStorage } from "@monkey.do/monkey";
import TreeMember from "./tree/index";
import PeerMember from "./list/peer";
import RecentMember from "./list/recent";
import MemberDialog from "./member-dialog";
import MemberProps from "./mixin/props";

export default {
  name: "MemberChoose",
  components: {
    MemberDialog,
  },
  mixins: [MemberProps],
  props: {
    onConfirm: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    /** 显示的tab列 */
    showedTabs: {
      type: [Array, String],
      default: () => ["recent", "peer", "subStructureTree", "structureTree"],
    },
    title: {
      type: String,
      default: "人员选择",
    },
  },
  data() {
    return {
      tabs: [
        { name: "最近", id: "lately", type: "list", component: RecentMember },
        { name: "同部门", id: "dept", type: "list", component: PeerMember },
        { name: "下级部门", id: "sub-dept", type: "sub", component: TreeMember },
        { name: "组织架构", id: "structure", type: "all", component: TreeMember },
      ],
      activeName: "lately",
      visible: false,
      data: [],
      tree: [],
      checkedValue: null,
      clickTimer: null,
    };
  },
  methods: {
    handleChooseMember() {
      if (this.disabled) return;
      this.visible = true;
    },
    handleConfirm(nodes) {
      this.$emit("confirm", nodes);
    },
    handleCancel() {
      this.$emit("cancel");
    },
    setRecentSelected(value) {
      const recent = getLocalStorage("recent-selected-member") || [];

      value.forEach(item => {
        const index = recent.findIndex(i => i.id === item.id);
        if (index !== -1) recent.splice(index, 1);
      });
      setLocalStorage("recent-selected-member", recent.concat(value).reverse());
    },
    reset() {
      this.checkedValue = [];
    },
  },
};
</script>

<style lang="scss">
.member-select-dialog {
  .el-tabs__content {
    overflow: initial;
  }
  .el-dialog__body {
    padding: 10px 24px 32px 24px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .el-tabs__header {
    margin-bottom: 0;
  }
}

.member-tree-container {
  height:  447px;
}
</style>
