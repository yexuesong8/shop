<template>
  <Dialog
    v-if="visible"
    title="分配角色"
    :visible="visible"
    :loading="loading"
    @cancel="cancel"
    @confirm="handleAllotRole"
  >
    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="(v,k) in appIdsArr"
        :key="k"
        :title="getPlatFormName(v)"
        :name="k"
      >
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="CurCheckedList" @change="handleChange">
          <el-checkbox v-for="(item,i) in v.data" :key="i" :label="item.id">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-collapse-item>
    </el-collapse>
  </Dialog>
</template>

<script>
import { Dialog } from "@monkey.do/monkey";
export default {
  name: "AllocateRole",
  components: { Dialog },
  props: {
    list: { type: Array, default: () => ([]) },
    visible: { type: Boolean, default: false },
    preSelectedList: { type: Array, default: () => ([]) },
    checkedList: { type: Array, default: () => ([]) },
    appIdsArr: { type: Array, default: () => ([]) },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      activeNames: [],
      CurCheckedList: [],
    };
  },
  watch: {
    checkedList: {
      handler(val) {
        this.CurCheckedList = [...val];
      },
    },
  },
  beforeMount() {
    this.defaultValue();
  },
  methods: {
    cancel() {
      this.$emit('roleCancle');
    },
    handleAllotRole() {
      this.$emit("roleConfirm");
    },
    defaultValue() {
      const data = this.$parent.allocatRole.fmtData.appIdsArr;
      this.activeNames = Object.keys(data).map((k) => parseInt(k));
      return this.activeNames;
    },
    getPlatFormName(v) {
      return this.dictFormatter("general_app", v.appId);
    },
    handleChange(value) {
      this.$emit("getCheckList", value);
      this.$emit('change');
    },
  },
};
</script>
