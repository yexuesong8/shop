<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="80px">
    <el-form-item label="流程类型:">
      <el-input disabled :value="typeData.name" :maxlength="100" @input="handleNameInput" />
    </el-form-item>
    <el-form-item label="版本号:" prop="versionNum">
      <el-input v-model="form.versionNum" disabled />
    </el-form-item>
    <el-form-item label="修改次数:" prop="updateFrequency">
      <el-input v-model="form.updateFrequency" disabled />
    </el-form-item>
    <el-form-item label="表单:" prop="formId">
      <DropDownTreeSelector
        v-model="form.formId"
        source-type="uri"
        data-source-uri="/api/v1/rabbit/workflow/form/find/all"
        :formatter="(data) => data.map(item => ({ ...item, name: item.tableName, id: item.tableId }))"
        :property="{
          id: 'id',
          name: 'name',
          children: 'childList',
          key: 'id',
        }"
      />
    </el-form-item>
    <el-form-item label="适用部门:" prop="deptId">
      <DepartmentSelector v-model="form.deptId" />
    </el-form-item>
    <el-form-item label="描述:" prop="description">
      <!-- 描述限制1024 -->
      <el-input v-model="form.description" type="textarea" maxlength="1024" />
    </el-form-item>
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item title="任务" name="task">
        <TaskProperty element-type="process" :value="form.taskList" @change="handleTaskChange" />
      </el-collapse-item>
    </el-collapse>
    <el-collapse v-model="activeCopy" accordion>
      <el-collapse-item title="抄送" name="copy">
        <CopyProperty element-type="copy" :value="form.ccMemberList" :switch="switchVal" @change="handleCopyChange" @swith="handleCopySwith" />
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script>
import TaskProperty from "./property/task";
import CopyProperty from "./property/copy";
import { mapState } from "vuex";
import { get as getType } from "@/api/workflow/type";
import { DepartmentSelector } from "@/components";
import { DropDownTreeSelector } from "@monkey.do/monkey";

export default {
  name: "FormProperties",
  components: {
    TaskProperty,
    CopyProperty,
    DepartmentSelector,
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
    typeId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeCopy: [],
      activeNames: [],
      form: {},
      typeData: {},
      switchVal: false,
      rules: {
        formId: [{ required: true, message: "请选择表单" }],
      },
      taskList: [],
    };
  },
  computed: {
    ...mapState("workflow", {
      element: state => state.element,
    }),
  },
  watch: {
    typeId: {
      handler: function(value) {
        if (value) {
          getType({ id: value }).then(res => {
            if (res.statusCode === 600) {
              this.typeData = res.data || {};
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
    form: {
      handler: function(value) {
        this.setData(value);
      },
      deep: true,
    },
  },

  mounted() {
    this.switchVal = this.defaultValue.enabledCC === 1;
    this.form = { ...this.form, ...this.defaultValue };
  },
  provide() {
    return {
      form: this.form,
    };
  },
  methods: {
    handleNameInput(e) {
      if (this.element) {
        this.modeler.get("modeling").updateProperties(this.element, {
          name: e,
        });
      }
    },
    handleTaskChange(taskList) {
      this.form = { ...this.form, taskList };
    },
    handleCopyChange(ccMemberIdList) {
      this.form = { ...this.form, ccMemberIdList };
    },
    handleCopySwith(enabledCC) {
      if (enabledCC === false) {
        this.form.ccMemberIdList = [];
      }
      this.form = { ...this.form, enabledCC: enabledCC ? 1 : 0 };
    },
    setData(value) {
      this.$store.commit("workflow/setProcess", { ...value });
    },
  },
};
</script>
