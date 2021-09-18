<template>
  <div class="main-content-container full-fill">
    <Page
      base-api="/api/v1/rabbit/system/security/rule"
      :toolbar-buttons="['create']"
      :form="{
        defaultParams:{
          authStrategy: 1,
        },
        props: {
          'label-width': 'auto',
        },
        items: [
          { component: { name: 'el-input', props: { placeholder: '请输入IP', maxlength: '20', clearable: true } }, span: 6, props: { label: 'IP', prop: 'ip' },},
          { component: { name: 'el-input', props: { placeholder: '请输入MAC', maxlength: '20', clearable: true } }, span: 6, props: { label: 'MAC', prop: 'mac' },},
          { component: { name: 'button' }, span: 5 },
        ],
      }"
      :table="{
        'fixed-table': true,
        props:{
          border:true,
        },
        columns: [
          { type: 'index', label: '序号' },
          { label: 'IP', prop: 'ip', width:'260px' },
          { label: 'MAC', prop: 'mac', width:'260px' },
          {
            label: '操作',
            type: 'handlers',
            handlers: [
              { type: 'update', label: '修改' },
              { type: 'delete', props: { type: 'button',confirmMessageFormatter: (row) => ({ title: '删除', message: `确定要删除IP为${row.ip}的这一条数据吗?` })} },
            ],
          },
        ]
      }"
      :detail-form="{
        props: {
          createTitle: '新增白名单',
          updateTitle: '修改白名单',
          'default-params': {
            authStrategy:1,
          },
          'update-fields': ['id', 'ip', 'mac'],
          form: {
            props: {
              'label-width': 'auto',
              rules: {
                ip: [{ required: true, message: '请填写ip' }],
                mac: [{ required: true, message: '请填写mac' }],
              },
            },
            items: [
              { component: { name: 'el-input' }, span: 24, props: { label: 'IP', prop: 'ip' }, },
              { component: { name: 'el-input' }, span: 24, props: { label: 'MAC', prop: 'mac' }, },
            ],
          },
        },
      }"
    />
  </div>
</template>

<script>
export default {
  name: "White",
};
</script>
