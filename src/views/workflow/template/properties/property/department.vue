<template>
  <el-collapse-item title="办理部门" name="department">
    <el-row>
      <el-col>
        <DepartmentSelector v-model="departmentList" multiple wants="" @change="handleDepartmentChange" />
      </el-col>
      <!--      <el-col :span="6">-->
      <!--        <el-button :disabled="!selectedRows.length" @click="handleDelete">删除</el-button>-->
      <!--      </el-col>-->
    </el-row>
    <!--    <el-table :data="departmentList" @selection-change="handleSelectionChange">-->
    <!--      <el-table-column align="center" type="selection" />-->
    <!--      <el-table-column label="部门" prop="name" show-overflow-tooltip />-->
    <!--    </el-table>-->
  </el-collapse-item>
</template>

<script>
import { isObject } from "@monkey.do/monkey";
import { DepartmentSelector } from "@/components";

export default {
  name: "DepartmentProperty",
  components: { DepartmentSelector },
  props: {
    defaultValue: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      departmentList: [],
      selectedRows: [],
    };
  },
  watch: {
    defaultValue: {
      handler: function(value = []) {
        this.departmentList = value.map(item => isObject(item) ? item.id : item);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleSelectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    handleDepartmentChange(value) {
      this.$emit("change", value.map(item => item.id));
    },
    handleDelete() {
      const departmentList = [];
      const deleteIds = this.selectedRows.map(row => row.id);
      for (let i = 0; i < this.departmentList.length; i++) {
        if (deleteIds.indexOf(this.departmentList[i].id) === -1) {
          departmentList.push(this.departmentList[i]);
        }
      }
      this.$emit("change", departmentList.map(item => item.id));
    },
  },
};
</script>
