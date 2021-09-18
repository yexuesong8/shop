<template>
  <Dialog
    v-if="dialogVisible"
    class="cus-dialog-container"
    :title="title"
    :visible.sync="dialogVisible"
    :loading="loading"
    append-to-body
    @close="close"
    @cancel="close"
    @confirm="submit"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="auto">
      <el-row :gutter="48">
        <el-col :span="24">
          <el-form-item label="模板名称" prop="templateName">
            <el-input v-model="form.templateName" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" type="textarea" rows="5" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="选择目录" prop="parentId">
            <DropDownTreeSelector
              v-if="dialogVisible"
              v-model="form.parentId"
              data-source-uri="/api/v1/rabbit/system/action/find/all/tree"
              source-type="uri"
              :formatter="menuTreeFormat"
              :property="{ id: 'id', key: 'id', name: 'name', children: 'children' }"
              :default-expand-all="false"
              :default-expanded-keys="['0']"
              @change="handleParentIdChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路由地址:" prop="path">
            <el-input v-model="form.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示状态:" prop="visible">
            <el-radio-group v-model="form.visible">
              <el-radio v-for="item in visibleOptions" :key="item.key" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <ApplicationItem :value.sync="form.appId" />
        </el-col>
      </el-row>
    </el-form>
  </Dialog>
</template>

<script>
import { Dialog, DropDownTreeSelector } from "@monkey.do/monkey";
import { menuTreeFormatter } from "@/utils/index";
import { ApplicationItem } from "@/components";

export default {
  inject: {
    getTemplateInfo: {
      default: () => {},
    },
  },
  components: {
    Dialog,
    DropDownTreeSelector,
    ApplicationItem,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    menu: {
      type: null,
      default: "",
    },
  },
  data() {
    return {
      dialogVisible: this.visible,
      form: {
        visible: 1,
        // component: "",
        pageType: 3, // 页面类型
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'change' }],
        path: [{ required: true, message: '路由地址不能为空', trigger: 'change' }],
        appId: [{ required: true, message: "适用范围不能为空", trigger: 'change' }],
        parentId: [{ required: true, message: "上级菜单不能为空", validate: this.validateParentId, trigger: 'change' }],
        templateName: [{ required: true, message: "模板名称不能为空", trigger: "change" }],
        description: [{ required: true, message: "模板描述不能为空", trigger: "change" }],
      },
      // 显示状态数据字典
      visibleOptions: [
        { id: 1, value: 1, label: "显示" },
        { id: 0, value: 0, label: "隐藏" },
      ],
    };
  },
  computed: {
    detail() {
      return this.getTemplateInfo();
    },
  },
  watch: {
    dialogVisible(value) {
      if (!value) {
        Object.keys(this.form).forEach(item => {
          this.form[item] = undefined;
        });
        this.$emit('update:visible', false);
      } else {
        const { name, description } = this.detail;
        this.form = { ...this.form, templateName: name, description };
        if (this.detail && this.detail.menu) {
          this.form = { ...this.form, ...JSON.parse(JSON.stringify(this.detail.menu)) };
        }
      }
    },
    visible: {
      handler(value) {
        this.dialogVisible = value;
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.dialogVisible = false;
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$emit("on-submit", this.form);
        }
      });
    },
    handleParentIdChange(value) {
      this.$set(this.form, "parentId", value);
      this.$refs["form"].validateField("parentId");
    },
    menuTreeFormat(value) {
      const menus = menuTreeFormatter(value, "menu", "sortNumber") || [];
      return [{ name: "根目录", id: "0", children: menus }];
    },
    validateParentId(rules, value, callback) {
      if (!this.form.parentId || this.form.parentId === 0) {
        callback();
      } else {
        callback(new Error("请选择上级菜单"));
      }
    },
  },
};
</script>
