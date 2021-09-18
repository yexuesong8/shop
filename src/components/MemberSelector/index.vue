<template>
  <div class="member-selector-box">
    <el-select
      ref="fuzzySearch"
      v-model="selectList"
      class="member-selector-select"
      :multiple="multiple"
      filterable
      remote
      clearable
      reserve-keyword
      :disabled="disabled"
      placeholder="请输入名称"
      :remote-method="remoteMethod"
      :multiple-limit="maxNumber"
      value-key="id"
      @focus="focusSelectValue"
      @change="handleCustomerChange"
    >
      <el-option
        v-for="(item, index) in searchMemberList"
        :key="index"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <select-button
      :max-number="maxNumber"
      :value="value"
      :disabled="disabled"
      :multiple="multiple"
      :showed-tabs="showedTabs"
      :property="property"
      @confirm="confirm"
    />
  </div>
</template>

<script>
import SelectButton from "./select-button.vue";
import MemberProps from "./mixin/props";

export default {
  name: "MemberSelector",
  components: {
    SelectButton,
    // FormItemSelectButton,
  },
  mixins: [MemberProps],
  model: {
    prop: "value",
    event: "change",
  },
  props: {
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
    formatter: {
      type: Function,
      default: (data) => data,
    },
  },
  data() {
    return {
      data: [],
      searchMemberList: [], // 筛选出的人员
      selectList: [], // 选中的人员
      count: 0,
    };
  },
  watch: {
    value: {
      handler(value) {
        if (this.multiple) {
          if (typeof value[0] === "string") {
            this.selectList = value;
          } else {
            this.selectList = value.map(item => item.id);
          }
        } else if (value[0]) {
          this.selectList = value[0].id;
        } else {
          this.selectList = value.id;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    this.memberList = await this.getMembers();
    this.searchMemberList = this.memberList;
  },
  methods: {
    confirm(value) {
      if (this.multiple) {
        this.selectList = [...new Set(this.selectList.concat(value.map(item => item.id)))];
      } else if (value[0]) {
        this.selectList = value[0].id;
      } else {
        this.selectList = value.id;
      }
      this.handleCustomerChange();
    },
    async remoteMethod(value) {
      this.searchMemberList = await this.getMembers({ name: value });
    },
    handleCustomerChange() {
      if (this.multiple) {
        const list = [];
        this.selectList.forEach(selectItem => {
          const item = this.memberList.filter(filterItem => filterItem.id === selectItem);
          if (item[0]) list.push(item[0]);
        });
        this.$emit("change", list);
        this.$emit("update:value", this.selectList);
      } else {
        const item = this.memberList.filter(filterItem => filterItem.id === this.selectList);
        this.$emit("change", item[0] || {});
        this.$emit("update:value", this.selectList);
      }
    },
    // select组件加上 filterable 后blur事件失效 换另一种方式实现
    focusSelectValue() {
      this.count++;
      if (this.count === 1) this.searchMemberList = this.memberList;
      if (this.$refs.fuzzySearch.$refs.input) {
        this.$refs.fuzzySearch.$refs.input.blur = () => {
          this.searchMemberList = this.memberList;
        };
      }
    },
    clean() {
      if (this.multiple) {
        this.selectList = [];
      } else {
        this.selectList = "";
      }
      this.handleCustomerChange();
    },
    async getMembers(payload) {
      return new Promise((resolve) => {
        this.$request("rabbit.system.user.fuzzySearchMember", { data: { name: "", ...payload }}).then(res => {
          resolve(this.formatter(res.data || []));
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.member-selector-box{
  display: flex;
  .member-selector-select{
    margin-right: 4px;
    /deep/.el-input__inner{
      padding-right: 16px !important;
    }
  }
}
</style>
