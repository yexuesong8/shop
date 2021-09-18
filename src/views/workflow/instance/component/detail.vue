<template>
  <span>
    <slot :click="handleSlotClick" />
    <Dialog title="流程查看页面" :visible="visible" @cancel="handleCancel" @confirm="handleConfirm">
      <LoadView :id="id">
        <template v-slot:default="view">
          <el-button type="primary" @click="view.click()">查看流程图</el-button>
        </template>
      </LoadView>
      <el-tabs v-model="activeName" class="mt10" type="border-card" @tab-click="handleTabClick">
        <el-tab-pane label="时间线" name="timeline">
          <el-timeline style="height:400px;overflow-y:auto;margin-left: -21px;">
            <el-timeline-item v-for="(activity, index) in lineHistory" :key="index" color="#4CA2FD" :handler-member-name="activity.handlerMemberName">
              {{ activity.operation }}
              <ul class="timeBox">
                <li>处理时间：{{ parseTime(activity.time) }}</li>
                <li>处理人：{{ activity.handlerMemberName }}</li>
                <!-- <li v-if="activity.type!=='instanceLog'">操作类型：{{activity.type}}</li> -->
                <li v-if="activity.type!=='instanceLog'">{{ activity.type==='node'?'处理环节：':activity.type==='comment'?'批注内容：':'' }}{{ activity.content }}</li>
              </ul>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
        <el-tab-pane label="表格" name="table">
          <el-table :data="tableHistory" border height="300">
            <el-table-column label="节点" prop="nodeName" show-overflow-tooltip />
            <el-table-column label="到达时间" prop="beginTime" show-overflow-tooltip>
              <template v-slot:default="slot">
                {{ parseTime(slot.row.beginTime) }}
              </template>
            </el-table-column>
            <el-table-column label="处理人" prop="handlerMemberName" show-overflow-tooltip />
            <el-table-column label="处理结果" prop="handleMode" show-overflow-tooltip>
              <template v-slot:default="slot">
                {{ dictFormatter("rabbit_workflow_instance_step_handle_mode", slot.row.handleMode) }}
              </template>
            </el-table-column>
            <el-table-column label="处理时间" prop="endTime" show-overflow-tooltip>
              <template v-slot:default="slot">
                {{ parseTime(slot.row.endTime) }}
              </template>
            </el-table-column>
            <el-table-column label="批注" prop="comment" max-width="250" show-overflow-tooltip />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </Dialog>
  </span>
</template>

<script>
import { instanceHistoryTable, instanceHistoryLine } from "@/api/workflow/instance";
import LoadView from "./load-view";

export default {
  name: "WorkflowDetail",
  components: { LoadView },
  props: {
    id: {
      type: String,
      required: true,
    },
    detailVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeName: 'table',
      visible: false,
      lineHistory: [],
      tableHistory: [],
    };
  },
  watch: {
    detailVisible: {
      handler(val) {
        this.visible = val;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleSlotClick() {
      this.getTableHistory({ id: this.id });
      this.getLineHistory({ id: this.id });
      this.visible = true;
    },
    handleConfirm() {
      this.visible = false;
    },
    handleCancel() {
      this.lineHistory = [];
      this.tableHistory = [];
      this.visible = false;
      this.$emit("cancle", this.visible);
    },
    handleTabClick(tab, event) {

    },
    async getLineHistory(data) {
      const res = await instanceHistoryLine(data);
      if (res.statusCode === 600) {
        this.lineHistory = res.data;
      }
    },
    async getTableHistory(data) {
      const res = await instanceHistoryTable(data);
      if (res.statusCode === 600) {
        this.tableHistory = res.data;
      }
    },
    handleLoadTemplate() {

    },
  },
};
</script>
<style scoped>
.timeBox li {
  list-style-type: none;
  color: #aaaaaa;
  position: relative;
  left: -40px;
  /* top: 10px; */
  margin-top: 5px;
  font-size: 13px;
}
</style>
