const nodeTypes = ['Task', "UserTask"];
const lineType = "SequenceFlow";
const processType = "Process";
const autoNodeTypes = ["ExclusiveGateway", "StartEvent", "EndEvent"];
const start = "StartEvent";
const end = "EndEvent";

export const disabledType = ["label"]; // 禁用的节点类型，比如 label: 节点上的字

export const getElementType = (element) => {
  if (element) {
    const type = (element.type || element.$type).replace(/(bpmn:)/ig, "");
    if (type.includes(start)) return "start";
    if (type.includes(end)) return "end";
    if (autoNodeTypes.indexOf(type) !== -1) return "auto";
    if (type === lineType) return "line";
    if (type === processType) return "process";
    return "node"; // 人工节点
  }
  return "";
};

export const isNode = (element) => nodeTypes.indexOf(element.type.replace(/(bpmn:)/ig, "")) !== -1;
export const isLine = (element) => getElementType((element)) === "line";
export const isProcess = (element) => getElementType((element)) === "process";
export const isAutoNode = (element) => getElementType((element)) === "auto";
export const isStart = (element) => getElementType((element)) === "start";
export const isEnd = (element) => getElementType((element)) === "end";
export const isLabel = (element) => !!element.labelTarget;

export const getDefinitions = (modeler) => {
  const definitions = modeler.get("canvas").getRootElement().businessObject.$parent;
  const elements = definitions["rootElements"][0]["flowElements"].concat(definitions["rootElements"][0]);
  return {
    definitions,
    elements,
  };
};

export const definitionsToObject = (modeler, done) => {
  // 取第一个process的流程节点
  const { rootElements: [process] } = getDefinitions(modeler).definitions;
  const { flowElements } = process;

  const nodeList = [];
  const pathList = [];

  flowElements.forEach(element => {
    const type = getElementType({ ...element, type: element.$type });

    if (type === "line") {
      pathList.push({
        name: element.name,
        defaultId: element.id,
        formNodeDefaultId: element.sourceRef.id,
        toNodeDefaultId: element.targetRef.id,
      });
    }

    if (type === "node") {
      nodeList.push({
        name: element.name,
        defaultId: element.id,
        type: 3,
      });
    }

    if (type === "auto") {
      nodeList.push({
        name: element.name,
        defaultId: element.id,
        isAutoNode: true,
        type: 4,
      });
    }

    if (type === "start") {
      nodeList.push({
        name: element.name,
        defaultId: element.id,
        isAutoNode: true,
        type: 1,
      });
    }

    if (type === "end") {
      nodeList.push({
        name: element.name,
        defaultId: element.id,
        isAutoNode: true,
        type: 2,
      });
    }
  });

  modeler.saveXML((err, xml) => {
    if (!err) {
      done({
        flowChart: xml,
        nodeList,
        pathList,
      });
    }
  });
};

