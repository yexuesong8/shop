<template>
  <el-table :key="randomNum" :data="tableData" style="width: 100%">
    <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.value" :label="item.label" />
    <el-table-column v-if="isactions === 'true'" label="操作">
      <el-button v-for="(items, index) in actionsList" :key="index" type="primary">{{ items.label }}</el-button>
    </el-table-column>
  </el-table>
</template>

<script>
import { handleStringFunction } from "@/views/page/design/utils/index";

export default {
  name: "PgTable",
  model: {
    prop: "templateValue",
    event: "handleInputChange",
  },
  props: {
    width: {
      type: String,
      default: "446px",
    },
    data: {
      type: null,
      default: () => {},
    },
    options: {
      type: null,
      default: "",
    },
    actions: {
      type: null,
      default: "",
    },
    isactions: {
      type: String,
      default: "",
    },
    datasource: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      innerValue: "",
      tableData: [
        { name: "111" },
      ],
      columns: [],
      actionsList: [],
      randomNum: Math.random(),
    };
  },
  watch: {
    templateValue: {
      handler(value) {
        this.innerValue = value;
      },
      immediate: true,
      deep: true,
    },
    options: {
      handler(value) {
        if (value) {
          this.columns = handleStringFunction(value);
        }
      },
      immediate: true,
      deep: true,
    },
    actions: {
      handler(value) {
        if (value) {
          this.actionsList = handleStringFunction(value);
          this.randomNum = Math.random(); // 防止更改数据 table不刷新
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleInputChange() {
      this.$emit("update:templateValue", this.innerValue);
      this.$emit("handleInputChange", this.innerValue);
    },
  },
};
</script>
