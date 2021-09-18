<template>
  <div class="options-detail">
    <el-button type="primary" @click="handleAddOption">新增选项</el-button>
    <Dialog title="新增选项" width="960px" :visible="visible" :loading="loading" @cancel="handleOptionCancel" @confirm="submitFormOption">
      <el-form ref="form" :inline="true" :model="field" label-width="auto">
        <el-row class="mb10">
          <el-button class="fr" type="primary" @click="handleAddFieldItem">新增</el-button>
        </el-row>
        <el-row v-for="(item, index) in optionList" :key="index">
          <el-row>
            <el-col :span="8">
              <el-form-item label="名称" :prop="`name${index}`" :rules="[{ required: true, message: '请填写字段名称', trigger: 'blur' }]">
                <el-input
                  v-model="item.name"
                  placeholder="请输入名称"
                  clearable
                  :maxlength="50"
                  @input="(e) => handleInputChange(e, `name${index}`)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="代码" :prop="`code${index}`" :rules="[{ required: true, message: '请填写字段代码', trigger: 'blur' }]">
                <el-input
                  v-model="item.code"
                  placeholder="请输入代码"
                  clearable
                  :maxlength="50"
                  @input="(e) => handleInputChange(e, `code${index}`)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="值" :prop="`content${index}`" :rules="[{ required: true, message: '请填写值', trigger: 'blur' }]">
                <el-input
                  v-model="item.content"
                  placeholder="请输入值"
                  clearable
                  :maxlength="50"
                  @input="(e) => handleInputChange(e, `content${index}`)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="上级选项" :prop="`parentCode${item}`">
                <el-select v-model="item['parentCode']" clearable>
                  <el-option v-for="(itemValue, keyValue) in parentOptions" :key="keyValue" :value="itemValue.code" :label="itemValue.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" :prop="`remark${item}`">
                <el-input
                  v-model="item.remark"
                  placeholder="请输入备注"
                  clearable
                  :maxlength="50"
                  @input="(e) => handleInputChange(e, `remark${item}`)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排序" :prop="`sortNumber${item}`">
                <el-input-number
                  v-model="item.sortNumber"
                  controls-position="right"
                  :min="0"
                  @input="(e) => handleInputChange(e, `sortNumber${item}`)"
                />
              </el-form-item>
              <el-form-item v-if="index !== 0">
                <el-button type="primary" @click="() => handleRmFieldItem(index)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import { Dialog } from '@monkey.do/monkey';

export default {
  name: 'DictionaryOptions',
  components: {
    Dialog,
  },
  props: {
    id: {
      type: String,
      default: "",
      required: true,
    },
  },
  data() {
    return {
      field: {},
      visible: false,
      optionList: [{ name: undefined, content: undefined }],
      parentOptions: [],
      loading: false,
      parentCode: "",
    };
  },

  watch: {
    id: {
      handler: function(value) {
        if (value) {
          this.$request("rabbit.system.data.getParentOption", { data: { dictionaryId: value }}).then(res => {
            if (res.statusCode === 600) {
              this.parentOptions = res.data;
            }
          });
        }
      },
      immediate: true,
    },
  },

  methods: {
    handleAddOption() {
      this.visible = true;
    },

    handleAddFieldItem() {
      this.optionList.push({ name: undefined, content: undefined });
    },

    handleRmFieldItem(key) {
      this.optionList = this.optionList.filter((item, index) => index !== key);
      Reflect.deleteProperty(this.field, `name${key}`);
      Reflect.deleteProperty(this.field, `code${key}`);
    },

    handleInputChange(value, item) {
      this.field = { ...this.field, ...{ [item]: value }};
    },

    handleParentIdChange(value, item) {
      this.field = { ...this.field, ...{ [item]: value }};
    },

    // 选项添加
    submitFormOption() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$request("rabbit.system.option.addOptionList", { data: { optionList: this.optionList, dictionaryId: this.id }}).then((response) => {
            this.loading = false;
            if (response.statusCode === 600) {
              this.msgSuccess('新增成功');
              this.handleOptionCancel();
              this.$emit("submitSuccess");
            }
          });
        }
      });
    },
    handleOptionCancel() {
      this.visible = false;
      // 重置参数
      this.optionList = [{ name: undefined, content: undefined }];
      this.field = {};
      this.$refs['form'].resetFields();
    },
  },
};
</script>
