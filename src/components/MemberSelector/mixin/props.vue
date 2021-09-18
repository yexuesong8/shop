<script>
export default {
  name: "MemberProps",

  props: {
    /** 单选多选 */
    multiple: {
      type: Boolean,
      default: true,
    },

    /** 选择人员最大数量 */
    maxNumber: {
      type: Number,
      default: null,
    },

    /** 选中的数据 */
    value: {
      type: null,
      default: () => [],
    },

    /** 显示名称以及取值字段 */
    property: {
      type: Object,
      default: () => ({
        id: "id",
        name: "name",
      }),
    },
  },
};
</script>
