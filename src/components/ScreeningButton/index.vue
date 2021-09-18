<template>
  <div class="rabbit-screening-button">
    <el-popover v-model="visibleControl" :placement="placement" :width="width" trigger="manual">
      <div class="rabbit-screening-button-content">
        <el-form ref="form" :model="modelForm" :label-width="labelWidth">
          <el-row :gutter="gutter">
            <el-col v-for="(item, index) in items" :key="index" :span="item.props.span || 12">
              <el-form-item :label="item.label ? `${item.label}：` : ''" v-bind="item.props" v-on="item.events">
                <FormItemComponent :component="getComponent(item.component)" :form.sync="modelForm" :prop="item.props.prop" v-bind="item.props" :model="modelForm[item.props.prop]" />
              </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align: right;">
              <el-button type="primary" :loading="loading" @click="handleConfirm">{{ searchText }}</el-button>
              <el-button @click="handleReset">{{ resetText }}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-button slot="reference" @click="handleScreeningSwitch">{{ screenText }}</el-button>
    </el-popover>
  </div>
</template>
<script>
import { isArray } from '@monkey.do/monkey';
import FormItemComponent from "./component/index";
export default {
  components: { FormItemComponent },
  // 相关配置
  props: {
    screenText: {
      type: String,
      default: "筛选",
    },
    searchText: {
      type: String,
      default: "确定",
    },
    resetText: {
      type: String,
      default: "重置",
    },
    trigger: {
      type: String,
      default: "manual",
    },
    placement: {
      type: String,
      default: "bottom-start",
    },
    width: {
      type: [String, Number],
      default: "800",
    },
    labelWidth: {
      type: String,
      default: "100px",
    },
    gutter: {
      type: Number,
      default: 16,
    },
    items: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    reset: {
      type: Function,
      default: () => {},
    },
    search: {
      type: Function,
      default: () => {},
    },
    searchReset: {
      type: Boolean,
      default: false,
    },
    searchClose: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modelForm: {},
      visibleControl: false,
    };
  },
  watch: {
    visible: {
      handler(val) {
        this.visibleControl = val;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleScreeningSwitch() {
      this.visibleControl = !this.visibleControl;
      this.$emit("update:visible", this.visibleControl);
    },
    handleConfirm() {
      this.search({ ...this.modelForm });
      if (this.searchClose) {
        this.visibleControl = false;
        this.$emit("update:visible", this.visibleControl);
      }
      if (this.searchReset) this.$refs["form"].resetFields();
    },
    handleReset() {
      this.$refs["form"].resetFields();
      this.reset();
    },
    getComponent(component, scope) {
      // 查询表单的查询按钮、重置按钮
      if (component.name === "button") {
        return this.getButtonProps(component);
      }
      // 禁用
      if (component.props && component.props.disabled && typeof component.props.disabled === "function") {
        component.props["disabled"] = component.props.disabled(scope);
      }
      return component;
    },
    getButtonProps(component) {
      return {
        ...component,
        props: {
          ...(component.props || {}),
          loading: this.loading,
          // search: this.search,
          // reset: this.reset,
        },
      };
    },
    // 设置form值
    setModelFormValue(value) {
      if (isArray(value)) {
        value.forEach(item => {
          if (item["prop"]) {
            this.$set(this.modelForm, item["prop"], item["value"]);
          }
        });
      } else {
        this.$set(this.modelForm, value["prop"], value["value"]);
      }
    },
  },
};
</script>
