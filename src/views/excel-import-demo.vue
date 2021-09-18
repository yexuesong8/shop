<template>
  <ExcelImportButton
    template-download-url="/api/v1/magpie/meter/firm/template/download/excel"
    excel-import-url="/api/v1/magpie/meter/firm/import/excel"
    excel-save-url="/api/v1/magpie/meter/firm/create/batch"
    :table="{
      columns: columns,
      props: {
        border: true,
      },
    }"
  >
    <el-button type="primary">批量开户</el-button>
  </ExcelImportButton>
</template>

<script>
import ExcelImportButton from '@/components/ExcelImport/excel-import-button';
import { parseTime } from "@monkey.do/monkey";
import { dictFormatter } from "@/utils";

export default {
  name: "ExcelImportDemo",
  components: { ExcelImportButton },
  data() {
    return {
      columns: [
        { label: '营业区域', prop: 'name' },
        { label: '供水片区', prop: 'component' },
        { label: '用户名称', prop: 'type', htmlFormatter: ({ row }) => `<span>${dictFormatter('system_dict_type', row.type)}</span>` },
        { label: '用户编号', prop: 'createTime' },
        { label: '水表表号', prop: 'createTime' },
        { label: 'SIM卡号', prop: 'createTime' },
        { label: '水表厂商', prop: 'createTime' },
        { label: "水表类型", prop: 'createTime' },
        { label: "通讯方式", prop: 'createTime' },
        { label: "量程精度", prop: 'createTime' },
        { label: "水表口径", prop: 'createTime' },
        { label: "水表型号", prop: 'createTime' },
        { label: "水表分组", prop: 'createTime' },
        { label: "水表用途", prop: 'createTime' },
        { label: "地址", prop: "address" },
        { label: "安装日期", prop: 'createTime', formatter: (row) => parseTime(row.createTime) },
      ],
    };
  },
};
</script>
