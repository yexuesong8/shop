<template>
  <el-row>
    <Table ref="table" api="/api/v1/rabbit/workflow/template/find/page" :params="{typeId: id}">
      <template v-slot:default="slot">
        <el-table v-loading="slot.loading" :data="slot.list" @selection-change="handleSelectionChange" @cell-dblclick="cellDbClick">
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="表单名称" prop="formName" />
          <el-table-column label="适用部门" prop="deptName" show-overflow-tooltip min-width="120" />
          <el-table-column label="是否启用" prop="enabled">
            <template slot-scope="scope">
              <el-switch :value="scope.row.enabled" :active-value="1" :inactive-value="0" @change="(value) => handleSwitchChange(value, scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="是否使用" prop="used">
            <template slot-scope="scope">
              <span>{{ scope.row.used === 0 ? "否" : "是" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新次数" prop="updateFrequency" />
          <el-table-column label="版本号" prop="versionNum" width="70" />
          <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip width="250">
            <template slot-scope="scope">
              {{ parseTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="action" width="250">
            <template slot-scope="scope">
              <el-button type="text" @click="handleTemplateCopy(scope.row)">复制</el-button>
              <el-button type="text" @click="handleTemplateUpdate(scope.row)">修改</el-button>
              <el-button type="text" @click="handleTemplateDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <no-data />
          </template>
        </el-table>
      </template>
    </Table>
  </el-row>
</template>
<script>
import { NoData } from "@monkey.do/monkey";
import { del, enable, copy } from "@/api/workflow/template";
import { Table } from "@/components";

export default {
  name: "WorkflowTemplate",
  components: { NoData, Table },
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      params: {
      },
    };
  },
  methods: {
    handleSelectionChange(selectedRows) {
      this.$emit("selection-change", selectedRows);
    },

    cellDbClick(row) {
      this.$router.push(`/rabbit/workflow/template?templateId=${row.id}`);
    },

    handleTemplateCopy(row) {
      this.$doingConfirm({ title: "复制模板", message: "确实要复制模板吗?" }).then(() => {
        copy({ id: row.id }).then(res => {
          if (res.statusCode === 600) {
            this.$message.success('复制成功');
            this.$refs["table"].refresh(1);
          }
        });
      });
    },
    handleTemplateUpdate(row) {
      this.$router.push(`/rabbit/workflow/template?templateId=${row.id}`);
    },
    handleTemplateDelete(row) {
      this.$doingConfirm({ title: "删除模板", message: "确实要删除模板吗?" }).then(() => {
        del({ id: row.id }).then(res => {
          if (res.statusCode === 600) {
            this.$message.success('删除成功');
            this.$refs["table"].refresh(1);
          }
        });
      });
    },
    handleSwitchChange(value, row) {
      const title = row.enabled === 1 ? "停用模板" : "启用模板";
      const message = row.enabled === 1 ? `确实停用模板'${row.typeName}'吗?` : `确实启用模板'${row.typeName}'吗?`;

      this.$doingConfirm({ title, message }).then(() => {
        enable({ id: row.id, enabled: row.enabled === 1 ? 0 : 1 }).then(res => {
          if (res.statusCode === 600) {
            this.$refs["table"].refresh();
            this.$message.success("操作成功");
          }
        });
      });
    },
  },
};
</script>
