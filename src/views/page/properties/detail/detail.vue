<template>
  <!-- 新增&修改模态框 -->
  <Dialog
    v-if="visible"
    :title="title"
    :visible="visible"
    :loading="loading"
    @cancel="cancel"
    @confirm="submitForm"
  >
    <el-form ref="addForm" :model="addForm" :rules="rules" label-width="auto">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="组:" prop="groupId">
            <ListSelector :value="addForm.groupId" wants="id" data-source-uri="/api/v1/rabbit/page/property/group/find" source-type="uri" @change="handlerGroupId" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="代码:" prop="code">
            <el-input v-model="addForm.code" clearable placeholder="请输入代码" :maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称:" prop="name">
            <el-input v-model="addForm.name" clearable placeholder="请输入名称" :maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型:" prop="typeId">
            <el-select v-model="addForm.typeId" placeholder="请选择类型" @change="handleChange">
              <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编辑器:" prop="editor">
            <el-input v-model="addForm.editor" clearable placeholder="请输入编辑器" :maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认值:" prop="defaultValue">
            <el-input v-model="addForm.defaultValue" clearable placeholder="请输入默认值" :maxlength="200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="属性类型:" prop="propType">
            <dictionary-selector code="rabbit_page_designer_property_prop_type" :value="addForm.propType" @change="handlePropType" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否必填:" label-width="100">
            <el-switch v-model="addForm.required" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="选项值:">
        <el-input v-model="addForm.options" clearable type="textarea" placeholder="请输入选项值" :maxlength="1000" />
      </el-form-item>
      <el-form-item label="提示:">
        <el-input v-model="addForm.prompt" clearable type="textarea" placeholder="请输入提示" :maxlength="200" />
      </el-form-item>
      <el-form-item label="描述:">
        <el-input v-model="addForm.description" clearable type="textarea" placeholder="请输入描述" :maxlength="200" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import { findType } from "@/api/page/propertiesType";
import { addAttri, updateAttri } from "@/api/page/propertiesDetail";
import { DictionarySelector } from "@/components";

export default {
  name: "Detail",
  components: {
    DictionarySelector,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    componentId: {
      type: String,
      default: "",
    },
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      // 提交表单
      addForm: {
        componentId: this.componentId,
        typeId: '',
        editor: '',
        required: true,
        ...this.form,
      },
      // 属性类型
      typeList: [],
      // 新增表单验证
      rules: {
        code: [
          { required: true, message: "代码不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "属性名称不能为空", trigger: "blur" },
        ],
        groupId: [
          { required: true, message: "分组不能为空", trigger: "blur" },
        ],
        typeId: [
          { required: true, message: "属性类型不能为空", trigger: "blur" },
        ],
        editor: [
          { required: true, message: "编辑器不能为空", trigger: "blur" },
        ],
        defaultValue: [
          { required: true, message: "默认值不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getType();
  },
  methods: {
    // 查询属性类型
    async getType() {
      const { statusCode, data } = await findType();
      if (statusCode === 600) {
        this.typeList = data;
      }
    },
    // 取消
    cancel() {
      this.addForm = {
        componentId: this.componentId,
        required: true,
      };
      this.$emit("close");
    },
    // 类型改变
    handleChange(editor) {
      this.typeList.forEach(item => {
        if (editor === item.id) {
          this.addForm.editor = item.editor;
        }
      });
    },
    handlerGroupId(val) {
      this.addForm = { ...this.addForm, groupId: val };
    },
    handlePropType(val) {
      this.addForm = { ...this.addForm, propType: val };
    },
    // 新增&修改
    submitForm() {
      this.$refs["addForm"].validate(async(valid) => {
        if (valid) {
          this.loading = true;
          if (this.addForm.hasOwnProperty("id")) {
            const { statusCode } = await updateAttri({ ...this.addForm, required: this.addForm.required === true ? "1" : "0" });
            if (statusCode === 600) {
              this.msgSuccess("修改成功");
              this.$emit("update", this.componentId);
              this.$emit("close");
            }
          } else {
            const { statusCode } = await addAttri({ ...this.addForm, required: this.addForm.required === true ? "1" : "0" });
            if (statusCode === 600) {
              this.msgSuccess("新增成功");
              this.$emit("update", this.componentId);
              this.$emit("close");
            }
          }
          this.loading = false;
        }
      });
    },
  },
};
</script>
