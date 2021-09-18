<template>
  <div class="main-content-container">
    <el-row type="flex" justify="space-between" class="mb20">
      <el-col :span="10">
        <search-input placeholder="请输入标题名称" style="width: 440px;" :maxlength="64" clearable :on-input="handleInput" />
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" :disabled="insertDisabled" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="tableData" @cell-dblclick="handleDblClick" @row-contextmenu="handleRowContextmenu">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="name" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column label="创建日期" prop="createTime" :render-header="handleSortHeader" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="创建人" min-width="100" show-overflow-tooltip />
      <el-table-column label="接收对象" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.deptNames ? scope.row.deptNames.join() : '' }}</span>
        </template>
      </el-table-column>
      <template v-slot:empty>
        <NoData />
      </template>
    </el-table>
    <pagination :total="total" :page-num="params.pageNum" :page-size="params.pageSize" :on-change="handlePaginationChange" />

    <Dialog :title="title" :visible="visible" :loading="sumitLoading" :has-footer="!detail" width="980px" @cancel="handleCancel" @confirm="handleSubmit">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="标题:" prop="name">
          <el-input v-if="!detail" v-model="form.name" placeholder="请输入公告标题" :maxlength="64" />
          <p v-else class="border">{{ form.name }}</p>
        </el-form-item>
        <el-form-item label="接收对象:" prop="deptsId">
          <DepartmentSelector v-if="!detail" v-model="form.deptsId" multiple />
          <p v-else class="border">{{ form.deptNames ? form.deptNames.join("、") : '' }}</p>
        </el-form-item>
        <el-form-item label="内容:">
          <Editor v-if="!detail" ref="editor" :value="content" @change="handleContentChange" />
          <div v-else class="content border" v-html="content" />
        </el-form-item>
        <el-form-item label="附 件:" prop="attachment">
          <el-upload
            v-if="visible"
            :class="detail?'upload-none':''"
            action="/api/v1/rabbit/file/upload"
            multiple
            :data="uploadData"
            :limit="5"
            :on-exceed="handleExceed"
            :headers="headers"
            :before-remove="handleRemove"
            :on-preview="handleDownloadFile"
            :file-list="isArray(fileList)?fileList:[]"
            :http-request="handleRequestFile"
          >
            <el-button type="primary">上传文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import { isArray, CellMenu, SortHeader, Download, getToken } from "@monkey.do/monkey";
import Editor from "@/components/editor";
import { request } from "@/utils";

import {
  pageFind,
  isAllow,
  createNotice,
  deleteNotice,
  updateNotice,
} from "@/api/notice";

export default {
  name: "Notice",
  components: {
    Editor,
  },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      name: "",
      tableData: [],
      total: 0,
      loading: false,
      sumitLoading: false,
      visible: false,
      title: '',
      form: {},
      content: '', // 富文本
      fileList: [],
      rules: {
        name: [
          { required: true, message: "标题名称不能为空", trigger: "blur" },
        ],
        deptsId: [
          { required: true, message: "接收对象不能为空", trigger: "blur" },
        ],
      },
      currentRow: {},
      update: false,
      detail: false,
      activeSort: [],
      sortFieldList: [],
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      uploadData: {
        appId: 1,
        type: 1,
      },
      sort: undefined,
      insertDisabled: false,
    };
  },
  mounted() {
    this.getList();
    this._isAllow();
  },
  methods: {
    isArray,
    getList(sort = 'desc') {
      this.loading = true;
      const payload = {
        ...this.params,
        name: this.name || undefined,
        sort,
      };
      pageFind(payload).then(res => {
        if (res.statusCode !== 600) return;
        this.tableData = res.data.list;
        this.total = res.data.total;
      }).finally(() => (this.loading = false));
    },
    _isAllow() {
      isAllow({ tableId: 1001 }).then(res => {
        if (res.statusCode === 600) {
          this.insertDisabled = !res.data.insert;
        } else {
          this.insertDisabled = true;
        }
      });
    },
    handlePaginationChange(val) {
      this.params.pageNum = val.pageNum;
      this.params.pageSize = val.pageSize;
      this.getList();
    },
    handleInput(val) {
      this.name = val;
      this.params.pageNum = 1;
      this.getList();
    },
    handleAdd() {
      this.visible = true;
      this.title = '新增公告';
      this.$set(this.form, 'deptsId', []);
    },
    handleDblClick(row) {
      this.visible = true;
      this.detail = true;
      this.title = '公告详情';
      this.currentRow = JSON.parse(JSON.stringify(row));
      this.handleVisible();
    },
    handleRowContextmenu(row, column, event) {
      this.currentRow = JSON.parse(JSON.stringify(row));
      CellMenu({
        data: [{ name: '修改', id: 'update' }, { name: '删除', id: 'delete' }],
        row,
        event,
        onClick: this.cellMenuClick,
      });
    },
    handleVisible() {
      this.form = this.currentRow;
      if (this.currentRow.attachment && typeof this.currentRow.attachment === 'string') {
        this.fileList = JSON.parse(this.currentRow.attachment);
      }
      this.content = this.currentRow.content;
      this.form = { ...this.form, deptsId: this.currentRow.deptIds };
    },
    cellMenuClick(event) {
      if (event.id === 'update') {
        this.title = "修改公告";
        this.visible = true;
        this.update = true;
        this.handleVisible();
      } else {
        this.$doingConfirm().then(() => {
          deleteNotice({ id: this.currentRow.id }).then((res) => {
            if (res.statusCode !== 600) return;
            this.msgSuccess('删除成功');
            this.getList();
          }).catch(() => (this.msgError('删除失败')));
        });
      }
    },
    handleCancel() {
      if (!this.detail && this.$refs.editor) {
        this.$refs.editor.clear();
      }
      this.fileList = [];
      this.visible = false;
      this.update = false;
      this.detail = false;
      this.form = {};
      this.content = '';
      this.$refs.form.resetFields();
      this.currentRow = {};
    },
    handleSuccess(msg) {
      this.handleCancel();
      this.msgSuccess(msg);
      this.getList();
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.sumitLoading = true;
        const payload = {
          ...this.form,
          depts: this.form.deptsId.join(),
          attachment: JSON.stringify(this.fileList.map(({ id, name }) => ({ id, name }))),
        };
        if (this.update) {
          updateNotice(payload).then(res => {
            if (res.statusCode !== 600) return;
            this.handleSuccess('更新成功');
          }).finally(() => (this.sumitLoading = false));
        } else {
          createNotice(payload).then(res => {
            if (res.statusCode !== 600) return;
            this.handleSuccess('创建成功');
          }).finally(() => (this.sumitLoading = false));
        }
      });
    },
    handleContentChange(val) {
      this.form.content = val;
    },
    handleSortHeader(h, params) {
      return SortHeader(h, params, {
        onClick: this.handleSortChange,
        active: this.activeSort,
      });
    },
    handleSortChange(sort) {
      this.activeSort = sort;
      if (!sort.length) return this.getList();
      if (sort[0].includes('asc')) {
        this.getList('asc');
      } else {
        this.getList('desc');
      }
    },
    handleExceed(files, fileList) {
      this.msgError("最多支持5个附件,请重新选择或打包上传");
    },
    handleUploadSuccess(response, file, fileList) {
      if (response.statusCode === 600) {
        const obj = {
          id: response.data.id || undefined,
          name: response.data.name || undefined,
        };
        this.fileList.push(obj);
      }
    },
    handleRequestFile(file) {
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("appId", 1);
      formData.append("type", 1);
      request({
        url: "/rabbit/file/upload",
        data: formData,
      }).then(res => {
        if (res.statusCode === 600) {
          const obj = {
            id: res.data.id || undefined,
            name: res.data.name || undefined,
          };
          this.fileList.push(obj);
        }
      });
    },
    handleRemove(file, fileList) {
      const index = fileList.findIndex((item) => {
        return file.uid === item.uid;
      });
      this.fileList.splice(index, 1);
    },
    handleDownloadFile(file) {
      if (file.id) {
        Download(file.id, (res) => {
          if (res.statusCode === 600 && res.data) {
            this.msgSuccess(res.message);
          } else if (res.statusCode === 600) {
            this.msgError(res.message);
          }
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
p{
  margin: 0;
}
.content{
  margin: 0;
}
.border{
  border: 1px solid #dddddd;
  padding: 0 10px;
  border-radius: 6px;
  min-height: 34px;
}
.upload-none {
  /deep/.el-upload--text {
    display: none;
  }
  /deep/.el-icon-close:before {
    display: none;
  }
  /deep/.el-upload-list__item:first-child{
    margin-top: 5px;
  }
}
</style>
