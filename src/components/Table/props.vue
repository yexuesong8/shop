<script>
export default {
  name: "TableProps",

  props: {
    api: {
      type: String,
      required: true,
    },
    /** 查询参数 */
    params: {
      type: Object,
      default: () => ({}),
    },
    /** 初始化时不进行查询 */
    initNoFetch: {
      type: Boolean,
      default: false,
    },
    /** 返回数据处理 */
    dataHandler: {
      type: Function,
      default: (data) => data,
    },
  },
};
</script>
