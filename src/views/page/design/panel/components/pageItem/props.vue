<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    isName: {
      type: String,
      default: "false",
    },
    required: {
      type: String,
      default: "false",
    },
    titleArrangement: {
      type: String,
      default: "row",
    },
  },
};
</script>
