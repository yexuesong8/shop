<script>
export default {
  name: "FormItemProps",
  props: {
    component: {
      type: Object,
      default: () => ({
        name: "el-input",
        props: {},
        events: {},
      }),
    },
    form: {
      type: Object,
      default: () => ({}),
    },
    prop: {
      type: String,
      default: "",
    },
    formatter: {
      type: Function,
      default: (value) => value,
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
