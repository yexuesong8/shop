<template>
  <div class="status-container main-content-container full-fill">
    <FixTableHeight>
      <template #top>
        <filter-search>
          <template v-slot:search>
            <el-form :model="params" class="mt20" label-width="auto">
              <el-row :gutter="10">
                <el-col :span="4">
                  <el-form-item label="应用ID:">
                    <el-input v-model="params.applicationId" :maxlength="50" placeholder="请输入应用ID" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="IP:">
                    <el-input v-model="params.ip" :maxlength="50" placeholder="请输入IP" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="端口:">
                    <el-input v-model="params.port" :maxlength="50" placeholder="请输入端口" />
                  </el-form-item>
                </el-col>
                <el-col :span="1.5">
                  <el-form-item label="是否在线:">
                    <el-select v-model="params.alive" clearable placeholder="请选择在线状态">
                      <el-option v-for="item in alive" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1.5">
                  <el-form-item>
                    <el-button type="primary" @click="query">查询</el-button>
                    <el-button @click="resetQuery">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
          <template #actions>
            <el-button style="height:32px" class="el-icon-refresh" @click="query" />
          </template>
        </filter-search>
      </template>
      <template #bottom>
        <el-table :data="!isEmptyObject(search)? searchData: data">
          <el-table-column type="index" />
          <el-table-column prop="applicationId" label="应用ID" width="260" />
          <el-table-column prop="ip" label="IP" width="140" />
          <el-table-column prop="port" label="端口" width="80" />
          <el-table-column prop="pid" label="进程" width="80" />
          <el-table-column label="启动时间" prop="startTime" min-width="150" show-overflow-tooltip>
            <template v-slot:default="slot">
              {{ parseTime(slot.row.startTime) }}
            </template>
          </el-table-column>
          <el-table-column label="更新时间" prop="timestamp" min-width="150" show-overflow-tooltip>
            <template v-slot:default="slot">
              {{ parseTime(slot.row.timestamp) }}
            </template>
          </el-table-column>
          <el-table-column prop="alive" label="是否在线" align="center">
            <template slot-scope="scope">
              <svg-icon v-if="scope.row.alive === 1" icon-class="alive" />
              <svg-icon v-else icon-class="offLine" />
            </template>
          </el-table-column>
          <el-table-column prop="cpuModel" label="CPU类型" width="310" />
          <el-table-column label="CPU使用率" width="100" align="center">
            <template slot-scope="scope">
              {{ (scope.row.cpuUtilization*100).toFixed(2)+'%' }}
            </template>
          </el-table-column>
          <el-table-column prop="totalMemory" label="总内存" />
          <el-table-column prop="usedMemory" label="使用内存" />
          <el-table-column label="内存使用率" width="100">
            <template slot-scope="scope">
              {{ (scope.row.memoryUtilization*100).toFixed(2)+'%' }}
            </template>
          </el-table-column>
          <el-table-column prop="totalHdd" label="总硬盘" />
          <el-table-column prop="usedHdd" label="使用硬盘" />
          <el-table-column label="硬盘使用率" width="100">
            <template slot-scope="scope">
              {{ (scope.row.hddUtilization*100).toFixed(2)+'%' }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </FixTableHeight>
  </div>
</template>

<script>
import { getResource } from '@/api/service/status';
import { isEmptyObject } from "@monkey.do/monkey";

export default {
  name: "ServiceStatus",
  data() {
    return {
      data: [],
      searchData: [],
      params: {},
      search: {},
      alive: [{
        id: 0,
        name: "离线",
      }, {
        id: 1,
        name: "在线",
      }],
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    /** 重置按钮操作 */
    resetQuery() {
      this.params = {};
      this.query();
    },
    fetch(data) {
      getResource(data).then(res => {
        if (res.statusCode === 600) {
          this.data = res.data;
        }
      });
    },
    isEmptyObject,
    // 点击搜索按钮
    query() {
      this.filterData(this.params);
      this.search = this.params;
    },
    filterData({ ...params }) {
      this.searchData = this.data.filter(item => {
        let matchApplicationId = true; // 应用id
        let matchIp = true; // ip
        let matchPort = true; // 端口
        let matchAlive = true; // 是否在线
        if (params.applicationId) {
          matchApplicationId = this.data.every(key => item.applicationId.includes(params.applicationId));
        }
        if (params.ip) {
          matchIp = this.data.every(key => item.ip.includes(params.ip));
        }
        if (params.port) {
          matchPort = this.data.every(key => item.port.includes(params.port));
        }
        if (params.alive === 0 || params.alive === 1) {
          matchAlive = item.alive === params.alive;
        }
        return matchApplicationId && matchIp && matchAlive && matchPort;
      });
    },
  },
};
</script>

<style lang="scss">
.status-container {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  .svg-icon {
    width: 20px;
    height: 38px;
  }
}
</style>
