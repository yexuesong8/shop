<template>
  <!-- 系统管理 表权限管控 -->
  <div class="main-content-container">
    <list-container ref="listContainer" api="/api/v1/rabbit/system/table/find/page" :form-props="{'label-width': 'auto'}">
      <!-- 搜索表单插槽 -->
      <template v-slot:form="slot">
        <filter-search class="mb10">
          <template v-slot:search>
            <el-row type="flex" class="mt10">
              <el-col :span="6">
                <el-form-item label="功能名">
                  <el-input v-model="slot.form.name" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="表名">
                  <el-input v-model="slot.form.code" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="类型">
                  <DictionarySelector :value.sync="slot.form.createType" code="system_dict_type" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="应用">
                  <DictionarySelector :value.sync="slot.form.appId" code="general_app" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="8" justify="end">
              <el-col :span="1.5">
                <el-button type="primary" :loading="slot.loading" @click="slot.search()">确认</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button @click="slot.reset()">重置</el-button>
              </el-col>
            </el-row>
          </template>
          <template v-slot:actions>
            <el-button type="primary" @click="handleAddTable">新增表</el-button>
            <el-button class="el-icon-refresh" :loading="slot.loading" @click="slot.refresh()" />
          </template>
        </filter-search>
      </template>

      <!-- 表格插槽 -->
      <template v-slot:table="table">
        <el-table v-loading="table.loading" :data="table.list" row-key="id" :expand-row-keys="expandRowKeys" border @cell-dblclick="handleTableDblclick">
          <el-table-column type="expand">
            <template slot-scope="{ row: tableRow }">
              <el-table :data="tableRow.fieldList">
                <el-table-column label="名称" prop="name" />
                <el-table-column label="字段" prop="code" />
                <el-table-column label="类型" prop="type">
                  <template v-slot="{ row: fieldRow }">
                    <span>{{ dictFormatter('system_field_type', fieldRow.type) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="长度" prop="length" />
                <el-table-column label="实体关联表" prop="entityTableName" />
                <el-table-column label="备注" prop="remark" show-overflow-tooltip />
                <el-table-column label="权限字段" prop="allowScopeField">
                  <template v-slot="{ row: fieldRow }">
                    <span>{{ fieldRow.allowScopeField ? '是' : '否' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template v-slot="{ row: fieldRow }">
                    <el-button type="text" @click="handleEditField(fieldRow)">编辑</el-button>
                    <el-button type="text" @click="handleDelField({ tableId: tableRow.id ,...fieldRow })">删除</el-button>
                  </template>
                </el-table-column>
                <template v-slot:empty>
                  <no-data />
                </template>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50" />
          <el-table-column label="功能名" prop="name" />
          <el-table-column label="表名" prop="code" />
          <el-table-column label="类型" prop="createType">
            <template v-slot="{ row }">
              <span>{{ dictFormatter('system_dict_type', row.createType) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="应用">
            <template v-slot="{ row }">
              <span>{{ dictFormatter('general_app', Number(row.appId)) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="目录" prop="directoryName" show-overflow-tooltip />
          <el-table-column label="权限管控" prop="joinAllowRule">
            <template v-slot="{ row }">
              <el-switch :value="row.joinAllowRule" :active-value="1" :inactive-value="0" @change="handleTableSwitch($event, row)" />
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" show-overflow-tooltip />
          <el-table-column label="操作" min-width="100" fixed="right">
            <template v-slot="{ row }">
              <el-row type="flex">
                <el-button type="text" @click="handleAddField(row)">新增字段</el-button>
                <el-button type="text" @click="handleSort(row)">权限字段</el-button>
                <el-button type="text" @click="handleDelTable(row)">删除</el-button>
              </el-row>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <no-data />
          </template>
        </el-table>
      </template>
    </list-container>

    <sort-dialog :data="sortFieldData" :visible.sync="sortVisible" @success="refresh()" />

    <table-dialog :visible.sync="tableVisible" :current-row.sync="currentTable" :title="tableTitle" @success="refresh()" />

    <field-dialog :visible.sync="fieldVisible" :current-row.sync="currentField" :title="fieldTitle" @success="refresh()" />
  </div>
</template>

<script>
import { ListContainer } from "@/components";
import tableDialog from './tableDialog';
import fieldDialog from './fieldDialog';
import sortDialog from './sort';
import { allowRule, deleteTable, deleteField } from "@/api/system/table";

export default {
  name: 'TableManage',
  components: {
    tableDialog,
    ListContainer,
    fieldDialog,
    sortDialog,
  },
  data() {
    return {
      tableVisible: false,
      tableTitle: '',
      currentTable: {},
      fieldVisible: false,
      fieldTitle: '',
      currentField: {},
      expandRowKeys: [],
      sortVisible: false,
      sortFieldData: {},
    };
  },
  watch: {
    sortVisible(val) {
      if (!val) this.sortFieldData = {};
    },
  },
  methods: {
    handleAddTable() {
      this.tableVisible = true;
      this.tableTitle = '新增表';
    },
    handleTableDblclick(row) {
      this.tableVisible = true;
      this.tableTitle = '编辑表';
      this.currentTable = JSON.parse(JSON.stringify(row));
    },
    refresh() {
      this.$refs["listContainer"].refresh();
    },
    handleAddField({ id }) {
      // this.expandRowKeys = [id]; // 点击新增字段展开此行
      this.fieldVisible = true;
      this.fieldTitle = '新增字段';
      this.currentField = { tableId: id, ...this.currentField };
    },
    handleEditField(row) {
      this.fieldVisible = true;
      this.fieldTitle = '编辑字段';
      this.currentField = JSON.parse(JSON.stringify(row));
    },
    handleSort(row) {
      const hash = { tableId: row.id, fieldList: row.fieldList };
      this.sortVisible = true;
      this.sortFieldData = hash;
    },
    handleDelField({ tableId, id }) {
      this.$doingConfirm({ title: "删除字段", message: "确定要删除此字段吗?" }).then(() => {
        deleteField({ tableId, id }).then(res => {
          if (res.statusCode !== 600) return;
          this.msgSuccess('删除字段成功');
          this.refresh();
        });
      });
    },
    handleTableSwitch(value, row) {
      this.$doingConfirm({ title: "权限管控", message: "确定此操作吗?" }).then(async() => {
        const res = await allowRule(row.id);
        if (res.statusCode !== 600) return;
        this.msgSuccess('修改成功');
        this.refresh();
      });
    },
    handleDelTable({ id }) {
      this.$doingConfirm({ title: "删除表", message: "确定要删除此表吗?" }).then(() => {
        deleteTable(id).then(res => {
          if (res.statusCode !== 600) return;
          this.msgSuccess('删除成功');
          this.refresh();
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-table__expanded-cell[class*=cell] {
  padding: 10px 30px;
}
</style>
