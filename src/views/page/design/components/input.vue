<template>
  <el-form-item :label="label" :label-width="labelWidth">
    <el-input :placeholder="placeholder" :type="type" />
  </el-form-item>
</template>

<script>
import FormItemProps from "./mixin/form-item-props";
import InputProps from "./mixin/input-props";

export default {
  name: "FormItemInput",
  mixins: [FormItemProps, InputProps],
  props: {
  },
};
</script>
