<template>
  <div class="main-content-container">
    <el-row :gutter="30">
      <el-col :span="5">
        <!-- 树目录开始-->
        <EditableTree
          title="报表分组"
          :highlight.sync="highlight"
          list-api="/api/v1/rabbit/report/group/find/tree"
          create-api="/api/v1/rabbit/report/group/create"
          update-api="/api/v1/rabbit/report/group/update"
          delete-api="/api/v1/rabbit/report/group/delete"
          sort-api="/api/v1/rabbit/report/group/sort"
          @nodeClick="handleNodeClick"
        >
          <template v-slot:button="slot">
            <el-button type="primary" @click="slot.click">新增分组</el-button>
          </template>
        </EditableTree>
      </el-col>
      <el-col :span="19">
        <!-- 系统管理，报表管理 -->
        <ListContainer
          ref="listContainer"
          :params="params"
          api="/api/v1/rabbit/report/template/find/page"
          :form-props="{ 'label-width': 'auto'}"
          @dataBack="handleDataBack"
        >
          <template v-slot:form="slot">
            <FilterSearch class="mb20">
              <template v-slot:search>
                <el-row :gutter="64" class="mt10">
                  <el-col :span="8">
                    <el-form-item label="名称：">
                      <el-input v-model="slot.form.name" placeholder="请输入名称" :maxlength="30" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="代码：">
                      <el-input v-model="slot.form.code" placeholder="请输入代码" :maxlength="30" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-row type="flex" :gutter="8">
                      <el-col :span="1.5">
                        <el-button type="primary" :loading="slot.loading" @click="slot.search">确认</el-button>
                      </el-col>
                      <el-col :span="1.5">
                        <el-button @click="() => reset(slot)">重置</el-button>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
              <template v-slot:actions>
                <el-button type="primary" @click="handleAdd()">新增</el-button>
                <el-button class="el-icon-refresh" :loading="slot.loading" @click="handleRefresh" />
              </template>
            </FilterSearch>
          </template>
          <template v-slot:table="table">
            <el-table v-loading="table.loading" :data="table.list" border row-key="id" :expand-row-keys="expands" @expand-change="handleGetTable" @cell-dblclick="handleUpdate">
              <!-- 嵌套表格 -->
              <el-table-column type="expand" width="30" fixed="left">
                <template slot-scope="scopes">
                  <el-table :data="scopes.row.querySchemeList" border>
                    <el-table-column label="查询方案" prop="name" min-width="130" show-overflow-tooltip />
                    <el-table-column label="表单类型" prop="formType" min-width="125" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span>{{ scope.row.formType === 1 ? "自定义组件" : "页面模板" }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="表单来源" prop="formSource" show-overflow-tooltip />
                    <el-table-column label="是否默认方案" prop="isDefault" width="100">
                      <template slot-scope="scope">
                        <span>{{ scope.row.isDefault === 1 ? "是" : "否" }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark" show-overflow-tooltip />
                    <el-table-column label="创建时间" prop="createTime" width="140">
                      <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="修改时间" prop="updateTime" width="140">
                      <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="action" width="100" fixed="right">
                      <template slot-scope="scope">
                        <el-button type="text" @click="handleUpdateQueryScheme(scope.row)">修改</el-button>
                        <el-button type="text" @click="handleDeleteQueryScheme(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <!-- 模板表格 -->
              <el-table-column type="index" width="50" align="center" fixed="left" />
              <el-table-column label="名称" prop="name" min-width="130" show-overflow-tooltip />
              <el-table-column label="代码" prop="code" min-width="165" show-overflow-tooltip />
              <el-table-column label="类型" prop="type" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ dictFormatter('rabbit_report_type', scope.row.type) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="所属组" prop="groupName" show-overflow-tooltip />
              <el-table-column label="备注" prop="remark" show-overflow-tooltip />
              <el-table-column label="创建人" prop="creatorName" show-overflow-tooltip />
              <el-table-column label="创建时间" prop="createTime" width="140" show-overflow-tooltip>
                <!--将时间戳转化为用户能看懂的时间表达式 -->
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="修改人" prop="updatorName" show-overflow-tooltip />
              <el-table-column label="修改时间" prop="updateTime" width="140" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.updateTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" class-name="small-padding fixed-width" min-width="290" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleUpdate(scope.row)">修改</el-button>
                  <el-button v-if="scope.row.type === 1" type="text" @click="handleAddQueryScheme(scope.row.id)">新增方案</el-button>
                  <el-button v-if="scope.row.type === 1" type="text" @click="handleSortQueryScheme(scope.row)">方案排序</el-button>
                  <el-button type="text" @click="handlePreview(scope.row.id)">预览</el-button>
                  <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </ListContainer>
        <!-- 模板新增、修改弹框 -->
        <Dialog :loading="templateLoading" :title="flagTemplate" width="600px" :visible="visible" @cancel="handleCancel" @confirm="handleSubmit">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" :maxlength="50" />
            </el-form-item>
            <el-form-item label="代码:" prop="code">
              <el-input v-model="form.code" placeholder="请输入代码" :maxlength="50" />
            </el-form-item>
            <el-form-item label="分组" prop="groupId">
              <DropDownTreeSelector
                :value="form.groupId"
                data-source-uri="/api/v1/rabbit/report/group/find/tree"
                source-type="uri"
                :property="{ id: 'id', key: 'id', name: 'name', children: 'childList' }"
                :default-expand-all="false"
                :default-expanded-keys="['0']"
                :disabled="groupDisabled"
                @change="handleGroupIdChange"
              />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <dictionary-selector code="rabbit_report_type" :value.sync="form.type" />
            </el-form-item>
            <el-form-item label="报表文件:">
              <Upload v-if="visible" ref="upload" :accept="accept" :file-list="fileInfo.fileList" :limit="1" :on-exceed="onExceed" :before-upload="beforeUpload" @change="handleChange">
                <el-button>选择报表文件</el-button>
                <el-button v-if="fileInfo.fileList.length" type="text" @click.stop="handleDownload">下载文件</el-button>
              </Upload>
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :maxlength="100" />
            </el-form-item>
            <el-form-item v-if="titleType !== 'create'" />
          </el-form>
        </Dialog>
        <!-- 查询方案新增、修改弹框 -->
        <Dialog :title="flagQueryScheme" :loading="querySchemeLoading" width="600px" :visible="visibleQueryScheme" @cancel="handleCancelQueryScheme" @confirm="handleSubmitQueryScheme">
          <el-form ref="formQueryScheme" :model="formQueryScheme" :rules="rules" label-width="100px">
            <el-form-item label="查询方案:" prop="name">
              <el-input v-model="formQueryScheme.name" placeholder="请输入查询方案" :maxlength="50" />
            </el-form-item>
            <el-form-item label="表单类型:" prop="formType">
              <dictionary-selector code="rabbit_report_query_plan_form_type" :value="formQueryScheme.formType" @change="handlePropType" />
            </el-form-item>
            <el-form-item label="表单来源:" prop="formSource">
              <DropDownTreeSelector
                v-if="formQueryScheme.formType === '2'"
                v-model="formQueryScheme.formSource"
                data-source-uri="/api/v1/rabbit/page/template/tree/find/all"
                source-type="uri"
                :property="{ id: 'id', key: 'id', name: 'name', children: 'childList' }"
                :default-expand-all="false"
                :default-expanded-keys="['0']"
                :node-disabled="disabled"
              />
              <el-input v-else v-model="formQueryScheme.formSource" placeholder="请输入表单来源" :maxlength="50" />
            </el-form-item>
            <el-form-item label="是否默认方案:" prop="isDefault">
              <el-switch v-model="formQueryScheme.isDefault" />
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="formQueryScheme.remark" type="textarea" placeholder="请输入备注" :maxlength="100" />
            </el-form-item>
          </el-form>
        </Dialog>
        <!-- 报表查询方案排序弹框 -->
        <Dialog title="方案排序" width="350px" :visible="visibleQuerySchemeSort" @cancel="handleCancelQuerySchemeSort" @confirm="handleSubmitQuerySchemeSort">
          <Draggable v-model="QuerySchemeSort">
            <div v-for="(element, index) in QuerySchemeSort" :key="index" class="group-list-item">{{ element.name }}</div>
          </Draggable>
        </Dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  addQueryScheme,
  updateQueryScheme,
  deleteQueryScheme,
  getQueryScheme,
  sortQueryScheme,
  getTemplate,
  getFile,
  getOneQueryScheme,
} from "@/api/system/report";
import { EditableTree, ListContainer, DictionarySelector } from "@/components";
import { FilterSearch, Dialog, DropDownTreeSelector, Upload, Download } from "@monkey.do/monkey";
import Draggable from 'vuedraggable'; // 排序插件

export default {
  name: 'Report',
  components: {
    EditableTree,
    FilterSearch,
    ListContainer,
    Dialog,
    DropDownTreeSelector,
    Upload,
    Draggable,
    DictionarySelector,
  },
  data() {
    return {
      // 展开行
      expands: [],
      defaultPlan: [{ id: "0", name: "否" }, { id: "1", name: "是" }],
      templateLoading: false,
      querySchemeLoading: false,
      titleType: 'create',
      visible: false,
      visibleQueryScheme: false,
      visibleQuerySchemeSort: false,
      form: {
        type: '1',
      },
      formQueryScheme: {
        isDefault: false,
      },
      groupId: "",
      QuerySchemeSort: [],
      accept: ".jrxml",
      rules: {
        name: [
          { required: true, message: '请输入查询方案', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入代码', trigger: 'blur' },
        ],
        groupId: [
          { required: true, message: '分组不能为空', validator: this.validateGroupId },
        ],
        type: [
          { required: true, message: '请选择报表类型', trigger: 'change' },
        ],
        formType: [
          { required: true, message: '请输入表单类型', trigger: 'change' },
        ],
        formSource: [
          { required: true, message: '请输入表单来源', trigger: 'blur' },
        ],
        isDefault: [
          { required: true, message: '请选择是否默认方案', trigger: 'change' },
        ],
      },
      // 遮罩层
      loading: false,
      // 参数查询方案列表
      querySchemeList: [],
      tableList: [],
      ids: [],
      params: {},
      // 文件信息
      fileInfo: {
        id: "",
        fileList: [],
      },
      highlight: true,
      groupDisabled: false,
    };
  },
  computed: {
    flagTemplate() {
      return this.titleType === 'create' ? '新增报表' : '修改报表';
    },
    flagQueryScheme() {
      return this.titleType === 'create' ? '新增方案' : '修改方案';
    },
  },
  watch: {
    QuerySchemeSort: {
      handler(value) {
        this.ids = value.map(item => item.id);
      },
      deep: true,
    },
  },
  methods: {
    // 表单groupId验证
    handleGroupIdChange(value) {
      this.form = { ...this.form, groupId: value };
      this.$refs["form"].validateField("groupId");
    },
    validateGroupId(rules, value, callback) {
      if (!this.form.groupId) {
        callback(new Error('请选择分组'));
      }
      callback();
    },
    // 模板树目录禁用
    disabled(data, node) {
      if (data.type === 1) {
        return true;
      }
    },
    // 表单类型选择
    handlePropType(val) {
      this.formQueryScheme = { ...this.formQueryScheme, formType: val };
    },
    // 下载
    handleDownload() {
      Download(this.fileInfo.id, (res) => {
        if (res.statusCode === 600 && res.message) {
          this.msgSuccess(res.message);
        }
      });
    },
    handleDataBack(data) {
      this.tableList = data.data.list;
    },
    // 预览
    handlePreview(id) {
      this.$router.push({
        path: "/rabbit/system/report/preview",
        query: {
          id,
        },
      });
    },
    // 模板新增按钮
    handleAdd() {
      this.titleType = 'create';
      this.visible = true;
      this.form.groupId = this.groupId;
    },
    onExceed() {
      this.msgError("文件只能上传1个");
    },
    // 模板删除功能按钮
    handleDelete(row) {
      this.$doingConfirm({ title: "删除报表", message: `确定删除报表${row.name}吗？` })
        .then(() => {
          deleteTemplate({ id: row.id }).then(res => {
            if (res.statusCode === 600) {
              this.msgSuccess('删除成功');
              this.$refs.listContainer.refresh(1);
            }
          });
        });
    },
    // 模板修改按钮
    async handleUpdate(row, column) {
      if (column === undefined || column.property !== undefined) {
        const data = await getTemplate({ id: row.id });
        if (data.statusCode === 600) {
          this.form = { ...data.data, type: String(data.data.type) };
          if (data.data.fileId) {
            this.fileInfo.id = data.data.fileId;
            getFile({ id: data.data.fileId }).then(res => {
              if (res.statusCode === 600) {
                if (this.fileInfo.fileList.length) {
                  this.fileInfo.fileList.splice(0, 1, { name: res.data.name, url: res.data.savePath });
                } else {
                  this.fileInfo.fileList.push({ name: res.data.name, url: res.data.savePath });
                }
              }
            });
          }
        }
        this.titleType = 'update';
        this.visible = true;
      }
    },
    // 模板提交->确定按钮
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.templateLoading = true;
          if (this.form.id !== undefined) {
            updateTemplate({ ...this.form }).then(response => {
              if (response.statusCode === 600) {
                this.msgSuccess('修改成功');
                this.$refs.listContainer.refresh(1);
                this.handleGetQueryScheme(this.form.id);
                this.handleCancel();
              }
            }).finally(() => { this.templateLoading = false; });
          } else {
            addTemplate({ ...this.form }).then(res => {
              if (res.statusCode === 600) {
                this.msgSuccess('新增成功');
                this.$refs.listContainer.refresh(1);
                this.handleCancel();
              }
            }).finally(() => { this.templateLoading = false; });
          }
        }
      });
    },
    // 模板提交->取消按钮
    handleCancel() {
      this.visible = false;
      this.$refs["form"].resetFields(); // 对该表单项进行重置，将其值重置为初始值并移除校验结果
      this.form = {};
      this.fileInfo = {
        id: "",
        fileList: [],
      };
    },
    // 重置
    reset(slot) {
      slot.reset();
      this.groupId = "";
      this.form = {};
      this.highlight = false;
    },
    // 树目录
    handleNodeClick(row) {
      this.groupId = row.id;
      this.params = { ...this.params, groupId: row.id };
      this.highlight = true;
      this.groupDisabled = this.groupId === "";
    },
    // 报表查询方案新增按钮
    handleAddQueryScheme(id) {
      this.titleType = 'create';
      this.visibleQueryScheme = true;
      this.formQueryScheme = { ...this.formQueryScheme, templateId: id };
    },
    // 报表查询方案修改按钮
    handleUpdateQueryScheme(row) {
      getOneQueryScheme({ id: row.id }).then(res => {
        if (res.statusCode === 600) {
          this.formQueryScheme = {
            ...res.data,
            formType: String(res.data.formType),
            isDefault: res.data.isDefault === 1,
          };
        }
      });
      this.titleType = 'update';
      this.visibleQueryScheme = true;
    },
    // 报表查询方案提交->取消按钮
    handleCancelQueryScheme() {
      this.visibleQueryScheme = false;
      this.$refs["formQueryScheme"].resetFields();
      this.formQueryScheme = {
        isDefault: false,
      };
    },
    // 报表查询方案提交->确定按钮
    handleSubmitQueryScheme() {
      this.$refs["formQueryScheme"].validate((valid) => {
        if (valid) {
          this.querySchemeLoading = true;
          if (this.formQueryScheme.id !== undefined) {
            updateQueryScheme({ ...this.formQueryScheme, isDefault: this.formQueryScheme.isDefault ? "1" : "0" }).then(response => {
              if (response.statusCode === 600) {
                this.msgSuccess('修改成功');
                this.handleGetQueryScheme(this.formQueryScheme.templateId);
                this.handleCancelQueryScheme();
              }
            }).finally(() => { this.querySchemeLoading = false; });
          } else {
            addQueryScheme({ ...this.formQueryScheme, isDefault: this.formQueryScheme.isDefault ? "1" : "0" }).then(res => {
              if (res.statusCode === 600) {
                this.msgSuccess('新增成功');
                this.handleGetQueryScheme(this.formQueryScheme.templateId);
                this.handleCancelQueryScheme();
              }
            }).finally(() => { this.querySchemeLoading = false; });
          }
        }
      });
    },
    // 报表查询方案删除功能按钮
    handleDeleteQueryScheme(row) {
      this.$doingConfirm({ title: "删除查询方案", message: `确定删除当前查询方案${row.name}吗？` })
        .then(() => {
          deleteQueryScheme({ id: row.id }).then(res => {
            if (res.statusCode === 600) {
              this.msgSuccess('删除成功');
              this.handleGetQueryScheme(row.templateId);
            }
          });
        });
    },
    // 报表查询方案排序按钮
    handleSortQueryScheme(row) {
      this.visibleQuerySchemeSort = true;
      this.handleGetQueryScheme(row.id);
    },
    // 报表查询方案提交取消按钮
    handleCancelQuerySchemeSort() {
      this.visibleQuerySchemeSort = false;
    },
    // 报表查询方案提交确定按钮
    handleSubmitQuerySchemeSort() {
      sortQueryScheme({ ids: this.ids }).then(res => {
        if (res.statusCode === 600) {
          this.msgSuccess("排序成功");
          this.visibleQuerySchemeSort = false;
          this.handleGetQueryScheme(this.QuerySchemeSort[0].templateId);
        }
      });
    },
    // 调用报表报表查询方案列表的接口
    handleGetTable(row, expandedRows) {
      expandedRows.forEach(item => {
        if (item.id === row.id) {
          this.handleGetQueryScheme(row.id);
        }
      });
    },
    // 刷新时将查询方案赋值为空
    handleRefresh() {
      this.params = {};
      this.expands = [];
    },
    // 判断上传文件类型
    beforeUpload(file) {
      const suffix = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (!this.accept.includes(suffix)) {
        this.msgError('不支持此文件类型上传');
        this.$refs.upload.loading = false;
        return false;
      }
      return true;
    },
    // 文件上传成功之后，返回文件
    handleChange(file) {
      this.form.fileId = file.response.data.id;
    },
    // 获取报表查询方案
    handleGetQueryScheme(id) {
      getQueryScheme({ templateId: id }).then(res => {
        if (res.statusCode === 600) {
          this.QuerySchemeSort = res.data;
          this.tableList.forEach((item, index) => {
            if (item.id === id) {
              this.$set(this.tableList[index], "querySchemeList", res.data);
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
  /deep/ .el-table__expanded-cell{
    padding-left: 80px !important;
  }
  .group-list-item{
    display: flex;
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
