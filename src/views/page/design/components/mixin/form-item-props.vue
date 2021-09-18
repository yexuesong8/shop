<script>
export default {
  name: "FormItemProps",
  props: {
    label: {
      type: String,
      default: "默认标签",
    },
    labelWidth: {
      type: [Number, String],
      default: "auto",
    },
    prop: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: [Object, Array],
      default: () => [],
    },
    error: {
      type: String,
      default: "String",
    },
    validateStatus: {
      type: String,
      default: "",
    },
    for: {
      type: String,
      default: "",
    },
    inlineMessage: {
      type: [String, Boolean],
      default: '',
    },
    showMessage: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: "",
    },
  },
};
</script>
