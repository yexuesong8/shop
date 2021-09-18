<template>
  <!-- 系统管理-菜单管理 -->
  <div class="menu-content-container main-content-container full-fill">
    <FixTableHeight>
      <template #top>
        <FilterSearch>
          <template v-slot:search>
            <Search :query-params.sync="queryParams" :loading="loading" @getList="getList" />
          </template>
          <template v-slot:actions>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </template>
        </FilterSearch>
      </template>
      <template #bottom>
        <el-table :loading="loading" :data="menuList" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="name" label="菜单名称" show-overflow-tooltip width="160" />
          <el-table-column prop="icon" label="图标" width="100">
            <template slot-scope="scope">
              <svg-icon :icon-class="scope.row.icon" />
            </template>
          </el-table-column>
          <el-table-column prop="sortNumber" label="排序" width="60" />
          <ApplicationColumn width="150" />
          <el-table-column prop="component" label="组件路径" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" :formatter="statusFormat" width="80">
            <template slot-scope="scope">
              <el-switch :value="scope.row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <no-data />
          </template>
        </el-table>
      </template>
    </FixTableHeight>

    <!-- 菜单详情 -->
    <Dialog class="rb-menu-detail-dialog" :title="title" :visible="detailVisible" :loading="submitLoading" @cancel="handleCancel" @confirm="handleConfirm">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row :gutter="DialogFormItemGutter">
          <el-col :span="24">
            <el-form-item label="上级功能:" prop="parentId">
              <!-- v-if 保证每次能拿到最新的数据 -->
              <drop-down-tree-selector
                v-if="detailVisible"
                v-model="form.parentId"
                data-source-uri="/api/v1/rabbit/system/action/find/all/tree"
                source-type="uri"
                :formatter="menuTreeFormat"
                :default-expand-all="false"
                :default-expanded-keys="['0']"
                @change="handleParentIdChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码:" prop="code">
              <el-input v-model="form.code" placeholder="请输入编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:">
              <el-radio-group v-model="form.status">
                <el-radio v-for="(item, index) in statusOptions" :key="index" :label="item.label">{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仅系统设计师可见:">
              <el-radio-group v-model="form.onlyDesigner">
                <el-radio v-for="(item, index) in onlyDesignerOptions" :key="index" :label="item.label">{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <ApplicationItem :value.sync="form.appId" />
          </el-col>
          <el-col :span="12">
            <el-form-item label="接口:" prop="apiIds">
              <drop-down-tree-selector
                v-if="detailVisible"
                id="apis"
                v-model="form.apiIds"
                data-source-uri="/api/v1/rabbit/system/api/find/tree"
                source-type="uri"
                multiple
                :node-disabled="handleNodeDisabled"
                :default-expanded-keys="['0']"
                :default-expand-all="false"
                @change="handleParentIdChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序:" prop="sortNumber">
              <el-input-number v-model="form.sortNumber" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型:" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio :label="1">模块</el-radio>
                <el-radio :label="2">操作</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type === 2" label="颜色:" prop="color">
              <el-input v-model="form.color" placeholder="请输入颜色" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type === 2" label="执行事件:" prop="event">
              <el-input v-model="form.event" placeholder="请输入执行事件" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type === 1" label="路由地址:" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type === 1" label="组件路径:" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type === 1" label="页面类型:" prop="pageType">
              <dictionary-selector v-model="form.pageType" code="rabbit_menu_page_type" :value="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type === 1" label="图标:" prop="icon">
              <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['IconSelector'].reset()">
                <IconSelector ref="IconSelector" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <!-- <el-col v-if="form.type === 3" :span="12"> -->
          <!-- <el-form-item v-if="form.pageType === '2'" label="iframe地址:" prop="component">
              <el-input v-model="form.component" placeholder="请输入iframe地址" />
            </el-form-item> -->
          <!-- <el-form-item v-else-if="form.pageType === '3'" label="页面模板:" prop="component">
              <DropDownTreeSelector
                :key="form.pageType"
                v-model="form.component"
                data-source-uri="/api/v1/rabbit/page/template/tree/find/all"
                source-type="uri"
                :property="{ id: 'id', key: 'id', name: 'name', children: 'childList' }"
                :default-expand-all="false"
                :default-expanded-keys="['0']"
                :node-disabled="pageDisabled"
              />
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item> -->
          <!-- <el-form-item v-else-if="form.pageType === '4'" label="报表:" prop="component">
              <DropDownTreeSelector
                :key="form.pageType"
                v-model="form.component"
                data-source-uri="/api/v1/rabbit/report/group/find/tree/template"
                source-type="uri"
                :property="{ id: 'id', key: 'id', name: 'name', children: 'childList' }"
                :default-expand-all="false"
                :default-expanded-keys="['0']"
                :node-disabled="reportDisabled"
              />
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item> -->
          <!-- <el-form-item label="组件路径:" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item> -->
          <!-- </el-col> -->
          <!-- <el-col v-if="form.type === 1" :span="12">
            <el-form-item label="选择图标:" prop="icon">
              <el-row class="menu-icon-item">
                <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['menuIconSelect'].reset()">
                  <IconSelector ref="menuIconSelect" @selected="selected" />
                  <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                    <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
                    <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                  </el-input>
                </el-popover>
                <div v-if="form.iconFileId" class="menu-icon-box" @mouseenter="menuIconEnter" @mouseleave="menuIconLeave">
                  <div v-show="maskShow" class="menu-icon-mask" @click="menuIconDelete">
                    <div class="mask" />
                    <span class="el-icon-delete" />
                  </div>
                  <img :src="getImgSrc(form.iconFileId)" alt="">
                </div>
                <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['menuIconSelect'].reset()">
                  <MenuIconSelector ref="menuIconSelect" source-type="uri" data-source-uri="/api/v1/rabbit/system/icon/find/all" @selected="menuIconSelected" />
                  <div slot="reference" class="menu-icon-select-box">
                    <div class="menu-icon-select-button">
                      <span class="el-icon-plus" />
                    </div>
                  </div>
                </el-popover>
              </el-row>
            </el-form-item>
          </el-col> -->
          <!-- <el-col v-if="form.type === 1" :span="12">
            <el-form-item label="提示:" prop="prompt">
              <el-input v-model="form.prompt" placeholder="请输入提示" :maxlength="200" />
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item v-if="form.type !== 2" label="显示状态:" prop="visible">
              <el-radio-group v-model="form.visible">
                <el-radio v-for="item in visibleOptions" :key="item.key" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type !== 1" label="菜单状态:">
              <el-radio-group v-model="form.status">
                <el-radio v-for="(item, index) in statusOptions" :key="index" :label="item.label">{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="显示排序:" prop="sortNumber">
              <el-input-number v-model="form.sortNumber" controls-position="right" :min="0" />
            </el-form-item>
          </el-col> -->
          <!-- <el-col v-if="form.type === 1" :span="24">
            <el-collapse>
              <el-collapse-item title="接口:" name="name">
                <new-uri ref="NewUri" :data="uriList" />
              </el-collapse-item>
            </el-collapse>
          </el-col>
          <el-col v-if="form.type === 1" :span="24">
            <el-collapse>
              <el-collapse-item title="按钮:" name="name">
                <new-button ref="NewButton" :data="buttonList" :menu-id="form.id" />
              </el-collapse-item>
            </el-collapse>
          </el-col> -->
        </el-row>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import { listMenu, add, del, update } from '@/api/system/menu';
import Search from "./search";
import { menuTreeFormatter2 } from "@/utils";
import { getMenuById } from "@/api/system/menu";
// import NewUri from "./uri";
// import NewButton from "./button";
import { DialogFormItemGutter } from "@/config/index";
// import MenuIconSelector from "@/components/MenuIconSelector";

const initForm = {
  visible: 1, // 默认显示
  status: 1, // 默认启用
  parentId: null,
  type: 1,
};

export default {
  name: 'Menu',
  components: {
    Search,
    // NewButton,
    // NewUri,
    // MenuIconSelector,
  },
  data() {
    return {
      submitLoading: false,
      DialogFormItemGutter,
      // 遮罩层
      loading: false,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      detailVisible: false,
      // 显示状态数据字典
      visibleOptions: [
        { id: 1, value: 1, label: "显示" },
        { id: 0, value: 0, label: "隐藏" },
      ],
      // 菜单状态数据字典
      statusOptions: [
        { key: 1, label: 1, value: "启用" },
        { key: 0, label: 0, value: "停用" },
      ],
      onlyDesignerOptions: [
        { key: 1, label: true, value: "是" },
        { key: 0, label: false, value: "否" },
      ],

      // 查询参数
      queryParams: {},
      // 表单参数
      form: {
        ...initForm,
        onlyDesigner: false,
      },
      buttons: [],
      submitBtn: {
      },
      // 表单校验
      rules: {
        onlyDesigner: [{ required: true, message: '请选择', trigger: 'change' }],
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        // orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
        // path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
        // component: [{ required: true, message: '组件路径不能为空', trigger: 'blur' }],
        appId: [{ required: true, message: "适用范围不能为空", trigger: 'blur' }],
        parentId: [{ required: true, message: "请选择上级菜单", validate: this.validateParentId }],
        type: [{ required: true, message: "请选择类型" }],
        pageType: [{ required: true, message: "请选择页面类型" }],
      },
      uriList: [],
      buttonList: [],
      maskShow: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 模板树目录禁用
    pageDisabled(data, node) {
      if (data.type === 1) {
        return true;
      }
    },
    // 报表目录禁用
    reportDisabled(data, node) {
      if (data.type === 2 || data.infoType === 1) {
        return true;
      }
    },
    // 选择目录图标
    selected(name) {
      this.form = { ...this.form, icon: name };
    },
    // 选择菜单图标
    menuIconSelected(data) {
      const { id, fileId } = data;
      this.form = { ...this.form, iconId: id, iconFileId: fileId };
    },
    /** 查询菜单列表 */
    getList(params = {}) {
      this.loading = true;
      return listMenu({ ...this.queryParams, ...params }).then(response => {
        this.menuList = menuTreeFormatter2(response.data, "sortNumber");
        this.loading = false;
        return response.data;
      });
    },
    menuTreeFormat(value) {
      const menus = menuTreeFormatter2(value, "sortNumber") || [];
      return [{ name: "根目录", id: "0", childList: menus }];
    },
    updateRoute() {
      this.getList();
      // this.$store.dispatch("permission/updateRoutes"); // TODO:更新出错,暂时不更新，让用户手动刷新
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    // 菜单状态字典翻译
    statusFormat(row) {
      if (row.status === 1) return "启用";
      return "停用";
    },
    // 取消按钮
    handleCancel() {
      this.detailVisible = false;
      this.form = { ...initForm };
      this.resetForm('form');
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      if (row) this.form.parentId = row.id;
      this.detailVisible = true;
      this.title = '新增功能';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = { ...row, pageType: row.pageType ? String(row.pageType) : undefined };
      getMenuById({ id: row.id }).then(res => {
        if (res.statusCode === 600) {
          this.form = { ...res.data, pageType: res.data.pageType ? String(res.data.pageType) : undefined };
          // this.form.apiIds = this.form.apiIds;
          // if (this.form.apiIds.includes(',')) {
          //   const tempValue = this.form.apiIds.split(',');
          //   const newArry = [];
          //   tempValue.forEach(element => {
          //     newArry.push(element.toString());
          //   });
          //   this.form.apiIds = newArry;
          // }
          // this.buttons = res.data.buttonList;
          // this.buttonList = res.data.buttonList;
          // this.uriList = res.data.uriList;
        }
      });

      this.detailVisible = true;
      this.title = '修改功能';
    },

    // 改变状态
    handleStatusChange(row) {
      this.$doingConfirm({ title: "修改菜单状态", message: "确实要修改菜单的状态吗？" }).then(() => {
        update({ id: row.id, status: row.status === 1 ? 0 : 1 }).then(res => {
          if (res.statusCode === 600) {
            this.msgSuccess('修改成功');
            this.updateRoute();
          }
        });
      });
    },

    /** 提交按钮 */
    handleConfirm() {
      const that = this;
      this.$refs['form'].validate(valid => {
        if (valid) {
          // const payload = { ...this.form, apiIds: String(this.form.apiIds) };
          const payload = { ...this.form };

          // if (this.form.type === 1) {
          //   const submitButton = this.$refs["NewButton"].getSubmitBtn();
          //   const buttonList = Object.keys(submitButton).map(item => ({ ...submitButton[item], edit: undefined }));
          //   const submitUri = this.$refs["NewUri"].gerSubmitUri();
          //   const uriList = Object.keys(submitUri).map(item => ({ ...submitUri[item], edit: undefined }));
          //   payload = { ...payload, buttonList, uriList };
          // }

          this.submitLoading = true;
          if (this.form.id !== undefined) {
            update(payload).then(response => {
              this.submitLoading = false;
              if (response.statusCode === 600) {
                this.msgSuccess('修改成功');
                this.handleCancel();
                that.getList();
                that.updateRoute();
              }
            });
          } else {
            add(payload).then(response => {
              if (response.statusCode === 600) {
                this.submitLoading = false;
                this.msgSuccess('新增成功');
                this.handleCancel();
                that.getList();
                that.updateRoute();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$doingConfirm({ title: "删除菜单", message: "确定要删除菜单吗?" }).then(() => {
        del({ id: row.id }).then(res => {
          if (res.statusCode === 600) {
            this.getList();
            this.updateRoute();
            this.msgSuccess('删除成功');
          }
        });
      });
    },
    // 新增
    handleAddButton() {
      const obj = { name: undefined, color: undefined, remark: undefined, event: undefined, edit: true };
      this.submitBtn[this.buttons.length] = obj;
      this.buttons.push(obj);
    },
    // 删除
    handleDeleteButton(button) {
      this.buttons.splice(button.$index, 1);
    },
    handleParentIdChange() {
      this.$refs["form"].validateField("parentId");
    },
    validateParentId(rules, value, callback) {
      if (!this.form.parentId || this.form.parentId === 0) {
        callback();
      } else {
        callback(new Error("请选择上级菜单"));
      }
    },
    menuIconEnter() {
      this.maskShow = true;
    },
    menuIconLeave() {
      this.maskShow = false;
    },
    menuIconDelete() {
      this.form = { ...this.form, iconId: undefined, iconFileId: undefined };
      this.maskShow = false;
    },
    handleNodeDisabled(data) {
      return !data.is_api;
    },
  },
};
</script>

<style lang="scss" scoped>
.rb-menu-detail-dialog {
  .segmentation {
    width: 100%;
    border-bottom: 2px dotted #e8e8e8;
    margin: 16px 0 24px 0;
  }
  .add {
    padding: 9px 24px;
    border-bottom: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    border-left: 1px solid #e8e8e8;
    .btn {
      width: 100%;
      border: 2px dotted #e8e8e8;
    }
  }
  .menu-icon-item {
    height: 32px;
    overflow: hidden;
  }
  .menu-icon-select-box {
    display: inline-block;
    width: 32px;
    height: 32px;
    vertical-align: top;
    .menu-icon-select-button {
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #E9E9E9;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  .menu-icon-box {
    display: inline-block;
    margin-right: 5px;
    width: 32px;
    height: 32px;
    position: relative;
    .menu-icon-mask {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: #000;
        opacity: .6;
      }
    }
    img {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
<style  lang="scss">
#apis .el-tree-node {
  .is-leaf + .el-checkbox .el-checkbox__inner{
    display: none;
  }
  .el-checkbox .el-checkbox__inner{
	display: inline-block;
  }
}

