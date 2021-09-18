<template>
  <div class="main-content-container">
    <list-container ref="ListContainer" api="/api/v1/rabbit/workflow/my/started/find/page" :form-props="{'label-width': 'auto'}">
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
              </el-row>
              <el-row :gutter="64">
                <el-col :span="6.5">
                  <!-- <el-form-item label="发起时间：" prop="beginTime">
                    <el-date-picker v-model="slot.form.beginTime" type="datetime" value-format="timestamp" />
                  </el-form-item> -->
                  <el-form-item label="发起时间：" prop="beginTime">
                    <el-date-picker
                      v-model="form.beginTime"
                      :default-time="['00:00:00', '23:59:59']"
                      type="datetimerange"
                      value-format="timestamp"
                      range-separator="-"
                      start-placeholder="起"
                      end-placeholder="止"
                      @change="(val) => handleChange(val, slot.form)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-row type="flex" :gutter="8">
                    <el-col :span="1.5">
                      <el-button type="primary" :loading="slot.loading" @click="slot.search()">确认</el-button>
                    </el-col>
                    <el-col :span="1.5">
                      <el-button @click="() => resetMix(slot)">重置</el-button>
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
        <el-table v-loading="slot.loading" :data="slot.list" border @cell-dblclick="handleCellDblclick">
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
          <el-table-column label="上一步处理耗时(分钟)" prop="beforeNodeConsumingTime" min-width="180" show-overflow-tooltip />
          <el-table-column label="当前环节" prop="currentNodeName" min-width="100" show-overflow-tooltip />
          <el-table-column label="操作" min-width="200" fixed="right">
            <template v-slot:default="slot">
              <el-row type="flex" :gutter="8">
                <el-col :span="1.5">
                  <Form :ref="`form${slot.row.id}`" :detail="slot.row" :button-method="setInstanceStatus" type="initiate">
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
                <template v-for="(item, index) in getButtons()">
                  <el-col v-if="setCondition(item, slot.row)" :key="index" :span="1.5">
                    <el-button type="text" @click="setInstanceStatus(item.params, slot.row)">{{ item.name }}</el-button>
                  </el-col>
                </template>
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
import { dictFormatter } from "@/utils";
import WorkflowDetail from "./component/detail";
import Form from "./component/form";
import { buttons, handleFunction, getTotalTime } from "./config";

export default {
  name: "Initial",
  components: {
    DictionarySelector,
    WorkflowDetail,
    ListContainer,
    Form,
  },
  data() {
    return {
      form: {},
    };
  },
  methods: {
    // 时间选择本地清空,搜索表单调用清空
    resetMix(slot) {
      slot.reset();
      this.form = {};
    },
    handleChange(val, form) {
      if (val) {
        this.timeValue = val;
        form.beginTimeBegin = this.timeValue[0];
        form.beginTimeEnd = this.timeValue[1];
      } else {
        form.beginTimeBegin = undefined;
        form.beginTimeEnd = undefined;
      }
    },
    getDictFormatValue(dictCode, optionCode) {
      return dictFormatter(dictCode, optionCode);
    },
    setInstanceStatus(type, row) {
      this.$doingConfirm(this.getConfirmMessage(type, row)).then(() => {
        handleFunction(type, { id: row.id }).then(res => {
          if (res.statusCode === 600) {
            this.$message.success("操作成功");
            this.$refs["ListContainer"].refresh();
            this.$refs[`form${row.id}`].cancel();
          }
        });
      });
    },
    getConfirmMessage(type, row) {
      let title = "";
      let message = "";

      switch (type) {
        case 'cancel':
          title = "撤销流程";
          message = "确定撤销流程吗?";
          break;
        case "pause":
          title = "暂停流程";
          message = "确定暂停流程吗?";
          break;
        case "continue":
          title = "继续流程";
          message = "确定继续流程吗?";
          break;
        default: break;
      }

      return { title, message };
    },
    getButtons() {
      return buttons["initiate"];
    },
    getTotalTime(row) {
      return getTotalTime(row);
    },
    setCondition(item, row) {
      let res = true;
      // 条件目前只支持并且
      const keys = Object.keys(item.condition || {});
      for (let i = 0; i < keys.length; i++) {
        if (row[keys[i]] !== item.condition[keys[i]]) {
          res = false;
          return false;
        }
        res = row.i === item.condition[i];
      }
      return res;
    },
    handleCellDblclick(row) {
      this.$refs[`form${row.id}`].handleClick();
    },
  },
};
</script>
