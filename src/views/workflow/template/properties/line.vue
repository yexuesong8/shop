<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="名称:">
      <el-input v-model.trim="form.name" type="text" :maxlength="50" @input="handleNameInput" />
    </el-form-item>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="条件" name="condition">
        <el-form-item label="条件类型:" prop="conditionType">
          <DictionarySelector :value.sync="form.conditionType" code="rabbit_workflow_path_condition_type" @change="handleValidateConditionType" />
        </el-form-item>
        <el-form-item label="执行内容:" prop="conditionContent">
          <el-input v-model="form.conditionContent" type="textarea" :maxlength="500" />
        </el-form-item>
      </el-collapse-item>
      <el-collapse-item title="转换规则" name="rules">
        <el-form-item label="转换类型:" prop="dataConvertType">
          <DictionarySelector :value.sync="form.dataConvertType" code="rabbit_workflow_path_data_convert_type" @change="handleValidateDataConvertType" />
        </el-form-item>
        <el-form-item label="转换内容:" prop="dataConvertContent">
          <el-input v-model="form.dataConvertContent" type="textarea" :maxlength="500" />
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
    <el-row class="mt20">
      <el-form-item label="描述:">
        <el-input v-model="form.description" type="textarea" :maxlength="500" />
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script>
import { DictionarySelector } from "@/components";
import { mapState } from "vuex";

export default {
  name: "LineProperties",
  components: { DictionarySelector },
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
      form: {
        conditionType: "0",
        dataConvertType: "0",
      },
      defaultRules: {
      },
      activeNames: ["condition", "rules"],
    };
  },
  computed: {
    ...mapState("workflow", {
      element: state => state.element,
    }),
    rules: {
      get() {
        const conditionContent = Number(this.form.conditionType) > 0 ? { conditionContent: [{ required: true, message: "请填写条件执行内容" }] } : {};
        const dataConvertContent = Number(this.form.dataConvertType) > 0 ? { dataConvertContent: [{ required: true, message: "请填写自定义办理人执行内容" }] } : {};
        return { ...this.defaultRules, ...conditionContent, ...dataConvertContent };
      },
    },
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
    this.form = { ...this.form, ...this.defaultValue };
  },
  methods: {
    handleNameInput(e) {
      if (this.element) {
        this.modeler.get("modeling").updateProperties(this.element, {
          name: e,
        });
      }
    },
    handleValidateConditionType(value) {
      if (value === "0") this.$refs["form"].clearValidate("conditionContent");
    },
    handleValidateDataConvertType(value) {
      if (value === "0") this.$refs["form"].clearValidate("dataConvertContent");
    },
    setData(value) {
      this.$store.commit("workflow/setData", value);
    },
  },
};
</script>
