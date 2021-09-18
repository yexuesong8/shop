<script>
export default {
  name: "HeaderMixProps",
  props: {
    title: {
      type: String,
      default: "",
    },
    maxlength: {
      type: [String, Number],
      default: 10,
    },
    placeholder: {
      type: String,
      default: '请输入分类名称',
    },
    createApi: {
      required: true,
      type: String,
    },
    property: {
      type: Object,
      default: () => ({
        label: "name",
        children: "childList",
      }),
    },
  },
};
</script>
