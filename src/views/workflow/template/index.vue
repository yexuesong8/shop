<template>
  <div class="template-container container">
    <div class="button-box">
      <el-button type="primary" :disabled="disabled" :loading="saveLoading" @click="handleSave">保存</el-button>
      <el-button @click="cancel">关闭</el-button>
    </div>
    <div ref="canvas" class="canvas" />
    <Properties ref="properties" :type="type" :modeler="bpmnModeler" :default-value="defaultProperties" :type-id="typeId" :elements="elements" @close="handleLodingClose" />
  </div>
</template>

<script>
import { translateModule } from "./transition";
import { xml as initXML } from "./xml";
// import { adjustPalette } from "./adjustPalette";
import CustomModeler from './modeler';
import Properties from "./properties";
import { mapState } from "vuex";
import { get } from "@/api/workflow/template";
import "./assets/bpmn.scss";

// 以下为bpmn工作流绘图工具的样式
import 'bpmn-js/dist/assets/diagram-js.css'; // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import { isProcess, disabledType, getElementType } from './utils';
import defaultElementNameModule from "./modeler/custom/defaultElementName";
export default {
  name: "WorkflowTemplate",
  components: { Properties },
  provide() {
    return {
      copyData: this,
    };
  },
  data() {
    return {
      copyData: {},
      bpmnModeler: null,
      container: null,
      canvas: null,
      type: "",
      typeId: "",
      templateId: "",
      routeTypeId: "", // 路由typeId
      routeTemplateId: "", // 路由templateId
      lastTypeId: "", // 上一次的typeId
      lastTemplateId: "", // 上一次的templateId
      defaultProperties: {}, // 当前节点默认properties对象
      xml: null,
      elements: [], // 存储所有的节点
      saveLoading: false,
    };
  },
  computed: {
    ...mapState('workflow', {
      data: state => state.data,
      disabled: state => {
        const process = state.data["process"] || {};
        return process.used === 1 || process.enabled === 1;
      },
    }),
  },
  activated() {
    this.routeTypeId = this.$route.query.typeId || "";
    this.routeTemplateId = this.$route.query.templateId || "";
    if (this.routeTypeId) {
      if (this.lastTemplateId || (this.lastTypeId && this.routeTypeId !== this.lastTypeId)) {
        this.clear();
        this.initBpmn();
      }
    } else if (this.routeTemplateId) {
      if (this.lastTypeId || (this.lastTemplateId && this.routeTemplateId !== this.lastTemplateId)) {
        this.clear();
        this.initBpmn();
      }
    }
  },
  deactivated() {
    this.lastTypeId = this.routeTypeId ? this.typeId : "";
    this.lastTemplateId = this.routeTemplateId ? this.templateId : "";
  },
  mounted() {
    this.initBpmn();
  },
  beforeDestroy() {
    // 清空store数据
    this.$store.commit("workflow/reset");
  },
  methods: {
    // 页面初始化
    clear() {
      this.$store.commit("workflow/reset");
      this.$refs.canvas.innerHTML = "";
      this.bpmnModeler = null;
      this.elements = [];
    },
    handleLodingClose() {
      this.saveLoading = false;
    },
    async initBpmn() {
      const canvas = this.$refs["canvas"];
      this.bpmnModeler = new CustomModeler({
        container: canvas,
        additionalModules: [
          translateModule,
          defaultElementNameModule,
        ],
      });

      // 去掉右下角图标
      if (document.querySelector(".bjs-powered-by")) {
        document.querySelector(".bjs-powered-by").style.display = "none";
      }
      // 获取模板数据、xml数据
      const xml = await this.initData();
      if (!xml) return;

      await this.bpmnModeler.importXML(xml);

      // 配置process相关属性
      this.initProperty(this.bpmnModeler);

      const { query: { typeId }} = this.$route;
      if (typeId) { // 新增模板
        // 新增时给开始节点设置名称
        this.initStartEventName();
      }

      // 工具栏样式调整
      // adjustPalette(this.$refs["canvas"]);

      // event bus
      this.bindEvent(this.bpmnModeler);

      // const modeling = this.bpmnModeler.get("modeling");
    },
    async initData() {
      const { query: { templateId, typeId }} = this.$route;

      let xml = "";
      if (typeId) { // 新增模板
        xml = initXML;
        this.typeId = typeId;
      }

      if (templateId) { // 修改模板
        this.templateId = templateId;
        const data = await this.getTemplate(templateId);
        this.typeId = data.typeId;
        // 设置节点、路径数据
        const dataObj = {};
        data.nodeList.forEach((item) => { dataObj[item.defaultId] = item; });
        data.pathList.forEach((item) => { dataObj[item.defaultId] = item; });
        // 设置process
        dataObj["process"] = data;

        this.$store.commit("workflow/setOriginData", dataObj);

        xml = data["flowChart"] || initXML;
      }
      return xml;
    },
    async getTemplate(templateId) {
      return new Promise((resolve, reject) => {
        get({ id: templateId }).then(res => {
          if (res.statusCode === 600) {
            this.copyData = res.data;
            resolve(res.data);
            if (res.data.used === 1 || res.data.enabled === 1) {
              this.$doingConfirm({ title: "警告", message: "当前模板已启用或已被使用过，无法进行修改！", showCancelButton: false });
            }
          } else {
            resolve("");
          }
        });
      });
    },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
    handleSave() {
      this.saveLoading = true;
      this.$refs["properties"].save().then(() => {
        this.saveLoading = false;
      });
    },
    initProperty(modeler) {
      const definitions = modeler.get("canvas").getRootElement().businessObject.$parent;
      const process = definitions["rootElements"][0];
      this.setProperties({ ...process, type: process.$type });
    },
    bindEvent(modeler) {
      const eventBus = modeler.get('eventBus');
      // const modeling = modeler.get("modeling");

      modeler.on("element.click", event => {
        const { element } = event;
        // 监听键盘回车/退格，删除节点/连线
        document.onkeydown = function(e) {
          const key = window.event.keyCode;
          // 如果节点类型不为结束/lable 则删除
          if (element.type !== "bpmn:StartEvent" && element.type !== "label") {
            if (key === 46 || key === 8) {
              // modeling.removeElements([element]);
            }
          }
        };
        this.setProperties(element);
      });

      // 阻止双击事件 https://forum.bpmn.io/t/disable-label-editing-specific-element/3559
      eventBus.on("element.dblclick", 10000, event => {
        return false;
      });

      // shape创建时触发
      // modeler.on("shape.create", shape => {
      //   console.log("节点创建:", shape);
      //   const { element }  = shape;
      //   // 设置节点初始名称
      //   const name = this.setNodeOriginName(modeler, element);
      //   // 绑定name到form表单上
      //   this.bindNameToForm(name, element.id);
      //   // 显示节点属性
      //   this.setProperties(element);
      // });

      // eventBus.on("shape.added", shape => {
      //   const { element }  = shape;
      //   modeler.get("modeling").updateProperties(element, {
      //     name: "name",
      //   });
      // });

      // 节点添加到canvas上时触发
      // create.end: 左侧palate上创建才触发
      // shape.added shape新增就触发
      // modeler.on("shape.added", shape => {
      //   console.log("节点添加:", shape);
      //   const { element }  = shape;
      //   // 设置节点初始名称
      //   const name = this.setNodeOriginName(modeler, element);
      //   // 绑定name到form表单上
      //   this.bindNameToForm(name, element.id);
      //   // 显示节点属性
      //   this.setProperties(element);
      // });

      // 节点移除
      modeler.on("shape.remove", shape => {
        this.$store.commit("workflow/removeElement", shape.element.id);
      });

      // 连线移除
      modeler.on("connection.remove", connection => {
        this.$store.commit("workflow/removeElement", connection.element.id);
      });

      // 节点创建开始
      modeler.on("create.start", elementNode => {
        const { elements: [element] } = elementNode;
        // eslint-disable-next-line no-unused-vars
        const type = getElementType(element);
        // const { elements: [ element ] }  = elementNode;
        // // 设置节点初始名称
        // const name = this.setNodeOriginName(modeler, element);
        // // 绑定name到form表单上
        // this.bindNameToForm(name, element.id);
        // if (type.includes("StartEvent")) {
        //   // TODO:其它方式判断 看是否有方法获取所有节点
        //   this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        //     if (xml.includes("startEvent")) {
        //       elementNode = null;
        //     }
        //   });
        // }
      });

      // 节点创建结束
      modeler.on("create.end", elementNode => {
        const { elements: [element] } = elementNode;

        // 显示节点属性
        this.setProperties(element);

        // // 设置节点初始名称
        // this.$store.dispatch("workflow/getCurrentNameIndex", element).then(name => {
        //   // 绑定name到form表单上
        //   this.bindNameToForm(name, element.id);

        //   // 显示节点属性
        //   this.setProperties(element);
        // });
      });

      // // 节点修改label触发
      // modeler.on("commandStack.element.updateLabel", (element, label, bounds, hints) => {
      //   console.log("commandStack.element.updateLabel", element);
      // });
      //
      // // 节点修改properties时触发
      // modeler.on("commandStack.element.updateProperties.postExecute", (element, properties) => {
      //   console.log("commandStack.element.updateProperties.postExecute", element);
      // });
      //
      // // 节点修改properties时触发
      // modeler.on("commandStack.element.updateProperties.postExecuted", (element, properties) => {
      //   console.log("commandStack.element.updateProperties.postExecuted", element);
      // });
      //
      // // 节点改变时触发
      // modeler.on("element.changed", (element, properties) => {
      //   console.log("element.changed", element);
      // });
    },
    setProperties(element) {
      if (disabledType.includes(element.type)) return;

      if (isProcess(element)) {
        this.defaultProperties = this.data["process"];
      } else {
        this.defaultProperties = this.data[element.id];
      }

      this.$store.commit("workflow/manage", {
        visible: true,
        id: element.id,
        element,
      });

      let isExist = false;
      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].id === element.id) {
          isExist = true;
          break;
        }
      }

      if (!isExist) this.elements.push(element);
    },
    bindNameToForm(name, id) {
      this.$store.commit("workflow/setExtraData", {
        id,
        extraData: {
          name,
        },
      });
    },
    initStartEventName() {
      const name = "开始";
      const definitions = this.bpmnModeler.get("canvas").getRootElement().businessObject.$parent;
      const start = definitions["rootElements"][0]["flowElements"][0];
      this.$store.commit("workflow/setExtraData", {
        id: start.id,
        extraData: {
          name,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.template-container {
  position: relative;
  width: 100%;
  height: 800px;
  background: #fff;
  .button-box {
    position: absolute;
    top: 10px;
    right: 315px;
    z-index: 10;
  }
  .properties-container {
    width: 300px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    padding: 20px 10px 0 10px;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
    background: #fff;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
.canvas {
  width: 100%;
  height: 100%;
}
/deep/.error.djs-shape .djs-visual > :nth-child(1) {
  fill: red !important;
  stroke: red !important;
  fill-opacity: 0.2 !important;
}
/deep/.error.djs-shape .djs-visual > :nth-child(2) {
  fill: red !important;
}
/deep/.error.djs-shape .djs-visual > path {
  fill: red !important;
  fill-opacity: 0.2 !important;
  stroke: red !important;
}
/deep/.error.djs-connection > .djs-visual > path {
  stroke: red !important;
}
</style>
