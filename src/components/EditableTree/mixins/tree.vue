<script>
export default {
  name: "TreeMixProps",
  props: {
    listApi: {
      type: String,
      default: "",
      required: true,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    createApi: {
      type: String,
      default: "",
    },
    updateApi: {
      type: String,
      default: "",
    },
    deleteApi: {
      type: String,
      default: "",
    },
    sortApi: {
      type: String,
      default: "",
    },
    formatter: {
      type: Function,
      default: data => data,
    },
    maxLength: {
      type: [String, Number],
      default: 10,
    },
    createSuccessText: {
      type: String,
      default: '新增成功',
    },
    updateSuccessText: {
      type: String,
      default: '更新成功',
    },
    deleteSuccessText: {
      type: String,
      default: '删除成功',
    },
    sortSuccessText: {
      type: String,
      default: "保存成功",
    },
    isEditable: {
      type: Boolean,
      default: true,
    },
    isCreatable: {
      type: Boolean,
      default: true,
    },
    isDeletable: {
      type: Boolean,
      default: true,
    },
    isSortable: {
      type: Boolean,
      default: true,
    },
    property: {
      type: Object,
      default: () => ({
        label: "name",
        children: "childList",
      }),
    },
    createParamsFormatter: {
      type: Function,
      default: null,
    },
    updateParamsFormatter: {
      type: Function,
      default: null,
    },
    deleteParamsFormatter: {
      type: Function,
      default: null,
    },
    sortParamsFormatter: {
      type: Function,
      default: null,
    },
    isAllButton: {
      type: Boolean,
      default: true,
    },
    allButtonText: {
      type: String,
      default: "全部",
    },
  },
};
</script>
