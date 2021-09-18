<template>
  <div class="main-content-container full-fill">
    <Page
      ref="page"
      list-api="/api/v1/rabbit/workflow/my/cc/find/page"
      :toolbar-buttons="['refresh']"
      :form="{
        props: {
          'label-width': 'auto',
        },
        items: [
          { component: { name: 'el-input', props: { placeholder: '请输入标题' } }, span: 6, props: { label: '标题', prop: 'dataTitle' },},
          { component: { name: 'drop-down-list-selector', props: { wants: 'id', 'data-source-uri': '/api/v1/rabbit/workflow/type/find/all', 'source-type': 'uri' } }, span: 6, props: { label: '流程类型', prop: 'typeId' } },
          { component: { name: 'button' }, span: 6 },
        ],
      }"
      :table="{
        props:{
          border:true,
        },
        columns: [
          { label: '序号' , type: 'index'},
          { label: '标题', prop: 'dataTitle' },
          { label: '流程类型', prop: 'typeName' },
          { label: '流程状态', prop: 'status' ,htmlFormatter: ({ row }) => `<span>${dictFormatter('rabbit_workflow_status', row.status)}</span>`},
          { label: '发起人', prop: 'startMemberName' },
          { label: '当前环节', prop: 'currentNodeName' },
          { label: '发起时间', prop: 'createTime', formatter: (row) => parseTime(row.createTime)},
          {
            label: '操作', type: 'handlers',
            handlers: [
              { type: 'button', label: '查看', events: { click: handleCheck } },
              { type: 'button', label: '流程详情', events: { click: handleDetails } },
            ],
          },
        ]
      }"
    />
    <Form v-if="formVisible" :id="form.instanceId" ref="form" :form-visible="formVisible" :detail="{...form, id: form.instanceId}" type="'formCopySend'" @cancle="handleFormCancle" />
    <WorkflowDetail v-if="detailVisible" :id="form.instanceId" ref="WorkflowDetail" :detail-visible="detailVisible" @cancle="handleDetailCancle" />
  </div>

</template>

<script>
import Form from "./component/form";
import WorkflowDetail from "./component/detail";

export default {
  name: "WorkflowCopySend",
  components: {
    Form,
    WorkflowDetail,
  },
  data() {
    return {
      formVisible: false,
      detailVisible: false,
      form: {},
    };
  },
  methods: {
    handleFormCancle(visible) {
      this.formVisible = visible;
    },
    handleDetailCancle(visible) {
      this.detailVisible = visible;
    },
    handleCheck(scope) {
      this.form = { ...scope.row };
      this.formVisible = true;
    },
    handleDetails(scope) {
      this.form = { ...scope.row };
      this.detailVisible = true;
      this.$nextTick(() => {
        this.$refs['WorkflowDetail'].handleSlotClick();
      });
    },
  },
};
</script>
