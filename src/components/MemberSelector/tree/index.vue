<template>
  <div class="member-tree-container">
    <!-- <search-input class="mb10 mt10" placeholder="请输入姓名" clearable :on-input="handleOnInput" /> -->
    <tree-selector
      ref="MemberTree"
      class="dept-member-tree"
      data-source-uri="/api/v1/rabbit/system/member/dept/tree/find"
      source-type="uri"
      :params="params"
      :property="{key: 'id', children: 'childList'}"
      :multiple="multiple"
      :default-checked-keys="checkedNode"
      :disabled="getNodeDisabled"
      :show-checkbox="true"
      :render-node="renderNode"
      :render-after-expand="false"
      :formatter="dataFormatter"
      :filter-node-method="filterNode"
      default-expand-all
    />
  </div>
</template>

<script>
import { SvgIcon, TreeSelector } from "@monkey.do/monkey";
import { getCheckedValue } from "@/utils";
import MemberProps from "../mixin/props";
import MemberData from "../mixin/data";

export default {
  name: "DeptMemberTree",
  components: {
    TreeSelector,
  },
  mixins: [MemberProps, MemberData],
  props: {
    type: {
      type: String,
      default: "", // sub: 下级 不传则获取全部组织架构
    },
    wants: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      filterText: "",
    };
  },
  computed: {
    params() {
      return { deptId: this.type === "sub" ? this.$store.getters.currentUserInfo.deptId : undefined };
    },
  },
  watch: {
    // 根据名称筛选部门树
    filterText(val) {
      this.$refs["MemberTree"].filter(val);
    },

    value: {
      handler: function(value) {
        this.checkedNode = getCheckedValue(value, this.property.id);
      },
      immediate: true,
    },
  },
  methods: {
    getNodeDisabled(data, node) {
      if (this.multiple) return false;
      return !data.isMember;
    },
    renderNode(h, { node, data, store }) {
      return h("span", {}, [
        h(SvgIcon, {
          props: {
            "iconClass": data.isMember ? "user" : "bumenguanli",
          },
        }),
        h("span", data.name),
      ]);
    },
    dataFormatter(data) {
      return data.map(item => {
        let memberList = [];
        if (item.memberList && item.memberList.length > 0) {
          memberList = item.memberList.map(m => {
            m.isMember = true;
            return m;
          });
        }

        if (item.childList && item.childList.length > 0) {
          item.childList = item.childList.concat(memberList);
          this.dataFormatter(item.childList);
        } else {
          item.childList = memberList;
        }

        return item;
      });
    },
    getCheckedNode() {
      return this.$refs["MemberTree"].getCheckedNodes().filter(item => item.isMember).map(item => this.wants ? item[this.wants] : item);
    },
    handleOnInput(value) {
      this.filterText = value;
    },
    // 根据输入内容筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return (data.name || "").indexOf(value) !== -1;
    },
    setFilterText(val) {
      this.filterText = val;
    },
  },
};
</script>

<style lang="scss">
.dept-member-tree {
  svg.svg-icon {
    position: relative;
    top: -1px;
    width: 18px;
    height: 18px;
    margin-right: 5px;
    fill: #666;
    vertical-align: middle;
  }
}
</style>
