<template>
  <!--系统管理-部门管理  -->
  <div class="main-content-container full-fill">
    <FixTableHeight>
      <template #top>
        <el-row>
          <el-col :span="18" class="fl">
            <search-input placeholder="请输入部门名称" style="width:240px" :on-input="handleInput" clearable />
          </el-col>
          <el-col :span="6">
            <el-button class="fr" type="primary" @click="handleAdd">新增</el-button>
          </el-col>
        </el-row>
      </template>
      <template #bottom>
        <el-table v-loading="loading" :data="deptList" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" default-expand-all>
          <el-table-column prop="name" label="部门" min-width="260" />
          <el-table-column prop="leaderName" label="负责人" align="center" />
          <!-- <el-table-column prop="userName" label="联系人" align="center" /> -->
          <el-table-column prop="phone" label="联系电话" min-width="200" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column label="创建时间" prop="createTime" min-width="200" align="center">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="text" @click="handleOpenLeader(scope.row)">负责人</el-button>
              <el-button v-if="scope.row.parentId !== 0" type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </FixTableHeight>

    <!-- 添加或修改部门对话框 -->
    <Dialog v-if="open" :title="title" :visible="open" :loading="submitLoading" @cancel="cancel" @confirm="submitForm">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="上级部门" prop="parentId">
                <DepartmentSelector v-model="form.parentId" @change="handleDeptSelected" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="上级部门编号" prop="parentId">
              <el-col :span="24">
                <label style="margin-right:10px">{{ form.parentId }}</label>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="本级部门编号" prop="id">
                <el-input v-if="id" :value="id" disabled />
                <el-input v-else v-model="form.id" maxlength="3" minlength="3" :disabled="dialogType === 'update'" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="部门名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入部门名称" />
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门名称" prop="name">
                <el-input v-model="form.name" maxlength="20" placeholder="请输入部门名称" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="联系人" prop="userName">
                <el-input v-model="form.userName" placeholder="请输入联系人姓名" />
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="坐标" prop="location">
                <GeoCoordinateFormItem v-model="location" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </Dialog>

    <!-- 负责人 -->
    <MemberSelectorDialog v-if="leaderSwitch" :value="leaderId" :multiple="false" :visible="leaderSwitch" @cancel="handleCancel" @confirm="handleConfirm" />
  </div>
</template>

<script>
import { delDept, addDept, updateDept, getDeptTree, addLeader } from "@/api/system/dept";
import { Dialog, validateEmail, SearchInput } from "@monkey.do/monkey";
import { DepartmentSelector, MemberSelectorDialog, GeoCoordinateFormItem } from "@/components";

export default {
  name: "Dept",
  components: {
    Dialog,
    GeoCoordinateFormItem,
    SearchInput,
    MemberSelectorDialog,
    DepartmentSelector,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  data() {
    const validatorLength = (rule, value, callback) => {
      if (value.length !== 3) {
        if (this.dialogType === "update") {
          callback();
        }
        callback(new Error("请输入长度为3的ID"));
      } else {
        callback();
      }
    };
    return {
      submitLoading: false,

      // 遮罩层
      loading: true,
      // 表格树数据
      deptList: [],

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        name: undefined,
        status: undefined,
      },
      id: "",
      parentId: "",
      dialogType: "",
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
        ],
        id: [
          { required: true, message: "部门编号不能为空", trigger: "blur" },
          { validator: validatorLength, trigger: "blur" },
        ],
        email: [{ required: false, validator: validateEmail, trigger: "blur" }],
      },
      location: [], // 坐标
      leaderSwitch: false, // 负责人dialog开关
      leaderId: [], // 负责人
      leaderUpId: "",
    };
  },

  created() {
    this.getList();
  },

  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      getDeptTree(this.queryParams).then((response) => {
        if (response.statusCode === 600) this.deptList = this.deptFilter(response.data);
        this.loading = false;
      });
    },
    // btn 负责人
    async handleConfirm(value = []) {
      const res = await addLeader({ leaderId: value[0].id, id: this.leaderUpId });
      if (res.statusCode === 600) {
        this.msgSuccess("设置成功");
        this.getList();
        this.handleCancel();
      }
    },
    handleCancel() {
      this.leaderSwitch = false;
      this.leaderUpId = "";
    },
    // 打开负责人的dialog
    handleOpenLeader(value) {
      this.leaderId = value.leaderId ? [value.leaderId] : [];
      this.leaderUpId = value.id;
      this.leaderSwitch = true;
    },

    // 部门过滤
    deptFilter(data) {
      const array = [];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const hasChildren = item.childList && item.childList.length > 0;
        if (item.flag !== 0 || hasChildren) {
          let children = [];
          if (hasChildren) children = this.deptFilter(item.childList);
          item["children"] = children;
          array.push(item);
        }
      }
      return array;
    },

    /** 部门搜索 */
    handleInput(value) {
      this.queryParams = { ...this.queryParams, name: value };
      this.getList();
    },

    // 部门选择
    handleDeptSelected(value) {
      this.parentId = value;
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.dialogType = "";
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: undefined,
        name: undefined,
        phone: undefined,
        email: undefined,
        status: "0",
      };
      this.location = [];
      this.resetForm("form");
      this.parentId = "";
      this.id = "";
    },

    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row !== undefined) {
        this.form.parentId = row.id;
        this.parentId = row.id;
      }
      this.open = true;
      this.title = "部门-新增";
      this.dialogType = "add";
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.id = row.id;
      this.form = { ...row };
      if (row.location) this.location = row.location.split(",");
      this.open = true;
      this.title = "部门-修改";
      this.dialogType = "update";
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;

          let location;
          if (this.location.length > 0) location = `${this.location[0]},${this.location[1]}`;

          if (this.dialogType === "update") {
            updateDept({ ...this.form, location }).then((response) => {
              this.submitLoading = false;
              if (response.statusCode === 600) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
                this.reset();
              }
            });
          } else {
            if (String(this.parentId).length >= 18) {
              this.$message.error('部门级数超过了限制');
              this.submitLoading = false;
              return false;
            }
            addDept({
              ...this.form,
              id: this.parentId ? this.parentId + this.form.id : this.form.id,
              parentId: this.parentId || "0",
              location,
            }).then((response) => {
              this.submitLoading = false;
              if (response.statusCode === 600) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
                this.reset();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$doingConfirm().then(() => {
        delDept({ id: row.id }).then((res) => {
          if (res.statusCode === 600) {
            this.getList();
            this.msgSuccess("删除成功");
          }
        });
      })
        .catch((err) => console.log(err));
    },
  },
};
</script>
