<template>
  <div class="warning-container">
    <list-container ref="ListContainer" api="/api/v1/rabbit/resource/state/find/page" :form-props="{'label-width': 'auto'}">
      <template v-slot:form="slot">
        <FilterSearch class="mb10">
          <template v-slot:search>
            <el-row class="mt10">
              <el-row :gutter="64">
                <el-col :span="6">
                  <el-form-item label="应用id：" prop="applicationId">
                    <el-input v-model="slot.form.applicationId" placeholder="请输入应用id" :maxlength="30" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="IP：" prop="ip">
                    <el-input v-model="slot.form.ip" placeholder="请输入IP" :maxlength="30" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="端口：" prop="port">
                    <el-input v-model="slot.form.port" placeholder="请输入端口" :maxlength="30" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="64">
                <el-col :span="6">
                  <el-form-item label="报警类型" prop="warningType">
                    <dictionary-selector :value.sync="slot.form.warningType" code="rabbit_monitor_warning_type" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-row type="flex" :gutter="8">
                    <el-col :span="1.5">
                      <el-button type="primary" :loading="slot.loading" @click="slot.search()">确认</el-button>
                    </el-col>
                    <el-col :span="1.5">
                      <el-button @click="slot.reset()">重置</el-button>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-row>
          </template>
          <template v-slot:actions>
            <el-button class="el-icon-refresh" :loading="slot.loading" @click="slot.refresh()" />
          </template>
        </FilterSearch>
      </template>

      <template v-slot:table="slot">
        <el-table v-loading="slot.loading" :data="slot.list" border>
          <el-table-column type="index" fixed="left" />
          <el-table-column label="应用ID" prop="applicationId" min-width="100" show-overflow-tooltip />
          <el-table-column label="IP" prop="ip" min-width="100" show-overflow-tooltip />
          <el-table-column label="端口" prop="port" min-width="100" show-overflow-tooltip />
          <el-table-column label="报警类型">
            <template slot-scope="scope">
              {{ dictFormatter("rabbit_monitor_warning_type", scope.row.warningType) }}
            </template>
          </el-table-column>
          <el-table-column label="报警内容" prop="warningContent" min-width="100" show-overflow-tooltip />
          <el-table-column label="报警时间" prop="createTimeTimestamp" min-width="150" show-overflow-tooltip>
            <template v-slot:default="slot">
              {{ parseTime(slot.row.createTimeTimestamp) }}
            </template>
          </el-table-column>
          <template v-slot:empty>
            <no-data />
          </template>
        </el-table>
      </template>
    </list-container>
  </div>
</template>

<script>
import { ListContainer } from "@/components";
import { NoData, FilterSearch } from "@monkey.do/monkey";

export default {
  name: "ServiceWarning",
  components: {
    ListContainer,
    NoData,
    FilterSearch,
  },
};

</script>
<style lang="scss" scoped>
.warning-container {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
}
</style>
