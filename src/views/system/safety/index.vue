<template>
  <div class="main-content-container full-fill">
    <Page
      ref="page"
      base-api="/api/v1/rabbit/system/role"
      :toolbar-buttons="[
        { type: 'auth-button', props: { code: '733690157324042240', type:'primary'}, },
        { type: 'auth-button', props: { code: '733690157307265024', disabled: !selectedRows.length}, },
        'refresh',
      ]"
      :table="{
        'fixed-table': true,
        events: {
          'selection-change': handleSelectionChange,
        },
        props:{
          border:true,
        },
        columns: [
          { type: 'selection', align: 'center' },
          { label: '角色名称', prop: 'name', width:'260px' },
          { label: '适用范围', prop: 'appId', htmlFormatter: ({ row }) => `<span>${dictFormatter('general_app', row.appId)}</span>`, width:'200px' },
          { label: '创建时间', prop: 'createTime', formatter: (row) => parseTime(row.createTime)},
          {
            label: '操作',
            type: 'handlers',
            handlers: [
              { type: 'button', label: '修改', events: { click: handleUpdate } },
              { type: 'delete', props: { type: 'button',confirmMessageFormatter: (row) => ({ title: '删除', message: `确定要删除${row.name}吗?` })} },
            ],
          },
        ]
      }"
    />
  </div>
</template>
<script>
// import EditTable from "@/components/EditTable/index.vue";
const initForm = {
  id: undefined,
  name: undefined,
  roleKey: undefined,
  status: 1,
  actionList: [],
  deptIds: [],
  remark: undefined,
  appId: undefined,
};
export default {
  name: "Safety",
  // components: { EditTable },
  data() {
    return {
      // 遮罩层
      submitLoading: false,
      // 是否显示弹出层
      visible: false,
      // 表单参数
      form: { ...initForm },
      // 角色下面的成员列表
      memberList: [],
      selectedRows: [], // 当前选中行
      // 表单校验
      rules: {
        name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
        appId: [{ required: true, message: "适用范围不能为空", trigger: "blur" }],
      },
      dispatchVisible: false, // 人员分配
      roleId: "", // 当前点击角色ID
      roleMenuVisible: false,
      roleMenuLoading: false,
      type: "add",
    };
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },
    /** 修改按钮操作 */
    handleUpdate(data) {
      this.type = "update";
      this.visible = true;
      this.form = { ...data.row };
    },
    // 批量删除——在auth-button使用
    handleBatchDelete() {
      this.$doingConfirm({ title: "删除角色", message: "确定要删除此角色吗?" })
        .then(() => {
          const ids = this.selectedRows.map(item => item.id);
          this.$request("rabbit.role.batchDel", { data: { roleList: ids }}).then((res) => {
            if (res.statusCode === 600) {
              this.msgSuccess("删除成功");
              this.$refs["page"].refresh(1);
            }
          });
        });
    },
  },
};
</script>

