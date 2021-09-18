<template>
  <el-row class="properties-container">
    <el-row class="properties-content">
      <el-row v-for="(item, index) in elements" v-show="element.id === item.id" :key="index">
        <component
          :is="components[getElementType(item)]"
          ref="component"
          :modeler="modeler"
          :type="getElementType(item)"
          :default-value="defaultValue"
          :type-id="typeId"
          v-bind="$attrs"
        />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import { isObject, isEmptyObject, deepClone } from "@monkey.do/monkey";
import NodeProperties from "./node";
import LineProperties from "./line";
import FormProperties from "./form";
import AutoNodeProperties from "./auto";
import { definitionsToObject, getElementType } from "../utils/";
import { elementsValidate } from "../utils/rules";
import { mapState } from "vuex";
import { save } from "@/api/workflow/template";

export default {
  name: "WorkFlowProperties",
  components: { NodeProperties, LineProperties, FormProperties, AutoNodeProperties },
  props: {
    modeler: {
      type: Object,
      default: () => ({}),
    },
    defaultValue: {
      type: Object,
      default: () => ({}),
    },
    typeId: {
      type: String,
      default: "",
    },
    elements: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      components: {
        node: NodeProperties,
        line: LineProperties,
        process: FormProperties,
        auto: AutoNodeProperties,
        start: AutoNodeProperties,
        end: AutoNodeProperties,
      },
      saveLoading: false,
    };
  },
  computed: {
    ...mapState("workflow", {
      type: state => getElementType(state.element),
      data: state => state.data,
      element: state => state.element,
    }),
  },
  methods: {
    getElementType(element) {
      return getElementType(element);
    },
    generatorErrorMsg(element, message) {
      const type = getElementType(element);
      let prevMsg = "";
      switch (type) {
        case "start":
          prevMsg = "开始节点：";
          break;
        case "end":
          prevMsg = "结束节点：";
          break;
        case "node":
          prevMsg = element.name ? `节点${element.name}：` : "";
          break;
        case "line":
          prevMsg = element.name ? `线条${element.name}：` : "";
          break;
        default: break;
      }

      return prevMsg + message;
    },
    save() {
      return new Promise((resolve, reject) => {
        const canvas = this.modeler.get("canvas");
        const definitions = this.modeler.get("canvas").getRootElement().businessObject.$parent;
        const validateElements = definitions["rootElements"][0]["flowElements"].concat(definitions["rootElements"][0]);

        const { valid, message, element } = elementsValidate(validateElements, { ...this.data, ...this.data["process"] });

        // 先将所有节点错误状态移除 然后对当前验证未通过元素添加error状态
        validateElements.forEach(element => {
          canvas.removeMarker(element.id, "error");
        });
        if (!valid) {
          this.$message.error(this.generatorErrorMsg(element, message));
          canvas.addMarker(element.id, "error");
          resolve();
          return;
        }
        // 处理节点的基础数据：判断节点传到后端type值
        definitionsToObject(this.modeler, (data = {}) => {
          const { nodeList = [], pathList = [] } = data;
          const haveEnd = nodeList.filter(it => it.type === 2);
          // 判断是否添加了结束节点
          if (haveEnd.length === 0) {
            this.$message.error("请添加结束节点！");
            resolve();
          // } else if (haveEnd.length > 1) {
          //   this.$message.error("有且只能有一个结束节点！");
          //   resolve();
          } else {
            let newData = {};
            const newNodeList = [];
            const newPathList = [];

            nodeList.forEach(node => {
              // 处理node数据
              const nodeData = deepClone(this.data[node.defaultId] || {});

              if (!nodeData.isAutoNode && !isEmptyObject(nodeData)) {
                const list = ["deptList", "roleList", "memberList", "jobList"];
                list.forEach(item => {
                  if (!nodeData.handler) nodeData.handler = {};
                  if (!nodeData.handler[item]) nodeData.handler[item] = [];
                  // 处理后台返回的数据 TODO:统一处理，提交或者获取到后处理,同时考虑列表数据展示问题
                  if (nodeData.handler[item]) {
                    nodeData.handler[item] = nodeData.handler[item].map(i => isObject(i) ? i.id : i);
                  }
                });
              }

              newNodeList.push({
                ...node,
                ...nodeData,
              });
            });

            pathList.forEach(path => {
              newPathList.push({
                ...path,
                ...this.data[path.defaultId],
              });
            });

            newData = { ...data, nodeList: newNodeList, pathList: newPathList };
            save({ typeId: this.typeId, ...this.data["process"], ...newData }).then(res => {
              this.$emit("close");
              if (res.statusCode === 600) this.$message.success("操作成功");
              this.updateId(res.data);
              resolve();
            });
          }
        });
      });
    },
    // 新增模板时保存后更新id，不然会导致再次保存时还是新增
    updateId(data) {
      this.$store.commit("workflow/updateProcess", {
        id: data.id,
      });
    },
  },
};
</script>

<style lang="scss">
.properties-container {
  .el-drawer__body {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px 10px 0 10px;
  }

  .el-collapse-item__wrap {
    overflow: visible;
  }
}
</style>
