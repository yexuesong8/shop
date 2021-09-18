<template>
  <el-collapse-item title="办理岗位" name="post">
    <el-row>
      <DropDownTreeSelector
        v-model="jobList"
        placeholder="请选择岗位"
        source-type="uri"
        wants=""
        data-source-uri="/api/v1/rabbit/system/job/find/all"
        :property="{ children: 'jobList', key: 'id', id: 'id', name: 'name' }"
        :formatter="dataFormatter"
        multiple
        @change="handlePostChange"
      />
      <!--      <el-button :disabled="!selectedRows.length" @click="handleDelete">删除</el-button>-->
    </el-row>
    <!--    <el-table :data="jobList" @selection-change="handleSelectionChange">-->
    <!--      <el-table-column type="selection" align="center" />-->
    <!--      <el-table-column label="岗位" prop="name" show-overflow-tooltip />-->
    <!--    </el-table>-->
  </el-collapse-item>
</template>

<script>
import { isObject } from "@monkey.do/monkey";
import { DropDownTreeSelector } from '@monkey.do/monkey';
export default {
  name: "PostProperty",
  components: { DropDownTreeSelector },
  props: {
    defaultValue: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedRows: [],
      jobList: [],
    };
  },
  watch: {
    defaultValue: {
      handler: function(value = []) {
        this.jobList = value.map(item => isObject(item) ? item.id : item);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleSelectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    handleDelete() {
      const jobList = [];
      const deleteIds = this.selectedRows.map(row => row.id);
      for (let i = 0; i < this.jobList.length; i++) {
        if (deleteIds.indexOf(this.jobList[i].id) === -1) {
          jobList.push(this.jobList[i]);
        }
      }
      // this.jobList = jobList;
      this.$emit("change", jobList.map(item => item.id));
    },
    dataFormatter(data) {
      const formatter = (data) => data.map(item => {
        return {
          ...item,
          name: item.typeName,
          id: item.typeId,
        };
      });
      return formatter(data);
    },
    handlePostChange(value) {
      // this.jobList = value;
      this.$emit("change", value.map(item => item.id));
    },
  },
};
</script>
