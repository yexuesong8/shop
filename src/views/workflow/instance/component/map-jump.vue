<template>
  <span>
    <slot :click="handleClick" />
    <Dialog v-if="visible" :visible="visible" :title="title" @cancel="handleCancel" @confirm="handleConfirm">
      <Viewer :nodes="nodes" type="mapJump" :xml="viewXML" @element-click="elementClick" />
    </Dialog>
  </span>
</template>

<script>
import Viewer from "./viewer";
import { getJumpNode, getRetreatNode } from "@/api/workflow/instance";
import { handleFunction } from "../config";

export default {
  name: "MapJump",
  components: { Viewer },
  props: {
    type: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    // eslint-disable-next-line vue/require-default-prop
    detail: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      visible: false,
      viewXML: "",
      nodeId: "",
    };
  },
  computed: {
    title() {
      return this.type === "jump" ? "选择跳转节点" : "选择退办节点";
    },
  },
  methods: {
    handleClick() {
      this.loadView().then(res => {
        if (res.statusCode === 600) {
          this.visible = true;
        }
      });
    },
    loadView() {
      let fn = new Promise((resolve) => { resolve({ statusCode: 500, message: "" }); });
      if (this.type === "jump") fn = getJumpNode;
      if (this.type === "retreat") fn = getRetreatNode;
      return fn({ instanceId: this.id, nodeId: this.nodeId, stateId: this.detail.stateId }).then(res => {
        if (res.statusCode === 600) {
          this.viewXML = res.data.flowchart;
          this.nodes = res.data.nodes;
        }
        return res;
      });
    },
    handleConfirm() {
      if (!this.nodeId) {
        this.$message.error("请选择跳转节点");
        return;
      }
      handleFunction(this.type, { instanceId: this.id, nodeId: this.nodeId, stateId: this.detail.stateId }).then(res => {
        if (res.statusCode === 600) {
          this.$message.success("操作成功");
          this.handleCancel();
          this.$emit("success");
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
    elementClick(id) {
      this.nodeId = id;
    },
  },
};
</script>
