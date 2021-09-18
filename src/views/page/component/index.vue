<template>
  <!-- 页面组件 -->
  <div class="main-content-container">
    <FilterSearch class="mb20">
      <template v-slot:search>
        <Search :group-list="groupList" :loading="loading" @search="handleSearch" />
      </template>
      <template v-slot:actions>
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="handleGroup">分组设置</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" :disabled="!allGroup.length" @click="handleGroupSort">排序</el-button>
          </el-col>
        </el-row>
      </template>
    </FilterSearch>

    <el-table v-loading="loading" border :data="tableList.list">
      <el-table-column type="index" fixed="left" />
      <el-table-column label="组" prop="groupName" min-width="50" />
      <el-table-column label="名称" prop="name" show-overflow-tooltip />
      <el-table-column label="代码" prop="code" show-overflow-tooltip />
      <el-table-column label="图标" prop="icon" show-overflow-tooltip />
      <el-table-column label="模板" prop="template" show-overflow-tooltip />
      <el-table-column label="是否可见" prop="groupName">
        <template slot-scope="scope">
          <el-switch :value="scope.row.visible=== 1 ? true:false" />
        </template>
      </el-table-column>
      <el-table-column label="顺序" prop="sortNum" width="50" />
      <el-table-column label="描述" prop="description" show-overflow-tooltip />
      <el-table-column label="创建人" prop="creatorName" show-overflow-tooltip />
      <el-table-column label="创建时间" prop="createTime" width="150">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="修改人" prop="updatorName" show-overflow-tooltip />
      <el-table-column label="修改时间" prop="updateTime" width="150">
        <template slot-scope="scope">
          {{ parseTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" min-width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" @click="handleAttri(scope.row.id)">属性</el-button>
          <el-button type="text" @click="handleDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      :total="tableList.total"
      :page-size="tableList.pageSize"
      :page-num="tableList.pageNum"
      :on-change="handlePaginationChange"
    />
    <!-- 组件排序 -->
    <Dialog
      v-if="sortVisible"
      :title="title"
      :visible="sortVisible"
      :loading="loading"
      width="350px"
      @cancel="cancel"
      @confirm="sortSubmitForm"
    >
      <div v-for="item in allGroup" :key="item.id">
        <span>{{ item.name }}</span>
        <Draggable v-model="item.components">
          <div v-for="val in item.components" :key="val.id" class="group-list-item">{{ val.name }}</div>
        </Draggable>
      </div>
    </Dialog>
    <!-- 新增&修改模态框 -->
    <Dialog
      v-if="isVisible"
      :title="title"
      :visible="isVisible"
      width="500px"
      :loading="loading"
      @cancel="cancel"
      @confirm="submitForm"
    >
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="auto">
        <el-form-item label="组:" prop="groupId">
          <ListSelector wants="id" data-source-uri="/api/v1/rabbit/page/component/group/find" source-type="uri" @change="handleGroupSelect" />
        </el-form-item>
        <el-form-item label="名称:" prop="name">
          <el-input v-model="addForm.name" clearable placeholder="请输入名称" :maxlength="50" />
        </el-form-item>
        <el-form-item label="图标:" prop="icon">
          <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelector'].reset()">
            <IconSelector ref="iconSelector" @selected="selected" />
            <el-input slot="reference" v-model="addForm.icon" placeholder="点击选择图标" readonly>
              <svg-icon slot="prefix" :icon-class="addForm.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="代码:" prop="code">
          <el-input v-model="addForm.code" clearable placeholder="请输入代码" :maxlength="50" />
        </el-form-item>
        <el-form-item label="是否可见:">
          <el-switch v-model="addForm.visible" />
        </el-form-item>
        <el-form-item label="顺序:" prop="sortNum">
          <el-input-number v-model="addForm.sortNum" :min="1" :maxlength="10" />
        </el-form-item>
        <el-form-item label="模板:" prop="template">
          <el-input v-model="addForm.template" clearable type="textarea" placeholder="请输入模板" :maxlength="100" />
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="addForm.description" clearable type="textarea" placeholder="请输入描述" :maxlength="200" />
        </el-form-item>
      </el-form>
    </Dialog>
    <!-- 分组设置 -->
    <Detail v-if="groupVisible" :visible="groupVisible" :group-list="groupList" :title="title" @close="handleClose" @update="refresh" />
    <!-- 属性详情 -->
    <PropertiesDetail
      :attri-visible="attriVisible"
      :sort-list="sortList"
      :get-attri-list="getAttriList"
      :attri-list="attriList"
      :title="title"
      :component-id="componentId"
      @close="handleClose"
      @change="handlePageChange"
      @update="handleUpdateAttri"
    />
  </div>
</template>

<script>
import { fetch, fetchList, addComponent, updateComponent, delComponent, fetchAll, groupSort } from "@/api/page/group";
import { getAttri, findSort } from "@/api/page/propertiesDetail";
import Search from "./search";
import Detail from "./groupDetail";
import PropertiesDetail from "../properties/detail";
import Draggable from 'vuedraggable';

export default {
  name: "PageComponent",
  components: {
    Search,
    Detail,
    PropertiesDetail,
    Draggable,
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 新增表单
      addForm: {
        groupId: "",
        name: "",
        code: "",
        icon: "",
        template: "",
        description: "",
        visible: true,
      },
      // 新增表单验证
      rules: {
        name: [
          { required: true, message: "分组名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "代码不能为空", trigger: "blur" },
        ],
        icon: [
          { required: true, message: "图标不能为空", validator: this.validateReceiver },
        ],
        groupId: [
          { required: true, message: "分组不能为空", trigger: "blur" },
        ],
        template: [
          { required: true, message: "模板不能为空", trigger: "blur" },
        ],
      },
      // 是否显示组件排序模态框
      sortVisible: false,
      // 组件排序
      groupSortList: [],
      // 属性数据
      attriList: {
        list: [],
      },
      // 所有组件
      allGroup: [],
      // 组件id
      componentId: "",
      // 分组
      groupList: [],
      // 表格数据
      tableList: {},
      // 弹出层标题
      title: "",
      // 是否显示模态框
      isVisible: false,
      // 是否显示分组模态框
      groupVisible: false,
      // 是否显示属性
      attriVisible: false,
      // 属性排序
      sortList: [],
      // 组件查询表单
      findForm: {
        pageNum: "1",
        pageSize: "10",
      },
    };
  },
  watch: {
    allGroup: {
      handler(newValue, oldValue) {
        this.groupSortList = newValue.map(item => {
          return item.components.map(val => {
            return val.id;
          });
        });
      },
      deep: true,
    },
  },
  created() {
    this.getList();
    this.getGroup();
    this.getAllGroup();
  },
  methods: {
    /** 查询分组 */
    async getGroup() {
      const { data } = await fetch();
      this.groupList = data;
    },
    /** 查询列表 */
    async getList() {
      this.loading = true;
      const { data, statusCode } = await fetchList(this.findForm);
      if (statusCode === 600) {
        this.tableList = data;
      }
      this.loading = false;
    },
    // 查询全部组件
    async getAllGroup() {
      const { data, statusCode } = await fetchAll();
      if (statusCode === 600) {
        this.allGroup = data;
      }
    },
    /** 查询属性 */
    async getAttriList(id) {
      const { statusCode, data } = await getAttri({ ...this.findForm, componentId: id });
      if (statusCode === 600) {
        this.attriList = data;
      }
    },
    // 查询属性排序
    async getAttriSort(id) {
      const { statusCode, data } = await findSort({ componentId: id });
      if (statusCode === 600) {
        this.sortList = data;
      }
    },
    // 更新属性
    handleUpdateAttri(id) {
      this.getAttriSort(id);
    },
    // 刷新
    refresh() {
      this.getGroup();
    },
    // 属性分页
    handlePageChange(data) {
      this.findForm.pageNum = data.pageNum;
      this.findForm.pageSize = data.pageSize;
      this.getAttriList(this.componentId);
    },
    // 分组选择
    handleSelector(data) {
      this.addForm.groupId = data;
    },
    // 分页查询
    handlePaginationChange(pagination) {
      this.findForm.pageNum = pagination.pageNum;
      this.findForm.pageSize = pagination.pageSize;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.visible = true;
      this.isVisible = true;
      this.title = "新增组件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.isVisible = true;
      this.addForm = { ...row };
      this.addForm.visible = row.visible === 1;
      this.title = "修改组件";
    },
    /** 属性按钮操作 */
    handleAttri(id) {
      this.componentId = id;
      this.attriVisible = true;
      this.title = "属性";
      this.getAttriList(id);
      this.getAttriSort(id);
    },
    /** 删除按钮操作 */
    handleDel(id) {
      this.$doingConfirm({ title: "删除组件", message: "确定要删除当前组件吗？" })
        .then(async() => {
          const { statusCode } = await delComponent({ id: id });
          if (statusCode === 600) {
            this.msgSuccess("删除成功");
            this.getList();
          }
        })
        .catch(() => console.log("删除取消"));
    },
    // 组件排序
    handleGroupSort() {
      this.getAllGroup();
      this.sortVisible = true;
      this.title = "排序";
    },
    // 组件排序提交
    async sortSubmitForm() {
      this.loading = true;
      const { statusCode } = await groupSort({ ids: this.groupSortList });
      if (statusCode === 600) {
        this.msgSuccess("排序成功");
        this.sortVisible = false;
      }
      this.loading = false;
    },
    // 搜索
    handleSearch(data) {
      this.findForm = { ...this.findForm, ...data, visible: data.visible === true ? "1" : "0" };
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.isVisible = false;
      this.sortVisible = false;
      this.reset();
    },
    // 分组设置
    handleGroup() {
      this.getGroup();
      this.groupVisible = true;
      this.title = "分组设置";
    },
    // 关闭分组模态框
    handleClose() {
      this.groupVisible = false;
      this.attriVisible = false;
    },
    handleGroupSelect(value) {
      this.addForm = { ...this.addForm, groupId: value };
    },
    // 图标选择
    selected(name) {
      this.addForm = { ...this.addForm, icon: name };
    },
    // 图标验证
    validateReceiver(rules, value, callback) {
      if (!this.addForm.icon) {
        callback(new Error("请选择图标"));
      }
      callback();
    },
    // 表单重置
    reset() {
      this.addForm = {
        groupId: "",
        name: "",
        code: "",
        icon: "",
        template: "",
        description: "",
        visible: true,
      };
      this.resetForm("addForm");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["addForm"].validate(async(valid) => {
        if (valid) {
          this.loading = true;
          if (this.addForm.hasOwnProperty("id")) {
            const { statusCode } = await updateComponent({
              ...this.addForm,
              visible: this.addForm.visible === true ? "1" : "0",
            });
            if (statusCode === 600) {
              this.msgSuccess("修改成功");
              this.isVisible = false;
              this.getList();
            }
          } else {
            const { statusCode } = await addComponent({
              ...this.addForm,
              visible: this.addForm.visible === true ? "1" : "0",
            });
            if (statusCode === 600) {
              this.msgSuccess("新增成功");
              this.isVisible = false;
              this.reset();
              this.getList();
            }
          }
          this.loading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .group-list-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 35px;
    background: #FDAFAF;
    color: #000;
    margin: 5px 0;
    padding: 0 40px;
    box-sizing: border-box;
    cursor:move;
  }
</style>
