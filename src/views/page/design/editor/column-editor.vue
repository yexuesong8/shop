<template>
  <div class="wrap">
    <div class="column-box">
      <div v-for="(item, index) in columnsList" :key="index" class="column-list" :class="{active: innerEditorValue === item}" @click="handleColumn(item)">
        <div v-for="(items, indexs) in getColumns(item)" :key="indexs" class="column-item" :style="{width: `${items/getSum(getColumns(item)) * 100}%`}" />
      </div>
    </div>
    <div class="line">自定义比例</div>
    <el-input
      v-model="innerEditorValue"
      v-bind="$attrs"
      style="width: 100%;"
      @input="handleInput"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import BaseEditor from "./index.vue";
import { isNumber } from "@/views/page/design/utils/index";

export default {
  name: "ColumnEditor",
  extends: BaseEditor,
  data() {
    return {
      columnsList: ["12:12", "8:8:8", "6:6:6:6", "4:4:4:4:4:4", "3:3:3:3:3:3:3:3"],
    };
  },
  methods: {
    handleInput(value) {
      this.handleColumnInput(value);
      this.setValue();
    },
    handleColumn(column) {
      this.innerEditorValue = column;
      const arr = column.split(":");
      const children = arr.map(item => {
        return { children: [] };
      });
      children.forEach((item, index) => {
        if (this.data.children && this.data.children[index]) {
          children[index] = this.data.children[index];
        }
      });
      this.data.children = JSON.parse(JSON.stringify(children));
      this.setValue();
    },
    getColumns(item) {
      const arr = item.split(":");
      return arr;
    },
    getSum(arr) {
      let count = 0;
      arr.forEach(item => {
        count += Number(item);
      });
      return count;
    },
    handleColumnInput(value) {
      if (this.isTrueColumn(value)) {
        this.handleColumn(value);
      }
    },
    isTrueColumn(str) {
      const arr = str.split(":");
      let flag = true;
      arr.forEach(item => {
        flag = isNumber(item);
      });
      return flag;
    },
  },
};
</script>
<style lang="scss" scoped>
.wrap{
  width: 100%;
  .line{
    margin: 8px 0;
  }
}
</style>
