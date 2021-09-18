<template>
  <el-form-item v-if="!data.hideItem" :label="props.label ? `${props.label}：` : ''" v-bind="props" v-on="events">
    <FormItemComponent :component="component" :provide-custom-data="provideCustomData" :form.sync="form" :data="data" :prop="props.prop" v-bind="props" :model="form[props.prop]" />
  </el-form-item>
  <FormItemComponent v-else :component="component" :provide-custom-data="provideCustomData" :form.sync="form" :data="data" :prop="props.prop" v-bind="props" :model="form[props.prop]" />
</template>

<script>
import FormItemComponent from "./component/index";

export default {
  name: "FormItem",
  components: { FormItemComponent },
  model: {
    prop: "form",
    event: "change",
  },
  props: {
    component: {
      type: Object,
      default: () => ({
        name: "el-input",
        props: {},
        events: {},
      }),
    },
    props: {
      type: Object,
      default: () => ({}),
    },
    events: {
      type: Object,
      default: () => ({}),
    },
    form: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    provideCustomData: {
      type: null,
      default: "",
    },
  },
};
</script>
