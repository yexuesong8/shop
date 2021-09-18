<template>
  <Dialog :visible="visible" :loading="loading" v-bind="$attrs" @cancel="handleCancel" @confirm="handleConfirm">
    <el-form ref="form" :model="form" :rules="rules" label-width="auto">
      <el-form-item label="组件分类" prop="parentIds">
        <el-cascader v-model="form.parentIds" style="width: 100%;" placeholder="请选择组件分类" clearable :show-all-levels="false" :options="treeList" :props="props" />
      </el-form-item>
      <el-form-item label="组件名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入组件名称" />
      </el-form-item>
      <el-form-item label="组件地址" prop="path">
        <el-input v-model="form.path" placeholder="请输入组件绝对路径地址" />
      </el-form-item>
      <el-form-item label="组件图片" prop="imageId">
        <Upload :accept="accept" :limit="1" :file-list="fileList" :disabled-download="!currentRow.id" @change="handleUploadChange" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import Upload from "./upload";
import { getImgSrc } from "@/utils";
import { fetchTree, createComponent, updateComponent } from "@/api/setCenter/home";

export default {
  name: "Detail",
  components: { Upload },
  props: {
    currentRow: {
      type: Object,
      default: () => ({}),
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateImageId = (rule, value, callback) => {
      if (this.form.imageId) {
        callback();
      } else {
        callback(new Error('请选择组件图片'));
      }
    };
    const validatePath = (rule, value, callback) => {
      const reg = /(^[\/\\].*)|(.*:.*)/;
      if (!value) {
        callback(new Error('请输入绝对路径'));
      } else if (!reg.test(value)) {
        callback('请输入正确的绝对路径');
      } else {
        callback();
      }
    };
    return {
      form: {},
      rules: {
        parentIds: [
          { required: true, message: '请选择组件分类', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入组件名称', trigger: 'blur' },
        ],
        path: [
          { required: true, validator: validatePath, trigger: 'blur' },
        ],
        imageId: [
          { required: true, validator: validateImageId, trigger: 'change' },
        ],
      },
      props: {
        children: 'childList',
        label: 'name',
        value: 'id',
        expandTrigger: 'hover',
      },
      loading: false,
      treeList: [],
      fileList: [],
      disabledUpload: false,
      accept: '.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP',
    };
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this._fetchTree();
        }
      },
    },
    currentRow: {
      handler(val) {
        if (val.id) {
          this.form = { ...val, parentIds: val.parentIds.split(',') };
          this.fileList = [{ id: this.form.imageId, url: getImgSrc(this.form.imageId) }];
        }
      },
      deep: true,
    },
  },
  methods: {
    handleClick() {
      this._fetchTree();
    },
    getTreeData(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i][this.props.children].length < 1) {
          data[i][this.props.children] = undefined;
        } else {
          this.getTreeData(data[i][this.props.children]);
        }
      }
      return data;
    },
    handleCancel() {
      this.$emit('update:visible', false);
      this.$emit('update:currentRow', {});
      this.fileList = [];
      this.form = {};
      this.$refs.form.resetFields();
    },
    _fetchTree() {
      fetchTree().then(res => {
        if (res.statusCode !== 600) return;
        this.treeList = this.getTreeData(res.data);
      });
    },
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        const params = {
          ...this.form,
          parentIds: this.form.parentIds.toString(),
        };
        if (this.currentRow.id) {
          updateComponent(params).then(res => {
            if (res.statusCode !== 600) return;
            this.$emit('success');
            this.msgSuccess('更新成功');
            this.handleCancel();
          });
        } else {
          createComponent(params).then(res => {
            if (res.statusCode !== 600) return;
            this.$emit('success');
            this.msgSuccess('创建成功');
            this.handleCancel();
          });
        }
      });
    },
    handleUploadChange(fileList) {
      if (fileList.length) {
        this.form.imageId = fileList[0].id;
      } else {
        this.form.imageId = '';
      }
    },
  },
};
</script>
