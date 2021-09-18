<template>
  <div v-if="data">
    <div v-for="(item, index) in tableColumns" :key="index" class="column">
      <el-input v-model="item.label" placeholder="label" class="field" @input="handleChange" />
      <el-input v-model="item.value" placeholder="value" @input="handleChange" />
      <div class="btn">
        <el-button type="text" class="el-icon-circle-plus-outline btn-item" @click="add(index)" />
        <el-button type="text" class="el-icon-remove-outline btn-item" @click="del(index)" />
      </div>
    </div>
  </div>
</template>

<script>
import BaseEditor from "./index.vue";
import { handleStringFunction } from "@/views/page/design/utils/index";

export default {
  name: "TableOptions",
  extends: BaseEditor,
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableColumns: {},
    };
  },
  watch: {
    data: {
      handler(value) {
        this.tableColumns = handleStringFunction(value.props.options);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleChange() {
      this.innerEditorValue = JSON.stringify(this.tableColumns);
      this.setValue();
    },
    add(index) {
      this.tableColumns.splice(index + 1, 0, { label: "", value: "" });
      this.handleChange();
    },
    del(index) {
      this.tableColumns.splice(index, 1);
      this.handleChange();
    },
  },
};
</script>
<style lang="scss" scoped>
.column{
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  .field{
    margin-right: 10px;
  }
}
.btn{
  display: flex;
  margin-left: 4px;
  .btn-item{
    font-size: 20px;
  }
}
</style>
