<template>
  <el-select v-model="innerEditorValue" clearable @change="handleChange">
    <el-option
      v-for="(item, index) in selectData"
      :key="index"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import BaseEditor from "./index.vue";

export default {
  name: "SelectEditor",
  extends: BaseEditor,
  data() {
    return {
      selectData: [],
    };
  },
  watch: {
    type: {
      handler(value) {
        if (value === "dataSource") { // 组件选择数据源
          this.selectData = this.list.hide.map(item => {
            return {
              label: item.props && item.props.id ? item.props.id : "",
              value: item.key,
            };
          });
        } else if (value === "dataSourceType") { // 数据源类型
          this.selectData = [
            { label: "api", value: "api" },
            { label: "sql", value: "sql" },
          ];
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleChange(value) {
      if (value && this.type === "dataSource") {
        const index = this.list.hide.findIndex(item => item.key === value);
        if (index !== -1) {
          const { model, defaultValue } = this.data.props;
          this.list.hide[index].props = { ...this.list.hide[index].props, params: { field: model, value: defaultValue }};
        }
      }
      this.setValue();
    },
  },
};
</script>
