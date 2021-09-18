import inherits from "inherits";
import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";
// import { append as svgAppend, create as svgCreate, classes as svgClasses } from "tiny-svg";
import { append as svgAppend, create as svgCreate } from "tiny-svg";
import startSvg from "../../assets/start.svg";
import endSvg from "../../assets/end.svg";
import autoSvg from "../../assets/auto.svg";

const customElements = ["bpmn:StartEvent", "bpmn:EndEvent", "bpmn:ExclusiveGateway"]; // 自定义元素的类型
const customConfig = { // 自定义元素的配置
  "bpmn:StartEvent": {
    "url": startSvg,
    "attr": { x: 0, y: 0, width: 40, height: 40 },
  },
  "bpmn:EndEvent": {
    "url": endSvg,
    "attr": { x: 0, y: 0, width: 45, height: 45 },
  },
  "bpmn:ExclusiveGateway": {
    url: autoSvg,
    "attr": { x: 0, y: 0, width: 45, height: 45 },
  },
};

// const hasLabelElements = ["bpmn:StartEvent", "bpmn:EndEvent"]; // 一开始就有label标签的元素类型

export default function CustomRenderer(eventBus, styles, textRenderer) {
  BaseRenderer.call(this, eventBus, 2000);

  // const computeStyle = styles.computeStyle;
  //
  // function renderLabel(parentGfx, label, options) {
  //   options = Object.assign({
  //     size: {
  //       width: 100,
  //     },
  //   }, options);
  //
  //   const text = textRenderer.createText(label || "", options);
  //
  //   svgClasses(text).add("djs-label");
  //
  //   svgAppend(parentGfx, text);
  //
  //   return text;
  // }

  this.drawCustomElements = function(parentNode, element) {
    const type = element.type; // 获取到类型
    if (type !== "label") {
      if (customElements.includes(type)) { // or customConfig[type]
        const { url, attr } = customConfig[type];
        const customIcon = svgCreate("image", {
          ...attr,
          href: url,
        });
        element["width"] = attr.width; // 这里我是取了巧, 直接修改了元素的宽高
        element["height"] = attr.height;
        svgAppend(parentNode, customIcon);
        // 判断是否有name属性来决定是否要渲染出label
        // if (!hasLabelElements.includes(type) && element.businessObject.name) {
        //   const text = svgCreate('text', {
        //     x: attr.x,
        //     y: attr.y + attr.height + 20,
        //     'font-size': '14',
        //     'fill': '#000'
        //   })
        //   text.innerHTML = element.businessObject.name;
        //   svgAppend(parentNode, text);
        // }
        // renderLabel(parentNode, element.label)
        return customIcon;
      }
      return this.bpmnRenderer.drawShape(parentNode, element);
    } else {
      return element;
    }
  };
}

inherits(CustomRenderer, BaseRenderer);

CustomRenderer.$inject = ["eventBus", "styles", "textRenderer"];

CustomRenderer.prototype.canRender = function(element) {
  // ignore labels
  return !element.labelTarget;
};

CustomRenderer.prototype.drawShape = function(p, element) {
  if (customElements.includes(element.type)) {
    return this.drawCustomElements(p, element);
  }
};

CustomRenderer.prototype.getShapePath = function(shape) {
};
