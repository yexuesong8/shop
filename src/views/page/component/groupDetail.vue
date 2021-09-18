<template>
  <!-- 新增&修改模态框 -->
  <Dialog
    v-if="visible"
    :title="title"
    :visible="visible"
    width="350px"
    :loading="loading"
    @cancel="cancel"
    @confirm="submitForm"
  >
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <Draggable v-model="componentGroupList">
      <div v-for="item in componentGroupList" :key="item.id" class="group-list-item">
        {{ item.name }}
        <div>
          <i class="el-icon-edit" @click="handleUpdate(item)" />
          <span class="close" @click="handleDel(item.id)">X</span>
        </div>
      </div>
    </Draggable>
    <Dialog
      v-if="subVisible"
      :title="subTitle"
      :visible="subVisible"
      :loading="loading"
      @cancel="subCancel"
      @confirm="subSubmitForm"
    >
      <el-form ref="groupForm" :model="groupForm" :rules="rules" label-width="auto">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="groupForm.name" clearable placeholder="请输入名称" :maxlength="50" />
        </el-form-item>
        <el-form-item label="图标:" prop="icon">
          <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelector'].reset()">
            <IconSelector ref="iconSelector" @selected="selected" />
            <el-input slot="reference" v-model="groupForm.icon" placeholder="点击选择图标" readonly>
              <svg-icon slot="prefix" :icon-class="groupForm.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
            </el-input>
          </el-popover>
        </el-form-item>
      </el-form>
    </Dialog>
  </Dialog>
</template>

<script>
import { add, update, del, sort } from "@/api/page/group";
import Draggable from 'vuedraggable';
import { IconSelector } from '@/components';

export default {
  name: "GroupDetail",
  components: {
    Draggable,
    IconSelector,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    groupList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      subVisible: false,
      subTitle: "",
      // 新增分组表单
      groupForm: {
        icon: "",
      },
      // 排序
      componentGroupList: [],
      idList: [],
      // 表单校验
      rules: {
        name: [
          { required: true, message: "分组名称不能为空", trigger: "blur" },
        ],
        icon: [
          { required: true, message: "图标不能为空", validator: this.validateReceiver },
        ],
      },
    };
  },
  watch: {
    groupList: {
      handler(newValue, oldValue) {
        this.componentGroupList = newValue;
      },
      deep: true,
    },
    componentGroupList: {
      handler(newValue, oldValue) {
        this.idList = newValue.map(item => {
          return item.id;
        });
      },
      deep: true,
    },
  },
  methods: {
    // 新增分组
    handleAdd() {
      this.subVisible = true;
      this.subTitle = "新增分组";
    },
    // 修改分组
    handleUpdate(data) {
      this.subVisible = true;
      this.groupForm = { ...data };
      this.subTitle = "修改分组";
    },
    // 取消按钮
    cancel() {
      this.$emit("close");
    },
    // 排序提交
    async submitForm() {
      this.loading = true;
      const { statusCode } = await sort({ ids: this.idList });
      if (statusCode === 600) {
        this.msgSuccess("排序成功");
        this.$emit("close");
      }
      this.loading = false;
    },
    // 图标选择
    selected(name) {
      this.groupForm = { ...this.groupForm, icon: name };
    },
    // 取消新增分组表单
    subCancel() {
      this.groupForm = {};
      this.subVisible = false;
    },
    // 删除分组
    handleDel(id) {
      this.$doingConfirm({ title: "删除分组", message: "确定要删除当前分组吗？" })
        .then(async() => {
          const { statusCode } = await del({ id: id });
          if (statusCode === 600) {
            this.msgSuccess("删除成功");
            this.$emit("update");
          }
        })
        .catch(() => console.log("删除取消"));
    },
    // 图标验证
    validateReceiver(rules, value, callback) {
      if (!this.groupForm.icon) {
        callback(new Error("请选择图标"));
      }
      callback();
    },
    // 新增&修改分组表单提交
    subSubmitForm() {
      this.$refs["groupForm"].validate(async(valid) => {
        if (valid) {
          this.loading = true;
          if (this.groupForm.hasOwnProperty("id")) {
            const { statusCode } = await update(this.groupForm);
            if (statusCode === 600) {
              this.msgSuccess("修改成功");
              this.subVisible = false;
              this.$emit("update");
            }
          } else {
            const { statusCode } = await add(this.groupForm);
            if (statusCode === 600) {
              this.msgSuccess("修改成功");
              this.subVisible = false;
              this.$emit("update");
            }
          }
        }
        this.loading = false;
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
    .el-icon-edit{
      cursor: pointer;
      &:hover{
        background: #1890FF;
        color: #fff;
      }
    }
    .close{
      margin-left: 20px;
      cursor: pointer;
      &:hover{
        background: #a00;
        color: #fff;
        cursor: pointer;
      }
    }
  }
// }
</style>
