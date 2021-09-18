<template>
  <el-dialog :visible.sync="visible" append-to-body @close="handleCancel">
    <el-tabs v-model="activeTab">
      <el-tab-pane v-if="type === 'add'" label="新增字段" name="first">
        <el-form ref="addForm" :model="field" :inline="true">
          <el-row v-for="(item, index) in indexArray" :key="item">
            <el-form-item label="字段名称" :prop="`name${item}`" size="small" :rules="[{ required: true, message: '请填写字段名称', trigger: 'blur' }]">
              <el-input
                :value="field[`name${item}`]"
                placeholder="请输入字段名称"
                clearable
                size="small"
                @input="(e) => handleInputChange(e, `name${item}`)"
              />
            </el-form-item>
            <el-form-item label="字段代码" :prop="`code${item}`" size="small" :rules="[{ required: true, message: '请填写字段代码', trigger: 'blur' }]">
              <el-input
                :value="field[`code${item}`]"
                placeholder="请输入字段代码"
                clearable
                size="small"
                @input="(e) => handleInputChange(e, `code${item}`)"
              />
            </el-form-item>
            <el-form-item v-if="item === indexArray[indexArray.length - 1]">
              <el-button icon="el-icon-plus" size="small" @click="handleAddFieldItem">新增</el-button>
            </el-form-item>
            <el-form-item v-if="index !== 0">
              <el-button icon="el-icon-delete" size="small" @click="() => handleRmFieldItem(item)">删除</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="type === 'add' ? '引用字段' : title" name="second">
        <el-form ref="searchForm" :model="search" :inline="true">
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
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'AddFieldList',
  data() {
    return {
      activeTab: "first",
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
      type: state => state.fieldType,
      data: state => state.fieldData,
    }),
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList(payload) {
      this.loading = true;
      this.$store.dispatch("table/getField", { ...payload, ...this.search }).then(() => {
        this.loading = false;
      });
    },

    handleSelectionChange(rows) {
      this.selectedRows = rows;
    },

    handleSubmit() {
      if (this.activeTab === "first") {
        this.$refs['addForm'].validate(valid => {
          if (valid) {
            const fieldList = this.indexArray.map(item => ({
              name: this.field[`name${item}`],
              code: this.field[`code${item}`],
            }));
            this.submitLoading = true;
            this.$store.dispatch("table/bindField", { tableId: this.id, fieldList }).then(res => {
              this.submitLoading = false;
              if (res.statusCode === 600) {
                this.msgSuccess("新增成功");
                this.handleCancel();
              }
            });
          }
        });
        return;
      }

      if (this.selectedRows.length > 0) {
        const payload = {
          tableId: this.id,
          fieldList: this.selectedRows.map(item => item.id),
        };
        this.submitLoading = true;
        this.$store.dispatch("table/addField", payload).then(res => {
          this.submitLoading = false;
          if (res.statusCode === 600) {
            this.msgSuccess("新增成功");
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
      this.$refs["searchForm"].validate(valid => {
        if (valid) {
          this.getList();
        }
      });
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
      // this.field[item] = value; // vue 不会响应 更新视图
      this.field = { ...this.field, ...{ [item]: value }};
    },
  },
};
</script>
