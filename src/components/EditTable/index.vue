<template>
  <div class="rabbit-edit-table">
    <div class="rabbit-edit-table-handles mb10">
      <el-button v-if="isTopCreate" type="primary" @click="add">{{ createText }}</el-button>
      <slot name="editTableHandles" :data="{...this}" />
    </div>
    <el-table :data="tableLists">
      <el-table-column v-for="(item, index) in form.items" :key="index" v-bind="item.props" :label="item.label">
        <template slot-scope="scope">
          <el-form v-if="(item.isEdit || item.isEdit === undefined) ? scope.row.handle : scope.row.add" :ref="`form${scope.$index}`" :model="modelForm[scope.$index]" v-bind="form.props" v-on="form.events" @submit.native.prevent>
            <FormItem :form="modelForm[scope.$index]" :scope="scope" :data="item" :component="getComponent(item.component, scope)" :props="getItemProps(item)" :events="getItemEvents(item)" />
          </el-form>
          <span v-else>{{ item.formatter ? item.formatter(scope) : scope.row[item.props.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="hasHandle" :label="handleText" width="100px" :fixed="handleFixedMode">
        <template slot-scope="scope">
          <el-button v-if="(scope.row.handle || scope.row.add) && buttons.includes('save')" :loading="loading" :disabled="scope.row.saveDisabled" type="text" @click="save(scope)">{{ saveText }}</el-button>
          <el-button v-if="scope.row.handle && !scope.row.add && buttons.includes('cancel')" :loading="loading" :disabled="scope.row.cancelDisabled" type="text" @click="cancel(scope)">{{ cancelText }}</el-button>
          <el-button v-if="!scope.row.handle && !scope.row.add && buttons.includes('update')" :loading="loading" :disabled="scope.row.updateDisabled" type="text" @click="update(scope)">{{ updateText }}</el-button>
          <el-popconfirm v-if="(!scope.row.handle || scope.row.add) && buttons.includes('delete')" confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" :title="deleteTitle" @confirm="deleteData(scope)">
            <el-button slot="reference" :loading="loading" :disabled="scope.row.deleteDisabled" type="text">{{ deleteText }}</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="hasHandle && isBottomCreate" class="add">
      <el-button icon="el-icon-plus" class="btn" @click="add">{{ createText }}</el-button>
    </div>
  </div>
</template>
<script>
import FormItem from "./FormItem";
import { isArray } from '@monkey.do/monkey';
export default {
  name: "EditTable",
  components: { FormItem },
  props: {
    /** form表单相关配置 */
    isApi: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => ({}),
    },
    detail: {
      type: Array,
      default: () => [],
    },
    buttons: {
      type: [Array, String],
      default: () => ["cancel", "save", "update", "delete"],
    },
    hasHandle: {
      type: Boolean,
      default: true,
    },
    isBottomCreate: {
      type: Boolean,
      default: true,
    },
    isTopCreate: {
      type: Boolean,
      default: false,
    },
    createMode: {
      type: String,
      default: "bottom",
    },
    handleFixedMode: {
      type: [String, Boolean],
      default: "right",
    },
    deleteMethod: {
      type: Function,
      default: () => { },
    },
    createMethod: {
      type: Function,
      default: () => { },
    },
    createClick: {
      type: Function,
      default: () => { },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    saveText: {
      type: String,
      default: "保存",
    },
    updateText: {
      type: String,
      default: "修改",
    },
    deleteText: {
      type: String,
      default: "删除",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    createText: {
      type: String,
      default: "新增",
    },
    handleText: {
      type: String,
      default: "操作",
    },
    deleteTitle: {
      type: String,
      default: "是否要删除此行？",
    },
    beforeCreate: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      modelForm: [],
      editData: {},
      tableLists: [],
    };
  },
  watch: {
    detail: {
      handler(value) {
        this.tableLists = JSON.parse(JSON.stringify(value));
        this.modelForm = JSON.parse(JSON.stringify(value));
      },
      deep: true,
      immediate: true,
    },
    modelForm: {
      handler(value) {
        this.tableLists = [...value];
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 新增一行
    add() {
      if (this.beforeCreate(this.modelForm) === false) return;
      if (isArray(this.form.items)) {
        const obj = { add: true, handle: true };
        this.form.items.forEach(item => {
          if (item.props.prop) {
            obj[item.props.prop] = "";
          }
        });
        if (this.createMode === "top") {
          this.tableLists.unshift(obj);
          this.modelForm.unshift(obj);
        } else {
          this.tableLists.push(obj);
          this.modelForm.push(obj);
        }
        console.log(this.modelForm, 8818181);
        this.createClick({
          index: this.modelForm.length - 1,
          self: this,
          setFormValue: this.setModleFormValue,
        });
      }
    },
    // 编辑 保存一份修改前数据
    update(scope) {
      this.$set(this.editData, scope.$index, JSON.parse(JSON.stringify(scope.row)));
      this.$set(scope.row, "handle", true);
      this.$set(scope.row, "add", false);
    },
    // 保存
    save(scope) {
      const validFlag = [];
      for (let i = 0; i < this.$refs[`form${scope.$index}`].length; i++) {
        this.$refs[`form${scope.$index}`][i].validate(valid => {
          validFlag.push(valid);
        });
      }
      // 验证通过
      if (!validFlag.includes(false)) {
        if (this.isApi) {
          this.createMethod(this.modelForm, scope.$index, () => {
            this.$set(this.tableLists, scope.$index, this.modelForm[scope.$index]);
            this.$set(scope.row, "handle", false);
            this.$set(scope.row, "add", false);
          });
        } else {
          this.$set(this.tableLists, scope.$index, this.modelForm[scope.$index]);
          this.$set(scope.row, "handle", false);
          this.$set(scope.row, "add", false);
          this.$emit("confirm", { data: this.modelForm, index: scope.$index });
        }
      }
    },
    // 取消修改 把原数据赋值回去
    cancel(scope) {
      this.$set(this.tableLists, scope.$index, this.editData[scope.$index]);
      this.$set(this.modelForm, scope.$index, this.editData[scope.$index]);
      this.$set(scope.row, "handle", false);
    },
    // 删除一行
    deleteData(scope) {
      if (this.isApi) {
        this.deleteMethod(this.modelForm, scope.$index, () => {
          this.tableLists.splice(scope.$index, 1);
          this.modelForm.splice(scope.$index, 1);
        });
      } else {
        this.tableLists.splice(scope.$index, 1);
        this.modelForm.splice(scope.$index, 1);
        this.$emit("delete", { data: this.modelForm, index: scope.$index });
      }
    },
    getItemProps(item) {
      return item.props || {};
    },
    getItemEvents(item) {
      return item.events || {};
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
          search: this.search,
          reset: this.reset,
        },
      };
    },
    // 设置form值
    setModleFormValue(value) {
      if (isArray(value)) {
        value.forEach(item => {
          if (item["prop"]) {
            this.$set(this.modelForm[item["index"]], item["prop"], item["value"]);
          }
        });
      } else {
        this.$set(this.modelForm[value["index"]], value["prop"], value["value"]);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.add {
  padding: 9px 24px;
  border-bottom: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  border-left: 1px solid #e8e8e8;
  .btn {
    width: 100%;
    border: 2px dotted #e8e8e8;
  }
}
/deep/.el-table__fixed-right::before, .el-table__fixed::before{
  content: "";
  height: 0;
}
</style>
