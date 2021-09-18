<template>
  <el-collapse-item title="超时处理" name="timeout">
    开启超时时间处理: <el-switch v-model="form.enabledTimeout" :active-value="1" :inactive-value="0" />
    <el-row v-show="form.enabledTimeout">
      <el-form-item label="时间类型:" prop="timeoutType">
        <dictionary-selector :value.sync="form.timeoutType" code="rabbit_workflow_node_timeout_type" />
      </el-form-item>
      <el-form-item label="时长:" prop="timeoutLength">
        <el-input v-model="form.timeoutLength" oninput="value=value.replace(/[^\d]/g,'')" placeholder="时长" :maxlength="9" />
      </el-form-item>
      <el-form-item label="操作" prop="timeoutOperation">
        <dictionary-selector :value.sync="form.timeoutOperation" code="rabbit_workflow_node_timeout_operation" />
      </el-form-item>
    </el-row>
  </el-collapse-item>
</template>

<script>
import { DictionarySelector } from "@/components";

export default {
  name: "TimeoutProperty",
  components: { DictionarySelector },
  inject: {
    form: {
      default: {},
    },
  },
  watch: {
    form: {
      handler: function(value) {
        this.$emit("change", value);
      },
      deep: true,
    },
  },
};
</script>
