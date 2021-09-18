<template>
  <el-row>
    <el-row>
      <span>支持抄送</span>
      <el-switch v-model="copyValue" @change="handleCopySwitch" />
    </el-row>
    <template v-if="copyValue">
      <el-row>
        <div class="btn" style="float:right;margin-top:10px;margin-bottom:10px">
          <el-button type="primary" @click="handleChoose">选择抄送人</el-button>
          <el-button :disabled="!selectedRows.length" @click="handleDelete">删除</el-button>
        </div>
      </el-row>
      <el-table :data="memberList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" />
        <el-table-column label="抄送人" prop="name" show-overflow-tooltip />
      </el-table>
      <MemberSelectorDialog multiple :visible="visible" title="抄送人" :value="memberList.map(item => item.id)" @confirm="handleConfirm" @cancel="handleCancel" />
    </template>
  </el-row>
</template>

<script>
import { MemberSelectorDialog } from "@/components";

export default {
  name: "CopyProperty",
  components: {
    MemberSelectorDialog,
  },
  inject: ["copyData"],
  props: {
    defaultValue: {
      type: Array,
      default: () => [],
    },
    elementType: {
      type: String,
      default: "node",
    },
  },
  data() {
    return {
      memberList: [],
      copyValue: false, // 支持抄送
      selectedRows: [],
      visible: false,
    };
  },
  watch: {
    defaultValue: {
      handler: function(value = []) {
        this.memberList = value;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    const copyData = this.copyData.copyData;
    this.copyValue = copyData.enabledCC ? copyData.enabledCC === 1 : false;
    this.memberList = copyData.ccMemberList ? copyData.ccMemberList : [];
  },
  methods: {
    handleConfirm(value) {
      this.memberList = value;
      this.$emit("change", value.map(item => item.id));
      this.visible = false;
    },
    handleChoose() {
      this.visible = true;
    },
    handleCopySwitch() {
      if (this.copyValue === false) {
        this.memberList = [];
      }
      this.$emit("swith", this.copyValue);
    },
    handleCancel() {
      this.memberList = this.memberList ? this.memberList : [];
      this.visible = false;
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },

    handleDelete() {
      let list = [...this.memberList];
      this.selectedRows.forEach(row => {
        list = list.filter(item => item.id !== row.id);
      });
      this.memberList = list;
      this.$emit("change", list.map(item => item.id));
    },
  },
};
</script>
