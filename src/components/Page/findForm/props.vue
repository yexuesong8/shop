<script>
export default {
  props: {
    hasFilter: {
      type: Boolean,
      default: true,
    },
    searchParamsFormatter: {
      type: Function,
      default: (params) => params,
    },
  },
};
</script>
