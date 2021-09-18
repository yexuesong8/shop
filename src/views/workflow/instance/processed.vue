<template>
  <!-- 流程事务 我的已办 -->
  <div class="main-content-container">
    <list-container ref="MainContainer" api="/api/v1/rabbit/workflow/my/processed/find/page" :form-props="{'label-width': 'auto'}">
      <template v-slot:form="slot">
        <FilterSearch class="mb10">
          <template v-slot:search>
            <el-row class="mt10">
              <el-row :gutter="64">
                <el-col :span="6">
                  <el-form-item label="标题：" prop="dataTitle">
                    <el-input v-model.trim="slot.form.dataTitle" placeholder="请输入标题" :maxlength="50" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="流程类型：" prop="typeId">
                    <ListSelector v-model="slot.form.typeId" wants="id" data-source-uri="/api/v1/rabbit/workflow/type/find/all" source-type="uri" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="状态：" prop="status">
                    <dictionary-selector :value.sync="slot.form.status" code="rabbit_workflow_status" />
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
      <template v-slot:table="table">
        <el-table v-loading="table.loading" :data="table.list" border @cell-dblclick="handleCellDblclick">
          <el-table-column type="index" fixed="left" />
          <!-- <el-table-column type="selection" fixed="left" width="50" align="center" /> -->
          <el-table-column label="标题" prop="dataTitle" min-width="100" show-overflow-tooltip />
          <el-table-column label="流程类型" prop="typeName" min-width="100" show-overflow-tooltip />
          <el-table-column label="流程状态" prop="status" min-width="100" show-overflow-tooltip>
            <template v-slot:default="slot">
              {{ getDictFormatValue("rabbit_workflow_status", slot.row.status) }}
            </template>
          </el-table-column>
          <el-table-column label="发起人" prop="startMemberName" min-width="100" show-overflow-tooltip />
          <el-table-column label="发起时间" prop="beginTime" min-width="150" show-overflow-tooltip>
            <template v-slot:default="slot">
              {{ parseTime(slot.row.beginTime) }}
            </template>
          </el-table-column>
          <el-table-column label="总耗时(分钟)" prop="totalTime" min-width="100" show-overflow-tooltip>
            <template v-slot:default="slot">
              {{ getTotalTime(slot.row) }}
            </template>
          </el-table-column>
          <el-table-column label="上一步" prop="beforeNodeName" min-width="100" show-overflow-tooltip />
          <el-table-column label="上一步处理时间" prop="beforeNodeOperactionTime" min-width="150" show-overflow-tooltip>
            <template v-slot:default="slot">
              {{ parseTime(slot.row.beforeNodeOperactionTime) }}
            </template>
          </el-table-column>
          <el-table-column label="上一步处理耗时(分钟)" prop="beforeNodeConsumingTime" width="160" show-overflow-tooltip />
          <el-table-column label="上一步执行动作" prop="handleMode" width="140" show-overflow-tooltip>
            <template v-slot:default="slot">
              {{ dictFormatter("rabbit_workflow_instance_step_handle_mode", slot.row.handleMode) }}
            </template>
          </el-table-column>
          <el-table-column label="当前环节" prop="currentNodeName" min-width="100" show-overflow-tooltip />
          <el-table-column label="当前办理人" prop="handleMemberName" min-width="100" show-overflow-tooltip />
          <el-table-column label="操作" min-width="200" fixed="right">
            <template v-slot:default="slot">
              <el-row type="flex" :gutter="8">
                <el-col :span="1.5">
                  <Form :ref="`form${slot.row.id}`" :detail="slot.row" type="processed">
                    <template v-slot:default="form">
                      <el-button type="text" @click="form.click">查看</el-button>
                    </template>
                  </Form>
                </el-col>
                <el-col :span="1.5">
                  <WorkflowDetail :id="slot.row.id">
                    <template v-slot:default="detail">
                      <el-button type="text" @click="detail.click()">流程详情</el-button>
                    </template>
                  </WorkflowDetail>
                </el-col>
              </el-row>
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
import { DictionarySelector, ListContainer } from "@/components";
import { NoData, FilterSearch, ListSelector } from "@monkey.do/monkey";
import { dictFormatter } from "@/utils";
import WorkflowDetail from "./component/detail";
import Form from "./component/form";
import { getTotalTime } from "./config";

export default {
  name: "Processed",
  components: {
    NoData,
    DictionarySelector,
    WorkflowDetail,
    ListContainer,
    FilterSearch,
    Form,
    ListSelector,
  },
  data() {
    return {
    };
  },
  methods: {
    getDictFormatValue(dictCode, optionCode) {
      return dictFormatter(dictCode, optionCode);
    },
    getTotalTime(row) {
      return getTotalTime(row);
    },
    handleCellDblclick(row) {
      this.$refs[`form${row.id}`].handleClick();
    },
  },
};
</script>
