<template>
  <!-- 系统管理-角色管理 -->
  <div class="main-content-container full-fill">
    <Page
      ref="page"
      base-api="/api/v1/rabbit/system/role"
      :toolbar-buttons="[
        { type: 'auth-button', props: { code: '733690157324042240', type:'primary'}, },
        { type: 'auth-button', props: { code: '733690157307265024', disabled: !selectedRows.length}, },
        'refresh',
      ]"
      :form="{
        props: {
          'label-width': 'auto',
        },
        items: [
          { component: { name: 'el-input', props: { placeholder: '请输入角色名称', maxlength: '20', clearable: true } }, span: 6, props: { label: '角色名称', prop: 'name' },},
          { component: { name: 'application-item' }, hideItem: true, span: 6, props: {prop: 'appId'}},
          { component: { name: 'list-selector', props: { wants: 'id', clearable: true, 'json-data': [{id: '1', name: '启用'}, { id: '0', name: '停用' }], 'source-type': 'json' } }, span: 6, props: { label: '状态', prop: 'status' } },
          { component: { name: 'button' }, span: 5 },
        ],
      }"
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
          { label: '状态', type: 'component' ,component: statusComponent, width:'120px'},
          { label: '创建时间', prop: 'createTime', formatter: (row) => parseTime(row.createTime)},
          {
            label: '操作',
            type: 'handlers',
            handlers: [
              { type: 'auth-button', props: { code: '814536992128761856', type: 'text' } },
              { type: 'button', label: '功能授权', events: { click: handleDispatchMenu } },
              { type: 'button', label: '分配人员', events: { click: handleDispatchMember } },
              { type: 'button', label: '修改', events: { click: handleUpdate } },
              { type: 'delete', props: { type: 'button',confirmMessageFormatter: (row) => ({ title: '删除', message: `确定要删除${row.name}吗?` })} },
            ],
          },
        ]
      }"
    />

    <!-- 角色详情 -->
    <Dialog
      v-if="visible"
      :title="title"
      :visible="visible"
      :loading="submitLoading"
      @cancel="cancel"
      @confirm="submitForm"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <ApplicationItem :value.sync="form.appId" />
        <el-form-item label="状态">
          <status-selector v-model="form.status" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" show-word-limit maxlength="500" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
    </Dialog>

    <!-- 分配人员 -->
    <member-selector-dialog
      v-if="dispatchVisible"
      :visible="dispatchVisible"
      :value="memberList"
      wants="id"
      showed-tabs="structureTree"
      @cancel="dispatchMemberCancel"
      @confirm="dispatchMemberConfirm"
    />

    <!-- 角色菜单 -->
    <RoleMenuSelector
      v-if="roleMenuVisible"
      :id="roleId"
      :loading="roleMenuLoading"
      :visible="roleMenuVisible"
      @cancel="handleRoleMenuCancel"
      @confirm="handleRoleMenuConfirm"
    />
  </div>
</template>

<script>
import RoleMenuSelector from "@/components/RoleMenuSelector/index";
import statusComponent from "./statusComponent";

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
  name: "Role",
  components: {
    RoleMenuSelector,
  },
  provide() {
    return {
      AuthButtonScope: this,
    };
  },
  data() {
    return {
      statusComponent,
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

  computed: {
    title() {
      return this.type === "add" ? "新增角色" : "修改角色";
    },
  },
  methods: {
    // 取消按钮
    cancel() {
      this.visible = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = { ...initForm };
      this.resetForm("form");
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },

    /** 新增按钮操作——在auth-button使用 */
    handleAdd() {
      this.visible = true;
      this.type = "add";
    },

    /** 修改按钮操作 */
    handleUpdate(data) {
      this.type = "update";
      this.visible = true;
      this.form = { ...data.row };
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.id !== undefined) {
            this.$request("rabbit.role.update", { data: { ...this.form }}).then(res => {
              if (res.statusCode === 600) {
                this.msgSuccess("修改成功");
                this.cancel();
                this.$refs["page"].refresh();
              }
            }).finally(() => (this.submitLoading = false));
          } else {
            this.$request("rabbit.role.add", { data: { ...this.form }}).then(res => {
              if (res.statusCode === 600) {
                this.msgSuccess("新增成功");
                this.cancel();
                this.$refs["page"].refresh();
              }
            }).finally(() => (this.submitLoading = false));
          }
        }
      });
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

    // 分配数据权限
    handleDispatchAuth(row) {
      this.$router.push(`/rabbit/system/authority/data/${row.id}?roleName=${row.name}`);
    },

    // 分配报表权限
    handleDispatchReport(row) {
      this.$router.push({
        path: "/rabbit/system/report/authority",
        query: {
          id: row.id,
          roleName: row.name,
        },
      });
    },

    // 分配人员
    handleDispatchMember(row) {
      this.roleId = row.row.id;
      this.$request("rabbit.role.fetchMemberListById", { data: { roleId: this.roleId }}).then((res) => {
        if (res.statusCode === 600) {
          this.memberList = res.data;
          this.dispatchVisible = true;
        }
      });
    },

    // 分配人员取消
    dispatchMemberCancel() {
      this.dispatchVisible = false;
    },

    // 分配菜单
    handleDispatchMenu(row) {
      this.roleId = row.row.id;
      this.roleMenuVisible = true;
    },

    // 分配人员保存
    dispatchMemberConfirm(value) {
      this.$request("rabbit.role.saveMembers", { data: { chooseUserIdList: value, roleId: this.roleId }})
        .then((res) => {
          if (res.statusCode === 600) {
            this.msgSuccess("操作成功！");
          } else this.msgSuccess(res.message);
        });
      this.dispatchMemberCancel();
    },

    handleRoleMenuConfirm(value) {
      this.roleMenuLoading = true;
      this.$request("rabbit.role.dispatchMenuToRole", {
        data: {
          id: this.roleId,
          chooseMenuIdList: value,
          // chooseUriIdList: value.uriIds,
          // chooseButtonIdList: value.buttonIds,
        },
      }).then(res => {
        if (res.statusCode === 600) {
          this.$message.success("分配成功");
          this.handleRoleMenuCancel();
        }
      }).finally(() => (this.roleMenuLoading = false));
    },

    handleRoleMenuCancel() {
      this.roleMenuVisible = false;
    },
  },
};
</script>
