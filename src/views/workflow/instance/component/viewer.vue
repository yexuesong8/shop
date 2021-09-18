<template>
  <div class="viewer-container">
    <div ref="canvas" class="canvas" />
  </div>
</template>

<script>
import BViewer from 'bpmn-js/lib/NavigatedViewer';
export default {
  name: "Viewer",
  props: {
    xml: {
      type: String,
      default: '',
    },
    stateNode: {
      type: Array,
      default: () => [],
    },
    stepNode: {
      type: Array,
      default: () => [],
    },
    nodes: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: "view",
    },
  },
  data() {
    return {
      taskList: [],
    };
  },
  mounted() {
    this.loadView();
  },
  methods: {
    async loadView() {
      const bpmnViewer = new BViewer({ container: this.$refs["canvas"] });
      const _self = this;

      await bpmnViewer.importXML(this.xml);

      const canvas = bpmnViewer.get('canvas');
      canvas.zoom('fit-viewport');

      // 判断开始节点或结束节点完成
      if (_self.type === "view") _self.loadCompleteNodes(bpmnViewer, canvas);

      // 判断节点是否可跳转
      if (_self.type === "mapJump") {
        _self.loadJumpNodes(bpmnViewer, canvas);
        _self.bindClickEvent(bpmnViewer);
      }
    },

    loadCompleteNodes(bpmnViewer, canvas) {
      // 判断开始节点或结束节点完成
      const completeNodeIds = this.stepNode.map(item => item.defaultId);
      const todoNodeIds = this.stateNode.map(item => item.defaultId);

      bpmnViewer._definitions.rootElements[0].flowElements.forEach(n => {
        if (completeNodeIds.indexOf(n.id) !== -1) canvas.addMarker(n.id, "highlight");
        if (todoNodeIds.indexOf(n.id) !== -1) {
          canvas.removeMarker(n.id, "highlight");
          canvas.addMarker(n.id, "highlight-todo");
        }
      });
    },
    loadJumpNodes(bpmnViewer, canvas) {
      // 判断开始节点或结束节点完成
      const jumpNodes = this.nodes.map(item => item.defaultId);

      bpmnViewer._definitions.rootElements[0].flowElements.forEach(n => {
        if (jumpNodes.indexOf(n.id) !== -1) {
          canvas.addMarker(n.id, "highlight");
        } else {
          canvas.addMarker(n.id, "disabled");
        }
      });
    },
    bindClickEvent(bpmnViewer) {
      bpmnViewer.on("element.click", event => {
        const { element: { id = "" }} = event;
        let nodeId;
        for (let i = 0; i < this.nodes.length; i++) {
          if (this.nodes[i]["defaultId"] === id) {
            nodeId = this.nodes[i].id;
            break;
          }
        }
        this.$emit("element-click", nodeId);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .viewer-container {
    /*position: absolute;*/
    background-color: #ffffff;
    /*top:0;*/
    /*left: 0;*/
    width: 100%;
    height: 100%;
    min-height: 400px;
    /deep/.bjs-powered-by {
      display: none;
    }
  }
  .canvas {
    width: 100%;
    height: 400px;
  }
  /deep/.highlight.djs-shape .djs-visual > :nth-child(1) {
    fill: green !important;
    stroke: green !important;
    fill-opacity: 0.2 !important;
  }
  /deep/.highlight.djs-shape .djs-visual > :nth-child(2) {
    fill: green !important;
  }
  /deep/.highlight.djs-shape .djs-visual > path {
    fill: green !important;
    fill-opacity: 0.2 !important;
    stroke: green !important;
  }
  /deep/.highlight.djs-connection > .djs-visual > path {
    stroke: green !important;
  }
  /deep/.highlight-todo.djs-connection > .djs-visual > path {
    stroke: orange !important;
    stroke-dasharray: 4px !important;
    fill-opacity: 0.2 !important;
  }
  /deep/.highlight-todo.djs-shape .djs-visual > :nth-child(1) {
    fill: orange !important;
    stroke: orange !important;
    stroke-dasharray: 4px !important;
    fill-opacity: 0.2 !important;
  }
  /deep/.disabled.djs-shape .djs-visual > :nth-child(1) {
    fill: gray !important;
    stroke: gray !important;
    fill-opacity: 0.2 !important;
  }
  /deep/.disabled.djs-shape .djs-visual > :nth-child(2) {
    fill: gray !important;
  }
  /deep/.disabled.djs-shape .djs-visual > path {
    fill: gray !important;
    fill-opacity: 0.2 !important;
    stroke: gray !important;
  }
  /deep/.disabled.djs-connection > .djs-visual > path {
    stroke: gray !important;
  }
  /deep/.overlays-div {
    font-size: 10px;
    color: red;
    width: 100px;
    top: -20px !important;
  }
</style>

