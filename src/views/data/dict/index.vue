<template>
  <!-- 数据管理-字典管理 -->
  <div class="main-content-container full-fill">
    <Page
      ref="page"
      list-api="/api/v1/rabbit/data/dictionary/find/page"
      :toolbar-buttons="[
        { type: 'create', events: { click: handleAdd } },
        'refresh'
      ]"
      :form="{
        props: {
          'label-width': 'auto',
        },
        items: [
          [
            { component: { name: 'el-input', props: { maxlength: 50, placeholder: '请输入字典名称', clearable: true} }, span: 6, props: { label: '字典名称', prop: 'name' }, },
            { component: { name: 'application-Item'}, span: 6, props: {prop: 'appId'}, hideItem: true},
            { component: { name: 'el-input', props: { maxlength: 50, placeholder: '请输入代码', clearable: true} }, span: 6, props: { label: '代码', prop: 'code' }, },
          ],
          { component: { name: 'el-input', props: { maxlength: 200, placeholder: '请输入备注', clearable: true} }, span: 6, props: { label: '备注', prop: 'remark' }, },
          { component: { name: 'button' }, span: 5},
        ],
      }"
      :table="{
        props:{ border: true },
        columns: [
          { type: 'selection', label: '序号' },
          { label: '字典名称', prop: 'name' },
          { label: '代码', prop: 'code' },
          { label: '类型', prop: 'type', htmlFormatter: ({ row }) => `<span>${dictFormatter('system_dict_type', row.type)}</span>` },
          { label: '上级字典', prop: 'parentName' },
          { label: '备注', prop: 'remark' },
          { label: '创建时间', prop: 'createTime', formatter: (row) => parseTime(row.createTime)},
          {
            label: '操作', type: 'handlers',
            handlers: [
              { type: 'button', label: '修改', events: { click: handleUpdate } },
              { type: 'button', label: '选项', events: { click: handleOptionType } },
              { type: 'delete', props: { api: '/api/v1/rabbit/data/dictionary/delete', type: 'button',confirmMessageFormatter: (row) => ({ title: '删除', message: `是否删除字典名为${row.name}的数据？` })} },
            ],
          },
        ],
      }"
    />

    <Detail :title="title" :visible="detVisible" :form="form" @cancel="handleCancel" @success="handleSuccess" />

    <!-- 选项 -->
    <Dialog v-if="visible" :title="title" :visible="visible" @cancel="cancel" @confirm="cancel">
      <el-form ref="formOption" :model="search" label-width="auto" :inline="true" @submit.native.prevent>
        <el-row>
          <el-col :span="18">
            <el-form-item label="选项名称:" prop="name">
              <el-input
                v-model.trim="queryParams.name"
                v-enter-search="handleSearch"
                placeholder="请输入选项名称"
                clearable
                style="width: 240px"
                :maxlength="30"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="searchLoading" @click="handleSearch">搜索</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="fr">
              <option-detail :id="queryParamsOption.dictionaryId" @submitSuccess="submitOptionSuccess" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 字典选项列表 -->
      <el-table v-loading="searchLoading" :data="typeData">
        <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip />
        <el-table-column prop="code" label="代码" width="100" show-overflow-tooltip />
        <el-table-column prop="content" label="值" width="120" show-overflow-tooltip />
        <el-table-column prop="sortNumber" label="排序" width="80" show-overflow-tooltip />
        <el-table-column prop="parentCodeName" label="上级字典选项" width="120" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" width="120" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" min-width="120px" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdateOption(scope.row)">修改</el-button>
            <el-button type="text" @click="delOptionList(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </Dialog>

    <Dialog title="修改选项" :visible="updateOptionVisible" :loading="updateOptionLoading" @cancel="handleUpdateOptionCancel" @confirm="handleUpdateOptionSubmit">
      <el-form ref="updateOptionForm" :model="updateOptionParams" label-width="auto">
        <el-row :gutter="48">
          <el-col :span="12">
            <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请填写字段名称', trigger: 'blur' }]">
              <el-input v-model.trim="updateOptionParams.name" placeholder="请输入名称" clearable :maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码" prop="code" :rules="[{ required: true, message: '请填写字段代码', trigger: 'blur' }]">
              <el-input v-model.trim="updateOptionParams.code" placeholder="请输入代码" clearable :maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="48">
          <el-col :span="12">
            <el-form-item label="值" prop="content">
              <el-input v-model.trim="updateOptionParams.content" clearable :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sortNumber">
              <el-input-number v-model.trim="updateOptionParams.sortNumber" controls-position="right" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="48">
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model.trim="updateOptionParams.remark" placeholder="请输入备注" clearable :maxlength="200" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import Detail from "./detail";
import OptionDetail from "./option-detail";

export default {
  name: 'Dictionary',
  components: {
    Detail,
    OptionDetail,
  },
  data() {
    return {
      search: {},
      field: {},
      optionList: [{ name: undefined, content: undefined }],
      searchLoading: false,
      submitLoading: false,
      // 字典表格数据
      typeData: [],
      // 弹出层标题
      titleType: '',
      // 是否显示弹出层
      detVisible: false,
      // open: false,
      visible: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        code: undefined,
        status: 1,
        type: undefined,
        remark: undefined,
      },
      // 查询选项参数
      queryParamsOption: {
        dictionaryId: '',
        optionList: [{ name: undefined, content: undefined }],
      },

      // 表单参数
      radio: 0,

      form: {
        id: undefined,
        name: undefined,
        code: undefined,
        remark: undefined,
        appId: undefined,
      },

      formOption: {},

      // 表单校验
      rules: {
        name: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '字典代码不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '值不能为空', trigger: 'blur' }],
        appId: [{ required: true, message: '适用范围不能为空', trigger: 'blur' }],
      },
      updateOptionParams: {},
      updateOptionVisible: false,
      updateOptionLoading: false,
    };
  },
  computed: {
    title() {
      if (this.titleType === 'readOption') return '查看选项';
      return this.titleType === 'create' ? '新增字典' : '修改字典';
    },
  },
  methods: {
    // 取消按钮
    cancel() {
      this.visible = false;
      // 清空搜索框
      this.queryParams.name = "";
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        code: undefined,
        remark: undefined,
        appId: undefined,
      };
      this.radio = 0;
      this.resetForm('form');
    },

    /** 搜索选项按钮操作 */
    handleSearch() {
      this.queryParams.pageNum = 1;
      this.getListOption();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.titleType = 'create';
      this.detVisible = true;
    },

    /** 修改按钮操作 */
    handleUpdate(data) {
      this.titleType = 'update';
      this.detVisible = true;
      this.form = { ...data.row };
    },

    // 选项删除按钮
    delOptionList(row) {
      this.$confirm(`确定要删除名为"${row.name}"的选项吗?`, "删除", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      }).then(() => {
        this.$request("rabbit.system.option.delOption", { data: { id: row.id }}).then((res) => {
          if (res.statusCode === 600) {
            this.msgSuccess('删除成功');
            this.handleSearch();
          }
        });
      });
    },

    // 新增选项成功
    submitOptionSuccess() {
      this.handleSearch();
    },

    /** 添加选项按钮操作 */
    handleAddOption() {
      this.reset();
      this.title = '新增选项';
    },
    // 获取选项
    getListOption() {
      this.searchLoading = true;
      this.$request("rabbit.system.option.getOption", { data: { dictionaryId: this.queryParamsOption.dictionaryId, ...this.queryParams }}).then((response) => {
        this.searchLoading = false;
        if (response.statusCode === 600) {
          this.typeData = response.data;
        }
      });
    },
    // 查看选项
    handleOptionType(row) {
      this.visible = true;
      this.titleType = 'readOption';
      this.queryParamsOption.dictionaryId = row.row.id;
      this.getListOption();
    },
    // 选项添加
    submitFormOption() {
      this.$refs['addFormOption'].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          this.$request("rabbit.system.option.addOptionList", { data: this.queryParamsOption }).then((response) => {
            this.submitLoading = false;
            if (response.statusCode === 600) {
              this.msgSuccess('新增成功');
              this.getListOption();
              this.handleOptionCancel();
            }
          });
        }
      });
    },

    handleOptionCancel() {
      this.title = '';
      // 重置参数
      this.queryParamsOption = {
        dictionaryId: '',
        optionList: [{ name: undefined, content: undefined }],
      };
      this.field = {};
      this.$refs['addFormOption'].resetFields();
    },
    // 选项修改按钮
    handleUpdateOption(data) {
      this.updateOptionParams = Object.assign({}, data);
      this.updateOptionVisible = true;
    },
    // 修改选项
    handleUpdateOptionSubmit() {
      this.updateOptionLoading = true;
      this.$request("rabbit.system.option.updateOption", { data: { id: this.updateOptionParams.id, code: this.updateOptionParams.code, name: this.updateOptionParams.name, sortNumber: this.updateOptionParams.sortNumber, remark: this.updateOptionParams.remark, content: this.updateOptionParams.content }}).then((res) => {
        this.updateOptionLoading = false;
        if (res.statusCode === 600) {
          this.$message.success('修改成功');
          this.getListOption();
          this.handleUpdateOptionCancel();
        }
      }
      );
    },
    handleUpdateOptionCancel() {
      this.updateOptionVisible = false;
      this.resetForm('updateOptionForm');
    },
    // detail成功
    handleSuccess() {
      this.$refs['page'].refresh(1);
    },
    // 取消
    handleCancel() {
      this.detVisible = false;
      this.form = {};
    },
  },
};
</script>
