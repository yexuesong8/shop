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
import { getLocalStorage, SelectedList, setLocalStorage } from '@monkey.do/monkey';
import { getCheckedValue } from '@/utils';
import MemberData from '../mixin/data';
import MemberProps from '../mixin/props';

export default {
  name: "RecentMember",

  components: {
    SelectedList,
  },

  mixins: [MemberProps, MemberData],

  data() {
    return {
      data: [],
      sourceData: [],
      checkedValue: null,
    };
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
    this.sourceData = this.getRecentSelected();
    this.data = this.sourceData;
  },

  methods: {
    handleOnInput(value) {
      if (value) {
        this.data = this.sourceData.filter(item => item[this.property.name].includes(value));
      } else {
        this.data = this.sourceData;
      }
    },

    getRecentSelected() {
      let data = getLocalStorage("recent-selected-member") || [];
      // 删除错误数据 TODO: 程序正常不会出现错误数据
      data = data.filter(item => item && item.id && item.name);
      setLocalStorage("recent-selected-member", data);
      return data || [];
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
