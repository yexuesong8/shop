<template>
  <Dialog
    :title="title"
    :visible="visible"
    :loading="loading"
    @cancel="cancel"
    @confirm="submitForm"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="auto">
      <el-row :gutter="DialogFormItemGutter">
        <el-col :span="12">
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" :maxlength="20" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别:">
            <el-select v-model="form.gender" placeholder="请选择">
              <el-option
                v-for="item in sexOptions"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="DialogFormItemGutter">
        <el-col :span="12">
          <el-form-item label="手机号码:" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号码" :maxlength="11" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱:" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" :maxlength="50" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="DialogFormItemGutter">
        <el-col :span="12">
          <el-form-item label="部门:" prop="deptId" class="tree-select-line-height">
            <DepartmentSelector v-model="form.deptId" @change="departmentChange" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位:">
            <PostSelector v-model="form.jobIdList" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="DialogFormItemGutter">
        <el-col :span="12">
          <el-form-item label="角色:">
            <el-select v-model="form.roleIdList" multiple placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.status === 0"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职时间:">
            <el-date-picker
              v-model="form.entryTime"
              type="date"
              value-format="timestamp"
              :picker-options="startDatePicker('form', 'turnPositiveTime')"
              placeholder="选择入职时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="DialogFormItemGutter">
        <el-col :span="12">
          <el-form-item label="入职状态:">
            <el-select v-model="form.jobStatus" placeholder="请选择">
              <el-option
                v-for="item in jobStatusOptions"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="转正时间:">
            <el-date-picker
              v-model="form.turnPositiveTime"
              type="date"
              value-format="timestamp"
              :picker-options="endDatePicker('form', 'entryTime')"
              placeholder="选择转正时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="DialogFormItemGutter">
        <el-col :span="12">
          <el-form-item label="工号:" prop="code">
            <el-input v-model="form.code" placeholder="请输入工号" :maxlength="50" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态:">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="item in statusOptions"
                :key="item.key"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注:">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" show-word-limit :maxlength="500" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </Dialog>
</template>

<script>
import { statusOptions, DialogFormItemGutter } from "@/config/index";
import { isPhone, isEmail } from "@monkey.do/monkey";
import { DepartmentSelector, PostSelector } from "@/components";
import { startDatePicker, endDatePicker } from "@/utils";

export default {
  name: "Detail",
  components: { PostSelector, DepartmentSelector },
  props: {
    form: {
      type: Object,
      default: () => ({}),
    },
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    const phoneValidator = (rule, value, callback) => {
      if (!value) {
        callback();
        return;
      }
      if (!isPhone(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };

    const emailValidator = (rule, value, callback) => {
      if (!rule.required && !value) callback();

      if (!isEmail(value)) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };

    return {
      DialogFormItemGutter,
      roleList: [],
      loading: false,
      // 状态数据字典
      statusOptions,
      // 性别状态字典
      sexOptions: [
        { key: 1, value: 1, label: "男" },
        { key: 2, value: 2, label: "女" },
      ],
      // 入职状态
      jobStatusOptions: [
        { key: 1, value: 1, label: "正式" },
        { key: 2, value: 2, label: "试用" },
        { key: 3, value: 3, label: "实习" },
      ],
      // 表单校验
      rules: {
        code: [{ required: true, message: "工号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        account: [{ message: "账号不能为空", trigger: "blur" }],
        deptId: [{ required: true, message: "部门不能为空" }],
        password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }],
        email: [
          {
            required: false,
            validator: emailValidator,
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            required: false,
            validator: phoneValidator,
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },

  created() {
    this.handleRole();
  },
  methods: {
    departmentChange() {
      this.$refs["form"].validateField("deptId");
    },
    startDatePicker,
    endDatePicker,
    // 获取角色信息
    handleRole() {
      this.$request("rabbit.system.userManage.getByRole").then((res) => {
        this.roleList = res.data;
      });
    },
    // 取消按钮
    cancel() {
      this.$refs["form"].resetFields();
      this.$emit("cancel");
    },
    // 提交按钮
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.form.id !== undefined) {
            this.$request("rabbit.system.userManage.update", { data: { id: this.id, ...this.form }}).then((res) => {
              this.loading = false;
              if (res.statusCode === 600) {
                this.msgSuccess("修改成功");
                this.$emit("success");
                this.cancel();
              }
            });
          } else {
            this.$request("rabbit.system.userManage.add", { data: { ...this.form }}).then((res) => {
              this.loading = false;
              if (res.statusCode === 600) {
                this.msgSuccess("新增成功");
                this.$emit("success");
                this.cancel();
              }
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss">
 .jobSelect {
    .el-select-group__title {
      font-size: 16px;
      color: #186ad1;
    }
  }
</style>
