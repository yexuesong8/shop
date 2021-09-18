<template>
  <div class="rb-file-upload">
    <el-upload
      ref="elUpload"
      :action="url"
      :headers="{
        Authorization: getAuthorization(),
      }"
      multiple
      :disabled="loading"
      :show-file-list="false"
      :http-request="httpRequest"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :file-list="elUploadFileList"
      v-bind="elUpload"
      v-on="$listeners"
    >
      <el-button :loading="loading">{{ label }}</el-button>
    </el-upload>
    <div class="rb-file-upload-list">
      <div v-for="(file, index) in fileList" :key="index" class="rb-file-upload-item">
        <div class="file-type-icon el-icon-document l-part" />
        <div class="r-part">
          <div class="clearfix">
            <span class="file-name fl">{{ file.name }}</span>
            <div class="icon-box fr">
              <span v-if="file.status === 'error'" class="file-reupload-icon el-icon-refresh" @click="() => reupload(file)" />
              <span v-if="isRemoveIconShow(file)" class="file-remove-icon el-icon-close" @click="() => removeFile(file)" />
            </div>
          </div>
          <div class="file-process-bar" :class="[file.status]">
            <div class="background-bar" :style="{width: getProcessBarWidth(file)}" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken, Token, request, getAppId, axios } from "@monkey.do/monkey";
import UploadMixinProps from "./mixin-props.vue";

const CancelToken = axios.CancelToken;
let requestCancel = null;

export default {
  name: "FileUpload",
  mixins: [UploadMixinProps],
  props: {
    url: {
      type: String,
      default: "/api/v1/rabbit/file/upload",
    },
    label: {
      type: String,
      default: "选择文件",
    },
    fileType: {
      type: Number,
      default: 1,
    },
    elUpload: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      fileList: [],
      loading: false,
      uid: 0,
    };
  },
  computed: {
    elUploadFileList() {
      return this.fileList.map(file => file.file);
    },
  },
  methods: {
    getAuthorization() {
      return `Bearer ${getToken(Token)}`;
    },
    upload() {
      this.$refs["elUpload"].submit();
    },
    getElUpload() {
      return this.$refs["elUpload"];
    },
    handleChange(file) {
      // 触发上传
      if (file.status === "ready") {
        this.fileList.push({
          percentage: 0,
          size: file.size,
          name: file.name,
          status: file.status,
          uid: file.uid,
          raw: file.raw,
          file,
        });
      }
    },
    handleExceed(files) {
      const newFileList = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        this.uid++;
        file.uid = this.uid;
        newFileList.push({
          percentage: 0,
          size: file.size,
          name: file.name,
          status: "ready",
          uid: this.uid,
          raw: file,
          file: {
            uid: this.uid,
            raw: file,
            status: "ready",
          },
        });
      }

      const limit = this.elUpload.limit;
      const allFileList = this.fileList.concat(newFileList);

      if (allFileList.length > limit) {
        this.fileList = this.sliceFileList(allFileList, allFileList.length - limit, allFileList.length);
      } else {
        this.fileList = allFileList;
      }
    },
    sliceFileList(fileList, start, end) {
      const newFileList = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (i >= start && i < end) {
          newFileList.push(file);
        }
      }
      return newFileList;
    },
    findFileIndex(fileUid) {
      return this.fileList.findIndex(file => file.uid === fileUid);
    },
    httpRequest(file) {
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("type", this.fileType);
      formData.append("appId", getAppId());

      this.loading = true;

      const currentUploadFileIndex = this.findFileIndex(file.file.uid);
      const currentFile = this.fileList[currentUploadFileIndex];

      request({
        url: this.url,
        data: formData,
        timeout: 200000,
        cancelToken: new CancelToken(function executor(c) {
          requestCancel = c;
        }),
        onUploadProgress: (progress) => {
          const percent = progress.loaded / progress.total * 100 | 0;

          this.fileList.splice(currentUploadFileIndex, 1, {
            ...currentFile,
            percentage: percent,
            status: "progress",
          });

          file.onProgress({ percent });
        },
      }).then(res => {
        if (res.statusCode !== 600) {
          this.$message.error(res.message);
          this.fileList.splice(currentUploadFileIndex, 1, {
            ...currentFile,
            percentage: 100,
            status: "error",
            response: res,
          });
        } else {
          this.$message.success(this.uploadSuccessText);
          this.fileList.splice(currentUploadFileIndex, 1, {
            ...currentFile,
            percentage: 100,
            status: "success",
            response: res,
          });
        }
        this.$emit("change", res);
        this.$emit("uploadSuccess", res);
        file.onSuccess();
      }).catch((err) => {
        console.error(err);
        this.fileList.splice(currentUploadFileIndex, 1, {
          ...currentFile,
          percentage: 100,
          status: "error",
          response: {},
        });
        this.$message.error("服务错误");
      }).finally(() => {
        this.loading = false;
      });
    },

    removeFile(file) {
      if (file.status === 'progress') {
        requestCancel();
        this.loading = false;
      }

      this.$refs["elUpload"].handleRemove(file.file);

      const currentUploadFileIndex = this.findFileIndex(file.uid);
      this.fileList.splice(currentUploadFileIndex, 1);
      this.$emit("remove", this.fileList);
    },
    reupload(file) {
      const elUpload = this.$refs["elUpload"];
      const uploadInner = elUpload.$refs["upload-inner"];
      uploadInner.upload(file.file.raw);
    },
    getProcessBarWidth(file) {
      if (!file || !file.percentage) return 0;
      return `${file.percentage}%`;
    },
    isRemoveIconShow(file) {
      if (!file) return false;
      return file.status !== 'success';
    },
    clear() {
      this.fileList = [];
      this.$refs["elUpload"].clearFiles();
    },
    getFileList() {
      return this.fileList;
    },
    getListByStauts(status) {
      return this.fileList.filter(file => file.status === status);
    },
    getSuccessFileList() {
      return this.getListByStauts("success");
    },
    getErrorFileList() {
      return this.getListByStauts("error");
    },
    getProgressFileList() {
      return this.getListByStauts("progress");
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/rabbit/styles/element-variables";

.rb-excel-import-upload-button {
  .rb-file-upload {
    width: 270px;
  }
}
.rb-file-upload-list {
  width: 100%;
  margin-top: 16px;
  .rb-file-upload-item {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 22px;
    &:last-child {
      margin-bottom: none;
    }
    .l-part {
      display: inline-block;
      margin-right: 9px;
    }
    .r-part {
      position: relative;
      flex: 1 1 auto;
    }
  }
  .icon-box {
    span {
      cursor: pointer;
    }
  }
  .file-process-bar {
    position: absolute;
    bottom: -5px;
    width: 100%;
    height: 2px;
    border-radius: 1px;
    background: rgba(0, 0, 0, 0.06);

    .background-bar {
      position: absolute;
      top: 0;
      left: 0;
      transition: width 300ms;
      -webkit-transition: width 300ms;
      height: 100%;
      border-radius: 1px;
    }

    &.progress {
      .background-bar {
        background: $--color-primary;
      }
    }

    &.error {
      .background-bar {
        background: $--color-danger;
      }
    }

    &.success {
      display: none;
    }
  }
}
</style>
