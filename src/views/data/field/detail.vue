<template>
  <!-- 数据管理-字段管理 新增 -->
  <el-dialog class="m-dialog" :title="title" :visible.sync="visible" width="500px" append-to-body @close="handleCancel">
    <el-form ref="form" :model="detail" :rules="rules" label-width="80px">
      <el-form-item label="字段名称" prop="name">
        <el-input v-model="detail.name" placeholder="请输入字段名称" clearable />
      </el-form-item>
      <el-form-item label="字段代码" prop="code">
        <el-input v-model="detail.code" placeholder="请输入字段代码" clearable />
      </el-form-item>
      <el-form-item label="选择字典" prop="dictionaryId">
        <el-select v-model="detail.dictionaryId" placeholder="请选择字典" clearable>
          <el-option
            v-for="item in dictionaryArray"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="detail.remark" type="textarea" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="detailLoading" @click="handleSubmit">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { statusOptions } from "@/config/index";
import { getType } from '@/api/system/dict/type';

export default {
  name: "Detail",
  data() {
    return {
      statusOptions,
      rules: {
        name: [{ required: true, message: "请输入字段名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入字段代码", trigger: "blur" }],
      },
      dictionaryArray: [],
    };
  },
  computed: {
    ...mapState("field", [
      "visible",
      "title",
      "type",
      "detail",
      "detailLoading",
    ]),
  },
  mounted() {
    getType().then(res => {
      if (res.statusCode === 600) {
        this.dictionaryArray = res.data;
      }
    });
  },
  methods: {
    handleSubmit() {
      this.$refs['form'].validate(validate => {
        if (validate) {
          if (this.type === "update") {
            this.$store.dispatch("field/update", this.detail).then((res) => {
              if (res.statusCode === 600) {
                this.msgSuccess("修改成功");
                this.handleCancel();
              }
            });
          } else {
            this.$store.dispatch("field/add", this.detail).then(res => {
              if (res.statusCode === 600) {
                this.msgSuccess("新增成功");
                this.handleCancel();
              }
            });
          }
        }
      });
    },
    handleCancel() {
      this.$store.commit("field/setDialog", {
        visible: false,
        title: "",
        type: "",
        detail: {},
      });
      this.$store.commit("field/setDetailLoading", false);
      this.resetForm('form');
    },
  },
};
</script>
