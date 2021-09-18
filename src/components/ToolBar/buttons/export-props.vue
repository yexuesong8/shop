<script>
export default {
  name: "ExportProps",
  props: {
    api: {
      type: String,
      default: "",
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    onFail: {
      type: Function,
      default: () => {},
    },
    hide: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
