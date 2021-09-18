<template>
  <!-- 权限管理-表 -->
  <div class="main-content-container full-fill">
    <Page
      ref="page"
      list-api="/api/v1/rabbit/auth/data/table/find/page"
      base-api="/api/v1/rabbit/auth/data/table"
      :toolbar-buttons="[
        { type: 'create', events: { click: handleAdd } },
        'refresh',
      ]"
      :form="{
        props: {
          'label-width': 'auto',
        },
        items: [
          { component: { name: 'el-input', props: { maxlength: 5,placeholder: '请输入名称' } }, trim: false, span: 6, props: { label: '名称', prop: 'name' }, },
          { component: { name: 'el-input', props: { maxlength: 5,placeholder: '请输入表名' } }, trim: false, span: 6, props: { label: '表名', prop: 'code' }, },
          { component: { name: 'drop-down-tree', props: { 'data-source-uri': '/api/v1/rabbit/data/category/find/tree', 'source-type': 'uri' }, }, span: 6, props: { label: '分类', prop: 'categoryId' } },
          { component: { name: 'list-selector', props: { wants: 'id', 'json-data': [{id: 1, name: '启用'}, { id: 0, name: '禁用' }], 'source-type': 'json' } }, span: 6, props: { label: '开启授权', prop: 'needAuth' } },
          { component: { name: 'button' }, span: 6 },
        ],
      }"
      :table="{
        props:{
          border:true,
        },
        columns: [
          { label: '名称', prop: 'name' },
          { label: '表名', prop: 'code' },
          { label: '分类', prop: 'categoryId', formatter: (row) => row.categoryName},
          { label: '授权', prop: 'needAuth', formatter: (row) => statusFormat(row)},
          {
            label: '操作',
            type: 'handlers',
            handlers: [
              { type: 'button', label: '新增字段', events: { click: handleAddField } },
              { type: 'button', label: '修改', events: { click: handleUpdate } },
              { type: 'delete', props: { api: '/api/v1/rabbit/data/table/delete1', type: 'button',confirmMessageFormatter: (row) => ({ title: '删除', message: `确定要删除吗?` })} },
            ],
          },
        ]
      }"
      :detail-form="{
        props: {
          createTitle: '新增表',
          updateTitle: '修改表',
          type:type,
          visible:visible,
          id:id,
          form: {
            props: {
              'label-width': 'auto',
              rules: {
                code: [{ required: true, message: '表名不能为空'}],
                name: [{ required: true, message: '名称不能为空' },],
              },
            },
            items: [
              { component: { name: 'el-input', props: { maxlength: '50' } }, span: 24, props: { label: '名称', prop: 'name' }},
              { component: { name: 'el-input', props: { maxlength: '100' } }, span: 24, props: { label: '表名', prop: 'code' }, },
              { component: { name: 'drop-down-tree', props: { 'data-source-uri': '/api/v1/rabbit/data/category/find/tree','source-type':'uri' }, }, span: 24, props: { label: '分类', prop: 'categoryId' }, },
              { component: { name: 'status-selector', props: { options: [{label: '启用', value: 1},{label: '禁用', value: 0}] }}, span: 24, props: { label: '开启授权', prop: 'needAuth' }},
            ],
          },
        },
        events: {
          success: handleCreateSuccess,
          cancel:handleDetailCancel,
        },
      }"
    />
    <field-dialog :visible.sync="fieldVisible" :title="fieldTitle" :table-id="tableId" @success="refresh()" />
  </div>
</template>

<script>
import fieldDialog from './fieldDialog';
export default {
  name: "Classfication",
  components: {
    fieldDialog,
  },
  data() {
    return {
      id: '',
      type: '',
      visible: false,
      // 表单参数
      form: {},
      fieldTitle: '',
      fieldVisible: false,
      tableId: undefined,
    };
  },
  created() {
  },
  methods: {
    statusFormat(row) {
      if (row.needAuth === 1) {
        return "启用";
      }
      return "禁用";
    },
    // 新增
    handleAdd() {
      this.type = "create";
      this.visible = true;
    },
    handleAddField(val) {
      this.fieldVisible = true;
      this.fieldTitle = '新增字段';
      this.tableId = val.row.id;
    },
    // 编辑
    handleUpdate(data) {
      this.type = "update";
      this.visible = true;
      this.id = data.row.id;
    },
    handleDetailCancel() {
      this.visible = false;
      this.id = "";
      this.type = "";
    },
    handleCreateSuccess() {
      this.$refs["page"].refresh(1);
    },
  },
};
</script>
