<script>
export default {
  props: {
    isSelectWhenClick: {
      type: Boolean,
      default: true,
    },
    dbClickShowDetailForm: {
      type: Boolean,
      default: true,
    },
    cellMenus: {
      type: Array,
      default: () => [],
    },
    sortFields: {
      type: Array,
      default: () => [],
    },
    sortType: {
      type: String,
      default: 'multiple',
    },
    /** 是否显示分页 */
    isShowPagination: {
      type: Boolean,
      default: true,
    },
    /** 是否为分页接口 */
    hasPagination: {
      type: Boolean,
      default: true,
    },
    dataBack: {
      type: Function,
      default: (res) => res,
    },
    /** 返回数据处理 */
    dataFormatter: {
      type: Function,
      default: (data) => data,
    },
    /** 列表数据处理 */
    listFormatter: {
      type: Function,
      default: (list) => list,
    },
    listKey: {
      type: String,
      default: "id",
    },
    isFetch: {
      type: [Boolean, Function],
      default: true,
    },
    // 固定table
    fixedTable: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
