<template>
  <div>
    <el-table
      v-loading="loading"
      :data="data.list"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="表名称" :show-overflow-tooltip="true" width="160" />
      <el-table-column prop="code" label="表代码" :show-overflow-tooltip="true" width="160" />
      <!--      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="80">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-switch-->
      <!--            :value="scope.row.status"-->
      <!--            :active-value="1"-->
      <!--            :inactive-value="0"-->
      <!--            @change="handleStatusChange(scope.row)"-->
      <!--          />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="创建人" align="left" prop="creatorId" />
      <el-table-column label="创建时间" align="left" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="left" prop="remark" />
      <el-table-column label="操作" align="left" width="380" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleCheckField(scope.row)"
          >查看字段</el-button>
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleAddField(scope.row)"
          >新增字段</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleRemoveField(scope.row)"
          >移除字段</el-button>
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
    ...mapState("table", [
      "data",
      "loading",
    ]),
  },
  created() {
    this.getList();
  },
  methods: {
    getList(payload) {
      this.$store.dispatch("table/getByPage", payload);
    },

    statusFormat(row) {
      if (row.status === 1) {
        return "启用";
      }
      return "停用";
    },

    handleUpdate(row) {
      this.$store.commit("table/setDialog", {
        detail: row,
        title: "修改数据库",
        visible: true,
        type: "update",
      });
    },

    handleStatusChange(row) {
      // const text = row.status === 1 ? '停用' : '启用';

      this.$doingConfirm().then(() => {
        this.$store.dispatch("table/update", { id: row.id, status: row.status === 1 ? 0 : 1 }).then((res) => {
          if (res.statusCode === 600) this.msgSuccess('切换成功');
        });
      }).catch(() => console.log("取消"));
      //
      // this.$confirm(`确认要${text}"${row.name}"菜单吗?`, '警告', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      // }).then(() => {
      //   this.$store.dispatch("table/update", { id: row.id, status: row.status === 1 ? 0 : 1 }).then((res) => {
      //     if (res.statusCode === 600) this.msgSuccess('切换成功');
      //   });
      // });
    },

    handleDelete(row) {
      this.$doingConfirm().then(() => {
        this.$store.dispatch("table/del", row.id).then(res => {
          if (res.statusCode === 600) this.msgSuccess('删除成功');
        });
      }).catch(() => console.log("取消"));
      // this.$confirm('是否确认删除名称为"' + (row.name || "") + '"的数据项?', '警告', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      // }).then(() => {
      //   return this.$store.dispatch("table/del", row.id);
      // }).then(() => {
      //   this.msgSuccess('删除成功');
      // });
    },

    handleCheckField(row) {
      this.$store.commit("table/fieldManage", {
        id: row.id,
        visible: true,
        type: "check",
      });
    },

    handleAddField(row) {
      this.$store.commit("table/fieldManage", {
        id: row.id,
        visible: true,
        type: "add",
      });
    },

    handleRemoveField(row) {
      this.$store.commit("table/fieldManage", {
        id: row.id,
        visible: true,
        type: "rm",
      });
    },
  },
};
</script>
