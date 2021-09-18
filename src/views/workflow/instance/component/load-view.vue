<template>
  <span>
    <slot :click="handleLoadView" />
    <Dialog v-if="visible" title="流程图" :visible="visible" @cancel="handleCancel" @confirm="handleConfirm">
      <Viewer :state-node="stateNode" :step-node="stepNode" :xml="viewXML" />
    </Dialog>
  </span>
</template>

<script>
import Viewer from "./viewer";
import { instanceHistoryMap } from "@/api/workflow/instance";
export default {
  name: "LoadView",
  components: { Viewer },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      viewXML: null,
      stepNode: [],
      stateNode: [],
    };
  },
  methods: {
    handleLoadView() {
      instanceHistoryMap({ id: this.id }).then(res => {
        if (res.statusCode === 600) {
          this.visible = true;
          this.viewXML = res.data.flowchart;
          this.stepNode = res.data.stepNode;
          this.stateNode = res.data.stateNode;
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
    handleConfirm() {
      this.handleCancel();
    },
  },
};
</script>
