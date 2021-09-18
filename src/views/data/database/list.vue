<template>
  <!-- 数据管理-数据库管理 表格-->
  <div>
    <el-table
      v-loading="loading"
      :data="data.list"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="数据库名称" :show-overflow-tooltip="true" width="120" />
      <el-table-column prop="code" label="代码" align="left" width="120" />
      <el-table-column prop="deptName" label="部门" width="150" />
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="180">
        <template slot-scope="scope">
          <el-switch
            :value="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="left" width="200" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="left" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleAddTable(scope.row)"
          >新增表</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleRmTable(scope.row)"
          >移除表</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="data.total>0"
      :total="data.total"
      :page-num.sync="data.pageNum"
      :page-size.sync="data.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'List',
  data() {
    return {
      // 菜单状态数据字典
      statusOptions: [
        { key: 1, label: 1, value: "启用" },
        { key: 0, label: 0, value: "停用" },
      ],
    };
  },
  computed: {
    ...mapState("database", [
      "data",
      "loading",
    ]),
  },
  created() {
    this.getList();
  },
  methods: {
    getList(payload) {
      this.$store.dispatch("database/getByPage", payload);
    },

    statusFormat(row) {
      if (row.status === 1) {
        return "启用";
      }
      return "停用";
    },

    handleUpdate(row) {
      this.$store.commit("database/setDialog", {
        detail: { ...row },
        title: "修改数据库",
        visible: true,
        type: "update",
      });
    },

    handleStatusChange(row) {
      const text = row.status === 1 ? '停用' : '启用';
      this.$confirm(`确认要${text}"${row.name}"菜单吗?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$store.dispatch("database/update", { id: row.id, status: row.status === 1 ? 0 : 1 }).then((res) => {
          if (res.statusCode === 600) {
            this.msgSuccess('切换成功');
          }
        });
      });
    },

    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + (row.name || "") + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        return this.$store.dispatch("database/del", row.id);
      }).then(() => {
        this.msgSuccess('删除成功');
      });
    },

    handleAddTable(row) {
      this.$store.commit("database/tableManage", {
        title: "新增表",
        visible: true,
        id: row.id,
        type: "add",
      });
    },

    handleRmTable(row) {
      this.$store.commit("database/tableManage", {
        title: "移除表",
        visible: true,
        id: row.id,
        type: "rm",
      });
    },
  },
};
</script>
