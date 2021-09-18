<template>
  <el-dialog :title="title" :visible.sync="visible" append-to-body @close="handleCancel">
    <el-form ref="searchForm" :model="search" :inline="true">
      <el-form-item label="表名称" prop="name" size="small">
        <el-input
          v-model="search.name"
          placeholder="请输入表名称"
          clearable
          size="small"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item label="表代码" prop="code" size="small">
        <el-input
          v-model="search.code"
          placeholder="请输入表代码"
          clearable
          size="small"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" :loading="searchLoading" @click="handleSearch">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="searchLoading"
      :data="data.list"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" reserve-selection width="44" />
      <el-table-column prop="name" label="表名称" :show-overflow-tooltip="true" width="160" />
      <el-table-column prop="code" label="表代码" :show-overflow-tooltip="true" width="160" />
      <el-table-column prop="createName" label="创建人" :show-overflow-tooltip="true" width="160" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" width="160" />
    </el-table>
    <pagination
      v-show="data.total>0"
      :total="data.total"
      :page-num.sync="data.pageNum"
      :page-size.sync="data.pageSize"
      @pagination="getList"
    />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="confirmLoading" @click="handleSubmit">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'TableList',
  data() {
    return {
      search: {
      },
      searchLoading: false,
      confirmLoading: false,
      selectedRows: [],
    };
  },
  computed: {
    ...mapState("database", {
      visible: state => state.tableVisible,
      id: state => state.databaseId,
      title: state => state.tableTitle,
      type: state => state.tableType,
      data: state => state.tableData,
    }),
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList(payload) {
      this.searchLoading = true;
      if (this.type === "add") {
        return this.$store.dispatch("database/getNoTable", { ...payload, id: this.id, ...this.search }).then(res => {
          this.searchLoading = false;
          return res;
        });
      } else {
        return this.$store.dispatch("database/getTable", { ...payload, id: this.id, ...this.search }).then(res => {
          this.searchLoading = false;
          return res;
        });
      }
    },

    handleSelectionChange(rows) {
      this.selectedRows = rows;
    },

    handleSubmit() {
      if (this.selectedRows.length > 0) {
        this.confirmLoading = true;

        if (this.type === "add") {
          const payload = {
            dbId: this.id,
            dbTableList: this.selectedRows.map(item => item.id),
          };
          this.$store.dispatch("database/addTables", payload).then(res => {
            this.confirmLoading = false;
            if (res.statusCode === 600) {
              this.msgSuccess("添加成功");
              this.handleCancel();
            }
          });
        } else {
          const payload = {
            idList: this.selectedRows.map(item => item.id),
          };
          this.$store.dispatch("database/rmTables", payload).then(res => {
            this.confirmLoading = false;
            if (res.statusCode === 600) {
              this.msgSuccess("移除成功");
              this.handleCancel();
            }
          });
        }
      }
    },

    handleCancel() {
      this.$store.commit("database/tableManage", {
        visible: false,
        title: "",
        tableId: "",
      });
      this.resetForm("form");
    },

    handleSearch() {
      this.$refs["searchForm"].validate(valid => {
        if (valid) {
          this.searchLoading = true;
          this.getList().then(() => {
            this.searchLoading = false;
          });
        }
      });
    },

    handleReset() {
      this.search = {};
      this.resetForm("form");
    },
  },
};
</script>
