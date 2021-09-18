<template>
  <div class="main-content-container">
    <list-container ref="ListContainer" api="/api/v1/rabbit/workflow/my/pending/find/page" :form-props="{'label-width': 'auto'}">
      <template v-slot:form="slot">
        <FilterSearch class="mb20">
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
                  <el-form-item label="发起人：" prop="startMemberId">
                    <MemberSelector ref="memberSelector" :value="memberValue" :multiple="false" @change="(value) => handleSearchMemberChange(value, slot.form)" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-row type="flex" :gutter="8">
                    <el-col :span="1.5">
                      <el-button type="primary" :loading="slot.loading" @click="slot.search">确认</el-button>
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
            <el-button class="el-icon-refresh" :loading="slot.loading" @click="slot.refresh" />
          </template>
        </FilterSearch>
      </template>
      <template v-slot:table="slot">
        <el-table v-loading="slot.loading" :data="slot.list" border @cell-dblclick="handleCellDblclick">
          <el-table-column type="index" fixed="left" />
          <!-- <el-table-column type="selection" fixed="left" width="50" align="center" /> -->
          <el-table-column label="标题" prop="dataTitle" min-width="100" show-overflow-tooltip />
          <el-table-column label="流程类型" prop="typeName" min-width="100" show-overflow-tooltip />
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
          <el-table-column label="待办人" prop="handleMemberName" min-width="100" show-overflow-tooltip />
          <el-table-column label="操作" min-width="150" fixed="right">
            <template v-slot:default="slot">
              <el-row type="flex" :gutter="8">
                <el-col :span="1.5">
                  <Form :ref="`form${slot.row.id}`" :detail="slot.row" type="pending" :button-method="buttonClick">
                    <template v-slot:default="form">
                      <el-button type="text" @click="form.click">办理</el-button>
                    </template>
                  </Form>
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
    <Dialog :title="handleTitle" :visible="handleVisible" :loading="handleLoading" @cancel="handleCancel" @confirm="handleConfirm">
      <el-form ref="handleForm" label-width="auto" :model="handleForm">
        <el-form-item label="批注:" prop="comment">
          <el-input v-model="handleForm.comment" type="textarea" :maxlength="200" />
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog :title="memberTitle" :visible="memberVisible" :loading="memberLoading" @cancel="memberCancel" @confirm="memberConfirm">
      <el-form ref="memberForm" label-width="auto" :model="memberForm" :rules="memberRules">
        <el-form-item label="人员选择:" prop="handoverMemberId">
          <MemberSelector v-model="memberForm.handoverMemberId" :multiple="memberType === 'together'" />
        </el-form-item>
        <el-form-item label="批注:" prop="comment">
          <el-input v-model="memberForm.comment" type="textarea" :maxlength="200" />
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog :title="commentTitle" :visible="commentVisible" :loading="commentLoading" @cancel="commentCancel" @confirm="commentConfirm">
      <el-form ref="commentrForm" label-width="auto" :model="commentForm">
        <el-form-item label="批注:" prop="comment">
          <el-input v-model="commentForm.comment" type="textarea" :maxlength="200" />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import { ListContainer, MemberSelector } from "@/components";
import { NoData, FilterSearch, ListSelector } from "@monkey.do/monkey";
import { dictFormatter } from "@/utils";
import Form from "./component/form";
import { buttons, handleFunction, getTotalTime } from "./config";

export default {
  name: "Pending",
  components: {
    NoData,
    FilterSearch,
    ListContainer,
    MemberSelector,
    Form,
    ListSelector,
  },
  data() {
    return {
      loading: false,
      form: {},
      tableData: [],
      params: {},
      total: 0,
      handleType: "post",
      handleVisible: false,
      handleData: {},
      handleLoading: false,
      handleForm: {},
      commentTitle: "批注",
      commentVisible: false,
      commentLoading: false,
      commentData: {},
      commentForm: {},
      commentType: "comment",
      memberType: "handover",
      memberVisible: false,
      memberData: {},
      memberLoading: false,
      memberForm: {},
      memberRules: {
        handoverMemberId: [{ required: true, message: "必填项不可为空", trigger: "blur" }],
      },
      memberValue: {},
    };
  },
  computed: {
    handleTitle() {
      return this.handleType === 'post' ? "提交" : "驳回";
    },
    memberTitle() {
      return this.memberType === 'handover' ? "转办" : "会办";
    },
  },
  methods: {
    // 发起人本地清空,搜索表单调用清空
    resetMix(slot) {
      slot.reset();
      this.$refs["memberSelector"].clean();
      this.memberValue = {};
    },
    handleSearchMemberChange(member, form) {
      form.startMemberId = member.id;
    },
    handleSearchMemberClose(member, form) {
      member = {};
      this.handleSearchMemberChange();
    },
    getDictFormatValue(dictCode, optionCode) {
      return dictFormatter(dictCode, optionCode);
    },
    handleConfirm() {
      const _this = this;
      this.$refs["handleForm"].validate(valid => {
        if (valid) {
          this.handleLoading = true;
          handleFunction(this.handleType, { instanceId: this.handleData.id, stateId: this.handleData.stateId, ...this.handleForm }).then(res => {
            this.handleLoading = false;
            if (res.statusCode === 600) {
              this.$message.success("操作成功");
              this.$refs["ListContainer"].refresh();
              _this.handleCancel(this.handleData);
            }
          });
        }
      });
    },
    handleCancel() {
      this.$refs["handleForm"].resetFields();
      this.handleVisible = false;
      // this.$refs[`form${this.handleData.id}`].cancel();
    },
    handleClick(row, type) {
      this.handleType = type;
      this.handleVisible = true;
      this.handleData = row;
    },
    memberConfirm() {
      this.$refs["memberForm"].validate(valid => {
        if (valid) {
          this.memberLoading = true;
          let payload = { ...this.memberForm };
          if (this.memberType === "together") {
            payload = {
              ...payload,
              togetherMemberIds: payload["handoverMemberId"].map(item => item.id),
              handoverMemberId: undefined,
              instanceId: this.memberData.id,
              stateId: this.memberData.stateId,
            };
          } else {
            payload = {
              ...payload,
              handoverMemberId: payload["handoverMemberId"].id,
              instanceId: this.memberData.id,
              stateId: this.memberData.stateId,
            };
          }

          handleFunction(this.memberType, { ...payload }).then(res => {
            this.memberLoading = false;
            if (res.statusCode === 600) {
              this.$message.success("操作成功");
              this.$refs["ListContainer"].refresh();
              this.memberCancel();
            }
          });
        }
      });
    },
    memberCancel() {
      this.$refs["memberForm"].resetFields();
      // this.$refs[`form${this.commentData.id}`].cancel();
      this.memberVisible = false;
      this.memberData = {};
      this.memberForm = {};
    },
    memberClick(row, type) {
      this.memberType = type;
      this.memberVisible = true;
      this.memberData = row;
    },
    // 点击批注按钮
    handleCommentClick(row, type) {
      this.commentType = type;
      this.commentVisible = true;
      this.commentData = row;
    },
    // 关闭批注
    commentCancel() {
      // this.$refs["commentForm"].resetFields();
      // this.$refs[`form${this.commentData.id}`].cancel();
      this.commentVisible = false;
      this.commentData = {};
      this.commentForm = {};
    },
    // 批注确认
    commentConfirm() {
      this.commentLoading = true;
      handleFunction(this.commentType, { instanceId: this.commentData.id, stateId: this.commentData.stateId, ...this.commentForm }).then(res => {
        this.commentLoading = false;
        if (res.statusCode === 600) {
          this.$message.success("操作成功");
          this.$refs["ListContainer"].refresh();
          this.commentCancel(this.handleData);
        }
      });
    },
    buttonClick(buttonType, row) {
      switch (buttonType) {
        case "handover":
        case "together":
          this.memberClick(row, buttonType);
          return;
        case "post":
        case "reject":
          this.handleClick(row, buttonType);
          return;
        case "comment":
          this.handleCommentClick(row, buttonType);
          return;
        default: return;
      }
    },
    getButtons() {
      return buttons["pending"];
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

    getTotalTime(row) {
      return getTotalTime(row);
    },
    handleCellDblclick(row) {
      this.$refs[`form${row.id}`].handleClick();
    },
  },
};
</script>

