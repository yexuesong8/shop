<template>
  <!-- 属性 -->
  <Dialog
    v-if="attriVisible"
    :title="title"
    :visible="attriVisible"
    width="800px"
    :loading="loading"
    @cancel="cancel"
    @confirm="submitForm"
  >
    <div class="btn">
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" :disabled="!attriList" @click="handleSort">排序</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="loading" border :data="attriList.list">
      <el-table-column type="index" fixed="left" />
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column label="组" prop="groupName" min-width="50" />
      <el-table-column label="代码" prop="code" show-overflow-tooltip />
      <el-table-column label="名称" prop="name" />
      <el-table-column label="类型" prop="typeName" />
      <el-table-column label="选项值" prop="options" show-overflow-tooltip />
      <el-table-column label="编辑器" prop="editor" show-overflow-tooltip />
      <el-table-column label="是否必填" prop="required">
        <template slot-scope="scope">
          <el-switch :value="scope.row.required === 1" />
        </template>
      </el-table-column>
      <el-table-column label="默认值" prop="defaultValue" show-overflow-tooltip />
      <el-table-column label="提示" prop="prompt" show-overflow-tooltip />
      <el-table-column label="顺序" prop="sortNum" show-overflow-tooltip />
      <el-table-column label="描述" prop="description" show-overflow-tooltip />
      <el-table-column label="创建人" prop="creatorName" show-overflow-tooltip />
      <el-table-column label="创建时间" prop="createTime" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="修改人" prop="updatorName" show-overflow-tooltip />
      <el-table-column label="修改时间" prop="updateTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ parseTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" fixed="right" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      :total="attriList.total"
      :page-size="attriList.pageSize"
      :page-num="attriList.pageNum"
      :on-change="handlePaginationChange"
    />
    <!-- 排序 -->
    <Sort :visible="sortVisible" :title="sortTitle" v-bind="$attrs" @close="handleClose" />
    <!-- 新增&修改模态框 -->
    <Detail v-if="visible" :form="updateForm" :visible="visible" :title="subtitle" v-bind="$attrs" @close="handleClose" @update="handleChange" />
  </Dialog>
</template>

<script>
import { delAttri } from "@/api/page/propertiesDetail";
import { Dialog } from "@monkey.do/monkey";
import Detail from "./detail";
import Sort from "./sort";

export default {
  name: "PropertiesDetail",
  components: {
    Dialog,
    Detail,
    Sort,
  },
  props: {
    attriVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    attriList: {
      type: Object,
      default: () => ({}),
    },
    getAttriList: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      // 是否显示模态框
      visible: false,
      // 是否显示排序
      sortVisible: false,
      // 模态框标题
      subtitle: "",
      // 标题
      sortTitle: '',
      // 修改表单
      updateForm: {
        required: true,
      },
    };
  },
  methods: {
    // 新增
    handleAdd() {
      this.visible = true;
      this.subtitle = "新增属性";
    },
    // 刷新数据
    handleChange(data) {
      this.getAttriList(data);
      this.$emit("update", data);
    },
    // 取消
    cancel() {
      this.$emit("close");
    },
    // 修改
    handleUpdate(data) {
      this.visible = true;
      this.updateForm = { ...data };
      this.updateForm.required = this.updateForm.required === 1;
      this.subtitle = "修改属性";
    },
    // 排序
    handleSort() {
      this.sortVisible = true;
      this.sortTitle = "排序";
    },
    // 删除
    handleDel(row) {
      this.$doingConfirm({ title: "删除属性", message: "确定要删除当前属性吗？" })
        .then(async() => {
          const { statusCode } = await delAttri({ id: row.id });
          if (statusCode) {
            this.msgSuccess("删除成功");
            this.getAttriList(row.componentId);
            this.$emit("update", row.componentId);
          }
        })
        .catch(() => { console.log("取消删除"); });
    },
    submitForm() {
      this.$emit("close");
    },
    // 关闭模态框
    handleClose() {
      this.updateForm = {};
      this.visible = false;
      this.sortVisible = false;
    },
    // 分页改变
    handlePaginationChange(pagination) {
      this.$emit("change", pagination);
    },
  },
};
</script>

<style lang="scss" scoped>
.btn{
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>
