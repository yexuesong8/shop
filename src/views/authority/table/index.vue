<template>
  <!-- 系统管理 表权限管控 -->
  <div class="main-content-container">
    <list-container ref="listContainer" api="/api/v1/rabbit/auth/data/table/find/page" :form-props="{'label-width': 'auto'}">
      <!-- 搜索表单插槽 -->
      <template v-slot:form="slot">
        <filter-search class="mb10">
          <template v-slot:search>
            <el-row type="flex" class="mt10">
              <el-col :span="6">
                <el-form-item label="名称" placeholder="请输入名称">
                  <el-input v-model="slot.form.name" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="表名" placeholder="请输入表名">
                  <el-input v-model="slot.form.code" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="分类">
                  <DropDownTreeSelector
                    v-model="slot.form.categoryId"
                    placeholder="请选择分类"
                    data-source-uri="/api/v1/rabbit/data/category/find/tree"
                    source-type="uri"
                    wants="id"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="开启授权">
                  <list-selector
                    v-model="slot.form.needAuth"
                    wants="id"
                    source-type="json"
                    :json-data="[{ id: '1', name: '启用' }, { id: '0', name: '禁用' }]"
                  />
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
        <el-table v-loading="table.loading" :data="table.list" row-key="id" :expand-row-keys="expandRowKeys" border @expand-change="(row, expandedRows ) => { handleExpandFeild(row, expandedRows , table.list) }">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table :data="feildList[scope.$index]">
                <el-table-column label="名称" prop="name" />
                <el-table-column label="编码" prop="code" />
                <el-table-column label="授权方式" prop="authModeCode">
                  <!-- <template v-slot:default="slot">
                    {{ authFormatter(slot.row.authModeCode) }}
                  </template> -->
                  <template v-slot:default="slot">
                    <div v-if="slot.row.authMode">
                      {{ slot.row.authMode.name }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="对应字典" prop="dictionaryName">
                  <!-- <template v-slot:default="slot">
                    {{ dictFormatter( slot.row., slot.row.dictionaryCode) }}
                  </template> -->
                </el-table-column>
                <el-table-column label="操作">
                  <template v-slot="slot">
                    <el-button type="text" @click="handleEditField(slot.row, scope.$index)">编辑</el-button>
                    <el-button type="text" @click="handleDelField({ id: slot.row.id }, scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
                <template v-slot:empty>
                  <no-data />
                </template>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="表名" prop="code" />
          <el-table-column label="分类" prop="categoryId">
            <template v-slot="{ row }">
              <span>{{ row.categoryName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="授权" prop="needAuth">
            <template v-slot="{ row }">
              <el-switch :value="row.needAuth" :active-value="1" :inactive-value="0" @change="handleSwitch($event, row)" />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" fixed="right">
            <template v-slot="{ row, $index }">
              <el-row type="flex">
                <el-button type="text" @click="handleAddField(row, $index)">新增字段</el-button>
                <el-button type="text" @click="handleTableDblclick(row)">修改</el-button>
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

    <!-- <sort-dialog :data="sortFieldData" :visible.sync="sortVisible" @success="refresh()" /> -->

    <table-dialog :visible.sync="tableVisible" :current-row.sync="currentTable" :title="tableTitle" @success="refresh()" />

    <field-dialog :visible.sync="fieldVisible" :current-row.sync="currentField" :title="fieldTitle" @getFeildList="getFeildList()" />
  </div>
</template>

<script>
import { ListContainer } from "@/components";
import tableDialog from './tableDialog';
import fieldDialog from './fieldDialog';
import { deleteTable, deleteField, getField, updateTable } from "@/api/authority/table";

export default {
  name: 'Table',
  components: {
    tableDialog,
    ListContainer,
    fieldDialog,
  },
  data() {
    return {
      tableVisible: false,
      tableTitle: '',
      currentTable: {},
      currentTableId: '',
      fieldVisible: false,
      fieldTitle: '',
      currentField: {},
      expandRowKeys: [],
      feildList: [],
      currentIndex: undefined,
      JSONData: [{ id: 1, name: '启用' }, { id: 0, name: '禁用' }],
    };
  },
  methods: {
    authFormatter(type) {
      switch (type) {
        case "dictionary":
          return '按字典';
        case "number":
          return '按数值';
        case "dept":
          return '按部门';
        case "member":
          return '按人员';
        case "exclude":
          return '不参与授权';
      }
    },
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
    handleSwitch(val, row) {
      this.$doingConfirm({ title: "授权", message: "确定此操作吗?" }).then(async() => {
        const res = await updateTable({ ...row, needAuth: val ? 1 : 0 });
        if (res.statusCode !== 600) return;
        this.msgSuccess('修改成功');
        this.refresh();
      });
    },
    handleAddField({ id }, index) {
      this.currentIndex = index;
      // this.expandRowKeys = [id]; // 点击新增字段展开此行
      this.fieldVisible = true;
      this.fieldTitle = '新增字段';
      this.currentField = { tableId: id, ...this.currentField };
    },
    handleEditField(row, index) {
      this.currentIndex = index;
      this.fieldVisible = true;
      this.fieldTitle = '编辑字段';
      this.currentField = JSON.parse(JSON.stringify(row));
    },
    handleDelField({ id }, index) {
      this.currentIndex = index;
      this.$doingConfirm({ title: "删除字段", message: "确定要删除此字段吗?" }).then(() => {
        deleteField({ tableId: this.currentTableId, id }).then(res => {
          if (res.statusCode !== 600) return;
          this.getFeildList();
          this.msgSuccess('删除字段成功');
          this.refresh();
        });
      });
    },
    getFeildList() {
      this.loading = true;
      getField({ tableId: this.currentField.tableId || this.currentTableId }).then((response) => {
        if (response.statusCode === 600) {
          this.$set(this.feildList, this.currentIndex, response.data);
        }
        this.loading = false;
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
    handleExpandFeild(row, expandedRows, list) {
      const index = list.findIndex(item => item.id === row.id);
      let flag;
      if (expandedRows.length > 0) {
        flag = expandedRows.some((item) => {
          return item.id === row.id;
        });
        if (flag) {
          this.loading = true;
          this.currentTableId = row.id;
          getField({ tableId: row.id }).then((response) => {
            if (response.statusCode === 600) {
              this.$set(this.feildList, index, response.data);
            }
            this.loading = false;
          });
        }
      }
    },

  },
};
</script>
<style lang="scss" scoped>
/deep/.el-table__expanded-cell[class*=cell] {
  padding: 10px 30px;
}
</style>
