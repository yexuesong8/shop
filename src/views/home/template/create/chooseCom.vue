<template>
  <Dialog :visible="visible" title="选择组件" @close="handleClose" @cancel="handleClose" @confirm="handleConfirm">
    <el-form ref="form" :model="form" :rules="rules" label-width="auto">
      <el-form-item label="组件分类:" prop="typeId">
        <el-cascader v-model="form.typeId" style="width: 100%;" clearable :show-all-levels="false" :options="treeList" :props="props" @change="handleCascaderChanged" />
      </el-form-item>
      <el-form-item label="组件名称:" prop="componentId">
        <el-select v-model="form.componentId" clearable :disabled="!typeId" placeholder="请选择组件名称" @change="handleSelectChange">
          <el-option
            v-for="item in compList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="内容预览:">
        <el-image :src="form.src" style="width: 240px; height: 240px">
          <div slot="error" class="error-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
      </el-form-item>
    </el-form>
  </Dialog>
</template>
<script>
import { getImgSrc } from "@/utils";
import { fetchTree, findComp } from "@/api/setCenter/home";

export default {
  name: "ChooseCom",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateId = (rule, value, callback) => {
      if (this.form.componentId) {
        callback();
      } else {
        callback(new Error('请选择组件名称'));
      }
    };
    return {
      form: {},
      treeList: [],
      props: {
        children: 'childList',
        label: 'name',
        value: 'id',
        expandTrigger: 'hover',
      },
      rules: {
        typeId: [
          { required: true, message: '请选择组件分类', trigger: 'change' },
        ],
        componentId: [
          { required: true, validator: validateId, trigger: 'change' },
        ],
      },
      typeId: '',
      compList: [],
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
  },
  methods: {
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
    _fetchTree() {
      fetchTree().then(res => {
        if (res.statusCode !== 600) return;
        this.treeList = this.getTreeData(res.data);
      });
    },
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.$emit('confirm', this.form);
        this.handleClose();
      });
    },
    handleClose() {
      this.form = {};
      this.typeId = '';
      this.compList = [];
      this.$refs.form.resetFields();
      this.$emit('update:visible', false);
    },
    getCompList() {
      if (!this.typeId) return;
      findComp({ typeId: this.typeId, pageSize: 999, pageNum: 1 }).then(res => {
        if (res.statusCode !== 600) return;
        this.compList = res.data.list;
      });
    },
    handleCascaderChanged(val) {
      if (!this.visible) return;
      this.form.componentId = '';
      this.form.src = '';
      if (val && val.length) {
        this.typeId = val[val.length - 1];
        this.getCompList();
      } else {
        this.typeId = '';
        this.compList = [];
      }
    },
    handleSelectChange(val) {
      if (val) {
        const selected = this.compList.find(item => item.id === val);
        this.form = { ...this.form, src: getImgSrc(selected.imageId), name: selected.name, path: selected.path };
      } else {
        this.form = { ...this.form, src: '', name: '', path: '' };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .el-image{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background: #f5f7fa;
    color: #909399;
    font-size: 14px;
    .el-icon-picture-outline:before{
      font-size: 30px;
    }
  }
</style>
