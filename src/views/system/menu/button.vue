<template>
  <!-- 系统管理-菜单管理 -->
  <div class="menu-new-button">
    <el-row>
      <el-col :span="24" class="line">
        <!-- <div>按钮</div> -->
        <div class="segmentation" />
      </el-col>
    </el-row>
    <el-table :data="buttons">
      <el-table-column label="名称" prop="name" min-width="100px">
        <template slot-scope="scope">
          <el-form v-if="scope.row.edit" :ref="`form${scope.$index}`" :model="buttons[scope.$index]" :rules="rules">
            <el-form-item prop="name" style="margin-bottom: 0;">
              <el-input v-model="(submitBtn[scope.$index] || {}).name" placeholder="请输入" />
            </el-form-item>
          </el-form>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代码" prop="id" min-width="160px" />
      <el-table-column label="颜色" prop="color" min-width="80px">
        <template slot-scope="scope">
          <el-input v-if="scope.row.edit" v-model="(submitBtn[scope.$index] || {}).color" placeholder="请输入" />
          <span v-else>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件" prop="event" min-width="100px">
        <template slot-scope="scope">
          <el-input v-if="scope.row.edit" v-model="(submitBtn[scope.$index] || {}).event" placeholder="请输入" />
          <span v-else>{{ scope.row.event }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可见条件" prop="optionalCondition" min-width="100px">
        <template slot-scope="scope">
          <el-input v-if="scope.row.edit" v-model="(submitBtn[scope.$index] || {}).optionalCondition" placeholder="请输入" />
          <span v-else>{{ scope.row.optionalCondition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接口" prop="uriId" min-width="100px">
        <template slot-scope="scope">
          <el-select v-if="scope.row.edit" v-model="(submitBtn[scope.$index] || {}).uriId" clearable @change="(value) => handleUriChange(value, scope)">
            <el-option v-for="(item, index) in uriList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
          <span v-else>{{ getUriNameById(scope.row.uriId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" min-width="100px">
        <template slot-scope="scope">
          <el-input v-if="scope.row.edit" v-model="(submitBtn[scope.$index] || {}).remark" placeholder="请输入" />
          <span v-else>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.cancel" type="text" @click="handleSaveButton(scope)">保存</el-button>
          <el-button v-if="scope.row.cancel" type="text" @click="handleCancelButton(scope)">取消</el-button>
          <el-button v-if="!scope.row.cancel" type="text" @click="handleEditButton(scope)">编辑</el-button>
          <el-popconfirm
            v-if="!scope.row.handle || scope.row.add"
            style="margin-left: 10px;"
            icon="el-icon-info"
            title="是否要删除此行？"
            @confirm="handleDeleteButton(scope)"
          >
            <el-button slot="reference" type="text">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="add">
      <el-button icon="el-icon-plus" class="btn" @click="handleAddButton">新增按钮</el-button>
    </div>
  </div>
</template>

<script>
import { getMenusUri } from "@/api/system/menu";
export default {
  name: 'NewButton',

  props: {
    data: {
      type: Array,
      default: () => [],
    },
    menuId: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      buttons: [],
      submitBtn: {},
      origin: {},
      uriList: [],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
      },
    };
  },

  watch: {
    data: function(value) {
      this.buttons = value || [];
      value.forEach((item, index) => {
        this.submitBtn[index] = item;
        this.origin = { ...this.origin, [index]: { ...item }};
      });
    },
  },

  mounted() {
    if (this.menuId) {
      getMenusUri({ menuId: this.menuId }).then(res => {
        if (res.statusCode === 600) {
          this.uriList = res.data;
        }
      });
    }
  },

  methods: {
    // 新增收款计划
    handleAddButton() {
      const obj = { name: undefined, color: undefined, remark: undefined, event: undefined, edit: true, cancel: true };
      this.submitBtn[this.buttons.length] = obj;
      this.buttons.push(obj);
    },

    // 修改
    handleEditButton(button) {
      this.buttons.splice(button.$index, 1, { ...this.submitBtn[button.$index], edit: true, cancel: true });
    },
    // 取消
    handleCancelButton(button) {
      this.buttons.splice(button.$index, 1, { ...this.origin[button.$index], edit: undefined, cancel: undefined });
    },
    // 保存
    handleSaveButton(button) {
      this.$refs[`form${button.$index}`].validate(valid => {
        if (valid) {
          this.buttons.splice(button.$index, 1, { ...this.submitBtn[button.$index], edit: undefined, cancel: undefined });
        }
      });
    },
    // 删除
    handleDeleteButton(button) {
      this.buttons.splice(button.$index, 1);
      // 删除对应数据
      Reflect.deleteProperty(this.submitBtn, button.$index);
    },
    // 选择接口
    handleUriChange(value, button) {
    },
    // 根据接口ID获取对应接口名称
    getUriNameById(id) {
      if (id && this.uriList.length > 0) {
        return this.uriList.filter(uri => uri.id === id)[0] ? this.uriList.filter(uri => uri.id === id)[0]["name"] : "";
      }
      return "";
    },
    getSubmitBtn() {
      return this.submitBtn || [];
    },

  },
};
</script>
