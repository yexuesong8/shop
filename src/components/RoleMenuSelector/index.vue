<template>
  <div class="role-menu-tree-container">
    <Dialog class="role-menu-tree-dialog" :loading="loading" title="功能授权" :visible="visible" @cancel="handleCancel" @confirm="handleConfirm">
      <search-input class="mb10 mt10" placeholder="请输入菜单名称" clearable :on-input="handleOnInput" />
      <tree-selector
        ref="MenuTreeSelector"
        class="menu-tree-selector"
        :data-source-uri="appMenuApi"
        source-type="uri"
        :params="params"
        :property="{key: 'id', children: 'childList'}"
        :default-checked-keys="checkedNodes"
        :show-checkbox="true"
        :render-after-expand="false"
        :formatter="dataFormatter"
        :filter-node-method="filterNode"
        default-expand-all
      />
    </Dialog>
  </div>
</template>

<script>
import { TreeSelector, SearchInput } from "@monkey.do/monkey";
import { appMenuApi } from "@/api/system/menu";
import { roleMenuTreeFormatter2 } from "@/utils";
import { getRoleCheckedOption } from "@/api/system/role";

export default {
  name: "RoleMenuSelector",

  components: {
    TreeSelector,
    SearchInput,
  },

  props: {
    type: {
      type: String,
      default: "", // sub: 下级 不传则获取全部组织架构
    },
    wants: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      filterText: "",
      checkedNodes: [],
      menus: [],
      appMenuApi,
      treeData: [],
      timer: null,
    };
  },

  computed: {
    params() {
      return { id: this.id };
    },
  },

  watch: {
    // 根据名称筛选部门树
    filterText(val) {
      this.$refs["MenuTreeSelector"].filter(val);
    },
    // value: {
    //   handler: function(value) {
    //     this.checkedNodes = getCheckedValue(value, this.property.id);
    //     console.log(this.checkedNodes, 99);
    //   },
    //   immediate: true,
    // },
  },
  mounted() {
    getRoleCheckedOption(this.id).then((res) => {
      this.$set(this.$data, "checkedNodes", res.data);
    });
  },

  // mounted() {
  //   const checkedNodes = ['875332572727480320', '874683795423364096'];
  //   this.$set(this.$data, "checkedNodes", checkedNodes);
  // getRoleCheckedOption(this.id).then((res) => {
  //   return {
  //     menuIds: res.data["chooseMenuIdList"] || [],
  //     buttonIds: res.data["chooseButtonIdList"] || [],
  //     uriIds: res.data["chooseUriIdList"] || [],
  //   };
  // }).then(({ menuIds, buttonIds, uriIds }) => {
  //   let count = 0;
  //   const checkedNodes = menuIds.concat(buttonIds).concat(uriIds);

  //   // const halfCheck = data => {
  //   //   data.forEach(item => {
  //   //     // 判断子节点
  //   //     if (item.childList && item.childList.length > 0) {
  //   //       halfCheck(item.childList);
  //   //     }

  //   //     // 存在菜单
  //   //     if (menuIds.indexOf(item.id) !== -1) {
  //   //       // 如果存在半选中 则从checkedNodes移除
  //   //       let isHalfCheck = false;
  //   //       if (item.buttonList && item.buttonList.length > 0) {
  //   //         // 所有节点中有在buttonIds中不存在 则半选中
  //   //         item.buttonList.forEach(button => {
  //   //           if (buttonIds.indexOf(button.id) === -1) isHalfCheck = true;
  //   //         });
  //   //       }
  //   //       if (isHalfCheck) {
  //   //         const index = checkedNodes.findIndex((nodeId) => nodeId === item.id);
  //   //         checkedNodes.splice(index, 1);
  //   //       }
  //   //     }
  //   //   });
  //   // };

  //   this.timer = setInterval(() => {
  //     if (this.treeData.length) {
  //       clearInterval(this.timer);
  //       this.timer = null;

  //       // halfCheck(this.treeData);

  //       this.$set(this.$data, "checkedNodes", checkedNodes);
  //     } else {
  //       count++;
  //     }

  //     if (count >= 100) {
  //       clearInterval(this.timer);
  //       this.timer = null;
  //     }
  //   }, 200);
  // });
  // },

  methods: {
    dataFormatter(data) {
      const treeData = roleMenuTreeFormatter2(data);
      this.treeData = treeData;
      return treeData;
    },

    getCheckedNode() {
      const ref = this.$refs["MenuTreeSelector"];
      console.log(ref.getCheckedNodes());
      const nodes = ref.getCheckedNodes().concat(
        ref.getHalfCheckedNodes()
      );
      console.log(nodes);
      const menuIds = nodes
        .filter((item) => !item.isButton && !item.isUri && item.type === 1)
        .map((item) => item.id);
      const buttonIds = nodes
        .filter((item) => !!item.isButton)
        .map((item) => item.id);
      const uriIds = nodes
        .filter((item) => !!item.isUri)
        .map((item) => item.id);

      return {
        menuIds,
        buttonIds,
        uriIds,
      };
    },

    handleOnInput(value) {
      this.filterText = value;
    },

    // 根据输入内容筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return (data.name || "").indexOf(value) !== -1;
    },

    handleConfirm() {
      let nodes = [];
      nodes = this.$refs["MenuTreeSelector"].getCheckedNodes();
      let menuIds = [];
      menuIds = nodes.map((item) => item.id);
      this.$emit("confirm", menuIds);
    },

    handleCancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="scss">
  .role-menu-tree-dialog {
    .el-dialog__body {
      height: 447px;
      padding: 10px 24px 32px 24px;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .el-tabs__header {
      margin-bottom: 0;
    }
  }
</style>
