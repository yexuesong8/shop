<template>
  <el-button type="text" v-bind="$attrs" @click="handleDelete" v-on="$listeners">删除</el-button>
</template>
<script>
import PageDelete from "@/components/Page/delete";
export default {
  name: "PageListDeleteHandler",
  mixins: [PageDelete],
  // props: {
  //  handler: {
  //   type: Object,
  //   default: () => ({
  //    props: {},
  //   }),
  //   required: true,
  //  },
  // },
  // watch: {
  //  handler: {
  //   handler(value) {
  //    console.log(value, "delete");
  //   },
  //   deep: true,
  //   immediate: true,
  //  },
  // },
};
</script>
