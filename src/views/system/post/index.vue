<template>
  <!-- 系统管理-岗位管理 -->
  <div class="main-content-container full-fill">
    <Page
      ref="page"
      list-api="/api/v1/rabbit/system/job/find/page"
      :toolbar-buttons="[
        { type: 'create', events: { click: handleAdd } },
        { label:'岗位类型', type: 'create', events: { click: handleShowJobType } },
        'refresh',
      ]"
      :form="{
        props: {
          'label-width': 'auto',
        },
        items: [
          { component: { name: 'el-input', props: { placeholder: '请输入岗位编码', maxlength:'16', clearable: true } }, span: 6, props: { label: '岗位编码', prop: 'code' },},
          { component: { name: 'el-input', props: { placeholder: '请输入岗位名称', maxlength:'16', clearable: true } }, span: 6, props: { label: '岗位名称', prop: 'name' },},
          { component: { name: 'list-selector', props: { wants: 'id', 'json-data': [{id: '1', name: '启用'}, { id: '0', name: '禁用' }], 'source-type': 'json' ,placeholder: '用户状态'} }, span: 6, props: { label: '状态', prop: 'status' } },
          { component: { name: 'button' }, span: 5 },
        ],
      }"
      :table="{
        props:{
          border:true,
        },
        columns: [
          { type: 'selection', align:'center'},
          { label: '岗位编码', prop: 'code' },
          { label: '岗位名称', prop: 'name' },
          { label: '岗位排序', prop: 'sortNumber' },
          { label: '状态', prop: 'status', type:'component', component: statusComponent},
          { label: '创建时间', prop: 'createTime', formatter: (row) => parseTime(row.createTime)},
          {
            label: '操作',
            type: 'handlers',
            handlers: [
              { type: 'button', label: '分配角色', events: { click: handleOnAllocatRoleDlg } },
              { type: 'button', label: '修改', events: { click: handleUpdate } },
              { type: 'delete', props: { api: '/api/v1/rabbit/system/job/delete', type: 'button',confirmMessageFormatter: (row) => ({ title: '删除', message: `确定要删除岗位名称为${row.name}吗?` })} },
            ],
          },
        ]
      }"
    />
    <!-- dialog1添加或修改岗位对话框 -->
    <Dialog v-if="visible" :loading="submitLoading" :title="title" :visible="visible" @cancel="cancel" @confirm="submitForm">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model.trim="form.name" :maxlength="16" placeholder="请输入岗位名称" clearable />
        </el-form-item>
        <el-form-item label="岗位编码" prop="code">
          <el-input v-model.trim="form.code" :maxlength="16" placeholder="请输入编码名称" clearable />
        </el-form-item>
        <el-form-item label="岗位顺序" prop="sortNumber">
          <el-input-number v-model="form.sortNumber" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in statusOptions" :key="item.key" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="岗位类型">
          <el-select v-model="form.typeId" placeholder="请选择岗位类型">
            <el-option v-for="item in jobTypeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" type="textarea" show-word-limit :maxlength="500" placeholder="请输入内容" clearable />
        </el-form-item>
      </el-form>
    </Dialog>
    <!--dialog2 岗位类型dialog -->
    <Dialog v-if="jobTypeVisible" title="岗位类型" :has-footer="false" :visible="jobTypeVisible" @cancel="jobTypeCancel">
      <Page
        ref="typePage"
        list-api="/api/v1/rabbit/system/job/type/find/page"
        :toolbar-buttons="[
          { type: 'create', events: { click: addJobType } },
        ]"
        :form="{
          props:{
            'label-width': 'auto',
          },
          items:[
            { component: { name: 'el-input', props: { placeholder: '请输入岗位类型', maxlength:'30', clearable: true} }, span: 12, props: { label: '岗位类型', prop: 'name' },},
            { component: { name: 'button' }, span: 12 },
          ],
        }"
        :table="{
          props:{
            border:true,
          },
          columns: [
            { label: '岗位类型', prop: 'name' },
            {
              label: '操作',
              type: 'handlers',
              handlers: [
                { type: 'button', label: '修改', events: { click: _updateJobType } },
                { type: 'delete', props: { api: '/api/v1/rabbit/system/job/type/delete', type: 'button',confirmMessageFormatter: (row) => ({ title: '删除', message: `确定要删除岗位类型为${row.name}吗?` })} },
              ],
            },
          ]
        }"
      />
    </Dialog>
    <!-- todo.dialog3 岗位操作子dialog -->
    <Dialog :title="jobOperate.title" :visible="jobOperate.subVisible" @cancel="subClose" @confirm="handleUpdateJobType">
      <el-form ref="newTypeForm" :model="jobOperate" label-width="auto" :rules="rules">
        <el-form-item label="岗位类型" prop="subInput">
          <el-input v-model.trim="jobOperate.subInput" :value="jobOperate.subInput" :maxlength="30" clearable />
        </el-form-item>
      </el-form>
    </Dialog>
    <!-- todo dialog4  分配角色dialog -->
    <AllocateRole
      v-if="allocatRole.subVisible"
      :visible="allocatRole.subVisible"
      :title="allocatRole.subTitle"
      :loading="allocatRole.ddLoading"
      :checked-list="allocatRole.checkedList"
      :app-ids-arr="allocatRole.fmtData.appIdsArr"
      @roleCancle="cancelAllocatRoleDlg"
      @getCheckList="handleSubSelectionChange"
      @roleConfirm="handleAllotRole"
      @change="handleSubSelected"
    />
  </div>
</template>

<script>
import { fetchRole } from "@/api/system/role";
import AllocateRole from "./allocatRole";
import statusComponent from "./statusComponent";

export default {
  name: "Post",
  components: { AllocateRole },
  data() {
    return {
      jobTypeList: [], // 岗位类型
      statusComponent,
      submitLoading: false,
      loading: false,
      ids: [],
      total: 0,
      postList: [],
      title: "",
      visible: false,
      id: "", // 岗位id
      options: [{ value: "测试1", lable: "测试1" }],
      statusOptions: [
        { key: 1, value: 1, label: "启用" },
        { key: 0, value: 0, label: "停用" },
      ],
      // 岗位dialog开关
      jobTypeVisible: false,
      // todo
      jobOperate: {
        id: "",
        title: "新增类型",
        subVisible: false,
        subInput: "",
        type: "add",
        subLoading: false,
      },
      // 分配角色
      allocatRole: {
        subTitle: "分配角色",
        subVisible: false,
        fmtData: {}, // 处理过后的数据
        checkedList: [], // checkbox 点击数据，和回填数据
        ddLoading: false,
        flag: false,
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: undefined,
        name: undefined,
        status: undefined,
      },
      // 表单参数
      form: {
        status: 1,
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "岗位名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "岗位编码不能为空", trigger: "blur" },
        ],
        sortNumber: [
          { required: true, message: "岗位顺序不能为空", trigger: "blur" },
        ],
        subInput: [
          { required: true, message: "请输入岗位类型", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getFetchRoleList();
  },
  methods: {
    // 分配角色操作标识方法
    handleSubSelected() {
      this.allocatRole.flag = true;
    },
    // 取消按钮
    cancel() {
      this.visible = false;
      this.form = { status: 1 };
      this.$refs["form"].resetFields();
    },
    // 岗位类型dialog cancel
    jobTypeCancel() {
      this.jobTypeVisible = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
    // 显示岗位类型
    showJobType() {
      this.$request("rabbit.system.post.fetch").then((res) => {
        this.jobTypeList = res.data;
        this.loading = false;
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.visible = true;
      this.title = "新增岗位";
      this.showJobType();
    },
    // 显示岗位类型
    handleShowJobType() {
      this.loading = true;
      this.jobTypeVisible = true;
      this.showJobType();
    },
    // 新增岗位类型
    addJobType() {
      this.jobOperate.subInput = "";
      this.jobOperate = {
        ...this.jobOperate,
        ...{ subVisible: true, title: "新增岗位类型", type: "add" },
      };
    },
    //  打开新增的dialog
    _updateJobType(row) {
      this.jobOperate = {
        ...this.jobOperate,
        ...{
          subInput: row.row.name,
          id: row.row.id,
          title: "修改岗位类型",
          subVisible: true,
          type: "update",
        },
      };
    },
    // todo 岗位类型的操作dialog cancel
    subClose() {
      this.jobOperate.subVisible = false;
      this.$refs.newTypeForm.resetFields();
    },
    // 添加岗位类型
    handleUpdateJobType() {
      this.$refs["newTypeForm"].validate(valid => {
        if (valid) {
          this.jobOperate.subLoading = true;
          if (this.jobOperate.type === "add") {
            this.$request("rabbit.system.post.createJobType", { data: { name: this.jobOperate.subInput }})
              .then((res) => {
                if (res.statusCode === 600) {
                  this.msgSuccess("新增成功");
                  this.$refs.typePage.refresh(1);
                }
              })
              .finally(() => {
                this.subClose();
                this.jobOperate.subLoading = false;
              });
          } else {
            this.$request("rabbit.system.post.updateJobType", { data: { id: this.jobOperate.id, name: this.jobOperate.subInput }}).then((res) => {
              if (res.statusCode === 600) {
                this.msgSuccess("修改成功");
                this.$refs.typePage.refresh(1);
              }
            }).finally(() => {
              this.subClose();
              this.jobOperate.subLoading = false;
            });
          }
        }
      });
    },
    // 分配权限的取消
    cancelAllocatRoleDlg() {
      this.allocatRole.subVisible = false;
    },
    handleFmtRoleData(data = []) {
      let idsArr = [];
      const appIdsArr = [];
      const { fmtData } = this.allocatRole;
      data.forEach((v, k) => {
        if (!idsArr.includes(v.appId)) idsArr.push(v.appId);
      });
      // 去重复
      idsArr = Array.from(new Set(idsArr));
      idsArr.forEach((v) => appIdsArr.push({ appId: v, data: [] }));
      // 改造数据
      data.forEach((v, k) => {
        appIdsArr.forEach((v1, j) => {
          if (v1.appId === v.appId) {
            v1.data.push({ id: v.id, name: v.name });
          }
        });
      });
      fmtData.appIdsArr = appIdsArr;
    },
    // todo.fp 打开分配角色dialog
    handleOnAllocatRoleDlg(row) {
      this.id = row.row.id;
      this.allocatRole.subVisible = true;
      this.allocatRole.flag = false;
      // 查询已分配的角色list
      this.$request("rabbit.system.post.findAllocatedRole", { data: { jobId: this.id }}).then((res) => {
        if (res.statusCode === 600) {
          this.allocatRole.checkedList = res.data;
          this.allocatRole.subVisible = true;
        }
      });
    },
    // 查询所有角色的
    getFetchRoleList() {
      fetchRole().then((res) => {
        if (res.statusCode === 600) {
          this.handleFmtRoleData(res.data);
        }
      });
    },
    async postAllotRole() {
      this.allocatRole.ddLoading = true;
      this.$request("rabbit.system.post.allotRole", { data: { jobId: this.id, roleIds: this.allocatRole.checkedList }}).then((res) => {
        if (res.statusCode === 600) {
          this.msgSuccess("分配角色成功");
          this.allocatRole.subVisible = false;
        }
        this.allocatRole.ddLoading = false;
      });
    },
    // 分配按钮事件
    handleAllotRole() {
      if (this.allocatRole.flag) this.postAllotRole();
      else this.cancelAllocatRoleDlg();
    },
    // 分配权限里面的表格多选框change事件
    handleSubSelectionChange(v) {
      const { allocatRole } = this;
      allocatRole.checkedList = v;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.visible = true;
      this.title = "修改岗位";
      this.$request("rabbit.system.post.getPost", { data: { id: row.row.id }}).then((res) => {
        this.form = res.data;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.id !== undefined) {
            this.$request("rabbit.system.post.updatePost", { data: this.form }).then((res) => {
              if (res.statusCode === 600) {
                this.msgSuccess("修改成功");
                this.$refs.page.refresh(1);
                this.cancel();
              }
            })
              .finally(() => (this.submitLoading = false));
          } else {
            this.$request("rabbit.system.post.addjob", { data: this.form }).then((res) => {
              if (res.statusCode === 600) {
                this.msgSuccess("新增成功");
                this.$refs.page.refresh(1);
                this.cancel();
              }
            }).finally(() => (this.submitLoading = false));
          }
        }
      });
    },
  },
};
</script>
