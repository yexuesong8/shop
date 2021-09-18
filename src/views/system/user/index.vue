<template>
  <div class="main-content-container rb-dept-container full-fill">
    <el-row :gutter="20" style="height: 100%;">
      <!--部门数据-->
      <el-col
        :span="4"
        :xs="24"
        style="height: 100%;"
      >
        <div class="head-container mb10">
          <SearchInput
            v-model="filterText"
            placeholder="请输入部门名称"
            clearable
          />
        </div>
        <div class="dept-tree-box">
          <el-tree
            ref="tree"
            class="member-search-dept-tree"
            :data="deptOptions"
            :highlight-current="highlight"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :render-content="deptTreeRender"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24" style="height: 100%">
        <Page
          ref="page"
          list-api="/api/v1/rabbit/system/member/find/page"
          :toolbar-buttons="[
            { type: 'create', events: { click: handleAdd } },
            'refresh',
          ]"
          :form="{
            props: {
              'label-width': 'auto',
            },
            params: params,
            items: [
              { component: { name: 'el-input', props: { placeholder: '请输入姓名', maxlength: '20', clearable: true } }, span: 6, props: { label: '姓名', prop: 'name' },},
              { component: { name: 'el-input', props: { placeholder: '请输入手机号码', maxlength: '11', clearable: true } }, span: 6, props: { label: '手机号码', prop: 'phone' },},
              { component: { name: 'list-selector', props: { clearable: true, wants: 'id', 'json-data': [{id: '1', name: '启用'}, { id: '0', name: '停用' }], 'source-type': 'json' } }, span: 6, props: { label: '状态', prop: 'status' } },
              { component: { name: 'button' }, span: 5 },
            ],
          }"
          :table="{
            'fixed-table': true,
            props:{
              border:true,
            },
            columns: [
              { type: 'selection', align: 'center' },
              { label: '账号', prop: 'account' },
              { label: '姓名', prop: 'name' },
              { label: '部门', prop: 'deptName' },
              { label: '手机号码', prop: 'phone' },
              { label: '状态', type: 'component' ,component: statusComponent},
              { label: '创建时间', prop: 'createTime', formatter: (row) => parseTime(row.createTime)},
              {
                label: '操作',
                type: 'handlers',
                width: 240,
                handlers: [
                  { type: 'button', label: '开通账号', show: isShowButton, events: { click: handleSetAccount } },
                  { type: 'button', label: '解锁', show: isShowLockButton, events: { click: handleUnlock } },
                  { type: 'button', label: '修改', events: { click: handleUpdate } },
                  { type: 'delete', props: { api: 'api/v1/rabbit/system/member/delete', type: 'button',confirmMessageFormatter: (row) => ({ title: '删除', message: `确定要删除${row.name}吗?` })} },
                  { type: 'auth-button', props: { code: '743064600869601280', type: 'text', method: handleResetPwd }, },
                ],
              },
            ]
          }"
          @reset="handleReset"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <Detail :visible="visible" :title="title" :form="form" @cancel="handleCancel" @success="handleSuccess" />
    <!-- 开通账户对话框 -->
    <UserAccount
      :id="userAccountId"
      :visible="visibleAccount"
      :account="userAccountName"
      :on-submit="createAccountSuccess"
      @cancel="handleUserAccountCancel"
    />
  </div>
</template>

<script>
import { getToken, SearchInput } from "@monkey.do/monkey";
import Detail from "./detail";
import UserAccount from "./account";
import statusComponent from "./statusComponent";

export default {
  name: "User",
  components: {
    Detail,
    SearchInput,
    UserAccount,
  },
  data() {
    return {
      deptOptions: [],
      params: {},
      statusComponent,
      // 遮罩层
      loading: true,
      matchLoading: false, // 同步钉钉loading
      visible: false,
      visibleAccount: false,
      // 选中数组
      ids: [],
      // 用户表格数据
      userList: null,
      // 弹出层标题
      titleType: '',
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 表单参数
      form: {
        status: 1,
      },
      defaultProps: {
        children: "childList",
        label: "name",
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },

      deptId: "", // 当前选中节点
      highlight: true,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        phone: undefined,
        status: undefined,
      },

      // 部门过滤
      filterText: '',
      userAccountId: "",
      userAccountName: "",
    };
  },

  provide() {
    return {
      AuthButtonScope: this,
    };
  },

  computed: {
    title() {
      return this.titleType === 'create' ? '人员-新增' : '人员-修改';
    },
  },

  watch: {
    // 根据名称筛选部门树
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },

  created() {
    this.getDepartmentTree();
  },

  methods: {
    // 开通账户按钮显示
    isShowButton({ row }) {
      return row.account === undefined;
    },
    // 解锁按钮
    // isShowLockButton({ row }) {
    //   return row.locked;
    // },
    isShowLockButton({ row }) {
      return row.lockExpireTime > new Date().getTime();
    },
    // 取消弹框
    handleCancel() {
      this.visible = false;
    },
    handleSuccess() {
      this.$refs.page.refresh(1);
    },

    handleSearchDept(value) {
      this.filterText = value;
    },

    // 部门
    getDepartmentTree(payload) {
      this.loading = true;
      this.$request("rabbit.system.userManage.getTree", { data: { ...this.queryParams, ...payload }}).then((res) => {
        if (res.statusCode === 600) {
          this.deptOptions = res.data;
          this.deptOptions.unshift({ id: "", name: "全部" });
        }
      }).finally(() => (this.loading = false));
    },

    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return (data.name || "").indexOf(value) !== -1;
    },

    // 节点单击事件
    handleNodeClick(data) {
      const { id } = data;
      this.deptId = id;
      this.params = { deptId: id };
      this.highlight = true;
    },
    // 重置
    handleReset() {
      this.deptId = "";
      this.highlight = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
    },

    // 新增
    handleAdd() {
      this.form = {
        status: 1,
      };
      this.visible = true;
      this.titleType = "create";
    },
    // 同步钉钉
    handleMatchDingDing() {
      this.matchLoading = true;
      this.$request("rabbit.system.user.matchDingDing", { data: { deptId: this.deptId }}).then(res => {
        if (res.statusCode === 600) {
          this.msgSuccess(res.message || "同步成功");
          this.$refs.page.refresh();
        }
      }).finally(() => { this.matchLoading = false; });
    },

    /** 修改按钮操作 */
    handleUpdate(data) {
      this.visible = true;
      this.titleType = "update";
      this.$request("rabbit.system.userManage.getById", { data: { id: data.row.id }}).then((res) => {
        if (res.statusCode === 600) {
          this.form = res.data;
        }
      });
    },

    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$confirm(`确定要重置"${row.name}"的密码吗?`, "重置密码", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      }).then(() => {
        this.$request("rabbit.system.userManage.resetPass", { data: { id: row.id }}).then((res) => {
          if (res.statusCode === 600) {
            this.msgSuccess("重置成功!");
          }
        });
      });
    },

    // 部门树 自定义渲染内容
    deptTreeRender(h, { node, data, store }) {
      if (this.deptId === data.id) {
        return h(
          "span",
          {
            props: { node },
            class: "dept-tree-custom-node",
            style: { fontSize: "14px" },
          },
          `${node.label}`
        );
      } else {
        return h(
          "span",
          { props: { node }, style: { fontSize: "14px" }},
          node.label
        );
      }
    },

    // 开通账户
    handleSetAccount(row) {
      this.visibleAccount = true;
      this.userAccountId = row.row.id;
      this.userAccountName = row.account;
    },

    // 解锁
    handleUnlock(row) {
      this.$request("rabbit.system.userManage.unlock", { data: { id: row.row.id }}).then((res) => {
        if (res.statusCode === 600) {
          this.$message.success("解锁成功");
          this.$refs.page.refresh(1);
        }
      });
    },

    handleUserAccountCancel() {
      this.userAccountId = "";
      this.userAccountName = "";
      this.visibleAccount = false;
    },

    createAccountSuccess() {
      this.$refs.page.refresh(1);
    },
  },
};
</script>

<style lang="scss">
.rb-dept-container {
  .user-list-table {
    .el-button + .el-button {
      margin-left: 5px;
    }
  }
  .dept-tree-box {
    height: calc(100% - 42px);
    overflow-y: auto;
  }
}
</style>
