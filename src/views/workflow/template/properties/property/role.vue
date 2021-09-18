<template>
  <el-collapse-item title="办理角色" name="role">
    <el-row>
      <DropDownTreeSelector
        v-model="roleList"
        placeholder="请选择角色"
        data-source-uri="/api/v1/rabbit/system/role/find/all"
        source-type="uri"
        multiple
        wants=""
        @change="handleRoleChange"
      />
      <!--      <el-button :disabled="!selectedRows.length" @click="handleDelete">删除</el-button>-->
    </el-row>
    <!--    <el-table :data="roleList" @selection-change="handleSelectionChange">-->
    <!--      <el-table-column type="selection" align="center" />-->
    <!--      <el-table-column label="人员" prop="name" show-overflow-tooltip />-->
    <!--    </el-table>-->
  </el-collapse-item>
</template>

<script>
import { isObject } from "@monkey.do/monkey";
import { DropDownTreeSelector } from '@monkey.do/monkey';
export default {
  name: "RoleProperty",
  components: { DropDownTreeSelector },
  props: {
    defaultValue: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      roleList: [],
      selectedRows: [],
    };
  },
  watch: {
    defaultValue: {
      handler: function(value = []) {
        this.roleList = value.map(item => isObject(item) ? item.id : item);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleDelete() {
      const roleList = [];
      const deleteIds = this.selectedRows.map(row => row.id);
      for (let i = 0; i < this.roleList.length; i++) {
        if (deleteIds.indexOf(this.roleList[i].id) === -1) {
          roleList.push(this.roleList[i]);
        }
      }
      this.$emit("change", roleList.map(item => item.id));
    },
    handleRoleChange(value) {
      this.$emit("change", value.map(item => item.id));
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows;
    },
  },
};
</script>
