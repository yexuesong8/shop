<template>
  <el-collapse-item title="按钮控制" name="buttonControl">
    <el-row>
      支持转办 <el-switch v-model="form.enabledHandover" :active-value="1" :inactive-value="0" />
    </el-row>
    <el-row>
      支持会办 <el-switch v-model="form.enabledTogether" :active-value="1" :inactive-value="0" />
    </el-row>
    <el-row>
      支持跳转 <el-switch v-model="form.enabledJump" :active-value="1" :inactive-value="0" />
    </el-row>
    <el-row>
      支持退办 <el-switch v-model="form.enabledRetreat" :active-value="1" :inactive-value="0" />
    </el-row>
    <el-row>
      支持并行 <el-switch v-model="form.enabledParallel" :active-value="1" :inactive-value="0" />
    </el-row>
  </el-collapse-item>
</template>

<script>
export default {
  name: "ButtonControlProperty",
  inject: {
    form: {
      default: {},
    },
  },
};
</script>
