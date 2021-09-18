<script>
export default {
  name: "ColumnsFilterProps",
  props: {
    data: {
      type: Array,
      default: () => [],
      required: true,
    },
    maxHeight: {
      type: String,
      default: "365px",
    },
    hasCheckedAll: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      default: "",
    },
  },
};
</script>
