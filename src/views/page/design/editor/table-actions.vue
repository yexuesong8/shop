<template>
  <div v-if="data">
    <el-button size="mini" type="text" @click="add">create</el-button>
    <div v-for="(item, index) in tableActions" :key="index" class="column">
      <el-input v-model="item.label" placeholder="请输入标题" class="field" @input="handleChange" />
      <el-input v-model="item.event" placeholder="请输入字段" @input="handleChange" />
      <div class="btn-box">
        <el-button size="mini" type="text" @click="del(index)">delete</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BaseEditor from "./index.vue";
import { handleStringFunction } from "@/views/page/design/utils/index";

export default {
  name: "TableActions",
  extends: BaseEditor,
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableActions: {},
    };
  },
  watch: {
    data: {
      handler(value) {
        this.tableActions = handleStringFunction(value.props.actions);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleChange(value) {
      this.innerEditorValue = JSON.stringify(this.tableActions);
      this.setValue();
    },
    add() {
      this.tableActions.push({ label: "", field: "" });
      this.handleChange();
    },
    del(index) {
      this.tableActions.splice(index, 1);
      this.handleChange();
    },
  },
};
</script>
<style lang="scss" scoped>
.column{
  display: flex;
  margin-bottom: 10px;
  .field{
    margin-right: 10px;
  }
}
.btn-box{
  display: flex;
}
</style>
