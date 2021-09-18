<template>
  <div>
    <el-upload
      list-type="picture-card"
      :file-list="fileList"
      :action="url"
      :limit="limit"
      :data="data"
      :on-exceed="handleExceed"
      :headers="headers"
      :on-change="handleUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :disabled="loading"
      v-bind="$attrs"
    >
      <i slot="default" class="el-icon-plus" />
    </el-upload>

    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getToken, Token, Download } from "@monkey.do/monkey";
import { getImgSrc } from "@/utils";

export default {
  name: "Upload",
  props: {
    url: {
      type: String,
      default: "/api/v1/rabbit/file/upload",
    },
    data: {
      type: Object,
      default: () => ({
        appId: 1,
        name: "file",
        type: 1,
      }),
    },
    limit: {
      type: Number,
      default: 10,
    },
    disabledDownload: {
      type: Boolean,
      default: false,
    },
    disabledRemove: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    fileList: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      headers: {
        Authorization: `Bearer ${getToken(Token)}`,
      },
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
    };
  },
  methods: {
    handleExceed() {
      if (this.limit) this.$message.error(`超出最大限制数：${this.limit}`);
    },
    handleUpload(file, fileList) {
      this.loading = true;
      if (file.status === "success") {
        const obj = {
          id: file.response.data.id,
          name: file.response.data.name,
          url: getImgSrc(file.response.data.id),
        };
        this.fileList.push(obj);
        this.$emit("change", this.fileList);
        this.loading = false;
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      Download(file.id, res => {
        if (res.statusCode === 600 && res.data) {
          this.msgSuccess(res.message);
        } else if (res.statusCode === 600) {
          this.msgError(res.message);
        }
      });
    },
    handleRemove(file) {
      if (!file.id) return;
      const index = this.fileList.findIndex(item => item.id === file.id);
      if (index > -1) {
        this.fileList.splice(index, 1);
      }
      this.$emit("change", this.fileList);
    },
  },
};
</script>
<style lang="scss" scoped>
  /deep/.el-dialog__header{
    background-color: #fff;
    /deep/.el-icon-close:before{
      color: #999;
    }
  }
</style>
