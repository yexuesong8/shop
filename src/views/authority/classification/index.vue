<template>
  <!-- 权限管理-接口分类 -->
  <div class="main-content-container full-fill">
    <Page
      ref="page"
      list-api="/api/v1/rabbit/system/api/category/find/page"
      base-api="/api/v1/rabbit/system/api/category"
      :toolbar-buttons="[
        { type: 'create', events: { click: handleAdd } },
        'refresh',
      ]"
      :form="{
        props: {
          'label-width': 'auto',
        },
        items: [
          { component: { name: 'el-input', props: { placeholder: '请输入名称' } }, trim: false, span: 6, props: { label: '名称', prop: 'name' }, },
          { component: { name: 'drop-down-tree', props: { 'data-source-uri': '/api/v1/rabbit/system/api/category/find/tree', 'source-type': 'uri' }, }, span: 8, props: { label: '分类', prop: 'parentId' } },
          { component: { name: 'button' }, span: 6 },
        ],
      }"
      :table="{
        props:{
          border:true,
        },
        columns: [
          { label: '名称', prop: 'name' },
          { label: '编码', prop: 'code' },
          { label: '上级分类', prop: 'parentId', formatter: (row) => row.parentName },{
            label: '操作',
            type: 'handlers',
            handlers: [
              { type: 'button', label: '修改', events: { click: handleUpdate } },
              { type: 'delete', props: { api: '/api/v1/rabbit/system/api/category/delete', type: 'button',confirmMessageFormatter: (row) => ({ title: '删除', message: `确定要删除吗?` })} },
            ],
          },
        ]
      }"
      :detail-form="{
        props: {
          createTitle: '新增接口分类',
          updateTitle: '修改接口分类',
          type:type,
          visible:visible,
          id:id,
          form: {
            props: {
              'label-width': 'auto',
              rules: {
                code: [{ required: true, validator: validateCode }],
                name: [{ required: true, message: '名称不能为空' },],
              },
            },
            items: [
              { component: { name: 'el-input', props: { maxlength: '50' } }, span: 24, props: { label: '名称', prop: 'name' }},
              { component: { name: 'el-input', props: { maxlength: '100' } }, span: 24, props: { label: '编码', prop: 'code' }},
              { component: { name: 'drop-down-tree', props: { 'data-source-uri': '/api/v1/rabbit/system/api/category/find/tree','source-type':'uri' }, }, span: 24, props: { label: '上级分类', prop: 'parentId' }, },
            ],
          },
        },
        events: {
          success: handleCreateSuccess,
          cancel:handleDetailCancel,
          beforeSubmit: handleBeforeSubmit,
        },
      }"
    />
  </div>
</template>

<script>
const validateCode = (rule, value, callback) => {
  const reg = /^([a-z_A-Z-0-9]+)$/;
  if (!value) {
    callback('请输入编码');
  } else if (!reg.test(value)) {
    callback('请输入正确的编码');
  } else {
    callback();
  }
};
export default {
  name: "Classfication",
  data() {
    return {
      id: '',
      type: '',
      visible: false,
      validateCode,
      // 表单参数
      form: {},
    };
  },
  created() {
  },
  methods: {
    // 新增
    handleAdd() {
      this.type = "create";
      this.visible = true;
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
    handleBeforeSubmit(data) {
      console.log(`before submit`, data);
    },
  },
};
</script>
