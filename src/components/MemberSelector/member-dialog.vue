<template>
  <Dialog v-if="visible" class="member-select-dialog" :title="title" :visible="visible" v-bind="$attrs" @cancel="handleCancel" @confirm="handleConfirm">
    <el-input v-model="checkoutValue" class="mb10 mt10" placeholder="请输入姓名" clearable suffix-icon="el-icon-search" @focus="handleFocus" @input="handleOnInput" />
    <el-tabs v-if="curShowedTabs.length > 1" v-model="activeTab" class="tab" @tab-click="handleClick">
      <el-tab-pane v-for="(tab, index) in curShowedTabs" :key="index" class="member-select-dialog-pane" :label="tab.name" :name="tab.id">
        <div class="member-select-container">
          <component
            :is="tab.component"
            v-if="activeTab === tab.id"
            ref="memberTree"
            :type="tab.type"
            :multiple="multiple"
            :wants="wants"
            :value="value"
            :property="property"
            :max-number="maxNumber"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <div v-else class="member-select-container">
      <component
        :is="curShowedTabs[0].component"
        ref="memberTree"
        :type="curShowedTabs[0].type"
        :multiple="multiple"
        :wants="wants"
        :value="value"
        :property="property"
        :max-number="maxNumber"
      />
    </div>
    <template v-slot:footerMessage>
      <div v-if="errorMsg" class="danger-color">
        {{ errorMsg }}
      </div>
    </template>
  </Dialog>
</template>

<script>
import {
  SearchInput,
  getLocalStorage,
  setLocalStorage,
  SelectedList,
  Dialog,
  isArray,
} from "@monkey.do/monkey";
import TreeMember from "./tree/index";
import PeerMember from "./list/peer";
import RecentMember from "./list/recent";
import MemberProps from "./mixin/props";
import MemberData from "./mixin/data";

export default {
  name: "MemberSelectorDialog",
  components: {
    SearchInput,
    SelectedList,
    Dialog,
  },
  mixins: [MemberProps, MemberData],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /** 显示的tab列 */
    showedTabs: {
      type: [Array, String],
      default: () => ["recent", "peer", "subStructureTree", "structureTree"],
    },
    wants: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "人员选择",
    },
  },
  data() {
    return {
      tabs: [
        { name: "最近", id: "recent", type: "list", component: RecentMember },
        { name: "本部门", id: "peer", type: "list", component: PeerMember },
        { name: "下级部门", id: "subStructureTree", type: "sub", component: TreeMember },
        { name: "组织架构", id: "structureTree", type: "all", component: TreeMember },
      ],
      checkoutValue: "",
      activeTab: "recent",
      tree: [],
      checkedValue: null,
      clickTimer: null,
      nonExistMember: [], // 不存在的人员
    };
  },
  computed: {
    curShowedTabs() {
      if (isArray(this.showedTabs)) {
        return this.tabs.filter(item => this.showedTabs.indexOf(item.id) !== -1);
      } else {
        return this.tabs.filter(item => this.showedTabs === item.id);
      }
    },
  },
  watch: {
    showedTabs: {
      handler: function(value) {
        let tabs = null;
        if (isArray(value)) {
          tabs = this.tabs.filter(item => value.indexOf(item.id) !== -1);
        } else {
          tabs = this.tabs.filter(item => value === item.id);
        }
        this.activeTab = (tabs[0] || {})["id"] || "recent";
      },
      immediate: true,
    },
  },
  methods: {
    // tab切换
    handleClick() {
      if (this.activeTab !== "structureTree") {
        this.checkoutValue = "";
      }
    },
    // 获取焦点
    handleFocus() {
      this.activeTab = "structureTree";
    },
    // 输入事件
    handleOnInput(value) {
      let ref;
      if (this.curShowedTabs.length > 1) {
        ref = this.$refs["memberTree"][0];
      } else {
        ref = this.$refs["memberTree"];
      }
      ref.setFilterText(value);
    },
    async handleConfirm() {
      let nodes = [];

      // 最近列表处判断人员是否存在
      if (this.curShowedTabs.length > 1) {
        nodes = this.$refs["memberTree"][0].getCheckedNode();
      } else {
        nodes = this.$refs["memberTree"].getCheckedNode();
      }

      // 判断是否超出最大数量
      if (this.maxNumber || this.maxNumber === 0 ? nodes.length > this.maxNumber : false) {
        this.errorMsg = `超过最大选择数量${this.maxNumber},请重新选择`;
      } else {
        this.errorMsg = "";
      }

      // 判断成员是否存在
      if (this.activeTab === "recent" && nodes.length > 0) {
        await this.checkRecent(nodes);
      }

      if (this.errorMsg) return;

      this.setRecentSelected(nodes);
      this.checkoutValue = "";
      this.$emit("confirm", nodes);
      this.$emit("update:visible", false);
      this.removeNonExistMember();
      this.activeTab = "recent";
    },

    handleCancel() {
      this.$emit("update:visible", false);
      this.$emit("cancel");
      this.removeNonExistMember();
      this.checkoutValue = "";
      this.activeTab = "recent";
    },

    setRecentSelected(value) {
      const recent = getLocalStorage("recent-selected-member") || [];

      value.forEach(item => {
        const index = recent.findIndex(i => i.id === item.id);
        if (index !== -1) recent.splice(index, 1);
      });

      setLocalStorage("recent-selected-member", recent.concat(value).reverse());
    },

    checkRecent(nodes) {
      return new Promise(resolve => {
        const ids = nodes.map(item => item.id);

        this.$request("rabbit.system.user.userValidate", { data: { ids }}).then(res => {
          if (res.statusCode === 600) {
            const invalidIds = res.data["invalidIds"] || [];
            if (invalidIds.length) {
              const userNames = nodes.filter(item => invalidIds.indexOf(item.id) !== -1).map(item => item.name).join(",");
              this.errorMsg = `人员${userNames}不存在,请重新选择`;
              this.nonExistMember = this.nonExistMember.concat(invalidIds);
              resolve([]);
            } else {
              this.errorMsg = "";
              resolve(nodes);
            }
          }
        });
      });
    },

    removeNonExistMember() {
      const recent = getLocalStorage("recent-selected-member") || [];

      // 删除不存在的人员
      this.nonExistMember.forEach(item => {
        const index = recent.findIndex(i => i.id === item);
        if (index !== -1) recent.splice(index, 1);
      });

      setLocalStorage("recent-selected-member", recent);
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
    margin-top: 10px;
  }
  .el-dialog__body {
    padding: 10px 24px 32px 24px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .el-tabs__header {
    margin-bottom: 0;
  }
  .member-select-dialog-pane{
    overflow: hidden;
    overflow-y: auto;
  }
  .member-select-container {
    height:  447px;
    overflow: auto;
  }
}
</style>
