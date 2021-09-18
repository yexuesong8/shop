<template>
  <!-- 流程管理-流程类型 -->
  <div class="main-content-container">
    <list-container ref="ListContainer" api="/api/v1/rabbit/workflow/type/find/page" :form-props="{'label-width': 'auto'}">
      <template v-slot:form="slot">
        <FilterSearch class="mb10">
          <template v-slot:search>
            <el-row :gutter="10" class="mt10">
              <el-col :span="6">
                <el-form-item label="类型名称:" prop="name">
                  <el-input v-model.trim="slot.form.name" v-enter-search="slot.search" placeholder="请输入类型名称" :maxlength="50" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="代码:" prop="code">
                  <el-input v-model.trim="slot.form.code" v-enter-search="slot.search" placeholder="请输入代码" :maxlength="50" clearable />
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
                <el-button class="el-icon-refresh" :loading="slot.loading" @click="slot.refresh()" />
              </el-col>
            </el-row>
          </template>
        </FilterSearch>
      </template>
      <template v-slot:table="slot">
        <el-table v-loading="slot.loading" :data="slot.list">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table :data="scope.row['templateList']" @cell-dblclick="cellDbClick">
                <el-table-column label="类型名称" prop="typeName" />
                <el-table-column label="表单名称" prop="formName" />
                <el-table-column label="适用部门" prop="deptName" show-overflow-tooltip min-width="120" />
                <el-table-column label="是否启用" prop="enabled">
                  <template slot-scope="slot">
                    <el-switch :value="slot.row.enabled" :active-value="1" :inactive-value="0" @change="(value) => handleSwitchChange(value, slot.row)" />
                  </template>
                </el-table-column>
                <el-table-column label="是否使用" prop="used">
                  <template slot-scope="slot">
                    <span>{{ slot.row.used === 0 ? "否" : "是" }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="更新次数" prop="updateFrequency" />
                <el-table-column label="版本号" prop="versionNum" width="70" />
                <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip width="250">
                  <template slot-scope="slot">
                    {{ parseTime(slot.row.createTime) }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" prop="action" width="250">
                  <template slot-scope="slot">
                    <el-button type="text" @click="handleTemplateCopy(slot.row)">复制</el-button>
                    <el-button type="text" @click="handleTemplateUpdate(slot.row)">修改</el-button>
                    <el-button type="text" @click="handleTemplateDelete(slot.row)">删除</el-button>
                  </template>
                </el-table-column>
                <template v-slot:empty>
                  <no-data />
                </template>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" min-width="120" show-overflow-tooltip />
          <el-table-column label="代码" prop="code" show-overflow-tooltip />
          <application-column />
          <el-table-column label="数据库" prop="dbId" show-overflow-tooltip />
          <el-table-column label="创建人" prop="creatorName" />
          <el-table-column label="创建时间" prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="text" @click="handleDeleteDictionary(scope.row)">删除</el-button>
              <el-button type="text" @click="handleAddTemplate(scope.row)">新增模板</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </list-container>

    <!-- 弹框 -->
    <Dialog :title="flag ? '新增类型' : '修改类型'" :visible="visible" :loading="confirmLoading" @cancel="handleCancel" @confirm="handleSubmit">
      <el-form ref="form" :model="addForm" :rules="rules" label-width="80px">
        <el-form-item label="名称:" prop="name">
          <el-input v-model.trim="addForm.name" placeholder="请输入类型名称" :maxlength="20" />
        </el-form-item>
        <el-form-item label="代码:" prop="code">
          <el-input v-model.trim="addForm.code" placeholder="请输入代码" :maxlength="20" />
        </el-form-item>
        <application-item :value.sync="addForm.appId" />
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import { addTypeData, delectTypeData, updateTypeData } from "@/api/workflow/type";
import { del, enable, copy } from "@/api/workflow/template";
import { ListContainer, ApplicationColumn, ApplicationItem } from "@/components";

export default {
  name: "WorkflowType",
  components: { ListContainer, ApplicationItem, ApplicationColumn },
  data() {
    return {
      visible: false,
      addForm: {
        id: "",
        name: "",
        code: "",
        appId: "",
        // dbId: "",
      },
      flag: false,
      // 新增表单校验
      rules: {
        name: [{ required: true, message: "标题名称不能为空", trigger: "blur" }],
        code: [{ required: true, message: "代码不能为空", trigger: "blur" }],
        appId: [{ required: true, message: "适用范围不能为空", trigger: "blur" }],
        // dbId: [{ required: true, message: "数据库ID不能为空", trigger: "blur" }],
      },
      // templateVisible: false,
      // id: "",
      confirmLoading: false,
    };
  },
  deactivated() {
    // this.templateVisible = false;
  },
  methods: {
    // 添加
    handleAdd() {
      this.visible = true;
      this.flag = true;
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          if (this.flag) {
            addTypeData(this.addForm).then(res => {
              this.confirmLoading = false;
              if (res.statusCode === 600) {
                this.$refs["ListContainer"].refresh(1);
                this.handleCancel();
                this.$message.success('添加成功！');
              }
            });
          } else {
            updateTypeData(this.addForm).then(res => {
              this.confirmLoading = false;
              if (res.statusCode === 600) {
                this.$refs["ListContainer"].refresh(1);
                this.handleCancel();
                this.$message.success('修改成功！');
              }
            });
          }
          // this.visible = false
        }
      });
    },
    handleCancel() {
      this.visible = false;
      this.$refs.form.resetFields();
      this.addForm = {
        id: "",
        name: "",
        code: "",
        appId: "",
        // dbId: ""
      };
    },
    // 修改
    handleUpdate(row) {
      this.visible = true;
      this.flag = false;
      this.addForm.id = row.id;
      this.addForm.name = row.name;
      this.addForm.code = row.code;
      this.addForm.appId = row.appId;
      // this.addForm.dbId = row.dbId;
    },
    // 删除
    handleDeleteDictionary(row) {
      this.$doingConfirm({ title: "删除流程类型", message: "确定要删除流程类型吗?" }).then(() => {
        delectTypeData({ id: row.id }).then(res => {
          if (res.statusCode === 600) {
            this.$message.success('删除成功');
            this.$refs["ListContainer"].refresh(1);
          }
        });
      });
    },
    handleAddTemplate(row) {
      this.$router.push(`/rabbit/workflow/template?typeId=${row.id}`);
      this.$emit("add");
    },
    cellDbClick(row) {
      this.$router.push(`/rabbit/workflow/template?templateId=${row.id}`);
    },
    handleSwitchChange(value, row) {
      const title = row.enabled === 1 ? "停用模板" : "启用模板";
      const message = row.enabled === 1 ? `确实停用版本为${row.versionNum}的模板吗?` : `确实启用版本为${row.versionNum}的模板吗?`;

      this.$doingConfirm({ title, message }).then(() => {
        enable({ id: row.id, enabled: row.enabled === 1 ? 0 : 1 }).then(res => {
          if (res.statusCode === 600) {
            this.$refs["ListContainer"].refresh();
            this.$message.success("操作成功");
          }
        });
      });
    },

    handleTemplateCopy(row) {
      this.$doingConfirm({ title: "复制模板", message: "确实要复制模板吗?" }).then(() => {
        copy({ id: row.id }).then(res => {
          if (res.statusCode === 600) {
            this.$message.success('复制成功');
            this.$refs["ListContainer"].refresh();
          }
        });
      });
    },

    handleTemplateUpdate(row) {
      this.$router.push(`/rabbit/workflow/template?templateId=${row.id}`);
    },

    handleTemplateDelete(row) {
      this.$doingConfirm({ title: "删除模板", message: "确实要删除模板吗?" }).then(() => {
        del({ id: row.id }).then(res => {
          if (res.statusCode === 600) {
            this.$message.success('删除成功');
            this.$refs["ListContainer"].refresh();
          }
        });
      });
    },
  },
};
</script>
