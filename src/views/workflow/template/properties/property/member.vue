<template>
  <el-collapse-item title="办理人员" name="member">
    <el-row>
      <div class="btn" style="float:right;margin-bottom:10px">
        <el-button type="primary" @click="handleChoose">选择人员</el-button>
        <el-button :disabled="!selectedRows.length" @click="handleDelete">删除</el-button>
      </div>
    </el-row>
    <el-table :data="memberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
      <el-table-column label="人员" prop="name" show-overflow-tooltip />
    </el-table>
    <member-selector-dialog multiple :visible="visible" :value="memberList.map(item => item.id)" @cancel="handleCancel" @confirm="handleConfirm" />
  </el-collapse-item>
</template>

<script>
import { MemberSelectorDialog } from "@/components";

export default {
  name: "MemberProperty",
  components: { MemberSelectorDialog },
  props: {
    defaultValue: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visible: false,
      selectedRows: [],
      memberList: [],
    };
  },
  watch: {
    defaultValue: {
      handler: function(value = []) {
        this.memberList = value;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleChoose() {
      this.visible = true;
    },
    handleConfirm(value = []) {
      this.memberList = value;
      this.$emit("change", value.map(item => item.id));
      this.handleCancel();
    },
    handleCancel() {
      this.visible = false;
    },
    handleSelectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    handleDelete() {
      let list = [...this.memberList];
      this.selectedRows.forEach(row => {
        list = list.filter(item => item.id !== row.id);
      });
      this.memberList = list;
      this.$emit("change", list.map(item => item.id));
    },
  },
};
</script>
<style scoped>
</style>
