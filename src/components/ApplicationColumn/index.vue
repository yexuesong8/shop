<template>
  <el-table-column label="适用范围" prop="appId" v-bind="$attrs">
    <template v-slot="scope">
      <span>{{ dictFormatter('general_app', scope.row.appId) }}</span>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "ApplicationColumn",
};
</script>
