<template>
  <el-form ref="form" :model="form" v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <slot :search="search" :reset="reset" :form="form" :loading="loading" />
  </el-form>
</template>

<script>
export default {
  name: "FindForm",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {},
    };
  },
  methods: {
    search() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$emit("search", this.form);
        }
      });
    },
    reset() {
      this.form = {};
      this.$refs["form"].resetFields();
      this.$emit("reset");
    },
  },
};
</script>
