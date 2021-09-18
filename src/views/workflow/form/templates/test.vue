<template>
  <el-form label-width="auto">
    <el-form-item label="测试0">
      <el-input />
    </el-form-item>
    <el-form-item label="测试1">
      <el-select :value="1">
        <el-option :value="1">测试1</el-option>
        <el-option :value="2">测试2</el-option>
        <el-option :value="3">测试3</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="测试2">
      <el-input type="textarea" />
    </el-form-item>
    <el-form-item label="测试3">
      <el-date-picker />
    </el-form-item>
  </el-form>
</template>
