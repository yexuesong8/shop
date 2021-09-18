<template>
  <el-form id="right-menu" ref="form" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="节点:" prop="name">
      <el-input v-model="form.name" :maxlength="50" @input="handleNameInput" />
    </el-form-item>
    <el-form-item label="代码:" prop="code">
      <el-input v-model="form.code" :maxlength="50" />
    </el-form-item>
    <el-form-item label="表单:">
      <DropDownTreeSelector
        v-model="form.formId"
        source-type="uri"
        data-source-uri="/api/v1/rabbit/workflow/form/find/all"
        :formatter="dataFormatter"
        :property="{
          id: 'id',
          name: 'name',
          children: 'childList',
          key: 'id',
        }"
      />
    </el-form-item>
    <el-form-item label="通过方式:" prop="passType">
      <dictionary-selector :value.sync="form.passType" code="rabbit_workflow_node_pass_type" />
    </el-form-item>
    <el-form-item v-show="form.passType == '3'" label="提交率:" prop="postProportion">
      <el-input-number v-model="form.postProportion" :controls="false" :min="0" :max="100" class="node-postProportion" />
      <span>%</span>
    </el-form-item>
    <el-collapse v-model="activeNames">
      <!-- 超时处理 -->
      <!--      <TimeoutProperty @change="handleValueChange" />-->
      <el-collapse-item title="超时处理" name="timeout">
        <el-row style="margin-bottom:15px;">
          开启超时时间处理: <el-switch v-model="form.enabledTimeout" :active-value="1" :inactive-value="0" />
        </el-row>
        <el-row v-show="form.enabledTimeout">
          <el-form-item label="时间类型:" prop="timeoutType">
            <dictionary-selector :value.sync="form.timeoutType" code="rabbit_workflow_node_timeout_type" />
          </el-form-item>
          <el-form-item label="时长:" prop="timeoutLength">
            <el-input v-model="form.timeoutLength" oninput="value=value.replace(/[^\d]/g,'')" placeholder="时长" :maxlength="9" />
          </el-form-item>
          <el-form-item label="操作:" prop="timeoutOperation">
            <dictionary-selector :value.sync="form.timeoutOperation" code="rabbit_workflow_node_timeout_operation" />
          </el-form-item>
        </el-row>
      </el-collapse-item>

      <!-- 按钮名称 -->
      <!--      <ButtonNameProperty @change="handleValueChange" />-->
      <el-collapse-item title="按钮名称" name="buttonName">
        <el-form-item label="提交:">
          <el-input v-model.trim="form.postButtonName" placeholder="提交按钮名称" :maxlength="10" />
        </el-form-item>
        <el-form-item label="驳回:">
          <el-input v-model.trim="form.rejectButtonName" placeholder="驳回按钮名称" :maxlength="10" />
        </el-form-item>
        <el-form-item label="转办:">
          <el-input v-model.trim="form.handoverButtonName" placeholder="转办按钮名称" :maxlength="10" />
        </el-form-item>
        <el-form-item label="会办:">
          <el-input v-model.trim="form.togetherButtonName" placeholder="会办按钮名称" :maxlength="10" />
        </el-form-item>
      </el-collapse-item>

      <!-- 按钮控制 -->
      <!--      <ButtonControlProperty @change="handleValueChange" />-->
      <el-collapse-item title="按钮控制" name="buttonControl" class="btn-contoll">
        <el-row>
          支持驳回 <el-switch v-model="form.enabledReject" :active-value="1" :inactive-value="0" />
        </el-row>
        <el-row>
          支持转办 <el-switch v-model="form.enabledHandover" :active-value="1" :inactive-value="0" />
        </el-row>
        <el-row>
          支持会办 <el-switch v-model="form.enabledTogether" :active-value="1" :inactive-value="0" />
        </el-row>
        <el-row>
          支持跳转 <el-switch v-model="form.enabledJump" :active-value="1" :inactive-value="0" />
        </el-row>
        <el-row>
          支持退办 <el-switch v-model="form.enabledRetreat" :active-value="1" :inactive-value="0" />
        </el-row>
        <el-row>
          支持并行 <el-switch v-model="form.enabledParallel" :active-value="1" :inactive-value="0" />
        </el-row>
      </el-collapse-item>
      <!-- 办理人员 -->
      <MemberProperty :default-value="memberList" @change="handleMemberChange" />

      <!-- 办理部门 -->
      <DepartmentProperty :default-value="deptList" @change="handleDepartmentChange" />

      <!-- 办理岗位 -->
      <PostProperty :default-value="jobList" @change="handleJobChange" />

      <!-- 角色 -->
      <RoleProperty :default-value="roleList" @change="handleRoleChange" />

      <!-- 自定义办理人 -->
      <!--      <define-member-property @change="handleValueChange" />-->
      <el-collapse-item title="自定义办理人" name="define-member" class="handler">
        <el-form-item label="办理人类型:" prop="handlerType">
          <dictionary-selector :value.sync="form.handlerType" code="rabbit_workflow_node_handler_type" @change="handleTypeChange" />
        </el-form-item>
        <el-form-item label="执行内容:" prop="handlerContent">
          <el-input v-model="form.handlerContent" type="textarea" :maxlength="500" />
        </el-form-item>
      </el-collapse-item>

      <!-- 任务 -->
      <el-collapse-item title="任务" name="task">
        <TaskProperty :value="taskList" @change="handleTaskChange" />
      </el-collapse-item>

    </el-collapse>
  </el-form>
</template>

<script>
import { DropDownTreeSelector } from "@monkey.do/monkey";
import { DictionarySelector } from "@/components";
import TaskProperty from "./property/task";
import MemberProperty from "./property/member";
import RoleProperty from "./property/role";
// import DefineMemberProperty from "./property/define-member";
// import ButtonNameProperty from "./property/button-name";
// import TimeoutProperty from "./property/timeout";
// import ButtonControlProperty from "./property/button-control";
import DepartmentProperty from "./property/department";
import PostProperty from "./property/job";
import { mapState } from "vuex";

export default {
  name: "NodeProperties",
  components: {
    DictionarySelector,
    TaskProperty,
    MemberProperty,
    RoleProperty,
    // DefineMemberProperty,
    // ButtonNameProperty,
    // TimeoutProperty,
    // ButtonControlProperty,
    DepartmentProperty,
    PostProperty,
    DropDownTreeSelector,
  },
  props: {
    modeler: {
      type: Object,
      default: () => ({}),
    },
    defaultValue: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      activeNames: [],
      form: {
        passType: "1",
        enabledHandover: 1,
        enabledTogether: 1,
        enabledJump: 1,
        enabledRetreat: 1,
        enabledReject: 1,
        enabledParallel: 0,
        enabledTimeout: 0,
      },
      defaultRules: {
        name: [{ required: true, message: "请填写名称" }],
      },
      taskList: [],
      jobList: [],
      memberList: [],
      deptList: [],
      roleList: [],
    };
  },
  computed: {
    ...mapState("workflow", {
      element: state => state.element,
      id: state => state.id,
    }),
    rules: {
      get() {
        const passType = this.form.passType === "3" ? { postProportion: [{ required: true, message: "请填写提交率" }] } : {};
        const handlerType = Number(this.form.handlerType) > 0 ? { handlerContent: [{ required: true, message: "请填写自定义办理人执行内容" }] } : {};
        const enabledTimeout = this.form.enabledTimeout === 1 ? {
          timeoutType: [{ required: true, message: "请选择超时类型" }],
          timeoutLength: [{ required: true, message: "请填写超时时长" }],
          timeoutOperation: [{ required: true, message: "请填写超时操作" }],
        } : {};
        return { ...this.defaultRules, ...passType, ...handlerType, ...enabledTimeout };
      },
    },
  },

  provide() {
    return {
      form: this.form,
      parent: this,
    };
  },
  watch: {
    form: {
      handler: function(value) {
        this.setData(value);
      },
      deep: true,
    },
  },
  mounted() {
    this.form = {
      ...this.form,
      taskList: [],
      handler: {
        memberList: [],
        deptList: [],
        jobList: [],
        roleList: [],
      },
      ...this.defaultValue,
    };
    this.form.passType = this.form.passType.toString();
    this.taskList = this.form.taskList || [];
    this.memberList = this.form.handler.memberList || [];
    this.deptList = this.form.handler.deptList || [];
    this.jobList = this.form.handler.jobList || [];
    this.roleList = this.form.handler.roleList || [];
  },
  methods: {
    dataFormatter(data) {
      // 只处理最外层数据
      return data.map(item => ({ ...item, id: item.tableId, name: item.tableName }));
    },
    handleMemberChange(memberList) {
      this.form = { ...this.form, handler: { ...this.form.handler, memberList }};
    },
    handleTaskChange(taskList) {
      this.taskList = taskList;
      this.form = { ...this.form, taskList };
    },
    handleDepartmentChange(deptList) {
      this.deptList = deptList;
      this.form = { ...this.form, handler: { ...this.form.handler, deptList }};
    },
    handleJobChange(jobList) {
      this.jobList = jobList;
      this.form = { ...this.form, handler: { ...this.form.handler, jobList }};
    },
    handleRoleChange(roleList) {
      this.roleList = roleList;
      this.form = { ...this.form, handler: { ...this.form.handler, roleList }};
    },
    handleTypeChange(value) {
      if (value === "0") this.$refs["form"].clearValidate("handlerContent");
    },
    handleNameInput(e) {
      if (this.element) {
        this.modeler.get("modeling").updateProperties(this.element, {
          name: e,
        });
      }
    },
    setData(value) {
      this.$store.commit("workflow/setData", value);
    },
    reset() {
      this.$refs["form"].resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
#right-menu .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 18px;
    margin-left: -15px;
}
.btn-contoll .el-row{
    padding-left: 30px;
    padding-bottom: 5px;
}
.handler .el-collapse-item__content {
  padding:25px;
}
.node-postProportion{
  width: 190px;;
}
</style>
