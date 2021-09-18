<template>
  <div class="main-content-container full-fill">
    <!-- <detail-form
      :visible.sync="detailFormVisible"
      title="新增"
      type="create"
      :update-fields="['id', 'appId', 'status', 'name']"
      create-api="/api/v1/rabbit/system/role/create"
      update-api="/api/v1/rabbit/system/role/update"
      :form="{
        props: {
          'label-width': 'auto',
          rules: {
            name: [{ required: true, message: '请填写角色名称' }],
            appId: [{ required: true, message: '请选择适用范围' }],
          },
        },
        items: [
          { component: { name: 'el-input', events: { input: dictionaryChange } }, span: 24, props: { label: '角色名称', prop: 'name' }, },
          { component: { name: 'dictionary', props: { code: 'general_app' } }, isNeedInstance: true, span: 24, props: { label: '适用范围', prop: 'appId' }, },
          { component: { name: 'status-selector' }, span: 24, props: { label: '状态', prop: 'status' }, },
          { component: { name: 'el-input', props: { type: 'textarea' }, }, span: 24, props: { label: '备注', prop: 'remark' }, },
        ],
      }"
      @success="handleCreateSuccess"
    >
      <template #create>
        <el-button @click="handleCreate">新增</el-button>
      </template>
    </detail-form> -->

    <Page
      ref="Page"
      base-api="/api/v1/rabbit/system/role"
      :toolbar-buttons="[
        'create',
        'delete',
        'export',
        { label: '打印', type: 'printing', props: { options: { targetStyles: ['*'] } } },
        { type: 'delete', label: '删除1' },
        { type: 'export', label: '导出123' },
        { type: 'more',
          props: {
            data: [
              { type: 'export', props: { label: '导出233' } },
              { label: '打印1', type: 'printing', props: { options: { targetStyles: ['*'] } } },
              {
                type: 'import',
                props: { label: '哈哈'},
              },
              { type: 'delete', props: { label: '删除112' } },
              { type: 'update', props: { label: '修改123' }, events: { click: handleButtonClick }, },
            ],
          },
        },
        { type: 'update', label: '修改2', events: { click: handleButtonClick }, },
        { type: 'button', label: '测试', events: { click: handleButtonClick }, },
        { type: 'import', label: '导入22' },
        'refresh',
        { type: 'columns-filter', props: { id: 'rabbit-page-toolbar', hasCheckedAll: true, data: ['序号', '字典名称', '类型', '自定义组件', '类型2', '创建时间','操作'], defaultChecked: ['序号', '操作'], }, events: { change: columnsChange } },
      ]"
      :form="{
        ref: 'form',
        props: {
          'label-width': 'auto',
        },
        items: [
          [
            { component: { name: 'el-input', props: { maxlength: 5 } }, trim: false, span: 6, props: { label: '输入框', prop: 'input' }, },
            { component: { name: 'el-select' }, span: 12, props: { label: '下拉框1', prop: 'select' }, },
          ],
          { component: { name: 'application-item' }, trim: true, hideItem: true, props: { prop: 'appId' } },
          { component: { name: 'list-selector', events: { change: handleSelectFocus }, props: { wants: 'id', 'json-data': [{id: 1, name: '是'}, { id: 2, name: '否' }], 'source-type': 'json' } }, span: 12, props: { label: '下拉框select', prop: 'select' } },
          { component: { name: 'date-time-picker', props: { valueFormat: 'timestamp' , }}, span: 7, props: { label: '审核日', prop: 'auditDay' }},
          { component: { name: 'date-time-picker' }, span: 8, props: { label: '时间', prop: 'startTime' } },
          { component: { name: 'dictionary', props: { placeholder: '请选择字典', code: 'bee_dc_device_menu' }, }, span: 8, props: { label: '字典', prop: 'dict' } },
          { component: { name: 'drop-down-tree', props: { 'data-source-uri': '/api/v1/rabbit/system/department/find/tree', 'source-type': 'uri' }, }, span: 8, props: { label: '下拉树', prop: 'dropId' } },
          { component: { name: 'member-selector', props: {} }, span: 8, props: { label: '人员选择', prop: 'memberId', formatter: handleMemberSelector }},
          { component: { name: 'button' }, hideItem: true, span: 5 },
        ],
        defaultParams: defaultParams,
        params: searchParams,
      }"
      :printing-table="{ printPropList: ['name', 'type', 'createTime'], printTypeList: ['index'], }"
      :table="{
        events: {
          'selection-change': handleSelectionChange,
          'row-click': handleRowClick,
          'expand-change': handleExpandChange
        },
        props: {
          id: 'page-list-container',
          'fixed-table': true,
          border: true,
          lazy: true,
          load: lazyLoad,
          'tree-props': { children: 'childList', hasChildren: 'hasChildren' },
        },
        columns: [
          { type: 'index', label: '序号' },
          { type: 'selection', align: 'center' },
          { label: '字典名称', prop: 'name' },
          { label: '自定义组件', type: 'component', prop: 'custom', component: ToolbarColumnComponent },
          { label: '类型', prop: 'type', html: { props: {}, events: { click: handleHtmlClick }, formatter: ({ row }) => hanldeHtmlFormatter(row)}, htmlFormatter: ({ row }) => `<span>${dictFormatter('system_dict_type', row.type)}</span>` },
          { label: '创建时间', prop: 'createTime', formatter: (row) => parseTime(row.createTime) },
          {
            label: '操作',
            type: 'handlers',
            handlers: [
              { type: 'update', label: '测试' },
              { type: 'button', label: '测试隐藏', show: isShowButton, props: { disabled: getButtonDisabled }, events: { click: handleHandlerClick } },
              { type: 'delete', props: { type: 'button', confirmMessageFormatter: (row) => ({ title: '删除', message: `确实要删除名称为${row.name}的字典吗?` }) } },
              { type: 'auth-button', props: { code: '733690157324042240', type: 'text', method: handleHandlerClick }, },
            ],
          },
        ],
        'is-fetch': (params) => isFetch(params),
        'cell-menus': [
          { label: '修改', events: { click: cellMenuClick } },
          {
            label: '删除',
            type: 'delete',
            props: {
              api: '/',
              disabled: (row) => {
                log1(row);
                return false;
              },
              confirmMessageFormatter: confirmMessageFormatter,
            },
            events: { click: cellMenuClick },
          },
        ],
        'sort-fields': ['name', 'type'],
        'sort-type': 'single',
      }"
      :detail-form="{
        props: {
          createTitle: '新增角色',
          updateTitle: '修改角色',
          'default-params': {
            hahaha: 1234,
          },
          'update-fields': ['id', 'appId', 'status', 'name'],
          form: {
            props: {
              'label-width': 'auto',
              rules: {
                name: [{ required: true, message: '请填写角色名称' }],
                appId: [{ required: true, message: '请选择适用范围' }],
              },
            },
            items: [
              { component: { name: 'el-input' }, span: 24, props: { label: '角色名称', prop: 'name' }, },
              { component: { name: 'dictionary', events: { change: handleSelectDictChange }, props: { code: 'general_app' }, }, span: 24, props: { label: '适用范围', prop: 'appId' }, },
              { component: { name: 'status-selector' }, span: 24, props: { label: '状态', prop: 'status' }, },
              { component: { name: 'el-input', props: { type: 'textarea' }, }, span: 24, hide: handleHideInput, props: { label: '备注', prop: 'remark' }, },
              { component: { name: 'component', component: ToolbarColumnComponent, events: { change: handleSelectChange } }, span: 24, props: { label: '备注' } },
            ],
          },
        },
        events: {
          success: handleCreateSuccess,
          beforeSubmit: handleBeforeSubmit,
        },
      }"
    >
      <!--      <template v-slot:form="props">-->
      <!--        <el-form-item label="测试1:">-->
      <!--          <el-input v-model="props.form.name1" />-->
      <!--        </el-form-item>-->
      <!--        <el-form-item label="测试2:">-->
      <!--          <el-input v-model="props.form.name2" />-->
      <!--        </el-form-item>-->
      <!--        <el-form-item>-->
      <!--          <el-button :loading="props.loading" @click="props.search">查询</el-button>-->
      <!--          <el-button @click="props.reset">重置</el-button>-->
      <!--        </el-form-item>-->
      <!--      </template>-->
      <!-- <template v-slot:detailForm="props">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="props.form.name" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="props.form.status" />
        </el-form-item>
      </template> -->
      <!-- <template v-slot:basicSearch="props">
        <el-input v-model="props.form.name" v-number="{ type: 'float', precision: 5, maxLength: 12 }" style="width:200px" />
        <input-number />
        <RadioGroupSelector v-model="props.form.id" :data="[{name: '按钮', id: 1}, {name: '测试', id: 2}]" @change="(value) => handleRadioButtonChange(value, props)" />
      </template>
      <template v-slot:extraAboveForm>
        <el-input />
      </template> -->
      <template v-slot:extraAboveTable>
        <el-button>ceshi</el-button>
      </template>
      <!--      <template v-slot:table="props">-->
      <!--        <el-table border>-->
      <!--          <el-table-column label="测试" />-->
      <!--        </el-table>-->
      <!--      </template>-->
    </Page>
  </div>
</template>

<script>
// import { RadioGroupSelector, isArray, request } from "@monkey.do/monkey";
import { isArray, request } from "@monkey.do/monkey";
// import { Page, DetailForm } from "@/components";
import { Page } from "@/components";
import ToolbarExpand from "./page-demo-expand";
import ToolbarColumnComponent from "./page-demo-column-component";
import Vue from "vue";

Vue.component("ToolbarColumnComponent", ToolbarColumnComponent);

export default {
  name: "PageDemo",
  // components: { Page, RadioGroupSelector },
  components: { Page },
  data() {
    return {
      ToolbarExpand,
      ToolbarColumnComponent,
      detailFormVisible: false,
      handleHideInput: false,
      searchParams: {
      },
      defaultParams: {
        input: "123",
        beginTime: 1612800000000,
        endTime: 1615910399000,
      },
    };
  },
  mounted() {
    this.mockRequest({
      url: "/system/menu/find/all",
    });

    this.$mockRequest("rabbit.demo.get");

    request({
      url: "/mock/api/v1/system/menu/export",
    });
  },
  methods: {
    handleAdd() {
      console.log("新增");
      console.log(this.$refs["Page"].getExpandRef('Expand-790640587488362496'));
    },
    handleSelectionChange(keys) {
      console.log(keys);
    },
    handleButtonClick(id) {
      console.log(id);
      console.log("测试点击");
    },
    handleHandlerClick(data) {
      console.log(data);
    },
    handleRowClick(column) {
      console.log(column);
    },
    cellMenuClick(row) {
      console.log(row);
    },
    columnsChange(columns) {
      console.log(columns);
    },
    log1(row) {
      console.log(row);
    },
    confirmMessageFormatter(row) {
      console.log("1", row);
      return {
        title: "1",
        message: "1",
      };
    },
    lazyLoad(row, treeNode, resolve) {
      console.log(row);
    },
    handleExpandChange(row, expand) {
      console.log(row);
    },
    handleRadioButtonChange(value, props) {
      console.log(value);
      this.searchParams = {
        ...this.searchParams,
        test: value,
      };
    },
    isShowButton({ row, $index }) {
      return $index % 2 === 0;
    },
    handleCreate() {
      this.detailFormVisible = true;
    },
    handleCreateSuccess(type) {
      // this.$refs["Page"].refresh();
    },
    handleBeforeSubmit(data) {
      console.log(`before submit`, data);
    },
    getButtonDisabled() {
      return true;
    },
    hanldeHtmlFormatter(row) {
      return `<span style="color: red;">123</span>`;
    },
    handleHtmlClick(data) {
      console.log(data);
    },
    handleMemberSelector(value) {
      if (isArray(value)) {
        return value.map(item => item.id);
      } else {
        return value.id || value;
      }
    },
    isFetch(params) {
      this.searchParams = {
        ...this.searchParams,
        ...params,
      };
      return true;
    },
    handleImportChange(props) {
      console.log(props);
    },
    handleSelectChange() {
      this.$refs["Page"].$refs["detailForm"].setModleFormValue([{ prop: "sel", value: 444 }, { prop: "ffq", value: 555 }]);
    },
    handleSelectDictChange(value) {
      if (value) this.handleHideInput = !this.handleHideInput;
    },
    handleSelectFocus(val) {
      console.log(val, "focus");
    },
    dictionaryChange(instance, value) {
      console.log(instance);
      console.log(value);
    },
  },
};
</script>
