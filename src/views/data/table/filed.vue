<template>
  <el-dialog :title="title" :visible.sync="visible" append-to-body @close="handleCancel">
    <el-form ref="form" :model="search" :inline="true">
      <el-form-item label="字段名称" prop="name" size="small">
        <el-input
          v-model="search.name"
          placeholder="请输入字段名称"
          clearable
          size="small"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item label="字段代码" prop="code" size="small">
        <el-input
          v-model="search.code"
          placeholder="请输入字段代码"
          clearable
          size="small"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" :loading="loading" @click="handleSearch">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="data.list"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" reserve-selection width="44" />
      <el-table-column prop="name" label="字段名称" :show-overflow-tooltip="true" width="160" />
      <el-table-column prop="code" label="字段代码" :show-overflow-tooltip="true" width="160" />
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
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'FieldList',
  data() {
    return {
      search: {
      },
      field: {
      },
      indexArray: [0],
      selectedRows: [],
      loading: false,
      submitLoading: false,
    };
  },
  computed: {
    ...mapState("table", {
      visible: state => state.fieldVisible,
      id: state => state.tableId,
      title: state => state.fieldType === "rm" ? "移除字段" : (state.fieldType === "check" ? "查看字段" : "新增字段"),
      type: state => state.fieldType,
      data: state => state.fieldData,
      activeTab: state => state.fieldType === "add" ? "first" : "second",
    }),
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList(payload) {
      this.loading = true;
      this.$store.dispatch("table/getExistField", { ...payload, ...this.search }).then(() => {
        this.loading = false;
      });
    },

    handleSelectionChange(rows) {
      this.selectedRows = rows;
    },

    handleSubmit() {
      if (this.type === "check") {
        this.handleCancel();
        return;
      }

      if (this.selectedRows.length > 0) {
        const payload = {
          id: this.id,
          fieldList: this.selectedRows.map(item => item.id),
        };
        this.submitLoading = true;
        this.$store.dispatch("table/rmField", payload).then(res => {
          this.submitLoading = false;
          if (res.statusCode === 600) {
            this.msgSuccess("删除成功");
            this.handleCancel();
          }
        });
      }
    },

    handleCancel() {
      this.$store.commit("table/fieldManage", {
        visible: false,
        id: "",
        type: "",
      });
      this.resetForm("form");
    },

    handleSearch() {
      this.getList();
    },

    handleReset() {
      this.resetForm("form");
    },

    handleAddFieldItem() {
      this.indexArray.push(this.indexArray[this.indexArray.length - 1] + 1);
    },

    handleRmFieldItem(itemKey) {
      this.indexArray = this.indexArray.filter(item => item !== itemKey);
      Reflect.deleteProperty(this.field, `name${itemKey}`);
      Reflect.deleteProperty(this.field, `code${itemKey}`);
    },

    handleInputChange(value, item) {
      this.field = { ...this.field, ...{ [item]: value }};
    },
  },
};
</script>
