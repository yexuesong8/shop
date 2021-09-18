<template>
  <!-- 系统管理-接口权限 -->
  <div class="main-content-container">
    <list-container ref="ListContainer" api="/api/v1/rabbit/system/uri/find/page" :form-props="{'label-width': 'auto'}">
      <template v-slot:form="slot">
        <FilterSearch class="mb10">
          <template v-slot:search>
            <el-row :gutter="10" class="mt10">
              <el-col :span="6">
                <el-form-item prop="name" label="接口名称:">
                  <el-input v-model="slot.form.name" v-enter-search="slot.search" placeholder="请输入接口名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="path" label="接口地址:">
                  <el-input v-model="slot.form.path" v-enter-search="slot.search" placeholder="请输入接口地址" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="enabled" label="状态:">
                  <el-select
                    v-model="slot.form.enabled"
                    placeholder="接口状态"
                    clearable
                  ><el-option
                    v-for="item in statusOptions"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button type="primary" :loading="slot.loading" @click="slot.search()">搜索</el-button>
                  <el-button @click="slot.reset()">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-slot:actions>
            <el-row :gutter="10">
              <el-col :span="1.5">
                <el-button type="primary" @click="handleAdd">新增</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button :disabled="!selectedRows.length" @click="handleBatchDelete">删除</el-button>
              </el-col>
            </el-row>
          </template>
        </FilterSearch>
      </template>
      <template v-slot:table="slot">
        <el-table v-loading="slot.loading" :data="slot.list" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="接口名称" prop="name" :show-overflow-tooltip="true" width="200" />
          <el-table-column label="接口地址" prop="path" width="200" />
          <el-table-column label="状态" width="200">
            <template v-slot:default="slot">
              <el-switch
                :value="slot.row.enabled"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(slot.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="280">
            <template v-slot:default="slot">
              <span>{{ parseTime(slot.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="slot">
              <el-button
                type="text"
                @click="handleUpdate(slot.row)"
              >修改</el-button>
              <el-button
                type="text"
                @click="handleDelete(slot.row)"
              >删除</el-button>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <no-data />
          </template>
        </el-table>
      </template>
    </list-container>
    <!-- 弹框 -->
    <Dialog v-if="visible" :title="title" :visible="visible" :loading="submitLoading" @cancel="cancel" @confirm="submitForm">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="接口名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入接口名称" />
        </el-form-item>
        <el-form-item label="接口地址:" prop="path">
          <el-input v-model="form.path" placeholder="请输入接口地址" />
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-radio-group v-model="form.enabled">
            <el-radio
              v-for="item in statusOptions"
              :key="item.id"
              :label="item.key"
            >{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分配角色:">
          <el-tree
            ref="menu"
            :data="menuOptions"
            show-checkbox
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
            :default-checked-keys="checkedTreeNode"
          />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import { add, allRole, batchDel, del, getRoleInterface, update, updateStatus } from '@/api/system/interface';
import { FilterSearch, Dialog, NoData } from "@monkey.do/monkey";
import { ListContainer } from "@/components";

export default {
  name: "Interface",
  components: {
    FilterSearch,
    Dialog,
    ListContainer,
    NoData,
  },
  data() {
    return {
      // 遮罩层
      submitLoading: false,
      selectedRows: [], // 选中的行
      // 总条数
      total: 0,
      // 角色表格数据
      interfaceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      visible: false,
      // 状态数据字典
      statusOptions: [
        { id: 1, value: "启用", key: 1 },
        { id: 0, value: "禁用", key: 0 },
      ],
      // 角色列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 表单
      form: {
        id: "",
        name: "",
        path: "",
        enabled: "",
        createTime: 0,
        roleUriList: [],
        remark: "",
      },
      defaultProps: {
        // el-tree 配置
        children: "children",
        label: "name",
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: "接口名称不能为空", trigger: "blur" }],
        path: [{ required: true, message: "接口地址不能为空", trigger: "blur" }],
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      checkedTreeNode: [], // 角色选中的接口
    };
  },
  created() {
    this._allRole();
  },
  methods: {
    /** 查询所有角色 */
    _allRole() {
      allRole().then(res => {
        this.menuOptions = res.data;
      });
    },
    handleSearch(params) {
      this.getList(params);
    },
    /** 根据api查询可用的角色  */
    _getRoleInterface(id) {
      // this.getMenuTreeSelect(id);
      getRoleInterface(id).then(res => {
        if (res.statusCode === 600) {
          this.checkedTreeNode = res.data.roleUriList.map(item => item.roleId);
        }
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys();
      return checkedKeys.map(item => ({ roleId: item }));
    },
    // 角色状态修改
    handleStatusChange(row) {
      this.$doingConfirm().then(() => {
        updateStatus({ id: row.id, enabled: row.enabled === 1 ? 0 : 1 }).then(res => {
          if (res.statusCode === 600) {
            this.msgSuccess("修改成功");
            this.$refs.ListContainer.refresh();
          }
        });
      }).catch((err) => console.log(err));
    },
    // 取消按钮
    cancel() {
      this.visible = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.checkedTreeNode = [];
      this.form = {
        id: undefined,
        name: undefined,
        api: undefined,
        enabled: undefined,
        createTime: 0,
        roleUriList: [],
        remark: undefined,
      };
    },
    // 多选框选中数据

    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.visible = true;
      this.title = "新增接口角色";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$nextTick(() => {
        this._getRoleInterface(row.id);
      });
      this.form = { ...this.form, ...row };
      this.visible = true;
      this.title = "修改接口";
    },
    // 提交（确认）
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this.form.roleUriList = this.getMenuAllCheckedKeys();
          if (this.form.id !== undefined) {
            this.submitLoading = false;
            update(this.form).then(res => {
              if (res.statusCode === 600) {
                this.msgSuccess("修改成功");
                this.visible = false;
                this.$refs.ListContainer.refresh();
              }
            });
          } else {
            add(this.form).then(res => {
              this.submitLoading = false;
              if (res.statusCode === 600) {
                this.msgSuccess("新增成功");
                this.visible = false;
                this.$refs.ListContainer.refresh(1);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除接口名称为"' + row.name + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function() {
          return del({ id: row.id });
        })
        .then(() => {
          this.$refs.ListContainer.refresh();
          this.msgSuccess("删除成功");
        });
    },
    // 批量删除
    handleBatchDelete(row) {
      this.$confirm("是否确认删除所选内容？", "删除接口", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const ids = this.selectedRows.map(item => item.id);
        return batchDel({ ids });
      })
        .then(() => {
          this.$refs.ListContainer.refresh();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>
