<template>
  <div class="member-select-list">
    <!-- <search-input class="mb10 mt10" placeholder="请输入姓名" :on-input="handleOnInput" /> -->
    <selected-list
      title="人员列表"
      :multiple="multiple"
      source-type="json"
      :json-data="data"
      :value="checkedValue"
      :max-number="maxNumber"
      :property="property"
      wants-value=""
      @change="handleChange"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getCheckedValue } from "@/utils";
import { SelectedList } from "@monkey.do/monkey";
import MemberProps from "../mixin/props";
import MemberData from "../mixin/data";

export default {
  name: "PeerMember",
  components: {
    SelectedList,
  },
  mixins: [MemberProps, MemberData],
  data() {
    return {
      sourceData: [],
      data: [],
      checkedValue: null,
    };
  },

  computed: {
    ...mapGetters(["currentUserInfo"]),
  },

  watch: {
    value: {
      handler: function(value) {
        this.checkedValue = getCheckedValue(value, this.property.id);
      },
      immediate: true,
    },
  },

  mounted() {
    this.getMemberList();
  },

  methods: {
    getMemberList(value) {
      this.$request(
        "rabbit.system.userManage.getMember",
        {
          data: { deptId: this.currentUserInfo.deptId, name: value },
        },
      ).then(res => {
        if (res.statusCode === 600) {
          this.sourceData = res.data;
          this.data = res.data;
        }
      });
    },

    handleOnInput(value) {
      this.data = this.sourceData.filter(item => item[this.property.name].includes(value));
    },

    getCheckedNode() {
      return this.sourceData.filter(item => this.checkedValue.indexOf(item[this.property.id]) !== -1);
    },

    handleChange(value) {
      this.checkedNode = value;
      this.checkedValue = getCheckedValue(value, this.property.id);
    },
  },
};
</script>
