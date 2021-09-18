<template>
  <el-collapse-item title="自定义办理人" name="define-member">
    <el-form-item label="办理人类型:" prop="handlerType">
      <dictionary-selector :value.sync="form.handlerType" code="rabbit_workflow_node_handler_type" @change="handleTypeChange" />
    </el-form-item>
    <el-form-item label="执行内容:" prop="handlerContent">
      <el-input v-model="form.handlerContent" type="textarea" :maxlength="500" />
    </el-form-item>
  </el-collapse-item>
</template>

<script>
import { DictionarySelector } from "@/components";

export default {
  name: "DefineMemberProperty",
  components: { DictionarySelector },
  inject: {
    parent: {
      default: null,
    },
    form: {
      default: null,
    },
  },
  methods: {
    handleTypeChange(value) {
      if (value === "0") this.parent.$refs["form"].clearValidate("handlerContent");
    },
  },
};
</script>
