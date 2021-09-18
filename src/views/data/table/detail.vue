<template>
  <!-- 数据管理 表管理 新增 -->
  <el-dialog class="m-dialog" :title="title" :visible.sync="visible" width="500px" append-to-body @close="handleCancel">
    <el-form ref="form" :model="detail" :rules="rules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="detail.name" placeholder="请输入表名称" />
      </el-form-item>
      <el-form-item label="代码" prop="code">
        <el-input v-model="detail.code" placeholder="请输入表代码" />
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

export default {
  name: "Detail",
  data() {
    return {
      statusOptions,
      rules: {
        name: [{ required: true, message: "请输入表名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入表代码", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState("table", [
      "visible",
      "title",
      "type",
      "detail",
      "detailLoading",
    ]),
  },
  methods: {
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.type === "update") {
            this.$store.dispatch("table/update", this.detail).then((res) => {
              if (res.statusCode === 600) {
                this.msgSuccess("修改成功");
                this.handleCancel();
              }
            });
          } else {
            this.$store.dispatch("table/add", this.detail).then(res => {
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
      this.$store.commit("table/setDialog", {
        visible: false,
        title: "",
        type: "",
        detail: {},
      });
      this.$store.commit("table/setDetailLoading", false);
      this.resetForm('form');
    },
  },
};
</script>
