<template>
  <div class="rabbit-detail-box">
    <el-button v-if="innerType === 'create' && showCreateButton && !$slots.create" type="primary" @click="onClick">新增</el-button>
    <slot name="create" />
    <Dialog
      v-if="innerVisible"
      :title="title"
      :visible="innerVisible"
      :loading="loading"
      v-bind="dialog.props || {}"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      v-on="dialog.events || {}"
    >
      <el-form
        ref="form"
        :model="modelForm"
        v-bind="form.props"
        v-on="form.events"
        @submit.native.prevent
      >
        <slot name="form" :form="modelForm" />
        <FormItems v-if="!$scopedSlots.form" :items="form.items" :form="modelForm" />
      </el-form>
      <template v-slot:footer>
        <slot name="footer" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import FormItems from "@/components/FormItems";
import { request } from "@/utils";
import { fieldsFilter } from "@/utils";
import { isArray } from '@monkey.do/monkey';

const ConsoleMessagePrefix = "[detail-form]:";

export default {
  name: "DetailForm",
  components: { FormItems },
  props: {
    /** 获取详情数据的id */
    id: {
      type: String,
      default: "",
    },
    /** 详情数据 */
    detail: {
      type: Object,
      default: () => ({}),
    },
    /** 详情框类型：update、create */
    type: {
      type: String,
      default: "create",
    },
    /** 新增标题 */
    createTitle: {
      type: String,
      default: "新增",
    },
    /** 修改标题 */
    updateTitle: {
      type: String,
      default: "修改",
    },
    /** form表单相关配置 */
    form: {
      type: Object,
      default: () => ({}),
    },
    /** dialog相关配置 */
    dialog: {
      type: Object,
      default: () => ({}),
    },
    /** 新增接口 */
    createApi: {
      type: String,
      default: "",
    },
    /** 更新接口 */
    updateApi: {
      type: String,
      default: "",
    },
    /** 获取详情数据接口 */
    detailApi: {
      type: String,
      default: "",
    },
    /** 更新数据的额外参数 */
    getDetailParams: {
      type: Object,
      default: () => ({}),
    },
    /** 默认参数 */
    defaultParams: {
      type: Object,
      default: () => ({}),
    },
    /** 详情数据处理 */
    detailFormatter: {
      type: Function,
      default: (detail) => detail,
    },
    /** 模态款的显示隐藏 */
    visible: {
      type: Boolean,
      default: false,
    },
    /** 新增成功提示消息 */
    createSuccessMessage: {
      type: String,
      default: "新增成功",
    },
    /** 修改成功提示消息 */
    updateSuccessMessage: {
      type: String,
      default: "修改成功",
    },
    /** 更新传递的字段 */
    submitFields: {
      type: Array,
      default: () => [],
    },
    /** 新增成功、修改成功 自动关闭 */
    autoClose: {
      type: Boolean,
      default: true,
    },
    /** 是否显示新增按钮 */
    showCreateButton: {
      type: Boolean,
      default: true,
    },
  },
  inject: {
    $page: {
      default: null,
    },
  },
  data() {
    return {
      modelForm: this.detail || {},
      loading: false,
      innerVisible: false,
      detailLoading: false,
      innerType: 'create',
    };
  },
  computed: {
    title() {
      return this.innerType === 'create' ? this.createTitle : this.updateTitle;
    },
  },
  watch: {
    id: {
      handler: function(value) {
        if (value && (this.updateApi || (this.$page && this.$page.api.update))) {
          this.getDetail(value);
        }
      },
      immediate: true,
    },
    visible: {
      handler: function(value) {
        this.innerVisible = !!value;
      },
      immediate: true,
    },
    type: {
      handler: function(value) {
        this.innerType = value;
      },
      immediate: true,
    },
  },
  methods: {
    getDetail(id, cb = () => {}) {
      if (this.detailLoading) return;
      this.detailLoading = true;
      return request({
        baseURL: "",
        url: this.detailApi || (this.$page && this.$page.api.get),
        data: { ...this.getDetailParams, id },
      }).then(res => {
        this.detailLoading = false;
        if (res.statusCode === 600) {
          this.modelForm = this.detailFormatter(res.data);
        }
        cb(res);
      });
    },
    async handleConfirm() {
      if (this.innerType === "create") {
        this.handleCreate();
      } else if (this.innerType === 'update') {
        this.handleUpdate();
      }
    },
    handleCancel() {
      this.$emit("update:visible", false);
      this.innerVisible = false;
      this.$emit("cancel");
      this.modelForm = {};
      this.$refs["form"].resetFields();
    },
    onClick() {
      this.innerVisible = true;
      this.$emit("detailFormCreate");
    },
    async handleCreate() {
      if (!this.createApi && !(this.$page && this.$page.api.create)) {
        console.error(`${ConsoleMessagePrefix}请传入createApi`);
      } else {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.$emit("beforeSubmit", this.modelForm);
            this.loading = true;
            const params = this.submitFields.length ? fieldsFilter(this.modelForm, this.submitFields) : this.modelForm;
            request({
              baseURL: "",
              url: this.createApi || this.$page.api.create,
              data: { ...this.defaultParams, ...params },
            }).then(res => {
              this.$emit("afterSubmit", res);
              if (res.statusCode === 600) {
                this.submitSuccess(this.type, res);
              }
            }).finally(() => {
              this.loading = false;
            });
          }
        });
      }
    },
    async handleUpdate() {
      if (!this.updateApi && !(this.$page && this.$page.api.update)) {
        console.error(`${ConsoleMessagePrefix}请传入updateApi`);
      } else {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.$emit("beforeSubmit", this.modelForm);
            this.loading = true;
            const params = this.submitFields.length ? fieldsFilter(this.modelForm, this.submitFields) : this.modelForm;
            request({
              baseURL: "",
              url: this.updateApi || (this.$page && this.$page.api.update),
              data: { ...this.defaultParams, ...params },
            }).then(res => {
              this.$emit("afterSubmit", res);
              if (res.statusCode === 600) {
                this.submitSuccess(this.innerType, res);
              }
            }).finally(() => {
              this.loading = false;
            });
          }
        });
      }
    },
    submitSuccess(type, res) {
      this.$message.success(type === 'create' ? this.createSuccessMessage : this.updateSuccessMessage);
      this.$emit("success", type, res);
      if (this.autoClose) this.handleCancel();
      if (this.$page) this.$page.refresh(type === 'create' ? 1 : '');
    },
    setModleFormValue(value) {
      if (isArray(value)) {
        value.forEach(item => {
          if (item["prop"]) {
            this.modelForm[item["prop"]] = item["value"];
          }
        });
      } else {
        this.modelForm[value["prop"]] = value["value"];
      }
    },
    getForm() {
      return this.$refs["form"];
    },
    show(detail) {
      this.modelForm = { ...this.detail, ...detail };
      this.innerVisible = true;
      this.$emit("detailFormShow", this.modelForm);
    },
    hide() {
      this.innerVisible = false;
      this.$emit("detailFormHide", this.modelForm);
    },
    load(id, cb) {
      if (!id) {
        console.error(`${ConsoleMessagePrefix}没有详情数据id值`);
        return;
      }
      this.innerType = 'update';
      this.getDetail(id, cb);
    },
    setType(type) {
      this.innerType = type;
    },
  },
};
</script>
