<template>
  <Dialog title="流程模板" :visible="visible" @cancel="handleCancel" @confirm="handleConfirm">
    <el-row>
      <el-row class="fr" :gutter="8">
        <el-col :span="1.5">
          <Add :id="id" />
        </el-col>
      </el-row>
    </el-row>
    <List :id="id" ref="templateList" class="mt10" @selection-change="selectionChange" />
  </Dialog>
</template>

<script>
import { Dialog } from "@monkey.do/monkey";
import Add from "../template/add";
import List from "../template/list";

export default {
  name: "WorkflowTemplate",
  components: { Dialog, List, Add },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      list: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      ids: [],
    };
  },
  watch: {
  },
  methods: {
    handleConfirm() {
      this.$emit("confirm");
    },
    handleCancel() {
      this.$emit("cancel");
    },
    selectionChange(data) {
      this.ids = data.map(item => item.id);
    },
  },
};
</script>
